## Phase 1

- sidebar
- page creation
- routing
- basic editor

## Phase 2

- Tiptap editor
- block system

## Phase 3

- Yjs collaboration
- websocket sync

## Phase 4

- Dexie offline persistence

## Phase 5

- permissions
- comments
- presence indicators

## Installation and Setup

### Prerequisites

- Node.js 20 or newer
- pnpm 10.x
- Git

### Install

1. Clone the repository.
2. From the project root, install dependencies:

```bash
pnpm install
```

### Run the project

Start both the web app and the API server from the root workspace:

```bash
pnpm dev
```

If you want to run them separately:

```bash
pnpm dev:web
pnpm dev:server
```

### Build and preview the web app

```bash
pnpm --filter web build
pnpm --filter web preview
```

### Initialize Prisma in the server

From the server package directory:

```bash
cd apps/server
pnpm exec prisma init --datasource-provider postgresql
```

Then update `prisma/schema.prisma` if needed, set `DATABASE_URL` in `.env`, and generate the client:

```bash
pnpm exec prisma generate
```

If you add models later, run migrations with:

```bash
pnpm exec prisma migrate dev --name init
```

### Useful URLs

- Web app: the Vite dev server started by `apps/web`
- API server: `http://localhost:5000`

## Libraries Used

### Web app dependencies

- React
- React DOM
- React Router DOM
- Vite
- TypeScript
- Lucide React
- Dexie
- Yjs
- y-websocket
- Tiptap React
- Tiptap Starter Kit
- Tiptap Collaboration extension
- Tiptap Collaboration Cursor extension

### Web app dev dependencies

- ESLint
- @eslint/js
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- globals
- @vitejs/plugin-react
- @tailwindcss/vite
- Tailwind CSS
- @types/node
- @types/react
- @types/react-dom
- typescript-eslint

### Server dependencies

- Express
- CORS
- dotenv
- pg
- ws

### Server dev dependencies

- ts-node-dev
- TypeScript
- @types/cors
- @types/express
- @types/node
- @types/ws

# Recommended Future Folder Structure

```
apps/
  web/
    src/
      components/
      pages/
      editor/
      hooks/
      layouts/
      services/
      store/

  server/
    src/
      routes/
      websocket/
      db/
      services/
      middleware/
      types/

packages/
  shared-types/
  ui/
```
