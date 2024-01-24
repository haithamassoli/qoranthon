import { Feather, Ionicons } from "@expo/vector-icons";
import CustomDrawer from "@src/layouts/custom-drawer";
import { IconSize } from "@styles/size";
import { ms } from "@utils/platform";
import { Drawer } from "expo-router/drawer";

const HomeDrawer = () => {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        drawerType: "front",
        headerTitleStyle: {
          fontFamily: "Cairo-Bold",
          fontSize: ms(16),
        },
        drawerStyle: {
          width: "68%",
        },
        headerLeft: () => null,
      }}
    >
      <Drawer.Screen
        name="(homeStack)"
        options={{
          title: "الرئيسة",
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={IconSize.m} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="notifications"
        options={{
          title: "الإشعارات",
          drawerIcon: ({ color }) => (
            <Ionicons
              name="notifications-outline"
              size={IconSize.m}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="gamification"
        options={{
          title: "اختبر نفسك",
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons
              name="extension-puzzle-outline"
              size={IconSize.m}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="quizroom"
        options={{
          title: "غرفة الاختبارات",
          headerShown: false,
          drawerIcon: ({ color }) => (
            <Ionicons
              name="game-controller-outline"
              size={IconSize.m}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="leaderboard"
        options={{
          title: "لوحة المتصدرين",
          drawerIcon: ({ color }) => (
            <Ionicons name="trophy-outline" size={IconSize.m} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="statistics"
        options={{
          title: "إحصائيات  (قريــبا)",
          drawerIcon: ({ color }) => (
            <Feather name="bar-chart-2" size={IconSize.m} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="contact"
        options={{
          title: "تواصل معنا",
          drawerIcon: ({ color }) => (
            <Ionicons name="mail-outline" size={IconSize.m} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: "عن التطبيق",
          drawerIcon: ({ color }) => (
            <Feather name="info" size={IconSize.m} color={color} />
          ),
        }}
      />
    </Drawer>
  );
};

export default HomeDrawer;
