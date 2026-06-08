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

interface NurturingEmailProps {
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
  // Contenido (rellenar por email, no hardcodeado)
  subject: string;
  previewText: string;
  bodyHtml: string; // HTML del cuerpo generado por el módulo de copywriting
  showCta?: boolean;
}

export default function NurturingEmail({
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
  previewText,
  bodyHtml,
  showCta = true,
}: NurturingEmailProps) {
  const greeting = contactName ? `Hola, ${contactName}` : "Hola";

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
      <Preview>{previewText}</Preview>
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

            {/* Cuerpo generado por el módulo 02-email-writer.md */}
            <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />

            {showCta && (
              <Section style={{ textAlign: "center", margin: "24px 0" }}>
                <Button
                  href={ctaUrl}
                  label={primaryCtaLabel}
                  primaryColor={primaryColor}
                />
              </Section>
            )}

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
