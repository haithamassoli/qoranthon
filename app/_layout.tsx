import "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as ReThemeProvider } from "@shopify/restyle";
import { StatusBar } from "expo-status-bar";
import { useStore } from "@zustand/store";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { isDevice } from "expo-device";
import {
  PaperProvider,
  MD3LightTheme,
  TextInput,
  configureFonts,
  Text,
} from "react-native-paper";
import { useCallback, useEffect, useRef } from "react";
import { MaterialLight, fontConfig } from "@styles/material";
import { ThemeProvider } from "@react-navigation/native";
import theme, { Box, ReText } from "@styles/theme";
import Colors from "@styles/colors";
import {
  Alert,
  I18nManager,
  Platform,
  ScrollView,
  UIManager,
} from "react-native";
import {
  Stack,
  SplashScreen,
  useSegments,
  router,
  useRootNavigationState,
} from "expo-router";
import { LightNavigationColors } from "@styles/navigation";
import RNRestart from "react-native-restart";
import { getDataMMKV, isDateInSameDay, storeDataMMKV } from "@utils/helper";
import { addNotificationToken } from "@apis/notifications";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: Infinity,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      networkMode: "offlineFirst",
    },
  },
});

export const unstable_settings = {
  // Ensure any route can link back to `/`
  initialRouteName: "(drawer)",
};

SplashScreen.preventAutoHideAsync();

const getUserFromStorage = async () => {
  try {
    const user = getDataMMKV("user");
    if (user) useStore.setState({ user });
  } catch (error) {
    console.log(error);
  }
};

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;
// @ts-ignore
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.allowFontScaling = false;
ReText.defaultProps = ReText.defaultProps || {};
ReText.defaultProps.allowFontScaling = false;

// @ts-ignore
ScrollView.defaultProps = ScrollView.defaultProps || {};
// @ts-ignore
ScrollView.defaultProps.showsVerticalScrollIndicator = false;
// @ts-ignore
ScrollView.defaultProps.showsHorizontalScrollIndicator = false;

export default function RootLayout() {
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const { user } = useStore();
  const responseListener = useRef();

  const forceRTL = () => {
    if (!I18nManager.isRTL) {
      try {
        I18nManager.allowRTL(true);
        I18nManager.forceRTL(true);
        RNRestart.restart();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getStreakDays = () => {
    const streak = getDataMMKV("streakDays");
    if (streak) {
      if (isDateInSameDay(new Date(), new Date(streak.lastStreakDate))) return;
      if (
        isDateInSameDay(
          new Date(),
          new Date(new Date(streak.lastStreakDate).getTime() + 86400000)
        )
      ) {
        storeDataMMKV("streakDays", {
          streakDays: streak.streakDays + 1,
          lastStreakDate: new Date(),
        });
      }
    } else {
      storeDataMMKV("streakDays", {
        streakDays: 1,
        lastStreakDate: new Date(),
      });
    }
  };

  const configurePushNotifications = async () => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    if (isDevice) {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert("تنبيه", "لن يتم ارسال التنبيهات الى الجهاز الخاص بك");
        return;
      }
      const pushNotificationsToken = await Notifications.getExpoPushTokenAsync({
        projectId: "440aa068-5a2d-4b75-8997-66066412f00c",
      });
      const user = getDataMMKV("user");
      console.log(user.pushNotificationsToken);
      if (user && !user?.pushNotificationsToken) {
        addNotificationToken(user.id, pushNotificationsToken.data);
        storeDataMMKV("user", {
          ...user,
          pushNotificationsToken: pushNotificationsToken.data,
        });
      }
    }
  };

  useEffect(() => {
    forceRTL();
    getUserFromStorage();
    getStreakDays();
    // @ts-ignore
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response.notification.request.content, "response");
        const notifications = getDataMMKV("notifications");
        if (notifications) {
          storeDataMMKV("notifications", [
            ...notifications,
            {
              ...response.notification.request.content,
              date: new Date(),
            },
          ]);
        } else {
          storeDataMMKV("notifications", [
            {
              ...response.notification.request.content,
              date: new Date(),
            },
          ]);
        }
        router.push("/(drawer)/notifications");
      });

    return () =>
      // @ts-ignore
      Notifications.removeNotificationSubscription(responseListener.current);
  }, []);

  useEffect(() => {
    if (!user) return;
    configurePushNotifications();
  }, [user]);

  useEffect(() => {
    if (!rootNavigationState?.key) return;
    // @ts-ignore
    const inAuthGroup = segments.includes("(drawer)");
    // @ts-ignore
    const inAdminGroup = segments.includes("(admin)");
    // @ts-ignore
    const inUserGroup = segments.includes("(user)");
    // @ts-ignore
    const inSuperGroup = segments.includes("(super)");

    if (!user && inAuthGroup) {
      router.replace("/sign-in");
    } else if (user && segments[0] === "(auth)") {
      if (user.role === "admin") {
        router.replace("/admin-dashboard");
      } else if (user.role === "super") {
        router.replace("/super-dashboard");
      } else {
        router.replace("/");
      }
    } else if (user?.role === "user" && (inAdminGroup || inSuperGroup)) {
      router.replace("/(drawer)/(homeStack)/(user)");
    } else if (user?.role === "admin" && (inUserGroup || inSuperGroup)) {
      router.replace("/admin-dashboard");
    } else if (user?.role === "super" && (inUserGroup || inAdminGroup)) {
      router.replace("/super-dashboard");
    }
    console.log(segments);
  }, [user, segments, rootNavigationState]);

  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

export const App = () => {
  const [fontsLoaded] = useFonts({
    CairoReg: require("@assets/fonts/Cairo-Reg.ttf"),
    CairoBold: require("@assets/fonts/Cairo-Bold.ttf"),
    Uthmanic: require("@assets/fonts/UthmanicHafs1Ver18.ttf"),
  });
  const onLayoutRootView = useCallback(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const materialTheme: any = {
    ...MD3LightTheme,
    dark: false,
    isV3: true,
    version: 3,
    colors: { ...MD3LightTheme.colors, ...MaterialLight },
    fonts: configureFonts({ config: fontConfig }),
  };

  return (
    <ReThemeProvider theme={theme}>
      <StatusBar style={"dark"} backgroundColor={Colors.background} />
      <PaperProvider theme={materialTheme}>
        <ThemeProvider value={LightNavigationColors}>
          <Box flex={1} onLayout={onLayoutRootView}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_left",
              }}
            />
          </Box>
        </ThemeProvider>
      </PaperProvider>
    </ReThemeProvider>
  );
};
