import Footer from "./components/Footer";
import Frame1 from "./components/Frame1";
import Frame2 from "./components/Frame2";
import Frame3 from "./components/Frame3";
import Frame4 from "./components/Frame4";
import Frame5 from "./components/Frame5";
import Frame6 from "./components/Frame6";
import {
  FONT_SIZE_LOGO,
  FONT_SIZE_NAV_LINK,
  NAVBAR_BACKDROP_BLUR,
  NAVBAR_BACKDROP_SATURATE,
  NAVBAR_BORDER,
  NAVBAR_BOX_SHADOW,
  NAVBAR_HEIGHT,
  NAVBAR_PADDING_X,
} from "./theme";

const App = () => {
  return (
    <div className="bg-bg-warm">
      <main>
        <nav
          id="main-nav"
          className="sticky top-0 z-50 flex items-center justify-between"
          style={{
            height: NAVBAR_HEIGHT,
            paddingLeft: NAVBAR_PADDING_X,
            paddingRight: NAVBAR_PADDING_X,
            backdropFilter: `${NAVBAR_BACKDROP_BLUR} ${NAVBAR_BACKDROP_SATURATE}`,
            WebkitBackdropFilter: `${NAVBAR_BACKDROP_BLUR} ${NAVBAR_BACKDROP_SATURATE}`,
            background: "transparent",
            boxShadow: NAVBAR_BOX_SHADOW,
            borderBottom: NAVBAR_BORDER,
          }}
        >
          <span className="font-fanwood text-text-primary" style={{ fontSize: FONT_SIZE_LOGO }}>
            Justin Mak.
          </span>
          <ul className="flex gap-10 list-none m-0 p-0">
            <li>
              <a
                href="#services"
                className="font-fanwood font-normal text-text-primary no-underline hover:opacity-70"
                style={{ fontSize: FONT_SIZE_NAV_LINK }}
              >
                services
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="font-fanwood font-normal text-text-primary no-underline hover:opacity-70"
                style={{ fontSize: FONT_SIZE_NAV_LINK }}
              >
                contact
              </a>
            </li>
            <li>
              <a
                href="#experience"
                className="font-fanwood font-normal text-text-primary no-underline hover:opacity-70"
                style={{ fontSize: FONT_SIZE_NAV_LINK }}
              >
                experience
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="font-fanwood font-normal text-text-primary no-underline hover:opacity-70"
                style={{ fontSize: FONT_SIZE_NAV_LINK }}
              >
                about
              </a>
            </li>
          </ul>
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
