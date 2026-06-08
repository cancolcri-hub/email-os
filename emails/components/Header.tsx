import { Img, Section, Text } from "@react-email/components";

interface HeaderProps {
  brandShort: string;
  logoUrl?: string;
  primaryColor?: string;
}

export function Header({
  brandShort,
  logoUrl,
  primaryColor = "#000000",
}: HeaderProps) {
  return (
    <Section
      style={{
        backgroundColor: primaryColor,
        padding: "24px 32px",
        textAlign: "center",
      }}
    >
      {logoUrl ? (
        <Img
          src={logoUrl}
          alt={brandShort}
          height={40}
          style={{ display: "inline-block" }}
        />
      ) : (
        <Text
          style={{
            color: "#ffffff",
            fontSize: "20px",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          {brandShort}
        </Text>
      )}
    </Section>
  );
}
