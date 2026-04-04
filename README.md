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

### Número do WhatsApp

Edite `js/main.js` e altere a constante `WHATSAPP_NUMBER` antes do `git push`.
