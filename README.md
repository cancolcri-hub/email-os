# Email OS — Framework de email marketing reutilizable

![n8n](https://img.shields.io/badge/n8n-EA4B71?style=flat&logo=n8n&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Brevo](https://img.shields.io/badge/Brevo-0B996E?style=flat&logoColor=white)
![React Email](https://img.shields.io/badge/React_Email-000000?style=flat&logo=react&logoColor=white)
![GDPR](https://img.shields.io/badge/GDPR-ready-2D9CDB?style=flat)

Diseñé este framework para **desplegar email marketing completo para cualquier cliente clonando un único repo**: un motor fijo (lógica, compliance, componentes React Email y flujos n8n) + una capa de configuración variable por cliente. Lo construí para no reescribir desde cero cada captación de leads, secuencia de bienvenida o gestión de bajas — y para que el **cumplimiento GDPR forme parte de la arquitectura**, no de un parche final.

**Motor fijo** (módulos, lógica, compliance, componentes React Email, flujos n8n) + **config variable por cliente** (`client-config.yaml` + `.env`).

Desplegar un cliente nuevo = clonar este repo + rellenar config + conectar credenciales.

> Pieza de portfolio. Las credenciales y los datos de cliente se mantienen siempre fuera del control de versiones (`.env`, aislamiento por instancia/proyecto Supabase).

## Stack

- **Brevo** — envío de emails de marketing (listas, automaciones, analytics)
- **Resend** — emails transaccionales (confirmaciones, facturas) — separado de este sistema
- **Supabase** — base de datos de contactos, consentimientos y eventos
- **n8n** — orquestación de flujos (captación, secuencias, bajas)
- **React Email** — componentes de email tipados y parametrizados

## Modelo de despliegue

Una instancia por cliente (recomendado para esta fase):

```
email-os-template/          ← esta plantilla (se versiona)
clientes/
  digital-project/          ← cliente #0 (dogfooding — Digital Project usa esto primero)
    client-config.yaml
    .env
  clinica-sonrisa/
    client-config.yaml
    .env
  despacho-flores/
    client-config.yaml
    .env
```

Cada cliente tiene su propio proyecto Supabase, su propio dominio de envío y sus propias credenciales. Aislamiento total de datos.

## Inicio rápido

```bash
# 1. Clonar plantilla para un cliente nuevo
cp -r email-os-template/ clientes/nombre-cliente/

# 2. Copiar y rellenar la config del cliente
cp client-config/client-config.example.yaml clientes/nombre-cliente/client-config.yaml
# Editar client-config.yaml con los datos del cliente

# 3. Crear las variables de entorno
cp .env.example clientes/nombre-cliente/.env
# Añadir las credenciales reales (NUNCA commitear este archivo)

# 4. Crear la base de datos en Supabase del cliente
# Ejecutar database/contacts-schema.sql en el proyecto Supabase del cliente

# 5. Verificar el dominio de envío en Brevo
# Ver docs/sending-domain-setup.md (aplica también a Brevo para DNS)

# 6. Importar los flujos n8n
# Ver flows/n8n/ — importar JSON en la instancia n8n del cliente

# 7. Instalar dependencias (React Email para previews locales)
npm install

# 8. Previsualizar emails localmente
npm run preview
```

## Checklist de despliegue

Ver `docs/onboarding-checklist.md` — incluye el paso obligatorio de firma de DPA antes de tocar ningún dato.

## Estructura del repo

```
email-os-template/
  client-config/          ← config por cliente (YAML + schema)
  database/               ← SQL schema Supabase
  emails/                 ← componentes React Email
  flows/                  ← flujos n8n + playbooks por sector
  hooks/                  ← scripts de validación pre-envío
  docs/                   ← guías de instalación, GDPR, arquitectura
```

## Nota legal

Digital Project actúa como **encargada del tratamiento** (RGPD art. 28). Cada cliente es el **responsable del tratamiento** de sus propios contactos. El DPA (contrato de encargado) debe firmarse antes de procesar ningún dato de contacto del cliente.

Ver `docs/gdpr-email-guide.md`.
