# Configuración de dominio de envío — Brevo + DNS

Guía para configurar el subdominio dedicado de marketing y verificarlo en Brevo.

Este proceso aplica al dominio del cliente (`sending.domain` en el `client-config.yaml`), no al dominio de Digital Project.

---

## Por qué un subdominio dedicado

Nunca enviar emails de marketing desde el dominio principal del cliente (ej: `cliente.es`).

Razón: si hay bounces duros o quejas (normal al empezar), la reputación del dominio principal se ve afectada. Eso impacta en la entregabilidad del email corporativo del cliente.

Usar siempre un subdominio: `news.cliente.es`, `mail.cliente.es`, `marketing.cliente.es`.

---

## Paso 1 — Crear el subdominio

En el panel de DNS del cliente (normalmente en su registrador de dominios: GoDaddy, Namecheap, OVH, Hostinger, etc.):

Añadir un registro de tipo `A` o `CNAME` que apunte al subdominio:

```
Tipo:   CNAME
Nombre: news
Valor:  (el que indique Brevo — normalmente algo como link.brevo.com)
TTL:    3600
```

---

## Paso 2 — Verificar el dominio en Brevo

1. Entrar en Brevo → Configuración → Remitentes y dominios → Dominios
2. Añadir el dominio: `news.cliente.es`
3. Brevo mostrará los registros DNS que hay que añadir

---

## Paso 3 — Añadir registros SPF

SPF (Sender Policy Framework) indica qué servidores están autorizados a enviar emails del dominio.

```dns
Tipo:   TXT
Nombre: news.cliente.es
Valor:  v=spf1 include:spf.brevo.com ~all
TTL:    3600
```

Si el subdominio ya tiene un registro SPF, añadir `include:spf.brevo.com` al existente (no crear dos registros SPF — solo puede haber uno).

---

## Paso 4 — Añadir registro DKIM

DKIM (DomainKeys Identified Mail) firma criptográficamente los emails para verificar que no han sido modificados en tránsito.

Brevo genera el par de claves. Copiar el registro que te indique:

```dns
Tipo:   TXT
Nombre: mail._domainkey.news.cliente.es   (o el que indique Brevo)
Valor:  v=DKIM1; k=rsa; p=MIIBIjAN...   (clave pública generada por Brevo)
TTL:    3600
```

---

## Paso 5 — Añadir registro DMARC

DMARC define qué hacer con emails que no pasan SPF o DKIM, y permite recibir informes de entregabilidad.

Empezar con política permisiva (`p=none`) y endurecer cuando haya datos:

```dns
Tipo:   TXT
Nombre: _dmarc.news.cliente.es
Valor:  v=DMARC1; p=none; rua=mailto:dmarc@cliente.es
TTL:    3600
```

Cuando el dominio lleve un mes estable, cambiar a `p=quarantine` y eventualmente `p=reject`.

---

## Paso 6 — Verificar propagación

La propagación DNS puede tardar hasta 48 horas.

Para verificar antes de que Brevo lo detecte automáticamente:

```bash
# Verificar SPF
dig TXT news.cliente.es

# Verificar DKIM
dig TXT mail._domainkey.news.cliente.es

# Verificar DMARC
dig TXT _dmarc.news.cliente.es
```

---

## Paso 7 — Confirmación en Brevo

Una vez propagados los registros, Brevo los verifica automáticamente. Cuando los tres (SPF, DKIM, DMARC) estén en verde, el dominio está listo para enviar.

---

## Paso 8 — Calentamiento

Si el dominio es nuevo (nunca ha enviado emails antes):

| Semana | Volumen máximo diario |
|---|---|
| 1 | 50 emails |
| 2 | 200 emails |
| 3 | 500 emails |
| 4 | 1.000 emails |
| 5+ | Volumen normal |

Enviar siempre a los contactos más comprometidos primero (los que más abrieron en otros canales). Un bounce rate alto en la primera semana puede marcar el dominio como spam.

---

## Señales de alerta durante el calentamiento

| Métrica | Umbral de alerta | Acción |
|---|---|---|
| Bounce rate (duro) | >2% | Parar, limpiar lista |
| Tasa de quejas | >0.1% | Parar, revisar contenido y segmento |
| Open rate | <10% | Revisar asuntos y calidad de la lista |
