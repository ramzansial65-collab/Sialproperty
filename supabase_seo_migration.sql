-- Run this once in Supabase SQL Editor before deploying the updated website.
alter table public.listings add column if not exists slug text;
alter table public.listings add column if not exists seo_title text;
alter table public.listings add column if not exists seo_description text;

-- Backfill existing rows first. Appending part of the row ID prevents
-- duplicate titles/locations from producing the same legacy slug.
update public.listings
set slug = trim(both '-' from regexp_replace(
  lower(coalesce(title,'property') || '-' || coalesce(area,'') || '-' || coalesce(city,'')),
  '[^a-z0-9]+', '-', 'g'
)) || '-' || left(id::text, 8)
where slug is null or slug = '';

update public.listings
set seo_title = coalesce(nullif(seo_title,''), title || ' | Sial Property Adviser'),
    seo_description = coalesce(nullif(seo_description,''), left(coalesce(description,title),155))
where seo_title is null or seo_title = '' or seo_description is null or seo_description = '';

-- Enforce uniqueness after the legacy slugs have been backfilled.
create unique index if not exists listings_slug_unique
on public.listings (slug)
where slug is not null and slug <> '';
