# Schema — client-config.yaml

Documentación de cada campo del archivo de configuración por cliente.

## `client`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `id` | string | Sí | Identificador único del cliente. Snake_case, sin espacios. Debe coincidir con `client_id` en Supabase. |
| `name` | string | Sí | Razón social o nombre completo del cliente. |
| `brand_short` | string | Sí | Nombre de marca corto para usar en emails y cabeceras. |
| `sector` | enum | Sí | Sector del cliente. Ver valores válidos en el ejemplo. |
| `website` | string | Sí | URL de la web del cliente (con https). |
| `privacy_policy_url` | string | Sí | URL de la política de privacidad del cliente. Se enlaza en el pie de todos los emails. |
| `logo_url` | string | No | URL pública del logo. Si está vacío, `Header.tsx` muestra solo el `brand_short`. |
| `primary_color` | string | No | Color principal de la marca en hex. Valor por defecto: `#000000`. |

## `legal`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `responsible_name` | string | Sí | Nombre del responsable del tratamiento (el cliente, no Digital Project). Va en el pie de todos los emails. |
| `responsible_address` | string | Sí | Dirección física del responsable. Requerido por LSSI para email comercial. |
| `responsible_email` | string | Sí | Email de contacto del responsable. |
| `dpa_signed` | boolean | Sí | **Crítico.** Indica si se ha firmado el contrato de encargado del tratamiento (RGPD art. 28) entre Digital Project y el cliente. Si es `false`, el hook `pre-send-gdpr.sh` bloquea cualquier envío. |

## `sending`

| Campo | Tipo | Requerido | Descripción |
|---|---|---|---|
| `domain` | string | Sí | Subdominio dedicado de marketing (ej: `news.cliente.es`). Nunca el dominio principal — afectaría a la reputación del dominio raíz si hay bounces o quejas. |
| `from_name` | string | Sí | Nombre del remitente que ve el destinatario. |
| `from_email` | string | Sí | Email de envío. Debe estar verificado en Brevo con SPF/DKIM en el DNS del `domain`. |
| `reply_to` | string | Sí | A dónde van las respuestas. Normalmente el email principal del cliente, no el de envío. |

## `segments`

Array de segmentos activos. Cada elemento tiene:

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | string | Identificador del segmento. Coincide con el valor del campo `segment` en la tabla `contacts` de Supabase y con la etiqueta en Brevo. |
| `label` | string | Nombre legible del segmento. |
| `description` | string | Para qué sirve este segmento. Solo documentación interna. |

## `voice`

| Campo | Tipo | Descripción |
|---|---|---|
| `tone` | string | Descripción del tono de voz para los emails de este cliente. Se pasa al módulo de copywriting cuando se genera contenido. |
| `language` | string | Código de idioma (BCP 47). Default: `es-ES`. |
| `emoji_policy` | enum | `ninguno` \| `minimo` \| `moderado`. Controla el uso de emojis en asuntos y cuerpos. |

## `conversion`

| Campo | Tipo | Descripción |
|---|---|---|
| `primary_cta` | string | Texto del botón CTA principal en todos los emails. |
| `conversion_channel` | enum | Canal al que se dirige el CTA: `whatsapp` \| `calendario` \| `formulario` \| `telefono`. |
| `whatsapp_number` | string | Número de WhatsApp con prefijo internacional (ej: `+34600000000`). Solo si `conversion_channel` es `whatsapp`. |
| `booking_url` | string | URL de reserva (Calendly, Cal.com). Solo si `conversion_channel` es `calendario`. |
| `form_url` | string | URL del formulario. Solo si `conversion_channel` es `formulario`. |

## `channels`

| Campo | Tipo | Descripción |
|---|---|---|
| `whatsapp_os` | boolean | Si el cliente tiene activo el asistente WhatsApp de Digital Project. Permite pausar emails cuando el lead convierte por WhatsApp. |
| `linkedin_os` | boolean | Si el cliente tiene el OS de LinkedIn activo. |

## `playbook`

| Valor | Sector |
|---|---|
| `clinica-dental` | Odontología |
| `fisio` | Fisioterapia y rehabilitación |
| `estetica` | Estética, cosmética, belleza |
| `abogado` | Despachos y asesorías legales |
| `inmobiliaria` | Agencias inmobiliarias |
| `generico` | Cualquier otro sector. Usa secuencias sin especificidad de sector. |
