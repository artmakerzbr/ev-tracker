# Garagem · EV Tracker

Registo de carregamentos EV e cálculo de débito ao condomínio.

---

## Deploy em 4 passos

### 1. Supabase (base de dados)

1. Vai a [supabase.com](https://supabase.com) → criar conta gratuita
2. Cria um novo projecto (nome: `ev-tracker`, escolhe uma região próxima, ex: `eu-west-1`)
3. Aguarda o projecto iniciar (~2 min)
4. Vai a **SQL Editor** → **New Query** → cola o conteúdo de `supabase-schema.sql` → **Run**
5. Vai a **Project Settings** → **API** e copia:
   - `Project URL` → é o teu `VITE_SUPABASE_URL`
   - `anon public` key → é o teu `VITE_SUPABASE_ANON_KEY`

---

### 2. GitHub (repositório)

1. Vai a [github.com](https://github.com) → criar conta se não tiveres
2. Cria um novo repositório com o nome **`ev-tracker`** (público, sem README)
3. No teu Mac, abre o Terminal nesta pasta e corre:

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USERNAME/ev-tracker.git
git push -u origin main
```

---

### 3. Secrets no GitHub

1. No GitHub, vai ao teu repositório → **Settings** → **Secrets and variables** → **Actions**
2. Clica **New repository secret** e adiciona:
   - Nome: `VITE_SUPABASE_URL` → Valor: (o URL que copiaste do Supabase)
   - Nome: `VITE_SUPABASE_ANON_KEY` → Valor: (a anon key que copiaste)

---

### 4. Activar GitHub Pages

1. No GitHub → **Settings** → **Pages**
2. Em **Source** selecciona **GitHub Actions**
3. Faz qualquer commit para o repositório para disparar o primeiro deploy:

```bash
git commit --allow-empty -m "trigger deploy"
git push
```

4. Aguarda ~2 min → a app fica disponível em:
   `https://SEU_USERNAME.github.io/ev-tracker/`

---

## Instalar no telemóvel como app

**iPhone (Safari):**
Abre o URL → toca em Partilhar → "Adicionar ao Ecrã Principal"

**Android (Chrome):**
Abre o URL → menu (⋮) → "Adicionar ao ecrã inicial"

---

## Desenvolvimento local

```bash
# Instalar dependências
npm install

# Criar ficheiro .env.local com as tuas credenciais
cp .env.example .env.local
# edita .env.local com os teus valores do Supabase

# Correr localmente
npm run dev
```

---

## Adicionar novas faturas

Quando receberes uma nova fatura do condomínio, envia o PDF ao Claude nesta conversa.
Ele extrai as tarifas automaticamente e devolve os dados para inserires na app.
