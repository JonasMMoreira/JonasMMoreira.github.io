# GameHub

Site estatico para `https://JonasMMoreira.github.io/gamehub/`, com GitHub Pages no frontend e Supabase para autenticacao, agenda, partidas e sincronizacao de dados.

## O que mudou

- Navegacao refeita com foco em celular.
- Agenda com dia e hora exatos para combinar jogatina.
- Arena com vencedor e derrotado em cada partida.
- Biblioteca e historico do Playnite importados a partir do export HTML.
- Sincronizacao da pasta exportada do Playnite direto no navegador.
- Backup da casa em JSON.

## Fluxo do Playnite

1. Exporte sua biblioteca do Playnite em HTML.
2. No GameHub, abra a aba `Playnite`.
3. Selecione a pasta exportada inteira.
4. Clique em `Sincronizar biblioteca`.
5. O site le o `index.html`, as paginas dos jogos e salva tudo no Supabase.

## Publicacao

1. Crie um projeto no Supabase.
2. Rode [supabase/schema.sql](./supabase/schema.sql) no SQL Editor.
3. Em `Authentication`, habilite cadastro de novos usuarios.
4. Em `Authentication > Providers > Email`, mantenha o provider ativo e desligue a confirmacao obrigatoria por email.
5. Edite [config.js](./config.js) com a URL e a chave publishable do Supabase.
6. Publique estes arquivos no repositorio `gamehub` da conta `JonasMMoreira`.
7. Ative GitHub Pages apontando para a branch principal e a raiz do projeto.
8. Mantenha o arquivo [.nojekyll](./.nojekyll) no repositorio.

## Estrutura

- [index.html](./index.html)
- [styles.css](./styles.css)
- [app.js](./app.js)
- [config.js](./config.js)
- [supabase/schema.sql](./supabase/schema.sql)
