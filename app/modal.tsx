import { addStudentMutation } from "@apis/auth";
import Loading from "@components/loading";
import NoConnection from "@components/noConnection";
import Snackbar from "@components/snackbar";
import ControlledInput from "@components/ui/controlledInput";
import CustomButton from "@components/ui/customButton";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNetInfo } from "@react-native-community/netinfo";
import Colors from "@styles/colors";
import { IconSize } from "@styles/size";
import { Box, ReText } from "@styles/theme";
import { useQueryClient } from "@tanstack/react-query";
import {
  StudentValidationSchemaType,
  studentValidationSchema,
} from "@src/types/schema";
import { ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { SafeAreaView, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import { getAllAdminsQuery } from "@apis/users";
import { useState } from "react";

const Modal = () => {
  const { isConnected } = useNetInfo();
  const queryClient = useQueryClient();
  const [sheikhId, setSheikhId] = useState<string>("");
  const { user } = useStore();
  const { control, handleSubmit, setValue } =
    useForm<StudentValidationSchemaType>({
      resolver: zodResolver(studentValidationSchema),
    });

  const {
    id,
    name,
  }: {
    id: string;
    name: string;
  } = useLocalSearchParams();

  const { mutate, isLoading } = addStudentMutation();
  const { data: admins, isInitialLoading: isLoadingAdmins } = getAllAdminsQuery(
    user?.id!,
    true
  );

  const onSubmit = (data: StudentValidationSchemaType) => {
    if (isConnected === false) return <NoConnection />;
    console.log(data, sheikhId);
    if (!sheikhId)
      return useStore.setState({ snackbarText: "يجب اختيار شيخ الطالب" });
    mutate(
      {
        name: data.name,
        studentId: data.studentId,
        sheikhId,
        phone: data.phone || "",
        managerId: user?.id!,
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

  if (isLoading || isLoadingAdmins) return <Loading />;
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
            defaultValue={name}
            autoComplete="name"
            textContentType="name"
          />
          <ControlledInput
            control={control}
            name="studentId"
            label="رقم تسجيل الطالب"
            keyboardType="number-pad"
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
          />
          <SelectDropdown
            data={admins!}
            renderDropdownIcon={() => (
              <Feather
                name="chevron-down"
                size={ms(20)}
                color={Colors.onBackground}
              />
            )}
            buttonStyle={{
              width: "100%",
              height: vs(48),
              borderRadius: ms(8),
              backgroundColor: Colors.background,
              borderColor: Colors.onBackground,
              borderWidth: 0.8,
            }}
            buttonTextStyle={{
              textAlign: "left",
              color: Colors.onBackground,
              fontFamily: "Cairo-Bold",
              fontSize: ms(14),
            }}
            defaultButtonText={"اختر شيخ الطالب"}
            dropdownStyle={styles.dropdown}
            rowStyle={styles.row}
            rowTextStyle={styles.rowText}
            onSelect={(item) => {
              setSheikhId(item.id);
            }}
            rowTextForSelection={(item) => item.name}
            buttonTextAfterSelection={(item) => item.name}
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

export default Modal;

const styles = StyleSheet.create({
  dropdown: {
    borderRadius: ms(8),
    backgroundColor: Colors.background,
    borderColor: Colors.onBackground,
    borderWidth: 0.8,
  },
  row: {
    width: "100%",
    backgroundColor: Colors.background,
    borderColor: Colors.onBackground,
    borderWidth: 0.6,
  },
  rowText: {
    fontFamily: "Cairo-Regular",
    fontSize: ms(14),
    textAlign: "left",
    color: Colors.onBackground,
  },
});
