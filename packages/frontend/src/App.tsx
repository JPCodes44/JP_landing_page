import Footer from "./components/Footer";
import Frame1 from "./components/Frame1";
import Frame2 from "./components/Frame2";
import Frame3 from "./components/Frame3";
import Frame4 from "./components/Frame4";
import Frame5 from "./components/Frame5";
import Frame6 from "./components/Frame6";
import HamburgerMenu from "./components/HamburgerMenu";
import { useBreakpoint } from "./hooks/useBreakpoint";

const App = () => {
  const bp = useBreakpoint();

  return (
    <div style={{ backgroundColor: "#f5f3ef" }}>
      <main>
        <nav
          id="main-nav"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "var(--nav-height)",
            paddingLeft: "var(--nav-px)",
            paddingRight: "var(--nav-px)",
            backdropFilter: "var(--nav-backdrop)",
            WebkitBackdropFilter: "var(--nav-backdrop)",
            background: "transparent",
            boxShadow: "var(--nav-box-shadow)",
            borderBottom: "var(--nav-border)",
          }}
        >
          <span
            style={{
              fontFamily: '"Fanwood Text", serif',
              color: "#2d2d2d",
              fontSize: "var(--nav-logo-size)",
            }}
          >
            Justin Mak.
          </span>
          {bp === "mobile" ? (
            <HamburgerMenu />
          ) : (
            <ul
              style={{
                display: "flex",
                gap: "2.5rem",
                listStyle: "none",
                margin: 0,
                padding: 0,
              }}
            >
              <li>
                <a
                  href="#services"
                  style={{
                    fontFamily: '"Fanwood Text", serif',
                    fontWeight: 400,
                    color: "#2d2d2d",
                    textDecoration: "none",
                    fontSize: "var(--nav-link-size)",
                  }}
                >
                  services
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  style={{
                    fontFamily: '"Fanwood Text", serif',
                    fontWeight: 400,
                    color: "#2d2d2d",
                    textDecoration: "none",
                    fontSize: "var(--nav-link-size)",
                  }}
                >
                  contact
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  style={{
                    fontFamily: '"Fanwood Text", serif',
                    fontWeight: 400,
                    color: "#2d2d2d",
                    textDecoration: "none",
                    fontSize: "var(--nav-link-size)",
                  }}
                >
                  experience
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  style={{
                    fontFamily: '"Fanwood Text", serif',
                    fontWeight: 400,
                    color: "#2d2d2d",
                    textDecoration: "none",
                    fontSize: "var(--nav-link-size)",
                  }}
                >
                  about
                </a>
              </li>
            </ul>
          )}
        </nav>
        <Frame1 />
        <Frame2 />
        <Frame3 />
        <Frame4 />
        <Frame5 />
        <Frame6 />
        <Footer />
      </main>
    </div>
  );
};

export default App;
