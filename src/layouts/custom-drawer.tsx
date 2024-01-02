import { Share, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Divider, Drawer } from "react-native-paper";
import { Box, ReText } from "@styles/theme";
import { IconSize } from "@styles/size";
import { useStore } from "@zustand/store";
import { hs, vs } from "@utils/platform";
import Loading from "@components/loading";
import { logoutMutation } from "@apis/auth";
import Colors from "@styles/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDataMMKV } from "@utils/helper";

const CustomDrawer = (props: any) => {
  const { user } = useStore();
  const { mutate, isLoading } = logoutMutation();
  const streak = getDataMMKV("streakDays");

  if (isLoading) return <Loading />;

  return (
    <Box flex={1}>
      <DrawerContentScrollView {...props}>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          style={{
            position: "absolute",
            top: useSafeAreaInsets().top,
            left: hs(16),
          }}
        >
          <Ionicons
            name="flame-outline"
            size={IconSize.l}
            color={Colors.tertiary}
          />
          <ReText variant="TitleSmall" color="tertiary">
            {streak.streakDays} يوم
          </ReText>
        </Box>
        <Box justifyContent="center" alignItems="center" paddingTop="vxl">
          <Feather name="user" color={Colors.tertiary} size={IconSize.xl} />
          <ReText variant="TitleMedium" color="tertiary" marginVertical="vs">
            {user?.role !== "super" ? user?.name : "المدير"}
          </ReText>
        </Box>
        <Box flex={1}>
          {props.state.routes.map((route: any, index: number) => {
            const { options } = props.descriptors[route.key];
            if (options.drawerIcon === undefined) return null;
            const label =
              options.drawerLabel !== undefined
                ? options.drawerLabel
                : options.title !== undefined
                ? options.title
                : route.name;

            const isFocused = props.state.index === index;

            const onPress = () => {
              if (route.name !== "statistics") {
                props.navigation.navigate(route.name);
              }
            };

            return (
              <Drawer.Item
                key={route.key}
                label={label}
                active={isFocused}
                onPress={onPress}
                icon={options.drawerIcon}
                style={{
                  height: vs(56),
                }}
              />
            );
          })}
        </Box>
      </DrawerContentScrollView>
      <Divider horizontalInset bold />
      <Box padding="hm">
        <TouchableOpacity
          onPress={() => {
            Share.share({
              message: `تطبيق مجالس على الاندرويد
              
تطبيق مجالس على الـios
              `,
            });
          }}
          style={{ paddingVertical: vs(16) }}
        >
          <Box flexDirection={"row"} alignItems={"center"}>
            <Ionicons
              name="share-social-outline"
              color={Colors.onBackground}
              size={IconSize.m}
            />
            <ReText variant="LabelLarge" marginLeft="hs" fontFamily="CairoBold">
              شارك مع أصدقائك
            </ReText>
          </Box>
        </TouchableOpacity>
        {!!user && (
          <TouchableOpacity
            onPress={() => mutate()}
            style={{ paddingVertical: vs(16) }}
          >
            <Box flexDirection={"row"} alignItems={"center"}>
              <Ionicons
                name="exit-outline"
                color={Colors.onBackground}
                size={IconSize.m}
              />
              <ReText
                variant="LabelLarge"
                marginLeft="hs"
                fontFamily="CairoBold"
              >
                تسجيل خروج
              </ReText>
            </Box>
          </TouchableOpacity>
        )}
      </Box>
    </Box>
  );
};

export default CustomDrawer;
