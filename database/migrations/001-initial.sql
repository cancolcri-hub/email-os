-- Migration 001 — Initial schema
-- Creación inicial de las tablas contacts y email_events
-- Aplicar a cada proyecto Supabase de cliente nuevo

-- Ver database/contacts-schema.sql para el schema completo con comentarios
-- Este archivo es el equivalente de migration para llevar registro de versiones

-- Ejecutar contacts-schema.sql completo
-- \i ../contacts-schema.sql

-- Registro de la migración aplicada
create table if not exists schema_migrations (
  version     text primary key,
  applied_at  timestamptz not null default now()
);

insert into schema_migrations (version) values ('001-initial')
  on conflict (version) do nothing;
