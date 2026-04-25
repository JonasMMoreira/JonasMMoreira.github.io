# PlayHub - Hub de Gaming da Familia

Site para organizar sessoes de jogo, ranking e registro de partidas da familia.

## Setup rapido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Abra o SQL Editor
3. Execute todo o conteudo de `supabase_schema.sql`
4. Copie:
   - `Project URL`
   - `anon / public key`

### 3. Configurar variaveis de ambiente

Crie um `.env` com base no `.env.example`:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4. Rodar localmente

```bash
npm run dev
```

Abra `http://localhost:5173`.

## GitHub Pages

O projeto ja esta ajustado para funcionar no GitHub Pages com Vite.

### O que foi preparado

- O `base` do Vite passa a usar automaticamente o nome do repositorio quando o build roda no GitHub Actions
- Foi adicionado um workflow em `.github/workflows/deploy.yml`
- O deploy publica o conteudo da pasta `dist`

### Como publicar

1. Suba este projeto para um repositorio no GitHub
2. Em `Settings > Pages`, deixe a fonte como `GitHub Actions`
3. Em `Settings > Secrets and variables > Actions`, crie estes secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Faça push para a branch `main`

Depois disso, o site sera publicado em:

```text
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/
```

Se voce usar dominio customizado ou quiser forcar outro caminho base, crie tambem a variavel de repositorio `BASE_PATH`.
Exemplos:

- `BASE_PATH=/playhub/`
- `BASE_PATH=/`

## Funcionalidades

- Login com nickname + senha
- Cadastro com cor de avatar
- Upload de foto de perfil
- Status em tempo real
- Ranking por XP
- Criacao e entrada em sessoes
- Notificacoes em tempo real
- Registro de partidas com distribuicao automatica de XP

## Estrutura

```text
src/
|-- hooks/
|   `-- useAuth.jsx
|-- lib/
|   `-- supabase.js
|-- pages/
|   |-- AuthPage.jsx
|   `-- Dashboard.jsx
|-- index.css
`-- main.jsx
```
