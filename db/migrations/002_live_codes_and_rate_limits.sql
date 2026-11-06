-- Order codes only need to be unique while an order is in play: 7N-0423 is
-- read out at the counter today, not looked up next year. A global unique
-- constraint would run out after 10,000 orders.
alter table orders drop constraint orders_code_key;
create unique index orders_live_code on orders (code)
  where status in ('pending_payment', 'new', 'preparing', 'ready');

-- The board also shows the last two hours of pickups.
create index orders_recent_pickups on orders (updated_at) where status = 'picked_up';

-- Fixed-window counters for rate limits (checkout, kitchen sign-in), keyed by
-- what is being limited and who: 'order:203.0.113.7'.
create table rate_limits (
  key text primary key,
  hits integer not null,
  window_started timestamptz not null
);
