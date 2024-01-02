import { Box, ReText } from "@styles/theme";
import { Feather } from "@expo/vector-icons";
import { hs, ms } from "@utils/platform";
import Colors from "@styles/colors";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";

const Header = ({ title }: { title: string }) => {
  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="hm"
      paddingVertical="vs"
    >
      <ReText variant="TitleLarge" color="primary" textAlign="left">
        {title}
      </ReText>
      <TouchableOpacity
        style={{
          flexDirection: "row",
        }}
        onPress={() => router.back()}
      >
        <Feather name="chevrons-left" size={ms(32)} color={Colors.primary} />
      </TouchableOpacity>
    </Box>
  );
};

export default Header;
