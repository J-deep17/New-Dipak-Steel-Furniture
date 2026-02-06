
-- 1. Homepage Hero
create table if not exists public.homepage_hero (
  id uuid primary key default gen_random_uuid(),
  heading text not null,
  subheading text,
  highlight_text text,
  hero_image text,
  cta_primary_text text,
  cta_primary_link text,
  cta_secondary_text text,
  cta_secondary_link text
);

alter table public.homepage_hero enable row level security;

create policy "Allow public read access" on public.homepage_hero
  for select using (true);

create policy "Allow admin full access" on public.homepage_hero
  for all using (public.is_admin(auth.uid()));

-- Seed Hero
insert into public.homepage_hero (heading, subheading, highlight_text, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link)
values (
  'Leading Office Furniture Manufacturer in Ahmedabad',
  'Dipak Furniture provides premium quality ergonomic chairs, executive desks, and institutional seating solutions with 25+ years of trust.',
  'Dipak Furniture',
  'View Products',
  '/products',
  'Contact Us',
  '/contact'
);


-- 2. Homepage Stats
create table if not exists public.homepage_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null
);

alter table public.homepage_stats enable row level security;

create policy "Allow public read access" on public.homepage_stats
  for select using (true);

create policy "Allow admin full access" on public.homepage_stats
  for all using (public.is_admin(auth.uid()));

-- Seed Stats
insert into public.homepage_stats (label, value) values 
('Years Experience', '25+'),
('Happy Clients', '500+'),
('Products Range', '100+');


-- 3. Homepage Categories
create table if not exists public.homepage_categories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  image_url text,
  link text
);

alter table public.homepage_categories enable row level security;

create policy "Allow public read access" on public.homepage_categories
  for select using (true);

create policy "Allow admin full access" on public.homepage_categories
  for all using (public.is_admin(auth.uid()));

-- Seed Categories (Placeholders, as actual images are in frontend code)
insert into public.homepage_categories (title, link) values 
('Office Chairs', '/products?category=chairs'),
('Steel Almirahs', '/products?category=almirahs'),
('School Furniture', '/products?category=school');


-- 4. Homepage About
create table if not exists public.homepage_about (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  button_text text,
  button_link text
);

alter table public.homepage_about enable row level security;

create policy "Allow public read access" on public.homepage_about
  for select using (true);

create policy "Allow admin full access" on public.homepage_about
  for all using (public.is_admin(auth.uid()));

-- Seed About
insert into public.homepage_about (title, description, button_text, button_link)
values (
  'Leading Office Furniture Manufacturer in Ahmedabad',
  'Dipak Furniture is a trusted office furniture manufacturer in Ahmedabad, Gujarat with over 25 years of experience in crafting premium quality furniture for offices, institutions, and commercial spaces. We specialize in ergonomic seating solutions designed for comfort.',
  'Learn About Us',
  '/about'
);


-- 5. Homepage Testimonials
create table if not exists public.homepage_testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  rating int default 5
);

alter table public.homepage_testimonials enable row level security;

create policy "Allow public read access" on public.homepage_testimonials
  for select using (true);

create policy "Allow admin full access" on public.homepage_testimonials
  for all using (public.is_admin(auth.uid()));

-- Seed Testimonials
insert into public.homepage_testimonials (name, message, rating) values
('Rajesh Kumar', 'Excellent quality chairs for our new office. Very comfortable and durable.', 5),
('Priya Patel', 'The steel almirahs are very sturdy. Great service and timely delivery.', 5);


-- 6. Homepage Features (Using WhyChooseUs content maybe?)
create table if not exists public.homepage_features (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  icon text
);

alter table public.homepage_features enable row level security;

create policy "Allow public read access" on public.homepage_features
  for select using (true);

create policy "Allow admin full access" on public.homepage_features
  for all using (public.is_admin(auth.uid()));

-- Seed Features
insert into public.homepage_features (title, description, icon) values
('Factory Direct', 'Get the best prices directly from the manufacturer.', 'Factory'),
('Quality Assurance', 'Premium materials and strict quality control.', 'CheckCircle'),
('Fast Delivery', 'Timely delivery across Gujarat and India.', 'Truck');


-- 7. Homepage FAQ
create table if not exists public.homepage_faq (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null
);

alter table public.homepage_faq enable row level security;

create policy "Allow public read access" on public.homepage_faq
  for select using (true);

create policy "Allow admin full access" on public.homepage_faq
  for all using (public.is_admin(auth.uid()));

-- Seed FAQ
insert into public.homepage_faq (question, answer) values
('Do you offer bulk discounts?', 'Yes, we offer competitive pricing for bulk orders for offices and institutions.'),
('Do you provide warranty?', 'Yes, all our products come with a standard warranty against manufacturing defects.');


-- 8. Homepage CTA
create table if not exists public.homepage_cta (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  button_text text,
  button_link text,
  background_color text
);

alter table public.homepage_cta enable row level security;

create policy "Allow public read access" on public.homepage_cta
  for select using (true);

create policy "Allow admin full access" on public.homepage_cta
  for all using (public.is_admin(auth.uid()));

-- Seed CTA
insert into public.homepage_cta (title, description, button_text, button_link)
values (
  'Ready to Transform Your Workspace?',
  'Get in touch with our team for personalized recommendations and competitive quotes on bulk orders.',
  'Get a Free Quote',
  '/contact'
);
