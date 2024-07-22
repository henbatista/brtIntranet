# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

# Definições de convenções a serem utilizadas neste projeto

## Nomes de pastas
 Usar letras minúsculas para nomear pastas no projeto Nuxt.js. 
 Isso ajuda a manter consistência e facilita a portabilidade do código entre sistemas operacionais, já que o sistema de arquivos de alguns sistemas operacionais é case-sensitive.

## Nomes de arquivos JavaScript/TypeScript - Para arquivos JavaScript ou TypeScript que contêm componentes Vue
 Nomear o arquivo com a primeira letra em maiúscula, seguida de camel case. 
 Exemplo: MeuComponente.vue ou MeuComponente.ts.
 
 | components/
 --| TheHeader.vue
 --| TheFooter.vue

## Nomes de arquivos CSS/SCSS
 Nomear o arquivo utilizando kebab case.
 Exemplo: meu-componente.css ou meu-componente.scss.
 Para arquivos CSS ou SCSS que estão associados a um componente específico, recomendado usar o mesmo nome do componente 

## Nomes de arquivos de layout
 Para arquivos de layout personalizados, usar a primeira letra em  minúsculas com kebab case. 
 Exemplo: meu-layout.vue.

 -| layouts/
 ---| default.vue
 ---| custom.vue