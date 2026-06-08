import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Button } from "../components/Button";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

interface WelcomeEmailProps {
  // Config del cliente
  brandShort: string;
  logoUrl?: string;
  primaryColor?: string;
  responsibleName: string;
  responsibleAddress: string;
  responsibleEmail: string;
  privacyPolicyUrl: string;
  unsubscribeUrl: string;
  primaryCtaLabel: string;
  ctaUrl: string;
  // Datos del contacto
  contactName?: string;
  // Contenido
  leadMagnetName: string;
  leadMagnetUrl: string;
  previewText?: string;
}

export default function WelcomeEmail({
  brandShort,
  logoUrl,
  primaryColor = "#000000",
  responsibleName,
  responsibleAddress,
  responsibleEmail,
  privacyPolicyUrl,
  unsubscribeUrl,
  primaryCtaLabel,
  ctaUrl,
  contactName,
  leadMagnetName,
  leadMagnetUrl,
  previewText,
}: WelcomeEmailProps) {
  const greeting = contactName ? `Hola, ${contactName}` : "Hola";
  const preview = previewText ?? `Tu ${leadMagnetName} está listo`;

  return (
    <Html lang="es" dir="ltr">
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: "#f9fafb", margin: 0, padding: "32px 0" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            maxWidth: "600px",
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          <Header
            brandShort={brandShort}
            logoUrl={logoUrl}
            primaryColor={primaryColor}
          />

          <Section style={{ padding: "32px 32px 24px" }}>
            <Text style={textStyle}>{greeting},</Text>

            <Text style={textStyle}>
              Aquí tienes tu <strong>{leadMagnetName}</strong>:
            </Text>

            <Section style={{ textAlign: "center", margin: "24px 0" }}>
              <Button
                href={leadMagnetUrl}
                label={`Descargar ${leadMagnetName}`}
                primaryColor={primaryColor}
              />
            </Section>

            <Text style={textStyle}>
              En los próximos días te enviaré algunos recursos más sobre este
              tema. Sin spam, sin ventas forzadas.
            </Text>

            <Text style={textStyle}>
              Una pregunta antes de seguir: ¿cuál es el mayor reto que tienes
              ahora mismo en tu negocio? Responde directamente a este email — leo
              todos.
            </Text>

            <Text style={{ ...textStyle, marginBottom: 0 }}>
              Un saludo,
              <br />
              <strong>El equipo de {brandShort}</strong>
            </Text>
          </Section>

          <Footer
            responsibleName={responsibleName}
            responsibleAddress={responsibleAddress}
            responsibleEmail={responsibleEmail}
            privacyPolicyUrl={privacyPolicyUrl}
            unsubscribeUrl={unsubscribeUrl}
          />
        </Container>
      </Body>
    </Html>
  );
}

const textStyle = {
  color: "#111827",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 16px",
};
