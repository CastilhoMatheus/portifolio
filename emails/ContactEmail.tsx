import {
  Body,
  Container,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type ContactEmailProps = {
  name: string;
  email: string;
  message: string;
};

/** The email you receive when someone submits the contact form. */
export default function ContactEmail({
  name,
  email,
  message,
}: ContactEmailProps) {
  return (
    <Html lang="en">
      <Preview>{`New message from ${name}`}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>New message from your portfolio</Heading>

          <Section>
            <Text style={label}>From</Text>
            <Text style={value}>
              {name} ({email})
            </Text>
          </Section>

          <Hr style={hr} />

          <Text style={label}>Message</Text>
          <Text style={messageStyle}>{message}</Text>

          <Hr style={hr} />

          <Text style={footer}>Hit reply to answer {name} directly.</Text>
        </Container>
      </Body>
    </Html>
  );
}

// Email clients need inline styles; colors match the site palette
const body = {
  backgroundColor: "#fbf8f1",
  fontFamily: "Helvetica, Arial, sans-serif",
};
const container = {
  backgroundColor: "#ffffff",
  borderTop: "4px solid #006437",
  borderRadius: "8px",
  margin: "40px auto",
  maxWidth: "560px",
  padding: "32px",
};
const heading = { color: "#006437", fontSize: "22px", margin: "0 0 24px" };
const label = {
  color: "#4a5a51",
  fontSize: "12px",
  letterSpacing: "0.05em",
  margin: "0",
  textTransform: "uppercase" as const,
};
const value = { color: "#0e1a14", fontSize: "16px", margin: "4px 0 0" };
const messageStyle = {
  color: "#0e1a14",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "8px 0 0",
  whiteSpace: "pre-wrap" as const,
};
const hr = { borderColor: "#f2ede1", margin: "24px 0" };
const footer = { color: "#4a5a51", fontSize: "13px", margin: "0" };
