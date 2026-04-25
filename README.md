# Dashboard Gamer de Sofa

Site estatico pensado para GitHub Pages com Supabase no backend de autenticacao e dados.

URL de publicacao planejada: `https://JonasMMoreira.github.io/gamehub/`

## O que ja vem pronto

- Login com usuario e senha sem pedir email na interface.
- Foto de perfil usando Supabase Storage.
- Ranking da casa com `Rei do Sofa`, `Maratonista` e XP total.
- Hall da fama automatico com destaques da casa.
- Termometro da casa com ritmo competitivo, horas totais e fila da noite.
- Aba `Arena` para registrar vitorias e derrotas manualmente.
- Painel `Partiu Jogar?` para status da casa, horario e alertas.
- Importacao da biblioteca do Playnite via JSON.
- Exportacao de backup da casa e download de exemplo de JSON para testes.

## Publicacao rapida

1. Crie um projeto no Supabase.
2. Abra o SQL Editor e rode [supabase/schema.sql](./supabase/schema.sql).
3. Em `Auth > Providers > Email`, desative a confirmacao obrigatoria por email.
4. Edite [config.js](./config.js) com a URL e a anon key do projeto.
5. Publique estes arquivos em um repositorio chamado `gamehub` na conta `JonasMMoreira`.
6. Ative GitHub Pages apontando para a branch principal e a raiz do projeto.
7. Mantenha o arquivo [.nojekyll](./.nojekyll) no repositorio para o Pages servir tudo como site estatico puro.

## Observacao sobre o Playnite

GitHub Pages nao consegue ler diretamente o banco local do Playnite no PC do usuario por limitacoes do navegador. Por isso, esta versao usa importacao de JSON da biblioteca. Se quiser, o proximo passo pode ser um pequeno companion app Windows para ler o banco local do Playnite e sincronizar automaticamente com o Supabase.

## Estrutura

- [index.html](./index.html)
- [styles.css](./styles.css)
- [app.js](./app.js)
- [config.js](./config.js)
- [supabase/schema.sql](./supabase/schema.sql)
