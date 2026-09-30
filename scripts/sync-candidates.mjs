#!/usr/bin/env node
/**
 * Gera public/data/candidatos-sp-2026.json a partir do arquivo oficial de dados abertos do TSE
 * (consulta_cand_2026.zip) — a mesma base publicada por portais como O Tempo.
 *
 * Roda no GitHub Actions (.github/workflows/candidatos.yml), que grava o JSON no repositório.
 * A busca por número acontece no navegador, contra esse JSON estático:
 * nenhum número digitado pelo eleitor sai do aparelho.
 *
 * Fotos: baixadas só para Senador, Governador e Presidente (poucos candidatos) e gravadas
 * em public/data/fotos/. Deputados aparecem sem foto (exceto os de config/candidates.ts).
 *
 * Requer o comando `unzip` (presente no runner do GitHub Actions).
 * Uso: node scripts/sync-candidates.mjs [--csv arquivo.csv ...]   (--csv: testar com CSVs locais)
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";

const ANO = 2026;
const UF = "SP";
const ZIP_URL = `https://cdn.tse.jus.br/estatistica/sead/odsele/consulta_cand/consulta_cand_${ANO}.zip`;
const FOTO_URL = (uf, sq) => `https://eleicoes-api.otempo.com.br/api/photo/${ANO}/fotos/candidatos/${uf}/${sq}.jpg`;
const OUT = path.join(process.cwd(), "public/data/candidatos-sp-2026.json");
const FOTOS = path.join(process.cwd(), "public/data/fotos");

// CD_CARGO do TSE → chave da base
const CARGOS = { 1: "presidente", 3: "governador", 5: "senador", 6: "federal", 7: "estadual" };
const COM_FOTO = new Set(["presidente", "governador", "senador"]);

/** Parser de CSV do TSE: separador ";", campos entre aspas, codificação latin1. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ";") { row.push(field); field = ""; }
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.length > 1) rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field || row.length) { row.push(field); if (row.length > 1) rows.push(row); }
  return rows;
}

/** Lê todos os CSVs (cada um com seu cabeçalho) e devolve objetos por linha. */
function* records(csvTexts) {
  for (const text of csvTexts) {
    const [header, ...rows] = parseCsv(text);
    if (!header) continue;
    const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
    for (const r of rows) yield (col) => (r[idx[col]] ?? "").trim();
  }
}

async function baixarCsvs() {
  const dir = path.join(tmpdir(), "tse-cand");
  await mkdir(dir, { recursive: true });
  const zip = path.join(dir, "cand.zip");
  const res = await fetch(ZIP_URL, { signal: AbortSignal.timeout(120000) });
  if (!res.ok) throw new Error(`${res.status} ao baixar ${ZIP_URL}`);
  await writeFile(zip, Buffer.from(await res.arrayBuffer()));
  const lista = execFileSync("unzip", ["-Z1", zip]).toString().split("\n").map((s) => s.trim());
  // SP (deputados, senador, governador) + BR/BRASIL (presidente)
  const alvos = lista.filter((f) => /\.csv$/i.test(f) && /_(SP|BR|BRASIL)\.csv$/i.test(f));
  if (!alvos.length) throw new Error(`CSV de SP/BR não encontrado no zip: ${lista.join(", ")}`);
  console.log(`[candidatos] arquivos: ${alvos.join(", ")}`);
  return alvos.map((f) => new TextDecoder("latin1").decode(execFileSync("unzip", ["-p", zip, f], { maxBuffer: 1 << 30 })));
}

async function baixarFoto(db, uf, sq, numero) {
  const file = `${db}-${numero}.jpg`;
  try {
    const res = await fetch(FOTO_URL(uf, sq), {
      signal: AbortSignal.timeout(20000),
      headers: { "user-agent": "Mozilla/5.0 (colinha-chapinha)" },
    });
    if (!res.ok || !res.headers.get("content-type")?.startsWith("image")) return undefined;
    await writeFile(path.join(FOTOS, file), Buffer.from(await res.arrayBuffer()));
    return `/data/fotos/${file}`;
  } catch {
    return undefined;
  }
}

async function main() {
  const i = process.argv.indexOf("--csv");
  const csvs = i > -1
    ? await Promise.all(process.argv.slice(i + 1).map(async (f) => new TextDecoder("latin1").decode(await readFile(f))))
    : await baixarCsvs();

  const base = { generatedAt: new Date().toISOString(), source: "TSE — dados abertos (consulta_cand_2026)" };
  const aptos = {}; // prioriza candidatura APTA quando o mesmo número aparece mais de uma vez
  for (const db of Object.values(CARGOS)) { base[db] = {}; aptos[db] = {}; }

  const fotos = [];
  for (const get of records(csvs)) {
    const db = CARGOS[Number(get("CD_CARGO"))];
    if (!db) continue;
    const uf = get("SG_UF");
    if (db === "presidente" ? !["BR", "BRASIL"].includes(uf) : uf !== UF) continue;
    const numero = get("NR_CANDIDATO");
    if (!/^\d+$/.test(numero)) continue;
    const apto = /^APTO/i.test(get("DS_SITUACAO_CANDIDATURA"));
    if (base[db][numero] && aptos[db][numero] && !apto) continue;
    base[db][numero] = { n: get("NM_URNA_CANDIDATO") || get("NM_CANDIDATO"), p: get("SG_PARTIDO") };
    aptos[db][numero] = apto;
    if (COM_FOTO.has(db)) fotos.push({ db, uf: db === "presidente" ? "BR" : UF, sq: get("SQ_CANDIDATO"), numero });
  }

  if (i === -1 && fotos.length) {
    await mkdir(FOTOS, { recursive: true });
    for (const f of fotos) {
      const foto = await baixarFoto(f.db, f.uf, f.sq, f.numero);
      if (foto && base[f.db][f.numero]) base[f.db][f.numero].f = foto;
    }
  }

  let total = 0;
  for (const db of Object.values(CARGOS)) {
    const n = Object.keys(base[db]).length;
    total += n;
    console.log(`[candidatos] ${db}: ${n}`);
  }
  if (!total) throw new Error("Nenhum candidato encontrado no arquivo do TSE");
  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(base));
  console.log(`[candidatos] ${total} candidatos gravados em ${path.relative(process.cwd(), OUT)}`);
}

main().catch((err) => {
  console.error(`[candidatos] Falha: ${err.message}`);
  process.exit(1);
});
