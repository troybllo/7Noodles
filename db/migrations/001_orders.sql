-- Online orders, from checkout to pickup.
create table orders (
  id text primary key,                         -- random, unguessable: the customer's status-page URL
  code text not null unique,                   -- short, for the kitchen and the customer: 7N-0423
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'new', 'preparing', 'ready', 'picked_up', 'cancelled')),
  lines jsonb not null,                        -- priced snapshot: names, choices, quantities, amounts
  subtotal_cents integer not null check (subtotal_cents >= 0),
  tax_cents integer not null check (tax_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  note text,
  pickup_at timestamptz not null,
  stripe_session_id text unique,
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  updated_at timestamptz not null default now()
);

-- The kitchen board reads paid orders that are still in play, by pickup time.
create index orders_active on orders (pickup_at) where status in ('new', 'preparing', 'ready');

-- Phones that asked for a push notification on each new order.
create table push_subscriptions (
  endpoint text primary key,
  p256dh text not null,
  auth text not null,
  label text,
  created_at timestamptz not null default now()
);

-- Switches the kitchen can flip, such as pausing online orders when busy.
create table settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);
insert into settings (key, value) values ('ordering_paused', 'false');
