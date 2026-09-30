# Minha Colinha 2026 — Chapinha da Vela

Ferramenta para o eleitor montar a colinha das Eleições 2026 (SP), com a identidade do **Chapinha da Vela — Deputado Estadual**.
Next.js + React + TypeScript + Tailwind + Lucide + html-to-image.

## Rodar
```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```
Na Vercel: importar o repositório (framework **Next.js**), sem configuração extra.

## Onde trocar os dados da campanha
| O quê | Arquivo |
|---|---|
| Número, partido, nome, CNPJ, redes, textos de SEO | `config/campaign.ts` |
| Candidatos cadastrados à mão e botão "Preencher candidatos sugeridos" | `config/candidates.ts` |
| Foto (PNG transparente, meio corpo) | `public/images/chapinha.png` |
| Rosto (cards e urna) | `public/images/chapinha-rosto.png` |
| Logo azul / logo branco | `public/images/logo-chapinha.png`, `public/images/logo-chapinha-branco.png` |
| Imagem de compartilhamento (1200×630) | `public/og-image.jpg` |
| Ícone da aba | `app/icon.png` |

## Base de candidatos (busca por número)
`scripts/sync-candidates.mjs` baixa o arquivo oficial de dados abertos do **TSE** (`consulta_cand_2026.zip`, a mesma base
que portais como O Tempo usam) e grava `public/data/candidatos-sp-2026.json` (deputados, senadores e governador de SP, e
presidente). O GitHub Actions (`.github/workflows/candidatos.yml`) roda isso a cada 6 horas e salva no repositório; a
Vercel publica sozinha em seguida. Para rodar na hora: aba **Actions → Atualizar candidatos (TSE) → Run workflow**.

## Privacidade
- A busca por número acontece no navegador, contra um JSON estático: nenhum número digitado é enviado a servidor.
- A colinha fica só no `localStorage` do aparelho; "Limpar colinha" apaga tudo.
- `lib/analytics.ts` só registra eventos genéricos (abertura, download, impressão, compartilhamento), nunca números.
- Compartilhar envia apenas o link da ferramenta.
