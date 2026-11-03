-- Allow the public marketing site (anon role) to submit merchant applications.
--
-- Must be applied to Supabase project jbcpqnhvzflgfesgqaar by the project owner.
--
-- Context: every browser write to public.merchant_applications was rejected with
--   42501 new row violates row-level security policy
-- because no policy permits INSERT for anon.
--
-- This grants INSERT ONLY. anon must never get SELECT, UPDATE or DELETE: the
-- table holds TINs and full applicant details. The site therefore inserts
-- once, on final submit, without `.select()` / `return=representation`.
--
-- BEFORE APPLYING, inspect the existing policies and keep any
-- authenticated/admin policies the CRM relies on (this migration does not
-- touch them):
--
--   select policyname, cmd, roles, qual, with_check
--   from pg_policies where tablename = 'merchant_applications';
--
-- Also confirm that no existing policy grants anon SELECT/UPDATE/DELETE
-- (e.g. a policy with roles = {public} or {anon} and cmd = ALL/SELECT). If one
-- exists, remove it — see the revokes below.

alter table public.merchant_applications enable row level security;

-- Table-level privileges for anon: insert only.
revoke select, update, delete, truncate on public.merchant_applications from anon;
grant insert on public.merchant_applications to anon;

drop policy if exists "Public can submit applications" on public.merchant_applications;

create policy "Public can submit applications"
on public.merchant_applications
for insert
to anon
with check (status = 'submitted');
