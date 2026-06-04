# Persona Sim

An interactive AI roleplay and perspective simulator. Create a character, pick a world, and have a persistent in-character conversation with the AI.

Two modes share one engine:
- **Fun mode** — immersive roleplay (fantasy, adventures, creative fiction).
- **Perspective mode** — educational; talk to a historical figure or another viewpoint without breaking character.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 — dark theme |
| Database + Auth | Supabase (Postgres + Row-Level Security) |
| AI | Anthropic API (`@anthropic-ai/sdk`) — server-side only, streaming |
| Deployment | Vercel |

---

## Local setup — step by step

### 1. Prerequisites

- **Node.js 20+** — install via [nvm](https://github.com/nvm-sh/nvm):
  ```bash
  nvm install 20 && nvm use 20
  ```
- A free [Supabase](https://supabase.com) account.
- An [Anthropic API key](https://console.anthropic.com).

### 2. Clone and install

```bash
git clone <your-repo-url>
cd persona-sim
npm install
```

### 3. Supabase project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Note your **Project URL** and **anon public key** (Settings → API).
3. Run the migration:
   - Open the **SQL Editor** in your Supabase dashboard.
   - Paste the entire contents of `supabase/migrations/001_initial.sql`.
   - Click **Run**.  
   This creates all tables and enables Row-Level Security so each user can only see their own data.

### 4. Environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
ANTHROPIC_API_KEY=sk-ant-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Security note**: `ANTHROPIC_API_KEY` is never sent to the browser. Only variables prefixed with `NEXT_PUBLIC_` are client-accessible.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How to deploy to Vercel

1. Push your repo to GitHub.
2. Import it in [Vercel](https://vercel.com).
3. Add all four environment variables in the Vercel dashboard (Settings → Environment Variables).
4. Deploy. Done.

---

## How the persona + memory engine works

### 1. Character → System Prompt Compiler

Every character has these fields: `name`, `personality`, `background`, `speech_style`, `knowledge_scope`, and `mode`.

When a conversation starts, a compiler function (`lib/engine/compiler.ts`, Phase 3) turns these fields into a system prompt that is sent to Claude. The compiler:
- Writes a vivid first-person description of the character.
- Includes 1–2 **few-shot example lines** in the character's voice — this is the single biggest lever for keeping the AI in character.
- Branches on `mode`:
  - `fun` → narrate immersively, use the character's speech style, stay in the world.
  - `perspective` → embody the worldview and knowledge limits; don't break character to lecture; acknowledge what this person would not know.

### 2. Memory (Phase 4)

Long conversations would overflow the context window if we sent every message every time. We use a simple two-part memory:

- **Recent window**: the last 10 messages are always sent verbatim.
- **Summary + facts**: when the conversation grows past ~20 messages, a cheap background AI call compresses older turns into a `summary` paragraph and extracts durable `facts` (names, relationships, plot points). These are stored in the `conversation_memory` table and prepended to every future prompt.

No vector database needed — just Postgres. This keeps the architecture simple and free.

**Current limitation**: the compression call itself costs tokens, and the summary can lose subtle nuance. For most conversations this is invisible, but very long sessions (100+ turns) may gradually drift.

### 3. Moderation (Phase 5)

A single module (`lib/engine/moderation.ts`) wraps input and output checks. The current implementation uses Claude's own judgment via a brief meta-prompt. The interface is:

```ts
moderateText(text: string): Promise<{ allowed: boolean; reason?: string }>
```

Because the interface is fixed, you can swap the implementation for a dedicated API (e.g. OpenAI Moderation) without touching any calling code.

---

## Data model

```
users            (Supabase auth — managed automatically)
characters       id, user_id, name, personality, background,
                 speech_style, knowledge_scope, mode, learning_goals
conversations    id, user_id, character_id, title
messages         id, conversation_id, role, content
conversation_memory  conversation_id, summary, facts[]
```

Row-Level Security ensures each user only reads and writes their own rows, even if someone guesses a UUID.

---

## Project structure

```
app/                   Next.js App Router pages and route handlers
  (auth)/              Login / register pages (Phase 1)
  (app)/               Authenticated app pages (Phase 2+)
  api/                 Server-side route handlers (AI, auth callbacks)
lib/
  supabase/            Browser, server, and middleware Supabase clients
  engine/              Prompt compiler, memory manager, moderation (Phase 3-5)
types/
  database.ts          TypeScript types mirroring the Postgres schema
supabase/
  migrations/          SQL files — run in Supabase SQL Editor
public/                Static assets, PWA manifest + icons
```

---

## Build phases

| Phase | What was built |
|---|---|
| 0 | Scaffold, Supabase clients, README, `.env.example` |
| 1 | Auth (register, login, logout) + SQL schema + RLS |
| 2 | Character creator + conversation list |
| 3 | Chat screen with streaming AI responses + prompt compiler |
| 4 | Memory layer (summary + facts) |
| 5 | Mode branching + moderation module |
| 6 | PWA manifest + service worker + polish |
