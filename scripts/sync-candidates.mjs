#!/usr/bin/env node
/**
 * Baixa a lista oficial de candidatos de SP (Eleições 2026) do DivulgaCandContas (TSE)
 * e grava public/data/candidatos-sp-2026.json — a mesma base que portais como O Tempo usam.
 *
 * A consulta de número acontece no navegador, contra esse JSON estático:
 * nenhum número digitado pelo eleitor sai do aparelho.
 *
 * Fotos: baixadas só para Senador, Governador e Presidente (poucos candidatos),
 * gravadas em public/data/fotos/. Deputados aparecem sem foto (exceto os configurados
 * manualmente em config/candidates.ts), para manter o site leve.
 *
 * Uso:  npm run sync:candidatos         (falha se o TSE não responder)
 *       node scripts/sync-candidates.mjs --soft   (usado no build: mantém o JSON atual se falhar)
 *       SKIP_SYNC=1 npm run build        (pula a sincronização)
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const SOFT = process.argv.includes("--soft");
const ANO = 2026;
const UF = "SP";
const BASE = "https://divulgacandcontas.tse.jus.br/divulga/rest/v1";
const IMG = "https://divulgacandcontas.tse.jus.br/divulga/rest/arquivo/img";
const OUT = path.join(process.cwd(), "public/data/candidatos-sp-2026.json");
const FOTOS = path.join(process.cwd(), "public/data/fotos");

const CARGOS = [
  { db: "presidente", cod: 1, uf: "BR", fotos: true },
  { db: "governador", cod: 3, uf: UF, fotos: true },
  { db: "senador", cod: 5, uf: UF, fotos: true },
  { db: "federal", cod: 6, uf: UF, fotos: false },
  { db: "estadual", cod: 7, uf: UF, fotos: false },
];

async function getJson(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(25000), headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} em ${url}`);
  return res.json();
}

async function eleicoes2026() {
  const lista = await getJson(`${BASE}/eleicao/ordinarias`);
  const ids = (Array.isArray(lista) ? lista : lista.eleicoes || [])
    .filter((e) => Number(e.ano) === ANO)
    .map((e) => String(e.id));
  if (!ids.length) throw new Error("Nenhuma eleição de 2026 encontrada no TSE");
  return [...new Set(ids)];
}

async function listar(cargo, ids) {
  for (const id of ids) {
    try {
      const data = await getJson(`${BASE}/candidatura/listar/${ANO}/${cargo.uf}/${id}/${cargo.cod}/candidatos`);
      const cands = data.candidatos || [];
      if (cands.length) return { id, cands };
    } catch {
      /* tenta a próxima eleição */
    }
  }
  return { id: null, cands: [] };
}

async function baixarFoto(idEleicao, cand, cargo) {
  const file = `${cargo.db}-${cand.numero}.jpg`;
  try {
    const res = await fetch(`${IMG}/${idEleicao}/${cand.id}/${cargo.uf}`, { signal: AbortSignal.timeout(20000) });
    if (!res.ok) return undefined;
    await writeFile(path.join(FOTOS, file), Buffer.from(await res.arrayBuffer()));
    return `/data/fotos/${file}`;
  } catch {
    return undefined;
  }
}

async function main() {
  if (process.env.SKIP_SYNC) return console.log("[candidatos] SKIP_SYNC definido — mantendo base atual.");
  const ids = await eleicoes2026();
  const base = { generatedAt: new Date().toISOString(), source: "TSE — DivulgaCandContas" };
  await mkdir(FOTOS, { recursive: true });
  let total = 0;
  for (const cargo of CARGOS) {
    const { id, cands } = await listar(cargo, ids);
    const mapa = {};
    for (const c of cands) {
      const numero = String(c.numero ?? "").trim();
      if (!numero) continue;
      const entry = { n: String(c.nomeUrna || c.nomeCompleto || "").trim(), p: c.partido?.sigla || "" };
      if (cargo.fotos && id) entry.f = await baixarFoto(id, c, cargo);
      mapa[numero] = entry;
    }
    base[cargo.db] = mapa;
    total += Object.keys(mapa).length;
    console.log(`[candidatos] ${cargo.db}: ${Object.keys(mapa).length}`);
  }
  if (!total) throw new Error("TSE respondeu, mas sem candidatos");
  await writeFile(OUT, JSON.stringify(base));
  console.log(`[candidatos] ${total} candidatos gravados em ${path.relative(process.cwd(), OUT)}`);
}

main().catch(async (err) => {
  const atual = existsSync(OUT) ? JSON.parse(await readFile(OUT, "utf8")) : null;
  console.warn(`[candidatos] Falha ao sincronizar com o TSE: ${err.message}`);
  if (SOFT) {
    console.warn(`[candidatos] Mantendo a base atual (gerada em ${atual?.generatedAt ?? "nunca"}).`);
    process.exit(0);
  }
  process.exit(1);
});
