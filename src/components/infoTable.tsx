import { Box, ReText } from "@styles/theme";
import ControlledInput from "./ui/controlledInput";
import Colors from "@styles/colors";
import { ms, vs } from "@utils/platform";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import {
  editMemorizedMutation,
  editNameMutation,
  editPhoneMutation,
  editSheikhIdMutation,
  editStudentIdMutation,
} from "@apis/users";
import { useStore } from "@zustand/store";
import Loading from "./loading";
import {
  EditStudentValidationSchemaType,
  editStudentValidationSchema,
} from "@src/types/schema";
import SelectDropdown from "react-native-select-dropdown";
import { StyleSheet } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

type InfoTableProps = {
  name: string;
  studentId: string;
  phone: string;
  sheikhId: string;
  memorized: string;
  studentInfo: string;
  sheikhName?: string;
  allSheikhs?: Sheikh[];
};

type Sheikh = {
  name: string;
  id: string;
  phone: string;
};

const InfoTable = ({
  name,
  memorized,
  studentId,
  phone,
  studentInfo,
  sheikhName,
  allSheikhs,
  sheikhId,
}: InfoTableProps) => {
  const { control, handleSubmit, getValues } =
    useForm<EditStudentValidationSchemaType>({
      resolver: zodResolver(editStudentValidationSchema),
    });
  const { user } = useStore();
  const queryClient = useQueryClient();

  const { mutate: editName, isLoading: isEditNameLoading } = editNameMutation();
  const { mutate: editPhone, isLoading: isEditPhoneLoading } =
    editPhoneMutation();
  const { mutate: editId, isLoading: isEditIdLoading } =
    editStudentIdMutation();
  const { mutate: editMemorized, isLoading: isEditMemorizedLoading } =
    editMemorizedMutation();

  const { mutate: editSheikhId, isLoading: isEditSheikhIdLoading } =
    editSheikhIdMutation();

  const studentSheikh = allSheikhs?.find((sheikh) => sheikh.id === sheikhId);

  const onEditName = (formData: EditStudentValidationSchemaType) => {
    editName(
      {
        studentId: studentInfo,
        name: formData.name || name,
      },
      {
        onSuccess: () => {
          useStore.setState({
            snackbarText: "تم تعديل الاسم بنجاح",
          });
          queryClient.invalidateQueries(["user", studentInfo]);
        },
      }
    );
  };

  const onEditPhone = (formData: EditStudentValidationSchemaType) => {
    editPhone(
      {
        studentId: studentInfo,
        phone: formData.phone || "",
      },
      {
        onSuccess: () => {
          useStore.setState({
            snackbarText: "تم تعديل رقم الهاتف بنجاح",
          });
          queryClient.invalidateQueries(["user", studentInfo]);
        },
      }
    );
  };

  const onEditId = (formData: EditStudentValidationSchemaType) => {
    editId(
      {
        studentId: studentInfo,
        newStudentId: formData.newStudentId || studentId,
      },
      {
        onSuccess: () => {
          useStore.setState({
            snackbarText: "تم تعديل رقم الطالب بنجاح",
          });
          queryClient.invalidateQueries(["user", studentInfo]);
        },
      }
    );
  };

  const onEditMemorized = (formData: EditStudentValidationSchemaType) => {
    editMemorized(
      {
        studentId: studentInfo,
        memorized: formData.memorized || "",
      },
      {
        onSuccess: () => {
          useStore.setState({
            snackbarText: "تم تعديل المحفوظ بنجاح",
          });
          queryClient.invalidateQueries(["user", studentInfo]);
        },
      }
    );
  };

  if (
    isEditNameLoading ||
    isEditPhoneLoading ||
    isEditIdLoading ||
    isEditMemorizedLoading ||
    isEditSheikhIdLoading
  )
    return <Loading />;

  return (
    <>
      <Box
        backgroundColor="secondary"
        paddingVertical="vs"
        borderTopLeftRadius="m"
        borderTopRightRadius="m"
      >
        <ReText
          variant="TitleMedium"
          fontFamily="CairoBold"
          textAlign="center"
          color="onPrimary"
        >
          البيانات الشخصية
        </ReText>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Box
          width={"50%"}
          borderLeftWidth={1}
          borderBottomWidth={1}
          borderColor="onBackground"
          paddingVertical="vs"
          alignSelf="center"
        >
          <ReText variant="BodyLarge" textAlign="center">
            الاسم
          </ReText>
        </Box>
        <Box width={"50%"}>
          <ControlledInput
            control={control}
            noError
            editable={user?.role !== "user"}
            defaultValue={name}
            name="name"
            label="الاسم"
            mode="outlined"
            right={
              <TextInput.Icon
                icon={() =>
                  getValues("name") && (
                    <Feather
                      name="check"
                      size={ms(24)}
                      color={Colors.onBackground}
                    />
                  )
                }
                onPress={handleSubmit(onEditName)}
              />
            }
          />
        </Box>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Box
          width={"50%"}
          borderLeftWidth={1}
          borderBottomWidth={1}
          borderColor="onBackground"
          paddingHorizontal="hxs"
          paddingVertical="vs"
        >
          <ReText variant="BodyLarge" textAlign="center">
            المحفوظ
          </ReText>
        </Box>
        <Box width={"50%"}>
          <ControlledInput
            control={control}
            noError
            editable={user?.role !== "user"}
            defaultValue={memorized}
            name="memorized"
            label="المحفوظ"
            mode="outlined"
            right={
              <TextInput.Icon
                icon={() =>
                  getValues("memorized") && (
                    <Feather
                      name="check"
                      size={ms(24)}
                      color={Colors.onBackground}
                    />
                  )
                }
                onPress={handleSubmit(onEditMemorized)}
              />
            }
          />
        </Box>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Box
          width={"50%"}
          borderLeftWidth={1}
          borderBottomWidth={1}
          borderColor="onBackground"
          paddingHorizontal="hxs"
          paddingVertical="vs"
        >
          <ReText variant="BodyLarge" textAlign="center">
            رقم تسجيل الدخول
          </ReText>
        </Box>
        <Box width={"50%"}>
          <ControlledInput
            control={control}
            noError
            editable={user?.role !== "user"}
            defaultValue={studentId}
            name="studentId"
            label="رقم تسجيل الدخول"
            mode="outlined"
            right={
              <TextInput.Icon
                icon={() =>
                  getValues("newStudentId") && (
                    <Feather
                      name="check"
                      size={ms(24)}
                      color={Colors.onBackground}
                    />
                  )
                }
                onPress={handleSubmit(onEditId)}
              />
            }
          />
        </Box>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Box
          width={"50%"}
          borderLeftWidth={1}
          borderBottomWidth={1}
          borderColor="onBackground"
          paddingHorizontal="hxs"
          paddingVertical="vs"
          borderBottomLeftRadius="m"
        >
          <ReText variant="BodyLarge" textAlign="center">
            رقم الهاتف
          </ReText>
        </Box>
        <Box width={"50%"}>
          <ControlledInput
            control={control}
            noError
            editable={user?.role !== "user"}
            defaultValue={phone}
            name="phone"
            label="رقم الهاتف"
            mode="outlined"
            right={
              <TextInput.Icon
                icon={() =>
                  getValues("phone") && (
                    <Feather
                      name="check"
                      size={ms(24)}
                      color={Colors.onBackground}
                    />
                  )
                }
                onPress={handleSubmit(onEditPhone)}
              />
            }
          />
        </Box>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Box
          width={"50%"}
          borderLeftWidth={1}
          borderBottomWidth={1}
          borderColor="onBackground"
          paddingHorizontal="hxs"
          paddingVertical="vs"
          borderBottomLeftRadius="m"
        >
          <ReText variant="BodyLarge" textAlign="center">
            شيخ الطالب
          </ReText>
        </Box>
        <Box width={"50%"}>
          {sheikhName && (
            <ControlledInput
              control={control}
              noError
              defaultValue={sheikhName}
              name="sheikh"
              editable={false}
              label="شيخ الطالب"
              mode="outlined"
            />
          )}
          {allSheikhs && (
            <SelectDropdown
              data={allSheikhs}
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
                fontFamily: "CairoBold",
                fontSize: ms(14),
              }}
              defaultButtonText={studentSheikh?.name}
              defaultValue={studentSheikh?.name}
              dropdownStyle={styles.dropdown}
              rowStyle={styles.row}
              rowTextStyle={styles.rowText}
              onSelect={(item) => {
                editSheikhId(
                  {
                    sheikhId: item.id,
                    studentId: studentInfo,
                  },
                  {
                    onSuccess: () => {
                      useStore.setState({
                        snackbarText: "تم تعديل الشيخ بنجاح",
                      });
                      queryClient.invalidateQueries(["user", studentInfo]);
                    },
                  }
                );
              }}
              rowTextForSelection={(item) => item.name}
              buttonTextAfterSelection={(item) => item.name}
            />
          )}
        </Box>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Box
          width={"50%"}
          borderLeftWidth={1}
          borderBottomWidth={1}
          borderColor="onBackground"
          paddingHorizontal="hxs"
          paddingVertical="vs"
          borderBottomLeftRadius="m"
        >
          <ReText variant="BodyLarge" textAlign="center">
            هاتف الشيخ
          </ReText>
        </Box>
        <Box width={"50%"}>
          <ControlledInput
            control={control}
            noError
            editable={false}
            defaultValue={studentSheikh?.phone || "لا يوجد"}
            name="sheikhPhone"
            label="هاتف الشيخ"
            mode="outlined"
          />
        </Box>
      </Box>
    </>
  );
};

export default InfoTable;

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
    fontFamily: "CairoReg",
    fontSize: ms(14),
    textAlign: "left",
    color: Colors.onBackground,
  },
});
