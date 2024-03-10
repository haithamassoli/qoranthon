import { addRequestMutation } from "@apis/auth";
import Loading from "@components/loading";
import ControlledInput from "@components/ui/controlledInput";
import CustomButton from "@components/ui/customButton";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RegistrationRequestsSchemaType,
  registrationRequestsSchema,
} from "@src/types/schema";
import { Box, ReText } from "@styles/theme";
import { hs, ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { router } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { Checkbox } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sendNotificationMutation } from "@apis/notifications";
import { getAdminsAndManagersQuery } from "@apis/users";

const SignUp = () => {
  const { control, handleSubmit, setValue } =
    useForm<RegistrationRequestsSchemaType>({
      resolver: zodResolver(registrationRequestsSchema),
    });

  const { data, isInitialLoading } = getAdminsAndManagersQuery();
  const { mutate, isLoading } = addRequestMutation();
  const { mutate: sendNotification, isLoading: isSending } =
    sendNotificationMutation();

  const adminsAndManagersNotificationTokens = data?.map(
    (user) => user.pushNotificationsToken!
  );

  const onSubmit = (formData: RegistrationRequestsSchemaType) => {
    mutate(formData, {
      onSuccess: () => {
        useStore.setState({
          snackbarText: "تم إرسال الطلب بنجاح، سيتم التواصل معك قريبا",
        });
        sendNotification({
          title: "طلب انضمام جديد",
          body: "تم استلام طلب انضمام جديد",
          tokens: adminsAndManagersNotificationTokens!,
        });
        router.back();
      },
    });
  };

  if (isLoading || isSending || isInitialLoading) return <Loading />;

  return (
    <Box
      flex={1}
      style={{
        paddingTop: useSafeAreaInsets().top + vs(12),
      }}
    >
      <Box flex={1} paddingHorizontal="hl" paddingTop="vl">
        <ReText
          textAlign="center"
          variant="TitleMedium"
          marginTop="vl"
          marginBottom="v2xl"
        >
          طلب الانضمام لتطبيق مجالس
        </ReText>
        <ControlledInput control={control} name="name" label="الإسم الثلاثي" />
        <ControlledInput
          control={control}
          name="telegram"
          label="معرف التيليجرام"
          onSubmitEditing={handleSubmit(onSubmit)}
        />
        <Controller
          control={control}
          defaultValue="ذكر"
          name="sex"
          render={({ field: { value } }) => (
            <>
              <TouchableOpacity onPress={() => setValue("sex", "ذكر")}>
                <Box flexDirection="row" alignItems="center">
                  <Checkbox
                    status={value === "ذكر" ? "checked" : "unchecked"}
                  />
                  <ReText variant="BodySmall">ذكر</ReText>
                </Box>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setValue("sex", "أنثى")}>
                <Box flexDirection="row" alignItems="center">
                  <Checkbox
                    status={value === "أنثى" ? "checked" : "unchecked"}
                  />
                  <ReText variant="BodySmall">أنثى</ReText>
                </Box>
              </TouchableOpacity>
            </>
          )}
        />
        <CustomButton
          title="إرسال"
          onPress={handleSubmit(onSubmit)}
          style={{
            marginTop: vs(36),
          }}
        />
      </Box>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: useSafeAreaInsets().top + vs(18),
          right: hs(16),
        }}
        onPress={() => router.back()}
      >
        <Feather name="x" size={ms(24)} />
      </TouchableOpacity>
    </Box>
  );
};

export default SignUp;
