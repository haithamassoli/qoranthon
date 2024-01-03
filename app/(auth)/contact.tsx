import { Feather } from "@expo/vector-icons";
import { Box, ReText } from "@styles/theme";
import { ms, vs } from "@utils/platform";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ContactScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Box flex={1} paddingHorizontal="hm" paddingVertical="vm">
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            alignSelf: "flex-start",
          }}
        >
          <Feather name="arrow-right" size={ms(26)} color="black" />
        </TouchableOpacity>
        <Box height={vs(16)} />
        <Box flex={1} justifyContent="center" alignItems="center">
          <ReText variant="DisplaySmall">تواصل معنا</ReText>
          <ReText variant="LabelLarge">مجالس</ReText>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default ContactScreen;
