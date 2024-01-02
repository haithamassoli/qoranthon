import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { hs, ms, vs } from "@utils/platform";
import { Card } from "react-native-paper";

const VideoButton = ({
  onPress,
  title,
  mode = "elevated",
  style,
  duration,
}: {
  onPress: () => void;
  title: string;
  mode?: "outlined" | "contained" | "elevated";
  style?: any;
  duration: string;
}) => {
  return (
    <Card
      mode={mode}
      onPress={onPress}
      contentStyle={{
        paddingHorizontal: hs(16),
      }}
      style={{
        ...style,
      }}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        height={vs(48)}
        justifyContent="space-between"
        width="100%"
      >
        <Box flexDirection="row" alignItems="center" gap="hs">
          <Feather name="play-circle" size={ms(20)} color={Colors.secondary} />
          <ReText variant="LabelLarge">{title}</ReText>
        </Box>
        <ReText variant="LabelLarge">{duration}</ReText>
      </Box>
    </Card>
  );
};

export default VideoButton;
