import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { IconSize } from "@styles/size";
import { Box, ReText } from "@styles/theme";
import { TextInput } from "react-native-paper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ms, vs } from "@utils/platform";
import ControlledInput from "@components/ui/controlledInput";
import Snackbar from "@components/snackbar";
import { useState } from "react";
import {
  LoginValidationSchemaType,
  loginValidationSchema,
} from "@src/types/schema";
import Loading from "@components/loading";
import { loginMutation } from "@apis/auth";
import CustomButton from "@components/ui/customButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetInfo } from "@react-native-community/netinfo";
import NoConnection from "@components/noConnection";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

const SheikhSignIn = () => {
  const { isConnected } = useNetInfo();
  const { control, handleSubmit, setFocus } =
    useForm<LoginValidationSchemaType>({
      resolver: zodResolver(loginValidationSchema),
    });
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isLoading } = loginMutation();

  const onSubmit = (data: LoginValidationSchemaType) => {
    if (isConnected === false) return <NoConnection />;
    mutate(data);
  };

  const onEyePress = () => {
    setShowPassword((e) => !e);
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
              <ReText variant="DisplaySmall">تسجيل الدخول</ReText>
              <ReText variant="HeadlineMedium">المعلمين</ReText>
            </Box>
            <Box height={vs(64)} />
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
              title="تسجيل الدخول"
            />
            <TouchableOpacity onPress={() => router.push("/sign-in")}>
              <ReText
                marginTop="hxs"
                textAlign="left"
                marginHorizontal="hs"
                variant="BodySmall"
              >
                هل أنت طالب؟ سجل دخولك من هنا
              </ReText>
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SheikhSignIn;
