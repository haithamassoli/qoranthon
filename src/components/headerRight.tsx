import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { hs, ms } from "@utils/platform";
import { TouchableOpacity } from "react-native";

interface Props {
  onPress: () => void;
}

const HeaderRight = ({ onPress }: Props) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Feather
        name="menu"
        size={ms(24)}
        style={{ marginStart: hs(16) }}
        color={Colors.onBackground}
      />
    </TouchableOpacity>
  );
};

export default HeaderRight;
