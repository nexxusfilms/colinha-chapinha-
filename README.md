# Minha Colinha 2026 — Chapinha da Vela

Ferramenta para o eleitor montar a colinha das Eleições 2026 (SP), com a identidade do **Chapinha da Vela — Deputado Estadual**.
Next.js + React + TypeScript + Tailwind + Lucide + html-to-image.

## Rodar
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # sincroniza candidatos com o TSE (se possível) e gera o build
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
`scripts/sync-candidates.mjs` baixa a lista oficial do **TSE (DivulgaCandContas)**, a mesma fonte usada por portais como O Tempo,
e grava `public/data/candidatos-sp-2026.json`. Roda automaticamente no `npm run build` (se o TSE não responder, mantém a base atual).
Manual: `npm run sync:candidatos`.

## Privacidade
- A busca por número acontece no navegador, contra um JSON estático: nenhum número digitado é enviado a servidor.
- A colinha fica só no `localStorage` do aparelho; "Limpar colinha" apaga tudo.
- `lib/analytics.ts` só registra eventos genéricos (abertura, download, impressão, compartilhamento), nunca números.
- Compartilhar envia apenas o link da ferramenta.
