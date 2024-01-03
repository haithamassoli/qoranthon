import HeaderRight from "@components/headerRight";
import { useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Box, ReText } from "@styles/theme";

const Contact = () => {
  const navigation: any = useNavigation();

  return (
    <>
      <Drawer.Screen
        options={{
          headerLeft: () => (
            <HeaderRight onPress={() => navigation.openDrawer()} />
          ),
        }}
      />
      <Box flex={1} paddingHorizontal="hm" paddingVertical="vm">
        <Box flex={1} justifyContent="center" alignItems="center">
          <ReText variant="DisplaySmall">تواصل معنا</ReText>
          <ReText variant="LabelLarge">مجالس</ReText>
        </Box>
      </Box>
    </>
  );
};

export default Contact;
