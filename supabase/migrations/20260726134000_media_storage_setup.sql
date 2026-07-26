-- Create a storage bucket called "media" for portfolio images/clips
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Create policy to allow public access to images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'media' );

-- Create policy to allow admin users to upload/update/delete media
create policy "Admin Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'media' and public.has_role(auth.uid(), 'admin') );

create policy "Admin Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'media' and public.has_role(auth.uid(), 'admin') )
with check ( bucket_id = 'media' and public.has_role(auth.uid(), 'admin') );

create policy "Admin Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'media' and public.has_role(auth.uid(), 'admin') );
