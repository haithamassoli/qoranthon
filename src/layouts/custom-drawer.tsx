import { Share, TouchableOpacity } from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Divider, Drawer } from "react-native-paper";
import { Box, ReText } from "@styles/theme";
import { IconSize } from "@styles/size";
import { useStore } from "@zustand/store";
import { ms, vs } from "@utils/platform";
import Loading from "@components/loading";
import { logoutMutation } from "@apis/auth";
import Colors from "@styles/colors";

const CustomDrawer = (props: any) => {
  const { user } = useStore();
  const { mutate, isLoading } = logoutMutation();

  if (isLoading) return <Loading />;

  return (
    <Box flex={1}>
      <DrawerContentScrollView {...props}>
        <Box justifyContent="center" alignItems="center" paddingTop="v2xl">
          <Feather name="user" color={Colors.tertiary} size={IconSize.xl} />
          <ReText variant="TitleMedium" color="tertiary" marginVertical="vs">
            {user?.name}
          </ReText>
        </Box>
        <Box flex={1} paddingTop="vs">
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
              message: `تطبيق تبيان على الاندرويد
              
تطبيق تبيان على الـios
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
