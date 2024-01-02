import { vs } from "@utils/platform";
import { Button } from "react-native-paper";

const CustomButton = ({
  onPress,
  title,
  mode = "contained",
  style,
  disabled,
}: {
  onPress: () => void;
  title: string;
  mode?: "text" | "outlined" | "contained" | "elevated" | "contained-tonal";
  style?: any;
  disabled?: boolean;
}) => {
  return (
    <Button
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      contentStyle={{
        height: vs(46),
      }}
      style={{
        ...style,
      }}
    >
      {title}
    </Button>
  );
};

export default CustomButton;
