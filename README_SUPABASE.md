# Supabase Setup for Data Persistence

Run this in your Supabase SQL Editor to enable persistent logs across page refreshes:

```sql
create table if not exists public.orchestration_logs (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    event_type text not null,
    input_payload text not null,
    confidence integer not null,
    action text not null,
    status text not null
);

alter table public.orchestration_logs enable row level security;
create policy "Allow service role insert" on public.orchestration_logs for insert with check (true);
create policy "Allow service role select" on public.orchestration_logs for select using (true);
```
