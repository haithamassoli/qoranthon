import { addStudentMutation } from "@apis/auth";
import Loading from "@components/loading";
import NoConnection from "@components/noConnection";
import Snackbar from "@components/snackbar";
import ControlledInput from "@components/ui/controlledInput";
import CustomButton from "@components/ui/customButton";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNetInfo } from "@react-native-community/netinfo";
import { IconSize } from "@styles/size";
import { Box, ReText } from "@styles/theme";
import {
  StudentValidationSchemaType,
  studentValidationSchema,
} from "@src/types/schema";
import { ms, vs } from "@utils/platform";
import { useForm } from "react-hook-form";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@styles/colors";
import { useStore } from "@zustand/store";
import { router, useLocalSearchParams } from "expo-router";
import { Keyboard, TouchableOpacity } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

const AddStudentScreen = () => {
  const { isConnected } = useNetInfo();
  const queryClient = useQueryClient();
  const { user } = useStore();
  const { control, handleSubmit, setValue, setFocus } =
    useForm<StudentValidationSchemaType>({
      resolver: zodResolver(studentValidationSchema),
    });

  const {
    sheikhId,
  }: {
    sheikhId?: string;
  } = useLocalSearchParams();

  const { mutate, isLoading } = addStudentMutation();
  const onSubmit = (data: StudentValidationSchemaType) => {
    if (isConnected === false) return <NoConnection />;
    mutate(
      {
        name: data.name,
        studentId: data.studentId,
        sheikhId: sheikhId || user?.id!,
        phone: data.phone || "",
        managerId: user?.managerId || user?.id!,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["users"]);
          useStore.setState({ snackbarText: "تم إنشاء الحساب بنجاح." });
          router.back();
        },
      }
    );
  };

  const onShufflePress = () => {
    setValue("studentId", Math.floor(Math.random() * 1000000).toString());
  };

  if (isLoading) return <Loading />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Snackbar />
      <Box flex={1} paddingHorizontal="hl" paddingTop="vl">
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={IconSize.l} color={Colors.onBackground} />
        </TouchableOpacity>
        <Box flex={1}>
          <Box height={"20%"} justifyContent="center" alignItems="center">
            <Feather
              name="user-plus"
              color={Colors.primary}
              size={IconSize.xl}
            />
            <ReText variant="DisplaySmall">إضافة طالب</ReText>
          </Box>
          <Box height={vs(64)} />
          <ControlledInput
            control={control}
            name="name"
            label="اسم الطالب"
            autoCapitalize="none"
            autoComplete="name"
            textContentType="name"
            onSubmitEditing={() => setFocus("studentId")}
          />
          <ControlledInput
            control={control}
            name="studentId"
            label="رقم تسجيل الطالب"
            keyboardType="number-pad"
            onSubmitEditing={() => setFocus("phone")}
            right={
              <TextInput.Icon
                icon={"auto-fix"}
                size={ms(24)}
                onPress={onShufflePress}
              />
            }
          />
          <ControlledInput
            control={control}
            name="phone"
            label="رقم الطالب أو ولي الأمر"
            autoCapitalize="none"
            textContentType="telephoneNumber"
            keyboardType="phone-pad"
            onSubmitEditing={() => Keyboard.dismiss()}
          />
          <Box height={vs(32)} />
          <CustomButton
            mode="contained-tonal"
            onPress={handleSubmit(onSubmit)}
            title="إضافة الطالب"
          />
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default AddStudentScreen;
