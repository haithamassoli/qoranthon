import { Platform } from "react-native";
import { height, width } from "./helper";

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

export const horizontalScale = (size: number) =>
  (shortDimension / guidelineBaseWidth) * size;
export const verticalScale = (size: number) =>
  (longDimension / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) =>
  size + (horizontalScale(size) - size) * factor;
export const moderateVerticalScale = (size: number, factor = 0.5) =>
  size + (verticalScale(size) - size) * factor;

export const isIOS = Platform.OS === "ios";

export const hs = horizontalScale;
export const vs = verticalScale;
export const ms = moderateScale;
export const mvs = moderateVerticalScale;
