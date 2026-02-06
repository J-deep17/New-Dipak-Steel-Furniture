-- Create product_templates table
create table if not exists product_templates (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  key_features text[],
  warranty_coverage text[],
  warranty_care text[],
  dimensions text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for product_templates
alter table product_templates enable row level security;

create policy "Allow admin all on templates"
  on product_templates
  for all
  using ( is_admin(auth.uid()) );

-- Update products table
alter table products add column if not exists warranty_coverage text[];
alter table products add column if not exists warranty_care text[];

-- Drop old warranty column (assuming we can drop it safely as per instructions to refactor)
alter table products drop column if exists warranty;
