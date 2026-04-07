# Site — Alana Brígida

Site estático (HTML, CSS, JS) com [Vite](https://vitejs.dev/) para desenvolvimento local e build de produção.

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior (recomendado 20 LTS)
- [npm](https://www.npmjs.com/) (vem com o Node)

## Uso local

Na pasta do projeto:

```bash
npm install
npm run dev
```

Abre o servidor em `http://localhost:5173` (porta exibida no terminal). Edições em `index.html`, `css/` e `js/` recarregam automaticamente.

Outros comandos:

```bash
npm run build    # gera a pasta dist/ (versão para publicar)
npm run preview  # serve a pasta dist/ localmente para testar o build
```

## Git e GitHub Pages

1. Crie um repositório no GitHub (pode ser público).
2. Na raiz deste projeto:

   ```bash
   git init
   git add .
   git commit -m "Site inicial"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPO.git
   git push -u origin main
   ```

3. No GitHub: **Settings → Pages → Build and deployment → Source**: escolha **GitHub Actions** (não “Deploy from a branch”).
4. O workflow `.github/workflows/deploy.yml` roda a cada push na branch `main` (ou `master`) e publica o conteúdo de `dist/`.

Após o primeiro deploy, o site aparece em `https://SEU_USUARIO.github.io/SEU_REPO/` (ajuste conforme o nome do repositório).

### WhatsApp e redes sociais

Edite `js/main.js` e preencha o objeto `SITE_CONFIG` com:

- `whatsappNumber`
- `socialLinks.instagram`
- `socialLinks.tiktok`
- `socialLinks.youtube`

Os botões ficam desativados automaticamente enquanto esses dados não forem informados.

## Checklist antes de publicar

- Preencher `SITE_CONFIG.whatsappNumber` em `js/main.js`.
- Revisar links de `socialLinks` (Instagram, TikTok, YouTube).
- (Opcional) Preencher `snapWidgetEmbedId` para usar feed real do Instagram.
- Rodar `npm run build` e conferir se a pasta `dist/` foi gerada sem erros.

### Faixa do Instagram (fotos reais em rolagem)

O Instagram não permite puxar posts direto no navegador sem API ou serviço autorizado. Para a faixa no fim da página mostrar **as publicações reais** de [@alanabrigidapsico](https://www.instagram.com/alanabrigidapsico/):

1. Crie uma conta gratuita em [SnapWidget](https://snapwidget.com/).
2. Conecte o perfil do Instagram e escolha um layout em **faixa / carrossel** (similar ao site de referência).
3. Gere o embed e copie o **ID** que aparece na URL do `iframe` (trecho após `/embed/`).
4. Em `js/main.js`, preencha `snapWidgetEmbedId: "SEU_ID"`.

Com o ID preenchido, o site carrega o widget e **esconde** a faixa alternativa com fotos locais. Sem ID, continua a rolagem com imagens da pasta `assets/photos/`.
