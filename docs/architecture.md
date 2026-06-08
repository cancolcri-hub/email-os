# Arquitectura del sistema — Email OS Template

## Diagrama general

```
CAPTACIÓN
  LinkedIn / Instagram / Web del cliente
          │
          ▼
  Formulario (Tally / Typeform / Next.js form)
          │
          ▼
  n8n — lead-capture-to-list.json
          │
          ├─── Supabase contacts (status=pending)
          │
          └─── Brevo — email de doble opt-in
                          │
                          ▼ (el lead confirma)
              n8n — welcome-sequence.json
                          │
                          ├─── Supabase contacts (status=confirmed)
                          │
                          └─── Brevo — Welcome automation
                                          │
                                          ▼ (D+0, D+2, D+5, D+10...)
                              Emails de nurturing (NurturingEmail.tsx)
                                          │
                                          ▼ (lead convierte)
                          Supabase contacts (converted_at = ahora)
                          Notificación al cliente / CRM

BAJA
  Lead hace clic en "darme de baja"
          │
          ▼
  Brevo — webhook unsubscribed
          │
          ▼
  n8n — unsubscribe-handler.json
          │
          └─── Supabase contacts (status=unsubscribed)
```

## Componentes y responsabilidades

### Brevo
- Gestión de la lista de contactos
- Envío de emails (transporte)
- Automations (secuencias temporales)
- Webhooks de eventos (abiertos, clics, bajas, quejas, bounces)
- Analytics de campañas

### Supabase (por cliente)
- Source of truth de contactos con estado y consentimiento
- Registro de eventos de email (para auditoría GDPR)
- Sync con Brevo via n8n

### n8n
- Orquestación de flujos (captación → lista → secuencia → conversión → baja)
- Recepción de webhooks de formularios
- Recepción de webhooks de Brevo
- Actualización de Supabase

### React Email
- Componentes tipados para los templates de email
- Parametrizados por `client-config.yaml` (logo, color, datos del responsable)
- Preview local antes de subir a Brevo

### client-config.yaml
- Única fuente de configuración por cliente
- Define identidad, legal, envío, segmentos, tono, conversión y canales
- El código nunca hardcodea datos de cliente

## Flujo de datos por dirección

### Entrada de datos (captación)
```
Formulario → n8n → Supabase → Brevo
```

### Eventos de email (feedback)
```
Brevo → webhook → n8n → Supabase (email_events)
```

### Generación de contenido
```
Claude (skills/email/) → borrador de email → aprobación humana → subir a Brevo manualmente
```

## Separación de canales

| Canal | Sistema | Cómo se integra |
|---|---|---|
| LinkedIn | skills/linkedin/ en clientes/ | Lead magnet CTA → formulario → captación |
| Instagram | skills/instagram/ en clientes/ | Bio link / DM keyword → formulario → captación |
| WhatsApp | Asistente WhatsApp del cliente | Si convierte por WA → pausa secuencia email |
| Web | Next.js + Supabase del cliente | Formulario inline → webhook → n8n |

## Decisiones de diseño

**Una instancia por cliente** — no multi-tenant en esta fase. Cada cliente tiene su propio proyecto Supabase, su propio dominio de envío y sus propias credenciales. Aislamiento total.

**client_id desde el inicio** — aunque ahora sea una instancia por cliente, el `client_id` está en todas las tablas desde el día 1. Migrar a multi-tenant con RLS más adelante no requerirá reescribir la lógica.

**Brevo, no Resend, para marketing** — Resend es transaccional (confirmaciones, facturas). Brevo gestiona listas, segmentos, automations y analytics. No mezclar.

**React Email para templates** — permite tipar los props, previsualizar localmente y generar HTML compatible con los principales clientes de email. Alternativa a arrastrar bloques en Brevo.

**n8n para orquestación** — no lógica de negocio en los webhooks directos de Brevo. Todo pasa por n8n para tener trazabilidad, manejo de errores y posibilidad de retry.
