# Vue3 Template

Vue 3 Template

## Tech Stack

**Client UI:** Vue3, Typescript, TailwindCSS, Pinia, Shadcn

**Client Data Fetch:** Axios, Tanstack

## Run Locally

Install dependencies

```bash
  pnpm install
```

Start the server

```bash
  pnpm dev
```

## Folder Structure

```bash
├───api
│   └───auth
│   │   └───queries.ts
│   │   └───services.ts
│   │   └───types.d.ts
│   └───config.ts
├───assets
│   ├───css
│   ├───icons
│   └───images
├───components
├───composable
├───layouts
├───lib
├───locales
├───modules
│   ├───auth
│   │   └───login
│   │   │   └───LoginView.vue
│   │   │   └───types.d.ts
│   ├───log
│   ├───not-found
│   └───to-do-list
├───router
├───shared
│   └───global.d.ts
└───stores
```

#### api

Split into folders based on controllers

**queries:** Tanstack Logic

**services:** Axios Logic
