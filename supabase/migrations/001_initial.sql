-- ================================================================
--  persona-sim — initial schema
--  Run this in Supabase: Dashboard → SQL Editor → paste & run.
-- ================================================================

-- ── Enable UUID generation ────────────────────────────────────
create extension if not exists "pgcrypto";

-- ── characters ────────────────────────────────────────────────
create table if not exists public.characters (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  name            text not null,
  personality     text not null,   -- e.g. "curious, warm, sardonic"
  background      text not null,   -- backstory / historical context
  speech_style    text not null,   -- e.g. "speaks in riddles", "formal Victorian prose"
  knowledge_scope text not null,   -- what they know / don't know (era, domain)
  mode            text not null check (mode in ('fun', 'perspective')),
  learning_goals  text,            -- nullable; only meaningful in perspective mode
  created_at      timestamptz not null default now()
);

-- ── conversations ─────────────────────────────────────────────
create table if not exists public.conversations (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  character_id uuid not null references public.characters(id) on delete cascade,
  title        text not null default 'New conversation',
  created_at   timestamptz not null default now()
);

-- ── messages ─────────────────────────────────────────────────
create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role            text not null check (role in ('user', 'assistant')),
  content         text not null,
  created_at      timestamptz not null default now()
);

-- ── conversation_memory ───────────────────────────────────────
-- One row per conversation; upserted after the memory-compression step.
create table if not exists public.conversation_memory (
  conversation_id uuid primary key references public.conversations(id) on delete cascade,
  summary         text not null default '',
  facts           text[] not null default '{}',
  updated_at      timestamptz not null default now()
);

-- ── Row-Level Security ────────────────────────────────────────
-- Users can only read/write their own rows. Service-role key bypasses RLS.

alter table public.characters        enable row level security;
alter table public.conversations     enable row level security;
alter table public.messages          enable row level security;
alter table public.conversation_memory enable row level security;

-- characters
create policy "characters: owner access"
  on public.characters for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- conversations
create policy "conversations: owner access"
  on public.conversations for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- messages — scoped through conversation ownership
create policy "messages: owner access"
  on public.messages for all
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  );

-- conversation_memory — same scoping as messages
create policy "memory: owner access"
  on public.conversation_memory for all
  using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and c.user_id = auth.uid()
    )
  );

-- ── Helpful indexes ───────────────────────────────────────────
create index if not exists characters_user_id_idx    on public.characters(user_id);
create index if not exists conversations_user_id_idx on public.conversations(user_id);
create index if not exists messages_conv_id_idx      on public.messages(conversation_id, created_at);
