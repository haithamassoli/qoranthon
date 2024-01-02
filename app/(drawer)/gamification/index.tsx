import HeaderRight from "@components/headerRight";
import { Box, ReText } from "@styles/theme";
import { useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Gamification = () => {
  const navigation: any = useNavigation();
  return (
    <Box
      flex={1}
      paddingHorizontal="hm"
      style={{
        paddingTop: useSafeAreaInsets().top,
      }}
    >
      <HeaderRight onPress={() => navigation.openDrawer()} />
      <Box flex={1} justifyContent="center" alignItems="center">
        <ReText variant="DisplaySmall">Gamification</ReText>
        <ReText variant="BodyLarge">مجالس</ReText>
      </Box>
    </Box>
  );
};

export default Gamification;
