import { ms } from "@utils/platform";
import { Stack } from "expo-router";

const GamificationStack = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        animation: "slide_from_left",
        headerBackTitle: "الرجوع",
        headerBackTitleVisible: false,
        headerShown: false,
        headerTitleStyle: {
          fontFamily: "CairoBold",
          fontSize: ms(16),
        },
      }}
    ></Stack>
  );
};

export default GamificationStack;
