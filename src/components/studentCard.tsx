import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { ms, vs } from "@utils/platform";
import { TouchableOpacity } from "react-native";

type Props = {
  item: any;
  onPress: () => void;
  onPressInfo: () => void;
  selected: boolean;
};

const StudentCard = ({
  onPress,
  onPressInfo,
  item,
  selected = false,
}: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        height={vs(52)}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="hm"
        backgroundColor={selected ? "primaryContainer" : "secondaryContainer"}
        borderRadius="l"
      >
        <Box flexDirection="row" alignItems="center">
          <Feather
            name="user"
            size={ms(24)}
            color={Colors.onSecondaryContainer}
          />
          <ReText
            variant="BodyLarge"
            color="onSecondaryContainer"
            marginLeft="hs"
          >
            {item.name}
          </ReText>
        </Box>
        <TouchableOpacity onPress={onPressInfo}>
          <Feather
            name="info"
            size={ms(24)}
            color={Colors.onSecondaryContainer}
          />
        </TouchableOpacity>
      </Box>
    </TouchableOpacity>
  );
};

export default StudentCard;
