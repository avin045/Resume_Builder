# Resume_Builder

A static Vite + React + TypeScript resume builder frontend prepared for GitHub Pages deployment.

## Features

- State-based views for a resume dashboard, editor, template customization, and export/download prep.
- Editable starter resume content with a live preview.
- Accent color customization for template styling.
- GitHub Pages workflow that builds the app and deploys the `dist` artifact.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The Vite app is configured with `base: "/Resume_Builder/"` for GitHub Pages hosting under this repository name.
