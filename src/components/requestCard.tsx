import { Feather, Ionicons } from "@expo/vector-icons";
import { Box, ReText } from "@styles/theme";
import { dateFromNow, width } from "@utils/helper";
import { hs, ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";

interface Props {
  name: string;
  telegram: string;
  createdAt: Date;
  sex: "ذكر" | "أنثى";
  onPress: () => void;
}

const RequestCard = ({ telegram, name, createdAt, sex, onPress }: Props) => {
  const copyToClipboard = async () => {
    useStore.setState({ snackbarText: "تم نسخ الحساب بنجاح" });
    await Clipboard.setStringAsync(telegram);
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        borderLeftWidth={4}
        borderColor="primary"
        paddingStart="hs"
        backgroundColor="surfaceVariant"
        paddingVertical="vs"
        paddingHorizontal="hm"
        borderRadius="m"
      >
        <Box flexDirection="row" justifyContent="space-between">
          <Box flexDirection="row" alignItems="center">
            <Ionicons
              name={sex === "ذكر" ? "man" : "woman"}
              size={ms(20)}
              color="black"
            />
            <ReText variant="BodySmall" textAlign="left">
              {name}
            </ReText>
          </Box>
          <ReText variant="BodySmall" textAlign="left">
            {dateFromNow(createdAt)}
          </ReText>
        </Box>
        <TouchableOpacity
          onPress={copyToClipboard}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            marginTop: vs(8),
            gap: hs(6),
            width: "50%",
            left: width * 0.42,
          }}
        >
          <ReText
            variant="TitleMedium"
            textAlign="right"
            fontFamily="Cairo-Bold"
            color="primary"
          >
            @{telegram}
          </ReText>
          <Feather name="copy" size={ms(20)} color="black" />
        </TouchableOpacity>
      </Box>
    </TouchableOpacity>
  );
};

export default RequestCard;
