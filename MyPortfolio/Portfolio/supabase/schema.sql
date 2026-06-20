-- Portfolio Admin Dashboard schema for Supabase
-- Run this file in the Supabase SQL editor after creating your project.

create extension if not exists "pgcrypto";

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'asimalyas4440@gmail.com';
$$;

create table if not exists public.profile (
  id text primary key default 'main' check (id = 'main'),
  name text not null default '',
  short_name text not null default '',
  brand_name text not null default '',
  headline text not null default '',
  summary text not null default '',
  about text not null default '',
  location text not null default '',
  avatar_url text not null default '',
  logo_avatar_url text not null default '',
  roles text[] not null default '{}',
  github_url text not null default '',
  linkedin_url text not null default '',
  resume_url text not null default '',
  contact_email text not null default '',
  phones text[] not null default '{}',
  suggested_questions text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default 'code',
  color text not null default 'text-indigo-500',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tech_stack text[] not null default '{}',
  categories text[] not null default '{}',
  url text,
  image_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  years text not null default '',
  degree text not null,
  institution text not null default '',
  grade text not null default '',
  image_url text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null default '',
  type text not null default 'Internship',
  location text not null default '',
  period text not null default '',
  image_url text,
  description text not null default '',
  responsibilities text[] not null default '{}',
  technologies text[] not null default '{}',
  certificate_url text,
  company_url text,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null default '',
  date_label text not null default '',
  description text not null default '',
  image_url text,
  credential_url text,
  category text not null default 'Skills',
  categories text[] not null default '{}',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  image_url text,
  categories text[] not null default '{}',
  date_label text not null default '',
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profile enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.education enable row level security;
alter table public.experiences enable row level security;
alter table public.certificates enable row level security;
alter table public.achievements enable row level security;

drop policy if exists "Public can read profile" on public.profile;
drop policy if exists "Admin can manage profile" on public.profile;
create policy "Public can read profile" on public.profile for select using (true);
create policy "Admin can manage profile" on public.profile for all using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "Public can read active skills" on public.skills;
drop policy if exists "Admin can manage skills" on public.skills;
create policy "Public can read active skills" on public.skills for select using (active = true);
create policy "Admin can manage skills" on public.skills for all using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "Public can read active projects" on public.projects;
drop policy if exists "Admin can manage projects" on public.projects;
create policy "Public can read active projects" on public.projects for select using (active = true);
create policy "Admin can manage projects" on public.projects for all using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "Public can read active education" on public.education;
drop policy if exists "Admin can manage education" on public.education;
create policy "Public can read active education" on public.education for select using (active = true);
create policy "Admin can manage education" on public.education for all using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "Public can read active experiences" on public.experiences;
drop policy if exists "Admin can manage experiences" on public.experiences;
create policy "Public can read active experiences" on public.experiences for select using (active = true);
create policy "Admin can manage experiences" on public.experiences for all using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "Public can read active certificates" on public.certificates;
drop policy if exists "Admin can manage certificates" on public.certificates;
create policy "Public can read active certificates" on public.certificates for select using (active = true);
create policy "Admin can manage certificates" on public.certificates for all using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

drop policy if exists "Public can read active achievements" on public.achievements;
drop policy if exists "Admin can manage achievements" on public.achievements;
create policy "Public can read active achievements" on public.achievements for select using (active = true);
create policy "Admin can manage achievements" on public.achievements for all using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

insert into public.profile (
  id,
  name,
  short_name,
  brand_name,
  headline,
  summary,
  about,
  location,
  avatar_url,
  logo_avatar_url,
  roles,
  github_url,
  linkedin_url,
  resume_url,
  contact_email,
  phones,
  suggested_questions
) values (
  'main',
  'Asim Ilyas Rathore',
  'Asim Ilyas Rathore',
  'Mr. Rathore',
  'Software Engineering student focused on web development, machine learning, and scalable applications.',
  'I create modern, scalable, and intelligent digital products by blending frontend design, APIs, and machine learning.',
  'I''m a passionate Software Engineering student at COMSATS University with expertise in full-stack development, machine learning, and building scalable applications.',
  'Abbottabad, Pakistan',
  '/imagesAchivemnts/profilePicNew1.png',
  '/imagesAchivemnts/profilePicNew1.png',
  array['Software Engineer','Web Developer','Machine Learning Engineer','Game Developer','DSA Specialist','Deep Learning Engineer','Problem Solver','AI & ML Engineer','Clean Code Developer','Creative Thinker'],
  'https://github.com/asimalyas',
  'https://www.linkedin.com/in/muhammad-asim-ilyas-a38b263a2',
  'https://1drv.ms/b/c/cacb8574e4143f96/IQDndPwfiBC3T7-h0IuWVWbyAe2Bro3mHw9OHb2SaDe3rz4?e=u6Hdfp',
  'asimalyas44440@gmail.com',
  array['+92 355 6074440', '+92 320 1587154'],
  array['Why should recruiters shortlist Asim?', 'Which projects best prove Asim''s React experience?', 'Summarize Asim for a junior software engineer role.', 'What AI and machine learning projects has Asim built?', 'How can I contact Asim?']
) on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

drop policy if exists "Public can read portfolio assets" on storage.objects;
drop policy if exists "Admin can upload portfolio assets" on storage.objects;
drop policy if exists "Admin can update portfolio assets" on storage.objects;
drop policy if exists "Admin can delete portfolio assets" on storage.objects;
create policy "Public can read portfolio assets" on storage.objects for select using (bucket_id = 'portfolio-assets');
create policy "Admin can upload portfolio assets" on storage.objects for insert with check (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());
create policy "Admin can update portfolio assets" on storage.objects for update using (bucket_id = 'portfolio-assets' and public.is_portfolio_admin()) with check (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());
create policy "Admin can delete portfolio assets" on storage.objects for delete using (bucket_id = 'portfolio-assets' and public.is_portfolio_admin());

