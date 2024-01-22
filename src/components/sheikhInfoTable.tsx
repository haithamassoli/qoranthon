import { Box, ReText } from "@styles/theme";
import ControlledInput from "./ui/controlledInput";
import Colors from "@styles/colors";
import { ms } from "@utils/platform";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "react-native-paper";
import { Feather } from "@expo/vector-icons";
import { editNameMutation, editPhoneMutation } from "@apis/users";
import { useStore } from "@zustand/store";
import Loading from "./loading";
import {
  EditStudentValidationSchemaType,
  editStudentValidationSchema,
} from "@src/types/schema";
import { useQueryClient } from "@tanstack/react-query";
import { editEmailMutation, editPasswordMutation } from "@apis/auth";

type InfoTableProps = {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
};

const SheikhInfoTable = ({
  name,
  phone,
  id,
  email,
  password,
}: InfoTableProps) => {
  const { control, handleSubmit, getValues } =
    useForm<EditStudentValidationSchemaType>({
      resolver: zodResolver(editStudentValidationSchema),
    });
  const { user } = useStore();
  const queryClient = useQueryClient();

  const { mutate: editName, isLoading: isEditNameLoading } = editNameMutation();
  const { mutate: editEmail, isLoading: isEditEmailLoading } =
    editEmailMutation();
  const { mutate: editPassword, isLoading: isEditPasswordLoading } =
    editPasswordMutation();
  const { mutate: editPhone, isLoading: isEditPhoneLoading } =
    editPhoneMutation();

  const onEditName = (formData: EditStudentValidationSchemaType) => {
    editName(
      {
        studentId: id,
        name: formData.name || name,
      },
      {
        onSuccess: () => {
          useStore.setState({
            snackbarText: "تم تعديل الاسم بنجاح",
          });
          queryClient.invalidateQueries(["user", id]);
        },
      }
    );
  };

  const onEditPhone = (formData: EditStudentValidationSchemaType) => {
    editPhone(
      {
        studentId: id,
        phone: formData.phone || "",
      },
      {
        onSuccess: () => {
          useStore.setState({
            snackbarText: "تم تعديل رقم الهاتف بنجاح",
          });
          queryClient.invalidateQueries(["user", id]);
        },
      }
    );
  };

  const onEditEmail = (formData: EditStudentValidationSchemaType) => {
    editEmail(
      {
        id,
        email: formData.email || "",
      },
      {
        onSuccess: () => {
          useStore.setState({
            snackbarText: "تم تعديل البريد الالكتروني بنجاح",
          });
          queryClient.invalidateQueries(["user", id]);
        },
      }
    );
  };
  const onEditPassword = (formData: EditStudentValidationSchemaType) => {
    editPassword(
      {
        id,
        password: formData.password || "",
      },
      {
        onSuccess: () => {
          useStore.setState({
            snackbarText: "تم تعديل كلمة المرور بنجاح",
          });
          queryClient.invalidateQueries(["user", id]);
        },
      }
    );
  };

  if (
    isEditNameLoading ||
    isEditPhoneLoading ||
    isEditEmailLoading ||
    isEditPasswordLoading
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
          fontFamily="Cairo-Bold"
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
            البريد الالكتروني
          </ReText>
        </Box>
        <Box width={"50%"}>
          <ControlledInput
            control={control}
            noError
            editable={user?.role !== "user"}
            defaultValue={email}
            name="email"
            label="البريد الالكتروني"
            mode="outlined"
            right={
              <TextInput.Icon
                icon={() =>
                  getValues("email") && (
                    <Feather
                      name="check"
                      size={ms(24)}
                      color={Colors.onBackground}
                    />
                  )
                }
                onPress={handleSubmit(onEditEmail)}
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
            كلمة المرور
          </ReText>
        </Box>
        <Box width={"50%"}>
          <ControlledInput
            control={control}
            noError
            editable={user?.role !== "user"}
            defaultValue={password}
            name="password"
            label="كلمة المرور"
            mode="outlined"
            right={
              <TextInput.Icon
                icon={() =>
                  getValues("password") && (
                    <Feather
                      name="check"
                      size={ms(24)}
                      color={Colors.onBackground}
                    />
                  )
                }
                onPress={handleSubmit(onEditPassword)}
              />
            }
          />
        </Box>
      </Box>
    </>
  );
};

export default SheikhInfoTable;
