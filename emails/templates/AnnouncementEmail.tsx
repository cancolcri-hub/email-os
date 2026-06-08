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

interface AnnouncementEmailProps {
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
  contactName?: string;
  previewText: string;
  announcementTitle: string;
  announcementBody: string;
  ctaVisible?: boolean;
}

export default function AnnouncementEmail({
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
  announcementTitle,
  announcementBody,
  ctaVisible = true,
}: AnnouncementEmailProps) {
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

            <Text style={{ ...textStyle, fontWeight: "bold", fontSize: "18px" }}>
              {announcementTitle}
            </Text>

            <Text style={textStyle}>{announcementBody}</Text>

            {ctaVisible && (
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
