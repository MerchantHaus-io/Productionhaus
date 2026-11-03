-- Fix the realtime broadcast trigger on merchant_applications.
--
-- Must be applied to Supabase project jbcpqnhvzflgfesgqaar by the project owner.
--
-- The trigger fires AFTER INSERT OR UPDATE OR DELETE. The old function passed
--   to_jsonb(COALESCE(NEW, ROW_TO_JSON(OLD::record)::jsonb))
-- which fails on every call with
--   42804: COALESCE types merchant_applications and jsonb cannot be matched
-- So every insert, update and delete on the table failed, whatever the role.
--
-- realtime.broadcast_changes(topic, event, operation, table, schema, new, old)
-- takes the raw rows. The function stays security definer (anon inserts need
-- it to write to realtime.messages). search_path is now pinned, which is safe
-- because the only call is schema-qualified.
--
-- This function was created outside version control; this file records it.

create or replace function public.merchant_applications_broadcast_trigger()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  perform realtime.broadcast_changes(
    'merchant_applications:changes',
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  return coalesce(NEW, OLD);
end;
$function$;
