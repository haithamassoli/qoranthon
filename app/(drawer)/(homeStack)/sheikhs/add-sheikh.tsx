import { registerMutation } from "@apis/auth";
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
  RegisterValidationSchemaType,
  registerValidationSchema,
} from "@src/types/schema";
import { ms, vs } from "@utils/platform";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@styles/colors";
import { useStore } from "@zustand/store";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

const AddSheikhScreen = () => {
  const { isConnected } = useNetInfo();
  const { user } = useStore();
  const queryClient = useQueryClient();
  const { control, handleSubmit, setFocus } =
    useForm<RegisterValidationSchemaType>({
      resolver: zodResolver(registerValidationSchema),
    });
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isLoading } = registerMutation();

  const onSubmit = (data: RegisterValidationSchemaType) => {
    if (isConnected === false) return <NoConnection />;
    mutate(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        managerId: user?.id!,
        phone: data.phone || "",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["admins"]);
          useStore.setState({ snackbarText: "تم إنشاء الحساب بنجاح." });
          router.back();
        },
      }
    );
  };

  const onEyePress = () => {
    setShowPassword((e) => !e);
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
            <ReText variant="DisplaySmall">إضافة شيخ</ReText>
          </Box>
          <Box height={vs(64)} />
          <ControlledInput
            control={control}
            name="name"
            label="اسم الشيخ"
            autoCapitalize="none"
            autoComplete="name"
            textContentType="name"
            onSubmitEditing={() => setFocus("phone")}
          />
          <ControlledInput
            control={control}
            name="phone"
            label="رقم الهاتف"
            autoCapitalize="none"
            textContentType="telephoneNumber"
            keyboardType="phone-pad"
            onSubmitEditing={() => setFocus("email")}
          />
          <ControlledInput
            control={control}
            name="email"
            label={"البريد الإلكتروني"}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            textContentType="emailAddress"
            onSubmitEditing={() => setFocus("password")}
          />
          <ControlledInput
            control={control}
            name="password"
            textContentType="password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            onSubmitEditing={handleSubmit(onSubmit)}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                size={ms(24)}
                onPress={onEyePress}
              />
            }
            label={"كلمة المرور"}
          />
          <Box height={vs(32)} />
          <CustomButton
            mode="contained-tonal"
            onPress={handleSubmit(onSubmit)}
            title="إضافة الشيخ"
          />
        </Box>
      </Box>
    </SafeAreaView>
  );
};

export default AddSheikhScreen;
