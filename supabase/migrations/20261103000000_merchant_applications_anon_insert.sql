-- Lock public (anon) access to merchant_applications down to INSERT only.
--
-- Must be applied to Supabase project jbcpqnhvzflgfesgqaar by the project owner.
--
-- State found on 2026-11-03 (pg_policies / role_table_grants):
--   * anon had table grants for SELECT, INSERT, UPDATE, DELETE, TRUNCATE,
--     REFERENCES and TRIGGER.
--   * anon policies: "Public insert" (INSERT, with check true),
--     "Enable update for public" and "Public update own" (UPDATE, using true).
--   * No anon SELECT policy. That is why the old browser upsert
--     (INSERT ... ON CONFLICT DO UPDATE) failed with 42501, while plain inserts
--     were already allowed.
--
-- After this migration anon can only INSERT rows with status = 'submitted'.
-- The website sends that explicitly (Apply.tsx and MerchantApplicationDialog.tsx).
-- Policies for authenticated users are not touched.
--
-- Inspect before applying:
--   select policyname, cmd, roles, qual, with_check
--   from pg_policies where tablename = 'merchant_applications';

begin;

alter table public.merchant_applications enable row level security;

-- Table-level privileges for anon: insert only.
revoke select, update, delete, truncate, references, trigger
  on public.merchant_applications from anon;
grant insert on public.merchant_applications to anon;

-- Old permissive anon policies. "Public insert" allowed any row, which would
-- override the status check below, because permissive policies are OR'd.
drop policy if exists "Public insert" on public.merchant_applications;
drop policy if exists "Enable update for public" on public.merchant_applications;
drop policy if exists "Public update own" on public.merchant_applications;

drop policy if exists "Public can submit applications" on public.merchant_applications;

create policy "Public can submit applications"
on public.merchant_applications
for insert
to anon
with check (status = 'submitted');

commit;
