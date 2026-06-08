# Checklist de despliegue — Cliente nuevo

Pasos para poner en marcha el Email OS para un cliente nuevo. Seguir en orden.

**Tiempo estimado:** 2-4 horas para un cliente con dominio y credenciales disponibles.

---

## Paso 0 — DPA (obligatorio antes de todo)

- [ ] Firmar el contrato de encargado del tratamiento (DPA) entre Digital Project y el cliente
  - Digital Project = encargado del tratamiento (RGPD art. 28)
  - Cliente = responsable del tratamiento
  - Sin DPA firmado: no se procesa ningún dato, no se configura nada, no se envía nada
- [ ] Guardar copia firmada del DPA en el expediente del cliente
- [ ] Actualizar `legal.dpa_signed: true` en el `client-config.yaml` del cliente

## Paso 1 — Configuración del cliente

- [ ] Copiar `client-config/client-config.example.yaml` → `clientes/<nombre-cliente>/client-config.yaml`
- [ ] Rellenar todos los campos del `client-config.yaml`:
  - [ ] `client.id` — snake_case único, sin espacios
  - [ ] `client.name` y `client.brand_short`
  - [ ] `client.sector` y `client.website`
  - [ ] `client.privacy_policy_url` — verificar que la URL existe y es accesible
  - [ ] `legal.*` — datos del responsable del tratamiento (el cliente)
  - [ ] `sending.*` — dominio de envío, from_name, from_email, reply_to
  - [ ] `segments` — los segmentos iniciales del cliente
  - [ ] `voice.tone` — pedir al cliente cómo quiere sonar
  - [ ] `conversion.*` — CTA y canal de conversión
  - [ ] `playbook` — sector para las secuencias pre-hechas

## Paso 2 — Variables de entorno

- [ ] Copiar `.env.example` → `clientes/<nombre-cliente>/.env`
- [ ] Rellenar:
  - [ ] `BREVO_API_KEY` — crear cuenta Brevo del cliente o usar la existente
  - [ ] `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` — del proyecto Supabase nuevo del cliente
  - [ ] `N8N_WEBHOOK_URL` — del flujo n8n del cliente
  - [ ] `CLIENT_ID` — mismo valor que `client.id` en el YAML
- [ ] Verificar que `.env` está en `.gitignore` — nunca debe commitarse

## Paso 3 — Base de datos Supabase

- [ ] Crear un proyecto Supabase nuevo para este cliente (aislamiento total)
- [ ] Ejecutar `database/contacts-schema.sql` en el SQL Editor de Supabase
- [ ] Verificar que se crearon las tablas `contacts`, `email_events` y `schema_migrations`
- [ ] Verificar que los índices se crearon correctamente
- [ ] Guardar las credenciales en el `.env` del cliente

## Paso 4 — Dominio de envío y DNS

- [ ] Crear subdominio dedicado de marketing: `news.<dominio-del-cliente>.es`
  - Nunca usar el dominio principal (afecta a su reputación)
- [ ] Crear cuenta en Brevo con el email del cliente o añadir el dominio a la cuenta existente
- [ ] Verificar el dominio en Brevo:
  - [ ] Añadir registro SPF al DNS del cliente
  - [ ] Añadir registro DKIM al DNS del cliente
  - [ ] Añadir registro DMARC al DNS del cliente
  - [ ] Esperar propagación DNS (hasta 48h)
- [ ] Verificar que Brevo marca el dominio como verificado
- [ ] Ver `docs/resend-setup.md` para guía detallada de DNS

## Paso 5 — Contactos iniciales

- [ ] Si el cliente tiene una lista existente: verificar que todos los contactos tienen consentimiento documentado
  - Si hay dudas sobre el origen de algún contacto: no importar sin aclaración
  - Contactos sin consentimiento verificable: no se importan
- [ ] Si la lista es nueva: arrancar desde cero (solo captación con doble opt-in desde hoy)
- [ ] Crear los segmentos en Brevo (coincidir con los del `client-config.yaml`)

## Paso 6 — Calentamiento del dominio

Si el dominio de envío es nuevo (0 emails enviados previamente):

- [ ] Semana 1: máximo 50 emails/día
- [ ] Semana 2: máximo 200 emails/día
- [ ] Semana 3: máximo 500 emails/día
- [ ] Semana 4+: volumen normal
- [ ] Durante el calentamiento: enviar solo a los contactos más comprometidos (los que abrieron otros canales)
- [ ] Monitorizar bounce rate y tasa de quejas en Brevo — si supera el 2%, parar y revisar

## Paso 7 — Flujos n8n

- [ ] Importar `flows/n8n/lead-capture-to-list.json` en la instancia n8n del cliente
- [ ] Importar `flows/n8n/welcome-sequence.json`
- [ ] Importar `flows/n8n/unsubscribe-handler.json`
- [ ] Configurar las variables de entorno en n8n (las mismas que en `.env`)
- [ ] Conectar el webhook de Brevo con n8n (para eventos de email)
- [ ] Activar los flujos en n8n

## Paso 8 — Templates de email

- [ ] Configurar los templates de email en Brevo (usando los componentes de `emails/templates/`)
  - [ ] WelcomeEmail — adaptar con el lead magnet del cliente
  - [ ] NurturingEmail — adaptar el playbook del sector
- [ ] Verificar que el footer tiene los datos del cliente (no de Digital Project)
- [ ] Verificar que el enlace de baja funciona en Brevo

## Paso 9 — Prueba completa end-to-end

- [ ] Usar un email de prueba para simular el flujo completo:
  - [ ] Rellenar el formulario del cliente
  - [ ] Verificar que llega el email de doble opt-in
  - [ ] Confirmar la suscripción
  - [ ] Verificar que llega el welcome email
  - [ ] Verificar que el contacto aparece en Supabase con `status='confirmed'`
  - [ ] Verificar que los eventos aparecen en `email_events`
  - [ ] Hacer clic en el enlace de baja
  - [ ] Verificar que el contacto se actualiza a `status='unsubscribed'` en Supabase
- [ ] Ejecutar hooks de validación: `bash hooks/pre-send-gdpr.sh` y `bash hooks/pre-send-spam-score.sh`

## Paso 10 — Activar y documentar

- [ ] Activar el formulario de captación en la web del cliente
- [ ] Activar los flujos n8n en modo producción
- [ ] Documentar en el expediente del cliente:
  - Fecha de activación
  - Credenciales (solo referencia, no guardar en texto plano)
  - Contactos importados inicialmente (si los hay) y su origen
  - Versión del playbook activado
- [ ] Programar revisión de métricas a los 30 días

---

**Tiempo total estimado:** 2-4 horas con dominio disponible. 48h adicionales si hay que esperar propagación DNS.
