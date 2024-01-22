import { createBox, createText, createTheme } from "@shopify/restyle";
import Borders from "./border";
import Spacing from "./spacing";
import { FontSize } from "./size";
import { hs } from "@utils/platform";

const theme = createTheme({
  colors: {
    primary: "rgb(120, 90, 0)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(255, 223, 154)",
    onPrimaryContainer: "rgb(37, 26, 0)",
    secondary: "rgb(107, 93, 63)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(244, 224, 187)",
    onSecondaryContainer: "rgb(36, 26, 4)",
    tertiary: "rgb(73, 101, 71)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(203, 235, 197)",
    onTertiaryContainer: "rgb(6, 33, 9)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "#fff9f1",
    onBackground: "rgb(30, 27, 22)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(30, 27, 22)",
    surfaceVariant: "rgb(237, 225, 207)",
    onSurfaceVariant: "rgb(77, 70, 57)",
    outline: "rgb(127, 118, 103)",
    outlineVariant: "rgb(208, 197, 180)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(51, 48, 42)",
    inverseOnSurface: "rgb(247, 240, 231)",
    inversePrimary: "rgb(240, 192, 72)",
    surfaceDisabled: "rgba(30, 27, 22, 0.12)",
    onSurfaceDisabled: "rgba(30, 27, 22, 0.38)",
    backdrop: "rgba(54, 48, 36, 0.4)",
  },
  spacing: {
    none: Spacing.none,
    hxs: Spacing.hxs,
    hs: Spacing.hs,
    hm: Spacing.hm,
    hl: Spacing.hl,
    hxl: Spacing.hxl,
    h2xl: Spacing.h2xl,
    h3xl: Spacing.h3xl,
    h4xl: Spacing.h4xl,
    vxs: Spacing.vxs,
    vs: Spacing.vs,
    vm: Spacing.vm,
    vl: Spacing.vl,
    vxl: Spacing.vxl,
    v2xl: Spacing.v2xl,
    v3xl: Spacing.v3xl,
    v4xl: Spacing.v4xl,
  },
  breakpoints: {},
  textVariants: {
    DisplayLarge: {
      fontFamily: "Cairo-Regular",
      fontSize: FontSize["5xl"],
      color: "onBackground",
      textAlign: "left",
    },
    DisplayMedium: {
      fontSize: FontSize["4xl"],
      fontFamily: "Cairo-Bold",
      color: "onBackground",
      textAlign: "left",
    },
    DisplaySmall: {
      fontSize: FontSize["3xl"],
      fontFamily: "Cairo-Regular",
      color: "onBackground",
      textAlign: "left",
    },
    HeadlineLarge: {
      fontSize: FontSize["2xl"],
      fontFamily: "Cairo-Bold",
      color: "onBackground",
      textAlign: "left",
    },
    HeadlineMedium: {
      fontSize: FontSize.xl,
      fontFamily: "Cairo-Regular",
      color: "onBackground",
      textAlign: "left",
    },
    HeadlineSmall: {
      fontSize: FontSize.l,
      fontFamily: "Cairo-Regular",
      color: "onBackground",
      textAlign: "left",
    },
    TitleLarge: {
      fontSize: FontSize.m,
      fontFamily: "Cairo-Bold",
      color: "onBackground",
      textAlign: "left",
    },
    TitleMedium: {
      fontSize: FontSize.s,
      fontFamily: "Cairo-Regular",
      letterSpacing: hs(0.15),
      color: "onBackground",
      textAlign: "left",
    },
    TitleSmall: {
      fontSize: FontSize["2xs"],
      fontFamily: "Cairo-Regular",
      letterSpacing: hs(0.1),
      color: "onBackground",
      textAlign: "left",
    },
    BodyLarge: {
      fontSize: FontSize.xs,
      fontFamily: "Cairo-Regular",
      letterSpacing: hs(0.5),
      color: "onBackground",
      textAlign: "left",
    },
    BodyMedium: {
      fontSize: FontSize["2xs"],
      fontFamily: "Cairo-Regular",
      letterSpacing: hs(0.25),
      color: "onBackground",
      textAlign: "left",
    },
    BodySmall: {
      fontSize: FontSize["3xs"],
      fontFamily: "Cairo-Regular",
      letterSpacing: hs(0.4),
      color: "onBackground",
      textAlign: "left",
    },
    LabelLarge: {
      fontSize: FontSize["2xs"],
      fontFamily: "Cairo-Regular",
      letterSpacing: hs(0.1),
      color: "onBackground",
      textAlign: "left",
    },
    LabelMedium: {
      fontSize: FontSize["3xs"],
      fontFamily: "Cairo-Regular",
      letterSpacing: hs(0.5),
      color: "onBackground",
      textAlign: "left",
    },
    LabelSmall: {
      fontSize: FontSize["4xs"],
      fontFamily: "Cairo-Regular",
      letterSpacing: hs(0.5),
      color: "onBackground",
      textAlign: "left",
    },
  },
  borderRadii: {
    none: Borders.none,
    s: Borders.s,
    m: Borders.m,
    l: Borders.l,
    xl: Borders.xl,
  },
  zIndices: {
    overlay: 1,
    modal: 2,
    aboveAll: 100,
  },
});

export type Theme = typeof theme;
export const Box = createBox<Theme>();
export const ReText = createText<Theme>();
export default theme;
