const ContactItem = ({ label, value }: { label: string; value: string }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "var(--footer-contact-gap)",
    }}
  >
    <span
      style={{
        color: "#2d2d2d",
        fontSize: "var(--footer-label-size)",
        fontFamily: "fanwood",
        fontWeight: 400,
      }}
    >
      {label}
    </span>
    <span
      style={{
        color: "#2d2d2d",
        fontSize: "var(--footer-value-size)",
        fontFamily: "fanwood",
        fontWeight: 400,
      }}
    >
      {value}
    </span>
  </div>
);

import { useBreakpoint } from "../hooks/useBreakpoint";

const Footer = () => {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";
  return (
    <footer
      style={{
        position: "relative",
        width: "100%",
        backgroundColor: "#f5f3ef",
        overflowX: "visible",
        overflowY: "hidden",
      }}
    >
      {/* Contact info */}
      {isMobile ? (
        <div
          className="footer-contacts"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: "var(--footer-px)",
            paddingRight: "var(--footer-px)",
            paddingTop: "var(--footer-pt)",
            paddingBottom: "var(--footer-pb)",
            gap: "var(--footer-gap)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--footer-stack-gap)" }}>
            <ContactItem label="Location:" value="Burlington ON, Canada" />
            <ContactItem label="Email:" value="@jp.mak44@gmail.com" />
          </div>
          <ContactItem label="Phone Number:" value="+1 (905) - 865 - 1230" />
        </div>
      ) : (
        <div
          className="footer-contacts"
          style={{
            display: "grid",
            paddingLeft: "var(--footer-px)",
            paddingRight: "var(--footer-px)",
            paddingTop: "var(--footer-pt)",
            paddingBottom: "var(--footer-pb)",
            gap: "var(--footer-gap)",
          }}
        >
          <ContactItem label="Location:" value="Burlington ON, Canada" />
          <ContactItem label="Email:" value="@jp.mak44@gmail.com" />
          <ContactItem label="Phone Number:" value="+1 (905) - 865 - 1230" />
        </div>
      )}

      {/* Large name — crops at bottom */}
      <div
        style={{
          width: "100%",
          lineHeight: 1,
          userSelect: "none",
          textAlign: "center",
          whiteSpace: "nowrap",
          fontSize: "var(--footer-name-size)",
          fontFamily: "var(--footer-name-font)",
          fontWeight: 500,
          color: "var(--footer-name-color)",
          marginBottom: "var(--footer-name-mb)",
        }}
      >
        Justin Mak
      </div>
    </footer>
  );
};

export default Footer;
