# Backend — Vanessa Braz

## Fonte de verdade

- Schema e RLS: `supabase/migrations/`
- Booking authority: `public.create_appointment` (price from `services.price_cents`)
- Double booking: `EXCLUDE USING gist` + trigger + row lock
- Auth: Supabase Auth. Passwords never stored by this application.
- Payments: webhook is authority (`supabase/functions/payments-webhook`)

## Bootstrap admin

After the first user signs up:

```sql
update public.profiles
   set role = 'admin'
 where email = 'EMAIL_REAL_DA_VANESSA';
```

There is no demo admin password.

## Apply migrations

```bash
supabase db push
# or
supabase migration up
```

Required env on the frontend:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Never set `VITE_SUPABASE_SERVICE_ROLE_KEY`.

## Live Supabase

Until a project is linked, catalog pages use the local fallback in `src/lib/data.ts`.
Login, booking confirmation and admin writes require a configured project.
