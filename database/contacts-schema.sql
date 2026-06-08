-- Email OS Template — Schema Supabase
-- Ejecutar en el proyecto Supabase del cliente antes de activar cualquier flujo
-- client_id incluido desde el inicio para facilitar migración futura a multi-tenant con RLS

-- ============================================================
-- TABLA: contacts
-- Registro de suscriptores con consentimiento y estado
-- ============================================================
create table if not exists contacts (
  id               uuid primary key default gen_random_uuid(),
  client_id        text not null,              -- identificador del cliente (de client-config.yaml)
  email            text not null,
  name             text,
  status           text not null default 'pending'
    check (status in ('pending', 'confirmed', 'unsubscribed', 'bounced', 'complained')),
  source           text,                       -- linkedin | instagram | web | whatsapp | import
  segment          text,                       -- debe coincidir con un segment.id del client-config.yaml
  consent_at       timestamptz,               -- timestamp del consentimiento (doble opt-in)
  consent_ip       text,                      -- IP del momento del consentimiento
  consent_version  text,                      -- versión de la política de privacidad aceptada
  preferred_channel text,                     -- email | whatsapp | ambos
  whatsapp_phone   text,                      -- si el contacto también está en el canal WhatsApp
  in_active_sequence text,                    -- ID de la secuencia activa en Brevo (para pausar)
  converted_at     timestamptz,              -- cuando se convirtió en cliente
  last_activity_at timestamptz,              -- última apertura o clic registrado
  brevo_contact_id bigint,                   -- ID del contacto en Brevo (para sync)
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (client_id, email)
);

-- ============================================================
-- TABLA: email_events
-- Registro de eventos de email (enviados, abiertos, clics, bajas)
-- Alimentado por los webhooks de Brevo via n8n
-- ============================================================
create table if not exists email_events (
  id           uuid primary key default gen_random_uuid(),
  client_id    text not null,
  contact_id   uuid references contacts(id) on delete set null,
  email        text,                          -- email del contacto (desnormalizado para consultas sin join)
  event_type   text not null
    check (event_type in (
      'sent', 'delivered', 'opened', 'clicked',
      'unsubscribed', 'bounced', 'complained', 'opt_in_sent', 'opt_in_confirmed'
    )),
  campaign_id  text,                         -- ID de la campaña o secuencia en Brevo
  campaign_name text,
  link_url     text,                         -- URL clicada (solo para event_type = 'clicked')
  occurred_at  timestamptz not null default now()
);

-- ============================================================
-- ÍNDICES
-- ============================================================
create index if not exists idx_contacts_client_status
  on contacts (client_id, status);

create index if not exists idx_contacts_client_segment
  on contacts (client_id, segment);

create index if not exists idx_contacts_email
  on contacts (email);

create index if not exists idx_email_events_client_contact
  on email_events (client_id, contact_id);

create index if not exists idx_email_events_occurred_at
  on email_events (occurred_at desc);

-- ============================================================
-- FUNCIÓN: updated_at automático
-- ============================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger contacts_updated_at
  before update on contacts
  for each row
  execute function update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (preparado para multi-tenant futuro)
-- Por ahora: una instancia = un cliente. RLS desactivado.
-- Para activar multi-tenant: habilitar RLS y añadir política por client_id.
-- ============================================================
-- alter table contacts enable row level security;
-- alter table email_events enable row level security;
--
-- create policy "contacts_client_isolation"
--   on contacts for all
--   using (client_id = current_setting('app.client_id'));
