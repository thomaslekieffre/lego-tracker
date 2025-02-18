-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type subscription_tier as enum ('free', 'premium');
create type lego_set_status as enum ('mounted', 'dismounted', 'incomplete');
create type piece_status as enum ('searching', 'found', 'ordered');

-- Create users table
create table users (
  id uuid primary key default uuid_generate_v4(),
  clerk_id text not null unique,
  email text not null unique,
  subscription_tier subscription_tier not null default 'free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  display_name text,
  avatar_url text,
  preferences jsonb not null default '{}'::jsonb,
  
  constraint email_length check (char_length(email) >= 3)
);

-- Create lego_sets table
create table lego_sets (
  id uuid primary key default uuid_generate_v4(),
  user_id text not null references users(clerk_id) on delete cascade,
  rebrickable_id text not null,
  name text not null,
  set_number text not null,
  pieces_count integer not null,
  year integer not null,
  status lego_set_status not null default 'dismounted',
  notes text,
  last_modified timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  image_url text,
  missing_pieces_count integer not null default 0,
  
  constraint pieces_count_positive check (pieces_count >= 0),
  constraint year_valid check (year >= 1930 and year <= extract(year from current_date) + 1),
  constraint missing_pieces_count_valid check (missing_pieces_count >= 0)
);

-- Create missing_pieces table
create table missing_pieces (
  id uuid primary key default uuid_generate_v4(),
  set_id uuid not null references lego_sets(id) on delete cascade,
  part_number text not null,
  color text not null,
  quantity integer not null,
  status piece_status not null default 'searching',
  purchase_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text,
  price numeric(10,2),
  
  constraint quantity_positive check (quantity > 0),
  constraint price_positive check (price is null or price >= 0)
);

-- Create user_statistics view
create view user_statistics as
select
  u.clerk_id as user_id,
  count(ls.id) as total_sets,
  count(case when ls.status = 'mounted' then 1 end) as mounted_sets,
  count(case when ls.status = 'dismounted' then 1 end) as dismounted_sets,
  count(case when ls.status = 'incomplete' then 1 end) as incomplete_sets,
  coalesce(sum(ls.missing_pieces_count), 0) as total_missing_pieces
from users u
left join lego_sets ls on ls.user_id = u.clerk_id
group by u.clerk_id;

-- Create function to update missing pieces count
create or replace function update_missing_pieces_count()
returns trigger
language plpgsql
security definer
as $$
declare
  set_id uuid;
  new_count integer;
begin
  if (TG_OP = 'DELETE') then
    set_id := OLD.set_id;
  else
    set_id := NEW.set_id;
  end if;

  select coalesce(sum(quantity), 0)
  into new_count
  from missing_pieces
  where missing_pieces.set_id = set_id;
  
  update lego_sets
  set missing_pieces_count = new_count
  where id = set_id;
  
  if (TG_OP = 'DELETE') then
    return OLD;
  end if;
  return NEW;
end;
$$;

-- Create trigger to update missing pieces count
create trigger update_missing_pieces_count_trigger
after insert or update or delete on missing_pieces
for each row
execute function update_missing_pieces_count();

-- Create RLS policies
alter table users enable row level security;
alter table lego_sets enable row level security;
alter table missing_pieces enable row level security;

-- Users can only see and modify their own data
create policy "Users can view own profile"
  on users for select
  using (auth.uid()::text = clerk_id);

create policy "Users can update own profile"
  on users for update
  using (auth.uid()::text = clerk_id);

-- Lego sets policies
create policy "Users can view own sets"
  on lego_sets for select
  using (auth.uid()::text = user_id);

create policy "Users can insert own sets"
  on lego_sets for insert
  with check (auth.uid()::text = user_id);

create policy "Users can update own sets"
  on lego_sets for update
  using (auth.uid()::text = user_id);

create policy "Users can delete own sets"
  on lego_sets for delete
  using (auth.uid()::text = user_id);

-- Missing pieces policies
create policy "Users can view pieces from own sets"
  on missing_pieces for select
  using (
    exists (
      select 1
      from lego_sets
      where lego_sets.id = missing_pieces.set_id
      and lego_sets.user_id = auth.uid()::text
    )
  );

create policy "Users can insert pieces to own sets"
  on missing_pieces for insert
  with check (
    exists (
      select 1
      from lego_sets
      where lego_sets.id = missing_pieces.set_id
      and lego_sets.user_id = auth.uid()::text
    )
  );

create policy "Users can update pieces from own sets"
  on missing_pieces for update
  using (
    exists (
      select 1
      from lego_sets
      where lego_sets.id = missing_pieces.set_id
      and lego_sets.user_id = auth.uid()::text
    )
  );

create policy "Users can delete pieces from own sets"
  on missing_pieces for delete
  using (
    exists (
      select 1
      from lego_sets
      where lego_sets.id = missing_pieces.set_id
      and lego_sets.user_id = auth.uid()::text
    )
  ); 