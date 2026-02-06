
-- Create 'uploads' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- Create 'product-images' bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Drop existing policies to avoid conflicts
drop policy if exists "Public Access" on storage.objects;
drop policy if exists "Public Access Product Images" on storage.objects;
drop policy if exists "Auth Upload" on storage.objects;
drop policy if exists "Auth Update" on storage.objects;
drop policy if exists "Auth Delete" on storage.objects;
drop policy if exists "Auth Upload Product Images" on storage.objects;
drop policy if exists "Auth Update Product Images" on storage.objects;
drop policy if exists "Auth Delete Product Images" on storage.objects;

-- Policy: Public Read Access for 'uploads'
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'uploads' );

-- Policy: Public Read Access for 'product-images'
create policy "Public Access Product Images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- Policy: Admin Upload Access for 'uploads' (Authenticated users)
create policy "Auth Upload"
  on storage.objects for insert
  with check ( bucket_id = 'uploads' and auth.role() = 'authenticated' );

-- Policy: Admin Update/Delete for 'uploads'
create policy "Auth Update"
  on storage.objects for update
  using ( bucket_id = 'uploads' and auth.role() = 'authenticated' );

create policy "Auth Delete"
  on storage.objects for delete
  using ( bucket_id = 'uploads' and auth.role() = 'authenticated' );

-- Repeat policies for 'product-images'
create policy "Auth Upload Product Images"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

create policy "Auth Update Product Images"
  on storage.objects for update
  using ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

create policy "Auth Delete Product Images"
  on storage.objects for delete
  using ( bucket_id = 'product-images' and auth.role() = 'authenticated' );
