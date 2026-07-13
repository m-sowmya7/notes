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

# Backend Implementation Map

This section maps frontend needs (what the web app uses or will call) to the backend files and implementations required, plus priorities and next steps.

- **Realtime collaboration (HIGH)**
  - Why: frontend uses `yjs` and `y-websocket` and shows sync/online status in UI.
  - Implement in: `apps/server/src/websocket/yjs` (Yjs websocket server), `apps/server/src/websocket/rooms`, `apps/server/src/websocket/presence`, and `apps/server/src/services/syncService`.
  - What to do: provide a WebSocket endpoint (e.g. `/yjs`), wire Y.Doc synchronization, persist snapshots optionally, and emit presence events.

- **Presence / Online status (MEDIUM)**
  - Why: `PageToolbar` shows online/offline and sync indicators.
  - Implement in: `apps/server/src/websocket/presence` and `apps/server/src/websocket/rooms`.
  - What to do: track connected users per room, expose simple presence API or ws events for the UI.

- **Document CRUD and listing (HIGH)**
  - Why: the app will need to create, fetch, update, and delete documents.
  - Implement in: `apps/server/src/api/documents`, backed by `apps/server/src/services/documentService` and DB models in `prisma/schema.prisma` (models: `User`, `Document`, `Revision` or `Content`).
  - Suggested endpoints: `GET /api/documents`, `GET /api/documents/:id`, `POST /api/documents`, `PUT /api/documents/:id`, `DELETE /api/documents/:id`.

- **Share links and public access (MEDIUM)**
  - Why: `ShareModal` in frontend uses share links and will request share metadata.
  - Implement in: `apps/server/src/api/share` and `apps/server/src/services/shareService`.
  - Suggested endpoints: `POST /api/share` (create link), `GET /api/share/:token` (resolve link), optional `DELETE /api/share/:token`.

- **Permissions (MEDIUM)**
  - Why: planned features include shared editing and permissions.
  - Implement in: `apps/server/src/api/permissions` and DB model `Permission` in Prisma.
  - Suggested behavior: check permission middleware on document endpoints; APIs to list/update permissions.

- **Auth / User (LOW to MEDIUM)**
  - Why: sharing and permissions need identities. If you already rely on external auth, integrate it.
  - Implement in: `apps/server/src/middleware` (auth middleware), `apps/server/src/routes` and a `User` model in Prisma.

- **Database / Persistence (HIGH if you need persistence)**
  - Why: to persist documents, shares, permissions, and snapshots.
  - Implement in: `apps/server/prisma/schema.prisma` (add models) and use generated client in `apps/server/src/generated/prisma`.
  - Steps: add Prisma models, set `DATABASE_URL` in `.env`, run `prisma migrate` and `prisma generate`.

- **Project scaffolding and glue (LOW)**
  - Files/folders currently empty but recommended for structure:
    - `apps/server/src/controllers` — HTTP handler implementations
    - `apps/server/src/routes` — Express routes registration
    - `apps/server/src/middleware` — auth, logging, error handling
    - `apps/server/src/utils` — helpers

Priority guidance: implement realtime + document CRUD + DB first for functional parity with frontend. Add share/permissions and auth after core flows work.

Quick next steps (developer checklist):

1. Add Prisma models for `User`, `Document`, `Share`, `Permission`, run migrations.
2. Implement minimal document endpoints in `apps/server/src/api/documents` and wire to `documentService`.
3. Start a basic Yjs websocket server in `apps/server/src/websocket/yjs` and expose `/yjs`.
4. Add presence tracking for rooms and expose status to the frontend.
5. Implement `share` endpoints and `shareService` to create/resolve public links.

Run the server (dev):

```bash
pnpm dev:server
```

If you want, I can scaffold minimal implementations for (1) a Yjs websocket endpoint and (2) the `GET /api/documents` and `POST /api/documents` endpoints next.

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

```
├── .turbo/
│   └── preferences/
│       └── tui.json
├── apps/
│   ├── server/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   │   ├── 20260621153416_init/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20260621153632_add_share_link/
│   │   │   │   │   └── migration.sql
│   │   │   │   ├── 20260705104212_live_rooms/
│   │   │   │   │   └── migration.sql
│   │   │   │   └── migration_lock.toml
│   │   │   ├── client.ts
│   │   │   └── schema.prisma
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   │   ├── documentController.ts
│   │   │   │   ├── shareController.ts
│   │   │   │   └── userController.ts
│   │   │   ├── live/
│   │   │   │   ├── extensions/
│   │   │   │   │   ├── awareness.ts
│   │   │   │   │   └── persistence.ts
│   │   │   │   ├── providers/
│   │   │   │   │   └── provider.ts
│   │   │   │   ├── hocuspocus.ts
│   │   │   │   ├── rooms.ts
│   │   │   │   └── utils.ts
│   │   │   ├── repositories/
│   │   │   │   ├── documentRepository.ts
│   │   │   │   ├── shareRepository.ts
│   │   │   │   └── userRepository.ts
│   │   │   ├── routes/
│   │   │   │   ├── documentRoutes.ts
│   │   │   │   ├── shareRoutes.ts
│   │   │   │   └── userRoutes.ts
│   │   │   ├── services/
│   │   │   │   ├── documentService.ts
│   │   │   │   ├── shareService.ts
│   │   │   │   └── userService.ts
│   │   │   └── index.ts
│   │   ├── .env.example
│   │   ├── .gitignore
│   │   ├── package.json
│   │   ├── prisma.config.ts
│   │   └── tsconfig.json
│   └── web/
│       ├── public/
│       │   └── cursor.cur
│       ├── src/
│       │   ├── components/
│       │   │   ├── dashboard/
│       │   │   │   └── FolderIcon.tsx
│       │   │   ├── kanban/
│       │   │   │   ├── AddCard.tsx
│       │   │   │   ├── Card.tsx
│       │   │   │   ├── Column.tsx
│       │   │   │   ├── DeleteZone.tsx
│       │   │   │   └── DropIndicator.tsx
│       │   │   ├── live/
│       │   │   │   └── LiveParticipants.tsx
│       │   │   ├── ManageLinksModal.tsx
│       │   │   ├── PageToolbar.tsx
│       │   │   ├── ShareEdit.tsx
│       │   │   ├── ShareModal.tsx
│       │   │   ├── ShareView.tsx
│       │   │   ├── Sidebar.tsx
│       │   │   ├── SlashCommandList.tsx
│       │   │   └── TemplatesModal.tsx
│       │   ├── context/
│       │   │   └── TemplatesModalContext.tsx
│       │   ├── db/
│       │   │   └── localDb.ts
│       │   ├── features/
│       │   │   ├── editor/
│       │   │   │   ├── commands/
│       │   │   │   │   └── slashItems.ts
│       │   │   │   └── extensions/
│       │   │   │       └── SlashCommand.tsx
│       │   │   ├── live/
│       │   │   │   └── provider.ts
│       │   │   └── share/
│       │   │       └── components/
│       │   │           ├── SharedKanban.tsx
│       │   │           ├── SharedList.tsx
│       │   │           └── SharedMarkdown.tsx
│       │   ├── layouts/
│       │   │   └── AppLayout.tsx
│       │   ├── pages/
│       │   │   ├── Dashboard.tsx
│       │   │   ├── Kanban.tsx
│       │   │   ├── List.tsx
│       │   │   ├── Markdown.tsx
│       │   │   ├── SharedPage.tsx
│       │   │   ├── StarredPage.tsx
│       │   │   └── TrashPage.tsx
│       │   ├── routes/
│       │   │   └── AppRoutes.tsx
│       │   ├── services/
│       │   │   └── syncService.ts
│       │   ├── types/
│       │   │   ├── kanbanTypes.ts
│       │   │   ├── pageToolbarType.ts
│       │   │   └── pageType.ts
│       │   ├── utils/
│       │   │   └── dashboard/
│       │   │       └── helpers.ts
│       │   ├── App.tsx
│       │   ├── index.css
│       │   └── main.tsx
│       ├── .gitignore
│       ├── eslint.config.js
│       ├── index.html
│       ├── package.json
│       ├── README.md
│       ├── tsconfig.app.json
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       └── vite.config.ts
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── to-do.txt
└── turbo.json
```