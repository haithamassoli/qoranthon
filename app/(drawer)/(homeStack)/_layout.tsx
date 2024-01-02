import { ms } from "@utils/platform";
import { Stack } from "expo-router";

const HomeStack = () => {
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
    >
      <Stack.Screen name="(user)/index" options={{ headerShown: false }} />
      <Stack.Screen
        name="(admin)/admin-dashboard"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(super)/super-dashboard"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="quran" options={{ headerShown: false }} />
      <Stack.Screen
        name="students/[studentId]"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="students/add-student"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default HomeStack;
