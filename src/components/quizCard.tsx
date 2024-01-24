import { Box, ReText } from "@styles/theme";
import { dateFromNow } from "@utils/helper";
import { hs, ms, vs } from "@utils/platform";
import { TouchableOpacity } from "react-native";
import Colors from "@styles/colors";
import { Feather } from "@expo/vector-icons";
import { deleteSessionMutation } from "@apis/sessions";
import { useStore } from "@zustand/store";
import Loading from "./loading";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  createdAt: Date;
  title: string;
  sheikhName: string;
  sheikhId: string;
  onPress: () => void;
}

const QuizCard = ({
  createdAt,
  onPress,
  sheikhId,
  sheikhName,
  title,
}: Props) => {
  const date = new Date(createdAt);
  const day = date.getDate();
  const month = date.getMonth();
  // const queryClient = useQueryClient();

  const { mutate: deleteSession, isLoading: isDeleting } =
    deleteSessionMutation();

  const { user } = useStore();
  // const onPressDeleteSession = () => {
  //   deleteSession(
  //     { studentId, sessionId },
  //     {
  //       onSuccess: () => {
  //         queryClient.invalidateQueries(["sessions", studentId]);
  //         useStore.setState({
  //           snackbarText: "تم حذف الجلسة بنجاح",
  //         });
  //       },
  //     }
  //   );
  // };

  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        borderLeftWidth={hs(4)}
        borderRadius="m"
        paddingStart="hs"
        backgroundColor="surfaceVariant"
        paddingVertical="vm"
        paddingHorizontal="hm"
        borderColor={"tertiary"}
      >
        {isDeleting ? (
          <Box height={vs(86)}>
            <Loading size="small" />
          </Box>
        ) : (
          <>
            <ReText variant="BodyMedium">{sheikhName}</ReText>
            <ReText variant="TitleLarge" color="primary">
              {title}
            </ReText>
            <Box position="absolute" top={vs(16)} right={hs(16)}>
              {(user?.role === "admin" || user?.role === "super") && (
                <Box paddingVertical="vxs">
                  {/* <TouchableOpacity onPress={onPressDeleteSession}> */}
                  <Feather
                    name="trash-2"
                    size={ms(22)}
                    color={Colors.onBackground}
                  />
                  {/* </TouchableOpacity> */}
                </Box>
              )}
            </Box>
            <Box flexDirection="row" justifyContent="space-between">
              <ReText variant="BodyMedium">{dateFromNow(createdAt)}</ReText>
              <ReText variant="BodyMedium">{`${day}/${month + 1}`}</ReText>
            </Box>
          </>
        )}
      </Box>
    </TouchableOpacity>
  );
};

export default QuizCard;
