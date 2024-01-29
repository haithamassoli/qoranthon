import { ms } from "@utils/platform";
import { Stack } from "expo-router";

const SalfahStack = () => {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        animation: "slide_from_left",
        headerBackTitle: "الرجوع",
        headerBackTitleVisible: false,
        headerShown: false,
        headerTitleStyle: {
          fontFamily: "Cairo-Bold",
          fontSize: ms(16),
        },
      }}
    ></Stack>
  );
};

export default SalfahStack;
