// https://callstack.github.io/react-native-paper/docs/guides/theming#creating-dynamic-theme-colors

import { hs, ms, vs } from "@utils/platform";

export const MaterialLight = {
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
  background: "rgb(255, 251, 255)",
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
  elevation: {
    level0: "transparent",
    level1: "rgb(248, 243, 242)",
    level2: "rgb(244, 238, 235)",
    level3: "rgb(240, 233, 227)",
    level4: "rgb(239, 232, 224)",
    level5: "rgb(236, 229, 219)",
  },
  surfaceDisabled: "rgba(30, 27, 22, 0.12)",
  onSurfaceDisabled: "rgba(30, 27, 22, 0.38)",
  backdrop: "rgba(54, 48, 36, 0.4)",
};

export const MaterialDark = {
  primary: "rgb(240, 192, 72)",
  onPrimary: "rgb(63, 46, 0)",
  primaryContainer: "rgb(90, 67, 0)",
  onPrimaryContainer: "rgb(255, 223, 154)",
  secondary: "rgb(215, 196, 160)",
  onSecondary: "rgb(58, 47, 21)",
  secondaryContainer: "rgb(82, 69, 42)",
  onSecondaryContainer: "rgb(244, 224, 187)",
  tertiary: "rgb(175, 207, 170)",
  onTertiary: "rgb(28, 54, 28)",
  tertiaryContainer: "rgb(50, 77, 49)",
  onTertiaryContainer: "rgb(203, 235, 197)",
  error: "rgb(255, 180, 171)",
  onError: "rgb(105, 0, 5)",
  errorContainer: "rgb(147, 0, 10)",
  onErrorContainer: "rgb(255, 180, 171)",
  background: "rgb(30, 27, 22)",
  onBackground: "rgb(233, 225, 217)",
  surface: "rgb(30, 27, 22)",
  onSurface: "rgb(233, 225, 217)",
  surfaceVariant: "rgb(77, 70, 57)",
  onSurfaceVariant: "rgb(208, 197, 180)",
  outline: "rgb(153, 144, 128)",
  outlineVariant: "rgb(77, 70, 57)",
  shadow: "rgb(0, 0, 0)",
  scrim: "rgb(0, 0, 0)",
  inverseSurface: "rgb(233, 225, 217)",
  inverseOnSurface: "rgb(51, 48, 42)",
  inversePrimary: "rgb(120, 90, 0)",
  elevation: {
    level0: "transparent",
    level1: "rgb(41, 35, 25)",
    level2: "rgb(47, 40, 26)",
    level3: "rgb(53, 45, 28)",
    level4: "rgb(55, 47, 28)",
    level5: "rgb(59, 50, 29)",
  },
  surfaceDisabled: "rgba(233, 225, 217, 0.12)",
  onSurfaceDisabled: "rgba(233, 225, 217, 0.38)",
  backdrop: "rgba(54, 48, 36, 0.4)",
};

export const fontConfig = {
  DisplayLarge: {
    fontFamily: "Cairo-Bold",
    lineHeight: vs(70),
    fontSize: ms(57),
  },
  DisplayMedium: {
    fontFamily: "Cairo-Regular",
    lineHeight: vs(58),
    fontSize: ms(45),
  },
  DisplaySmall: {
    fontFamily: "Cairo-Regular",
    lineHeight: vs(50),
    fontSize: ms(36),
  },
  headlineLarge: {
    fontFamily: "Cairo-Regular",
    lineHeight: vs(46),
    fontSize: ms(32),
  },
  headlineMedium: {
    fontFamily: "Cairo-Regular",
    lineHeight: vs(42),
    fontSize: ms(28),
  },
  headlineSmall: {
    fontFamily: "Cairo-Bold",
    lineHeight: vs(38),
    fontSize: ms(24),
  },
  titleLarge: {
    fontFamily: "Cairo-Regular",
    lineHeight: vs(34),
    fontSize: ms(22),
  },
  titleMedium: {
    fontFamily: "Cairo-Regular",
    lineHeight: vs(30),
    fontSize: ms(16),
    letterSpacing: hs(0.15),
  },
  titleSmall: {
    fontFamily: "Cairo-Bold",
    lineHeight: vs(26),
    fontSize: ms(14),
    letterSpacing: hs(0.1),
  },
  labelLarge: {
    fontFamily: "Cairo-Bold",
    lineHeight: vs(26),
    fontSize: ms(14),
    letterSpacing: hs(0.1),
  },
  labelMedium: {
    fontFamily: "Cairo-Regular",
    lineHeight: vs(22),
    fontSize: ms(12),
    letterSpacing: hs(0.5),
  },
  labelSmall: {
    fontFamily: "Cairo-Regular",
    lineHeight: vs(22),
    fontSize: ms(11),
    letterSpacing: hs(0.5),
  },
  bodyLarge: {
    fontFamily: "Cairo-Bold",
    lineHeight: vs(30),
    fontSize: ms(16),
    letterSpacing: hs(0.15),
  },
  bodyMedium: {
    fontFamily: "Cairo-Regular",
    lineHeight: vs(26),
    fontSize: ms(14),
    letterSpacing: hs(0.25),
  },
  bodySmall: {
    fontFamily: "Cairo-Regular",
    lineHeight: vs(22),
    fontSize: ms(12),
    letterSpacing: hs(0.4),
  },
};
