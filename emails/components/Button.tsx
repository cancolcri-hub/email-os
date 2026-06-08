import { Button as EmailButton } from "@react-email/components";

interface ButtonProps {
  href: string;
  label: string;
  primaryColor?: string;
}

export function Button({ href, label, primaryColor = "#000000" }: ButtonProps) {
  return (
    <EmailButton
      href={href}
      style={{
        backgroundColor: primaryColor,
        borderRadius: "6px",
        color: "#ffffff",
        display: "inline-block",
        fontSize: "15px",
        fontWeight: "600",
        padding: "12px 24px",
        textDecoration: "none",
      }}
    >
      {label}
    </EmailButton>
  );
}
