import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { IconSize } from "@styles/size";
import { Box, ReText } from "@styles/theme";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vs } from "@utils/platform";
import ControlledInput from "@components/ui/controlledInput";
import Snackbar from "@components/snackbar";
import {
  StudentLoginValidationSchemaType,
  studentLoginValidationSchema,
} from "@src/types/schema";
import Loading from "@components/loading";
import { studentLoginMutation } from "@apis/auth";
import CustomButton from "@components/ui/customButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetInfo } from "@react-native-community/netinfo";
import NoConnection from "@components/noConnection";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

const SignIn = () => {
  const { isConnected } = useNetInfo();
  const { control, handleSubmit } = useForm<StudentLoginValidationSchemaType>({
    resolver: zodResolver(studentLoginValidationSchema),
  });

  const { mutate, isLoading } = studentLoginMutation();

  const onSubmit = (data: StudentLoginValidationSchemaType) => {
    if (isConnected === false) return <NoConnection />;
    mutate(data);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Snackbar />
      <Box
        flex={1}
        style={{
          paddingTop: useSafeAreaInsets().top + vs(12),
        }}
      >
        <Box flex={1} paddingHorizontal="hl" paddingTop="vl">
          <Box flex={1}>
            <Box height={"25%"} justifyContent="center" alignItems="center">
              <Feather name="user" color={Colors.primary} size={IconSize.xl} />
              <ReText variant="DisplaySmall">تسجيل دخول</ReText>
              <ReText variant="HeadlineMedium">الطلاب</ReText>
            </Box>
            <Box height={vs(64)} />
            <ControlledInput
              control={control}
              name="studentId"
              label="رقم تسجيل الطالب"
              keyboardType="number-pad"
            />
            <Box height={vs(32)} />
            <CustomButton
              mode="contained-tonal"
              onPress={handleSubmit(onSubmit)}
              title="تسجيل الدخول"
            />
            <TouchableOpacity onPress={() => router.push("/sheikh-sign-in")}>
              <ReText
                marginTop="hxs"
                textAlign="left"
                marginHorizontal="hs"
                variant="BodySmall"
              >
                هل أنت معلم؟ سجل دخولك من هنا
              </ReText>
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SignIn;
