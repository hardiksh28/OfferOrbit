-- Run once in your Supabase project's SQL Editor before using the app.
create table if not exists public.workspaces (
 user_id uuid primary key references auth.users(id) on delete cascade,
 data jsonb not null,
 updated_at timestamptz not null default now(),
 constraint valid_workspace check (
  jsonb_typeof(data->'opportunities') = 'array' and data ? 'opportunities' and
  jsonb_typeof(data->'contacts') = 'array' and data ? 'contacts' and
  jsonb_typeof(data->'drafts') = 'array' and data ? 'drafts' and
  jsonb_typeof(data->'profile') = 'object' and data ? 'profile' and
  octet_length(data::text) <= 2000000
 )
);
alter table public.workspaces enable row level security;
revoke all on public.workspaces from anon;
grant select, insert, update, delete on public.workspaces to authenticated;
create policy "Read own workspace" on public.workspaces for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own workspace" on public.workspaces for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own workspace" on public.workspaces for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own workspace" on public.workspaces for delete to authenticated using ((select auth.uid()) = user_id);
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('resumes','resumes',false,10485760,array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'])
on conflict (id) do nothing;
create policy "Read own resume" on storage.objects for select to authenticated using (bucket_id='resumes' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Upload own resume" on storage.objects for insert to authenticated with check (bucket_id='resumes' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Update own resume" on storage.objects for update to authenticated using (bucket_id='resumes' and (storage.foldername(name))[1]=(select auth.uid())::text) with check (bucket_id='resumes' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "Delete own resume" on storage.objects for delete to authenticated using (bucket_id='resumes' and (storage.foldername(name))[1]=(select auth.uid())::text);
