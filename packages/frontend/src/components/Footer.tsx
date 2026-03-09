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
  return (
    <footer className="relative w-full bg-bg-warm overflow-x-visible overflow-y-hidden">
      {/* Contact info row */}
      <div
        className="flex justify-center"
        style={{
          paddingLeft: FOOTER_CONTACT_PADDING_X,
          paddingRight: FOOTER_CONTACT_PADDING_X,
          paddingTop: FOOTER_CONTACT_PADDING_TOP,
          paddingBottom: FOOTER_CONTACT_PADDING_BOTTOM,
          gap: "12rem",
        }}
      >
        {contacts.map(({ label, value }) => (
          <div key={label} className="flex flex-col" style={{ gap: "0.75rem" }}>
            <span
              className="text-text-primary"
              style={{
                fontSize: FOOTER_CONTACT_LABEL_SIZE,
                fontFamily: "fanwood",
                fontWeight: 400,
              }}
            >
              {label}
            </span>
            <span
              className="text-text-primary"
              style={{
                fontSize: FOOTER_CONTACT_VALUE_SIZE,
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
          fontSize: FOOTER_NAME_SIZE,
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
