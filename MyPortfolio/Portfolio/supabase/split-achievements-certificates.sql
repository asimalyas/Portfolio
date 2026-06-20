-- Run this after supabase/schema.sql if your database was created before certificate multi-categories.
-- It adds multi-category support to certificates and moves certificate-like rows out of achievements.

alter table public.certificates
add column if not exists categories text[] not null default '{}';

update public.certificates
set categories = array[category]
where cardinality(categories) = 0
  and category is not null
  and trim(category) <> '';

insert into public.certificates (
  title,
  issuer,
  date_label,
  description,
  image_url,
  credential_url,
  categories,
  sort_order,
  active
)
select
  title,
  case
    when title = 'CCNA: Introduction to Networks' then 'Cisco Networking Academy'
    when title like '%Workshop%' then 'COMSATS University'
    when title = 'Communication Event Certificate' then 'COMSATS University'
    when title = 'Convocation 2023 Appreciation' then 'COMSATS University'
    else 'COMSATS University'
  end as issuer,
  date_label,
  description,
  image_url,
  null as credential_url,
  categories,
  sort_order,
  active
from public.achievements
where title in (
  'Communication Event Certificate',
  'CCNA: Introduction to Networks',
  'Convocation 2023 Appreciation',
  'Deep Learning Workshop',
  'Deep Learning & NLP Workshop'
)
and not exists (
  select 1 from public.certificates c where lower(c.title) = lower(public.achievements.title)
);

delete from public.achievements
where title in (
  'Communication Event Certificate',
  'CCNA: Introduction to Networks',
  'Convocation 2023 Appreciation',
  'Deep Learning Workshop',
  'Deep Learning & NLP Workshop'
);

-- Suggested split after this migration:
-- Achievements: honor roll rows, competition awards, database/computer-network excellence.
-- Certificates: CCNA, workshop certificates, communication/convocation participation certificates.
