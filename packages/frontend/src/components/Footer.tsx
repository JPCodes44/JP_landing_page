import { useBreakpoint } from "../hooks/useBreakpoint";
import {
  FOOTER_CONTACT_LABEL_SIZE,
  FOOTER_CONTACT_PADDING_BOTTOM,
  FOOTER_CONTACT_PADDING_TOP,
  FOOTER_CONTACT_PADDING_X,
  FOOTER_CONTACT_VALUE_SIZE,
  FOOTER_NAME_SIZE,
} from "../theme";

const contacts = [
  { label: "Location:", value: "Burlington ON, Canada" },
  { label: "Email:", value: "@jp.mak44@gmail.com" },
  { label: "Phone Number:", value: "+1 (905) - 865 - 1230" },
];

const Footer = () => {
  const bp = useBreakpoint();
  const isMobile = bp === "mobile";

  const paddingX = isMobile ? "1.5rem" : FOOTER_CONTACT_PADDING_X;
  const paddingTop = isMobile ? "5rem" : FOOTER_CONTACT_PADDING_TOP;
  const paddingBottom = isMobile ? "4rem" : FOOTER_CONTACT_PADDING_BOTTOM;
  const gap = isMobile ? "3rem" : "12rem";
  const nameSize = isMobile ? "12vw" : FOOTER_NAME_SIZE;
  const flexDirection = isMobile ? ("column" as const) : ("row" as const);
  const labelSize = isMobile ? "1.4rem" : FOOTER_CONTACT_LABEL_SIZE;
  const valueSize = isMobile ? "1.4rem" : FOOTER_CONTACT_VALUE_SIZE;

  return (
    <footer className="relative w-full bg-bg-warm overflow-x-visible overflow-y-hidden">
      {/* Contact info row */}
      <div
        style={{
          display: "flex",
          flexDirection,
          justifyContent: isMobile ? "flex-start" : "center",
          paddingLeft: paddingX,
          paddingRight: paddingX,
          paddingTop,
          paddingBottom,
          gap,
        }}
      >
        {contacts.map(({ label, value }) => (
          <div key={label} className="flex flex-col" style={{ gap: "0.75rem" }}>
            <span
              className="text-text-primary"
              style={{
                fontSize: labelSize,
                fontFamily: "fanwood",
                fontWeight: 400,
              }}
            >
              {label}
            </span>
            <span
              className="text-text-primary"
              style={{
                fontSize: valueSize,
                fontFamily: "fanwood",
                fontWeight: 400,
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Large name — crops at bottom */}
      <div
        className="w-full leading-none select-none text-center whitespace-nowrap"
        style={{
          fontSize: nameSize,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 500,
          color: "#1a1a1a",
          lineHeight: 0.85,
          marginBottom: "-0.25em",
        }}
      >
        Justin Mak
      </div>
    </footer>
  );
};

export default Footer;
