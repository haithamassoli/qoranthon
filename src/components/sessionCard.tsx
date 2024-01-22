import { Box, ReText } from "@styles/theme";
import { SessionRate, SessionType } from "@src/types/data";
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
  onPress?: () => void;
  sessionRate: SessionRate;
  sessionType: SessionType;
  werd: string;
  studentId: string;
  sessionId: string;
}

const SessionCard = ({
  createdAt,
  onPress,
  sessionRate,
  sessionType,
  werd,
  sessionId,
  studentId,
}: Props) => {
  const date = new Date(createdAt);
  const day = date.getDate();
  const month = date.getMonth();
  const queryClient = useQueryClient();

  const { mutate: deleteSession, isLoading: isDeleting } =
    deleteSessionMutation();

  const { user } = useStore();
  const onPressDeleteSession = () => {
    deleteSession(
      { studentId, sessionId },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["sessions", studentId]);
          useStore.setState({
            snackbarText: "تم حذف الجلسة بنجاح",
          });
        },
      }
    );
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Box
        borderLeftWidth={hs(4)}
        borderRadius="m"
        paddingStart="hs"
        backgroundColor="surfaceVariant"
        paddingVertical="vm"
        paddingHorizontal="hm"
        style={{
          borderColor:
            sessionRate === "ممتاز"
              ? Colors.tertiary
              : sessionRate === "إعادة"
              ? Colors.error
              : Colors.primary,
        }}
      >
        {isDeleting ? (
          <Box height={vs(86)}>
            <Loading size="small" />
          </Box>
        ) : (
          <>
            <ReText variant="BodyMedium">{werd}</ReText>
            <ReText
              variant="TitleLarge"
              style={{
                color:
                  sessionRate === "ممتاز"
                    ? Colors.tertiary
                    : sessionRate === "إعادة"
                    ? Colors.error
                    : Colors.primary,
              }}
            >
              {sessionRate}
            </ReText>
            <Box position="absolute" top={vs(16)} right={hs(16)}>
              {sessionType === "جديد" && (
                <Box
                  borderRadius="s"
                  backgroundColor="error"
                  paddingHorizontal="hxs"
                  paddingVertical="vxs"
                >
                  <ReText variant="BodyMedium" color="onError">
                    جديد
                  </ReText>
                </Box>
              )}
              {sessionType === "مراجعة" && (
                <Box
                  borderRadius="s"
                  backgroundColor="primary"
                  paddingHorizontal="hxs"
                  paddingVertical="vxs"
                >
                  <ReText variant="BodyMedium" color="onPrimary">
                    مراجعة
                  </ReText>
                </Box>
              )}
              {(user?.role === "admin" || user?.role === "super") && (
                <Box paddingVertical="vxs">
                  <TouchableOpacity onPress={onPressDeleteSession}>
                    <Feather
                      name="trash-2"
                      size={ms(22)}
                      color={Colors.onBackground}
                    />
                  </TouchableOpacity>
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

export default SessionCard;
