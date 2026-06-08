# GDPR / LOPDGDD / LSSI — Guía de cumplimiento para email marketing en España

## Marco legal aplicable

| Norma | Ámbito | Qué regula en email marketing |
|---|---|---|
| **RGPD** (Reglamento 2016/679) | UE | Tratamiento de datos personales (emails son datos personales) |
| **LOPDGDD** (Ley Orgánica 3/2018) | España | Adaptación nacional del RGPD |
| **LSSI-CE** (Ley 34/2002) | España | Comunicaciones comerciales por vía electrónica |

## Roles en este sistema

| Rol | Quién | Qué implica |
|---|---|---|
| **Responsable del tratamiento** | El cliente (la clínica, el despacho...) | Decide para qué se usan los datos. Su nombre va en el pie de todos los emails. |
| **Encargado del tratamiento** | Digital Project | Trata los datos por cuenta del cliente. Requiere DPA firmado (RGPD art. 28). |

**Consecuencia práctica:** el pie de cada email lleva los datos del cliente, no los de Digital Project. Digital Project es invisible para el suscriptor final.

## Doble opt-in — por qué es obligatorio aquí

El RGPD exige que el consentimiento sea **libre, específico, informado e inequívoco**. Para email marketing, el doble opt-in (confirmación por email tras la suscripción) es la forma más robusta de demostrar ese consentimiento.

Sin doble opt-in: si hay una reclamación ante la AEPD, demostrar el consentimiento es mucho más difícil.

Con doble opt-in: hay registro del timestamp, IP y acción de confirmación del suscriptor.

**Este sistema usa doble opt-in siempre, sin excepciones.**

## Requisitos por email LSSI (art. 20-22)

Todo email comercial debe incluir:

- [ ] **Identificación clara del remitente** — nombre de la empresa/persona responsable
- [ ] **Dirección física o de contacto** — del responsable del tratamiento (el cliente)
- [ ] **Enlace de baja funcional** — visible, no oculto, no de pago, no con pasos extras
- [ ] **Asunto no engañoso** — el asunto debe reflejar el contenido real del email
- [ ] **Sin técnicas de ocultación** — el email no puede disimular su naturaleza comercial

## Derechos del suscriptor (RGPD art. 15-22)

El sistema debe facilitar el ejercicio de estos derechos:

| Derecho | Cómo se ejerce | Cómo responde el sistema |
|---|---|---|
| **Acceso** | El suscriptor pide qué datos tiene la empresa | Consulta en Supabase → respuesta en 30 días |
| **Rectificación** | El suscriptor pide corregir sus datos | Update en tabla contacts + Brevo |
| **Supresión** | El suscriptor pide borrar sus datos | Delete en contacts + email_events + Brevo |
| **Baja** | Clic en enlace de baja | Automatizado via n8n (flujo unsubscribe-handler) |
| **Oposición** | No recibir emails comerciales | Misma gestión que la baja |
| **Portabilidad** | El suscriptor pide sus datos en formato exportable | Consulta en Supabase → CSV |

## Retención de datos

| Tipo de dato | Retención máxima recomendada |
|---|---|
| Contacto activo (confirmed) | Mientras sea suscriptor activo |
| Contacto inactivo (>18 meses sin actividad) | Reactivación o eliminación |
| Contacto dado de baja | Conservar SOLO el email + fecha de baja (para no volver a añadirlo). Eliminar el resto. |
| Contacto con queja (complained) | Conservar email + fecha + motivo. No eliminar (defensa ante reclamaciones). |
| Eventos de email | 24 meses máximo |

## Lista de supresión

Brevo mantiene automáticamente una lista de supresión global (bounces duros, quejas, bajas). El sistema también mantiene en Supabase el estado de cada contacto. Nunca importar un email con status `unsubscribed`, `bounced` o `complained` en una nueva lista.

## Qué nunca hacer

- Importar listas compradas o cedidas sin consentimiento verificable
- Enviar emails a contactos con status `unsubscribed` o `complained`
- Reactivar automáticamente a suscriptores dados de baja
- Usar asuntos engañosos o que oculten la naturaleza comercial del email
- Procesar datos del cliente sin DPA firmado
- Guardar credenciales o datos de contacto en el repositorio de código

## Ante una reclamación a la AEPD

Si el cliente recibe una reclamación:

1. No borrar datos (pueden ser necesarios para la defensa)
2. Documentar qué datos se tienen del reclamante y desde cuándo
3. Identificar el consentimiento: timestamp + IP del doble opt-in en Supabase
4. Verificar que en el momento del email, el contacto estaba con status `confirmed`
5. Contactar a Digital Project para coordinar la respuesta

La multa máxima por infracción grave del RGPD es el 4% de la facturación anual global o 20 millones de euros (lo que sea mayor). Para una PYME, el impacto de una sanción puede ser crítico.

## Recursos oficiales

- AEPD (Agencia Española de Protección de Datos): aepd.es
- Guía AEPD sobre email marketing: aepd.es/es/documento/guia-proteccion-datos-correo-electronico
- LSSI-CE texto completo: boe.es/buscar/act.php?id=BOE-A-2002-13758
