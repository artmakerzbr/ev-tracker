-- Run this in your Supabase SQL editor (Dashboard > SQL Editor > New Query)

-- Readings table
create table readings (
  id         bigserial primary key,
  value      numeric(10,1) not null,
  date       date not null,
  note       text default '',
  car        text default 'tesla',
  created_at timestamptz default now()
);

-- Invoices table
create table invoices (
  id               bigserial primary key,
  label            text not null,
  periodo_inicio   date not null,
  periodo_fim      date not null,
  consumo_total_kwh numeric(8,1),
  tarifas          jsonb not null default '[]',
  created_at       timestamptz default now()
);

-- Enable Row Level Security (keeps data private)
alter table readings enable row level security;
alter table invoices enable row level security;

-- Allow all operations with the anon key (single-user app, no auth needed)
create policy "Allow all" on readings for all using (true) with check (true);
create policy "Allow all" on invoices for all using (true) with check (true);
