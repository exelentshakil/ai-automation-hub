# Traffic Analytics Setup

1. In Supabase SQL Editor:

```sql
create table if not exists public.traffic_logs (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    path text not null,
    ip_address text,
    city text,
    country text,
    user_agent text
);

-- Analytics dashboard needs read access, API needs write
alter table public.traffic_logs enable row level security;

create policy "Allow service role insert" on public.traffic_logs for insert with check (true);
create policy "Allow service role read" on public.traffic_logs for select using (true);
```

2. Add environment variables to Vercel (NEVER prefix with NEXT_PUBLIC_):
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

3. Opt-out snippet for yourself:
Run in browser console: `localStorage.setItem('disable_tracking', 'true')`
