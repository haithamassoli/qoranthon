import { TouchableOpacity, StyleSheet } from "react-native";
import { hs, ms, vs } from "@utils/platform";
import { Feather } from "@expo/vector-icons";
import { Box, ReText } from "@styles/theme";
import Colors from "@styles/colors";

type Props = {
  refetch?: () => void;
};

const NoConnection = ({ refetch }: Props) => {
  return (
    <Box flex={1} justifyContent={"center"} alignItems={"center"}>
      <ReText variant="DisplaySmall">لا يوجد اتصال بالانترنت</ReText>
      <TouchableOpacity onPress={refetch} style={styles.button}>
        <Feather name="refresh-cw" size={ms(20)} color={Colors.onBackground} />
      </TouchableOpacity>
    </Box>
  );
};

export default NoConnection;
const styles = StyleSheet.create({
  button: {
    paddingHorizontal: hs(20),
    paddingVertical: vs(12),
    borderRadius: ms(10),
    marginTop: vs(10),
  },
});
