# Playbook — Clínica Dental

Secuencia de nurturing pre-construida para clínicas dentales. Adaptar el copy con los datos específicos del cliente en `client-config.yaml`.

**Segmento objetivo:** `leads-nuevos` — personas que han descargado un lead magnet o solicitado información sobre tratamientos.

**Tono:** cercano, tranquilizador, profesional. Sin tecnicismos innecesarios.

**CTA objetivo:** reservar primera consulta gratuita / diagnóstico sin compromiso.

---

## Email 1 — D+2: El miedo más común

**Asunto:** Lo que más frena a la gente antes de ir al dentista

**Preheader:** Y cómo lo abordamos en [NOMBRE CLÍNICA]

---

El miedo al dentista es más frecuente de lo que parece.

En [NOMBRE CLÍNICA] lo vemos cada semana: personas que llevan meses (o años) postergando una revisión porque no saben qué van a encontrar, o simplemente porque la visita les genera ansiedad.

Lo que nadie te cuenta: la mayoría de los problemas dentales son mucho más sencillos de tratar cuando se detectan a tiempo. Lo que se convierte en un problema grande en 6 meses, hoy puede resolverse en una visita.

Por eso ofrecemos una primera consulta gratuita: sin presión, sin compromisos, solo para que puedas ver el estado de tu boca con calma y saber qué pasos, si los hay, tiene sentido dar.

¿Te animas a reservarla?

[BOTÓN: Reservar mi consulta gratuita]

---

## Email 2 — D+5: Un dato que cambia la perspectiva

**Asunto:** El tratamiento que más pacientes retrasan (y no debería)

**Preheader:** Una revisión a tiempo evita el 80% de los tratamientos más caros

---

Hay una estadística que repetimos mucho en la clínica porque cambia cómo la gente piensa en su salud dental:

El 80% de los tratamientos complejos y costosos (endodoncias, implantes, ortodoncia urgente) podrían haberse evitado con una revisión anual y una limpieza semestral.

No es marketing. Es lo que ven nuestros dentistas cada día.

Una revisión anual en [NOMBRE CLÍNICA] cuesta [PRECIO]. Un tratamiento de conducto puede multiplicar ese precio por diez.

Si llevas más de un año sin ir al dentista, esta semana es un buen momento para cambiar eso.

[BOTÓN: Pedir cita de revisión]

---

## Email 3 — D+10: Caso real (anonimizado)

**Asunto:** "Llevaba 3 años sin ir al dentista. Me alegro de haber vuelto."

**Preheader:** Lo que encontramos y cómo lo resolvimos en dos visitas

---

Hace unos meses vino a vernos una paciente que llevaba tres años sin revisión.

Llegó con algo de ansiedad, esperando lo peor. Lo que encontramos: una caries incipiente en un molar y una limpieza pendiente. Nada más.

Dos visitas después, problema resuelto. Sin grandes tratamientos, sin sorpresas desagradables.

Lo que más nos dijo que le sorprendió: que no dolió nada y que salió con una sensación de alivio enorme por haber ido por fin.

Si llevas tiempo postergando tu visita, probablemente la situación sea mejor de lo que imaginas. Y si no lo es, mejor saberlo ahora.

[BOTÓN: Reservar mi primera consulta]

---

## Email 4 — D+15: Oferta o disponibilidad (si procede)

**Asunto:** Esta semana tenemos hueco para nuevos pacientes

**Preheader:** Primera consulta gratuita — sin compromiso

---

Esta semana tenemos disponibilidad para primeras consultas.

Es la oportunidad perfecta si llevas tiempo pensando en venir y no has dado el paso.

La primera consulta es gratuita, dura unos 30 minutos y te irás sabiendo exactamente cómo está tu boca y qué, si algo, necesita atención.

Sin listas de espera, sin presiones.

[BOTÓN: Reservar ahora]

Solo mencionarlo si hay disponibilidad real. Si la agenda está llena, enviar el email 5 directamente.

---

## Notas de personalización

- Sustituir `[NOMBRE CLÍNICA]` con el `brand_short` del `client-config.yaml`
- Sustituir `[PRECIO]` con el precio real de revisión del cliente
- Verificar que el enlace del CTA apunta al canal correcto (`conversion_channel` del config)
- Si el cliente tiene WhatsApp OS activo, el botón puede abrir un chat de WhatsApp en vez de un formulario
- Ajustar el tono si la clínica es más formal o más cercana según `voice.tone` del config
