import HeaderRight from "@components/headerRight";
import { Box, ReText } from "@styles/theme";
import { useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";

const Statistics = () => {
  const navigation: any = useNavigation();
  return (
    <Box flex={1} justifyContent="center" alignItems="center">
      <Drawer.Screen
        options={{
          headerLeft: () => (
            <HeaderRight onPress={() => navigation.openDrawer()} />
          ),
        }}
      />
      <ReText variant="DisplaySmall">Statistics</ReText>
      <ReText variant="BodyLarge">مجالس</ReText>
    </Box>
  );
};

export default Statistics;
