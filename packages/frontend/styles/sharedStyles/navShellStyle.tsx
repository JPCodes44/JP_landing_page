import {
  NAVBAR_BACKDROP_BLUR,
  NAVBAR_BACKDROP_SATURATE,
  NAVBAR_BORDER,
  NAVBAR_BOX_SHADOW,
} from "../../src/theme/index";

export const navShellStyle = {
  backdropFilter: `${NAVBAR_BACKDROP_BLUR} ${NAVBAR_BACKDROP_SATURATE}`,
  WebkitBackdropFilter: `${NAVBAR_BACKDROP_BLUR} ${NAVBAR_BACKDROP_SATURATE}`,
  background: "rgba(245, 243, 239, 0.32)",
  boxShadow: NAVBAR_BOX_SHADOW,
  borderBottom: NAVBAR_BORDER,
};
