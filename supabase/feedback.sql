-- Guest book for the off-duty section. Run once in the Supabase SQL editor.
-- Rows are written only by the site's server (service role key); Row Level
-- Security with no policies means nothing is readable with the anon key.

create table if not exists public.feedback (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  note        text not null check (char_length(note) between 3 and 800),
  name        text check (char_length(name) <= 40),
  night       text,                 -- palette they were on (synth, abyss, ...)
  path        text,                 -- page path, for a future multi-page site
  ua          text,                 -- browser, truncated
  ip_hash     text,                 -- salted sha-256 of the IP, for rate limits only
  approved    boolean not null default false, -- flip by hand to feature a note
  anonymous   boolean not null default false  -- visitor asked to be unnamed on the wall
);

create index if not exists feedback_created_at_idx on public.feedback (created_at desc);
create index if not exists feedback_ip_hash_idx on public.feedback (ip_hash, created_at desc);

alter table public.feedback enable row level security;
-- no policies on purpose: anon/authenticated roles can neither read nor write
