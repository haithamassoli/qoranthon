import {
  editNotesMutation,
  getAllAdminsQuery,
  getUserByIdQuery,
} from "@apis/users";
import InfoTable from "@components/infoTable";
import Loading from "@components/loading";
import Snackbar from "@components/snackbar";
import ControlledInput from "@components/ui/controlledInput";
import CustomButton from "@components/ui/customButton";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { useQueryClient } from "@tanstack/react-query";
import { StudentNoteSchemaType, studentNoteSchema } from "@src/types/schema";
import { ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { deleteUserMutation } from "@apis/auth";

const StudentInfo = () => {
  const {
    studentInfo,
    sheikhName,
    role,
    sheikhId,
  }: {
    studentInfo: string;
    sheikhName: string;
    role?: string;
    sheikhId?: string;
  } = useLocalSearchParams();
  const { user } = useStore();

  const { mutate: editNotes, isLoading: isEditing } = editNotesMutation();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = deleteUserMutation();
  const { data: admins, isInitialLoading: isLoadingAdmins } = getAllAdminsQuery(
    role === user?.role
  );
  const { data: admin, isInitialLoading: isLoadingAdmin } =
    getUserByIdQuery(sheikhId);

  const { data, isInitialLoading: isLoadingInfo } =
    getUserByIdQuery(studentInfo);

  const { control, handleSubmit, getValues } = useForm<StudentNoteSchemaType>({
    resolver: zodResolver(studentNoteSchema),
  });

  const onEditNote = (formData: StudentNoteSchemaType) => {
    editNotes(
      {
        studentId: studentInfo,
        notes: formData.notes,
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["user", studentInfo]);
          useStore.setState({
            snackbarText: "تم تعديل الملاحظات بنجاح",
          });
        },
      }
    );
  };

  const onDelete = () => {
    mutate(studentInfo, {
      onSuccess: () => {
        useStore.setState({
          snackbarText: "تم حذف الطالب بنجاح",
        });
        queryClient.invalidateQueries(["users"]);
        router.push("/");
      },
    });
  };

  if (
    isLoading ||
    isLoadingInfo ||
    isLoadingAdmins ||
    isLoadingAdmin ||
    isEditing
  )
    return <Loading />;

  return (
    <>
      <Snackbar />
      <Box
        flex={1}
        paddingHorizontal="hm"
        justifyContent="space-between"
        paddingBottom="vl"
        style={{
          paddingTop: useSafeAreaInsets().top,
        }}
      >
        <Box>
          <Box marginBottom="vxl">
            <Box flexDirection="row" alignItems="center">
              <TouchableOpacity onPress={() => router.back()}>
                <Feather
                  name="chevrons-right"
                  size={ms(30)}
                  color={Colors.onBackground}
                />
              </TouchableOpacity>
              <ReText
                variant="TitleLarge"
                marginLeft="hxs"
                style={{
                  width: "72%",
                }}
              >
                {data?.name}
              </ReText>
            </Box>
          </Box>

          <InfoTable
            studentInfo={studentInfo}
            memorized={data?.memorized!}
            sheikhId={data?.sheikhId!}
            studentId={data?.studentId!}
            name={data?.name!}
            phone={data?.phone!}
            sheikhName={sheikhName || admin?.name}
            allSheikhs={admins}
          />
          <Box alignItems="center" marginTop="vl">
            <ControlledInput
              control={control}
              name="notes"
              label="ملاحظات عن الطالب"
              editable={user?.role !== "user"}
              inputMode="text"
              textAlignVertical="top"
              defaultValue={data?.notes || ""}
              contentStyle={{
                height: vs(86),
              }}
              multiline
              mode="outlined"
              right={
                <TextInput.Icon
                  icon={() =>
                    getValues("notes") && (
                      <Feather
                        name="check"
                        size={ms(24)}
                        color={Colors.onBackground}
                      />
                    )
                  }
                  onPress={handleSubmit(onEditNote)}
                />
              }
            />
          </Box>
        </Box>
        {user?.role !== "user" && (
          <CustomButton
            mode="contained"
            style={{
              backgroundColor: Colors.secondary,
            }}
            title="حذف الطالب"
            onPress={onDelete}
          />
        )}
      </Box>
    </>
  );
};

export default StudentInfo;
