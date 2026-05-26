# EV Tracker — Claude Code Reference

## Project
PWA de tracking de carregamentos EV e cálculo de débito ao condomínio.
URL: https://artmakerzbr.github.io/ev-tracker/

## Stack
- React + Vite → GitHub Pages (CI/CD via Actions)
- Supabase (PostgreSQL) — tabelas `readings` e `invoices`
- IBM Plex Mono, dark theme

## Deploy
```bash
npm run build
git add -A
git commit -m "..."
git push
```
GitHub Actions auto-deploya em ~2min. Secrets no GitHub: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` — não há `.env` local.

## Rules
- Edits cirúrgicos — nunca gerar o ficheiro completo
- Nunca usar `…` (reticências especiais) no código — o esbuild não processa, usar `...`
- A função `exportPDF` precisa ter a chaveta `}` de fecho antes do `calcBilling` — já causou builds quebrados
- O `index.html` foi substituído acidentalmente pelo do TeamWIP uma vez — manter atenção
- Variáveis de ambiente só existem nos GitHub Secrets — nunca criar `.env` local

## Design Tokens
- bg: #080a07 / surface: #0f1210 / surfaceHi: #161a14
- border: #1c2119 / accent: #00F563 / accentDim: #00b849
- tesla: #E82127 / renault: #f0a030 / danger: #e05050
- textHi: #eef2e8 / textMid: #7d8c74 / textLow: #3d4838 (só decorativo)
- Font: IBM Plex Mono / mínimo legível: 10px

## Business Logic
- Contador partilhado Tesla + Renault (contador físico da garagem)
- Delta = diferença entre leituras consecutivas
- Tarifa real = calculada a partir das faturas
- Fallback rate = tarifa da última fatura
- Poupança vs gasolina = (kWh/16)*7*preçoGasolina - €EV
- Preço gasolina = DGEG API, cache 7 dias em localStorage
- Histórico mensal em localStorage como `petrol-history: { "YYYY-MM": price }`

## Known Issues
- Navigation bar color no Pixel 8 Pro (PWA standalone) — sem solução encontrada
- Leitura perdida entre 3970.0 (13 Abr) e 4048.3 (22 Abr) — delta inflacionado em Abril 2026
- Supabase pausa após 7 dias sem actividade — keep-alive workflow resolve isto
