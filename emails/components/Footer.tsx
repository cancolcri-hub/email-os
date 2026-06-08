import { Hr, Link, Section, Text } from "@react-email/components";

interface FooterProps {
  responsibleName: string;
  responsibleAddress: string;
  responsibleEmail: string;
  privacyPolicyUrl: string;
  unsubscribeUrl: string;
}

export function Footer({
  responsibleName,
  responsibleAddress,
  responsibleEmail,
  privacyPolicyUrl,
  unsubscribeUrl,
}: FooterProps) {
  return (
    <Section style={{ padding: "0 32px 32px" }}>
      <Hr style={{ borderColor: "#e5e7eb", margin: "32px 0 24px" }} />
      <Text
        style={{
          color: "#9ca3af",
          fontSize: "12px",
          lineHeight: "18px",
          margin: "0 0 8px",
        }}
      >
        {responsibleName} · {responsibleAddress}
      </Text>
      <Text
        style={{
          color: "#9ca3af",
          fontSize: "12px",
          lineHeight: "18px",
          margin: 0,
        }}
      >
        <Link href={`mailto:${responsibleEmail}`} style={{ color: "#9ca3af" }}>
          {responsibleEmail}
        </Link>
        {" · "}
        <Link href={privacyPolicyUrl} style={{ color: "#9ca3af" }}>
          Política de privacidad
        </Link>
        {" · "}
        <Link href={unsubscribeUrl} style={{ color: "#9ca3af" }}>
          Darme de baja
        </Link>
      </Text>
    </Section>
  );
}
