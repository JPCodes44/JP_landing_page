import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

const NAV_LINKS = [
  { href: "#services", label: "services" },
  { href: "#contact", label: "contact" },
  { href: "#experience", label: "experience" },
  { href: "#about", label: "about" },
];

interface NavMenuItemProps {
  href: string;
  label: string;
  onClose: () => void;
}

const NavMenuItem = ({ href, label, onClose }: NavMenuItemProps) => {
  return (
    <a
      href={href}
      onClick={onClose}
      style={{
        display: "block",
        fontFamily: '"Fanwood Text", serif',
        fontWeight: 400,
        color: "#2d2d2d",
        textDecoration: "none",
        fontSize: "var(--nav-link-size)",
        padding: "var(--hamburger-link-padding)",
        transition: "opacity 0.3s ease",
      }}
    >
      {label}
    </a>
  );
};

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (panelRef.current) {
      gsap.set(panelRef.current, {
        scaleY: 0,
        transformOrigin: "top",
      });
    }
  }, []);

  useEffect(() => {
    if (!panelRef.current) return;

    const tween = isOpen
      ? gsap.to(panelRef.current, {
          scaleY: 1,
          duration: 0.28,
          ease: "power2.out",
        })
      : gsap.to(panelRef.current, {
          scaleY: 0,
          duration: 0.2,
          ease: "power2.in",
        });

    return () => {
      tween.kill();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!line1Ref.current || !line2Ref.current || !line3Ref.current) return;

    const tweens = isOpen
      ? [
          gsap.to(line1Ref.current, {
            rotation: 45,
            y: "0.45rem",
            duration: 0.22,
            ease: "power2.inOut",
          }),
          gsap.to(line2Ref.current, {
            opacity: 0,
            duration: 0.15,
          }),
          gsap.to(line3Ref.current, {
            rotation: -45,
            y: "-0.45rem",
            duration: 0.22,
            ease: "power2.inOut",
          }),
        ]
      : [
          gsap.to(line1Ref.current, {
            rotation: 0,
            y: 0,
            duration: 0.22,
            ease: "power2.inOut",
          }),
          gsap.to(line2Ref.current, {
            opacity: 1,
            duration: 0.15,
          }),
          gsap.to(line3Ref.current, {
            rotation: 0,
            y: 0,
            duration: 0.22,
            ease: "power2.inOut",
          }),
        ];

    return () => {
      for (const tw of tweens) tw.kill();
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
          gap: "var(--hamburger-btn-gap)",
          width: "var(--hamburger-btn-size)",
          height: "var(--hamburger-btn-size)",
          position: "relative",
          zIndex: 51,
        }}
      >
        <span
          ref={line1Ref}
          style={{
            display: "block",
            backgroundColor: "#2d2d2d",
            height: "var(--hamburger-line-height)",
            width: "var(--hamburger-line-width)",
          }}
        />
        <span
          ref={line2Ref}
          style={{
            display: "block",
            backgroundColor: "#2d2d2d",
            height: "var(--hamburger-line-height)",
            width: "var(--hamburger-line-width)",
          }}
        />
        <span
          ref={line3Ref}
          style={{
            display: "block",
            backgroundColor: "#2d2d2d",
            height: "var(--hamburger-line-height)",
            width: "var(--hamburger-line-width)",
          }}
        />
      </button>

      <div
        ref={panelRef}
        style={{
          position: "fixed",
          top: "var(--nav-height)",
          left: 0,
          width: "100%",
          zIndex: 49,
          pointerEvents: isOpen ? "auto" : "none",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          backdropFilter: "var(--nav-backdrop)",
          WebkitBackdropFilter: "var(--nav-backdrop)",
          background: "transparent",
          boxShadow: "var(--nav-box-shadow)",
          borderBottom: "var(--nav-border)",
        }}
      >
        {NAV_LINKS.map((link) => (
          <NavMenuItem
            key={link.href}
            href={link.href}
            label={link.label}
            onClose={() => setIsOpen(false)}
          />
        ))}
      </div>
    </>
  );
};

export default HamburgerMenu;
