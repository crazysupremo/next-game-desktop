# NEXT GAME Desktop

App de desktop (Windows/Mac/Linux) que abre o NEXT GAME (bluegames-nextgame.onrender.com)
numa janela própria — ícone próprio, sem barra de endereço, notificações e permissões de
câmera/microfone/tela funcionando normalmente (é o mesmo site, só numa "casca" de app).

Não precisa mexer em nada do código do NEXT GAME em si — este projeto é só o "instalador",
separado.

## Por que isto não vem com o instalador .exe já pronto

Gerar o instalador exige baixar o motor do Electron (o "navegador" que roda dentro do app,
~120MB), hospedado no GitHub. O ambiente onde eu rodo não tem acesso liberado a esse endereço
específico — só a registros de pacotes comuns (npm). Por isso não consegui gerar o `.exe`
final diretamente aqui.

## Jeito mais fácil: deixar o GitHub gerar sozinho (não precisa instalar nada no seu PC)

Este projeto já vem com um robô configurado (`.github/workflows/build.yml`) que, assim que
você sobe os arquivos num repositório do GitHub, liga um computador Windows de verdade nos
servidores do próprio GitHub, gera o `.exe` e já publica como Release automaticamente — com
link de download pronto. Você não precisa ter Node.js nem nada instalado.

1. No GitHub, crie um repositório novo (ex: `next-game-desktop`), público.
2. Extraia este zip e suba **todo o conteúdo** pra esse repositório — igual você já fez com os
   outros zips (arrastar os arquivos na área de upload). **Importante:** a pasta `.github`
   (com o arquivo `workflows/build.yml` dentro) precisa ir junto — ela costuma ficar "escondida"
   no Finder/Explorador de arquivos por causa do ponto no nome, então confirme que ela foi
   incluída no arraste (no Mac: Cmd+Shift+. no Finder mostra pastas ocultas).
3. Depois do upload, vá na aba **Actions** do repositório (menu de cima, ao lado de "Pull
   requests") — vai aparecer um processo rodando ("Build NEXT GAME Desktop Installer"). Espera
   uns 3-5 minutos até ficar com uma bolinha verde ✅.
4. Quando terminar, vá na aba **Releases** (lateral direita da página principal do repo) — vai
   ter uma release nova (tipo "NEXT GAME Desktop v1.0.1") com o `NEXT-GAME-Setup.exe` anexado.
5. Clique com o botão direito no nome do arquivo `.exe` → **"Copiar endereço do link"**.
6. Me manda esse link — eu coloco no lugar certo (`public/app.js` do NEXT GAME, constante
   `DESKTOP_DOWNLOAD_URL`) e te devolvo o site atualizado pra você subir no Render. Aí o botão
   "Baixar NEXT GAME para PC" na tela de login já fica ativo pra qualquer pessoa.

Toda vez que você subir uma versão nova do código pra esse repositório, o robô gera um `.exe`
novo automaticamente — não precisa repetir esse processo manualmente depois.

## Alternativa: gerar na sua própria máquina (se preferir ou tiver Node.js)

Pré-requisito: ter o [Node.js](https://nodejs.org) instalado (versão 18 ou mais recente).

```
npm install
npm run dist:win
```

O instalador pronto fica em `dist/NEXT-GAME-Setup.exe`. Depois é só seguir os passos 4-6 acima
(publicar como Release no GitHub e me mandar o link) — só que sem precisar da aba Actions,
porque você já gerou o arquivo direto no seu computador.

## Gerar pra Mac ou Linux

```
npm run dist:mac     # gera um .dmg (só funciona rodando num Mac)
npm run dist:linux   # gera um .AppImage
```

## Testar sem gerar instalador (mais rápido, só pra ver funcionando)

```
npm install
npm start
```
Abre a janela do app direto, sem empacotar nada.

## Trocar o endereço do NEXT GAME (se um dia mudar de domínio)

Não precisa mexer no código nem reempacotar o instalador. É só definir a variável de ambiente
`NEXT_GAME_URL` antes de abrir o app — por padrão ele usa
`https://bluegames-nextgame.onrender.com`.

## Ícone

O ícone usado (`build/icon.png`) é a logo oficial do NEXT GAME em alta resolução (512×512),
já pronto — o electron-builder converte automaticamente pros formatos `.ico` (Windows) e
`.icns` (Mac) na hora de empacotar.

## Assinatura de código (opcional, mas recomendado no futuro)

Sem um certificado de assinatura de código, o Windows vai mostrar um aviso do SmartScreen
("Windows protegeu seu PC") na primeira vez que alguém abrir o instalador — é normal pra apps
não assinados e não afeta o funcionamento, só assusta um pouco quem não conhece. Se quiser
remover esse aviso mais pra frente, é preciso comprar um certificado de assinatura de código
(EV code signing) — isso é opcional e pode ser feito depois, sem precisar mudar nada do projeto
agora.
