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
import { hs, ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { router, useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { ScrollView, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { deleteUserMutation } from "@apis/auth";
import { Image } from "expo-image";

const StudentInfo = () => {
  const {
    studentInfo,
    sheikhName,
    sheikhPhone,
    role,
    sheikhId,
  }: {
    studentInfo: string;
    sheikhName: string;
    sheikhPhone: string;
    role?: string;
    sheikhId?: string;
  } = useLocalSearchParams();
  const { user } = useStore();

  const { mutate: editNotes, isLoading: isEditing } = editNotesMutation();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = deleteUserMutation();
  const { data: admins, isInitialLoading: isLoadingAdmins } = getAllAdminsQuery(
    user?.id!,
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
      <ScrollView
        style={{
          flexGrow: 1,
          marginHorizontal: hs(16),
          marginTop: useSafeAreaInsets().top,
        }}
      >
        <Box flexDirection="row" marginBottom="vxl" alignItems="center">
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
            lineHeight={ms(36)}
            style={{
              width: "72%",
            }}
          >
            {data?.name}
          </ReText>
        </Box>
        <InfoTable
          studentInfo={studentInfo}
          memorized={data?.memorized!}
          sheikhId={data?.sheikhId!}
          studentId={data?.studentId!}
          name={data?.name!}
          phone={data?.phone!}
          sheikhName={sheikhName || admin?.name}
          sheikhPhone={sheikhPhone || admin?.phone}
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
        <ReText variant="TitleMedium">الإنجازات</ReText>
        <Box
          flexDirection="row"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="center"
          gap="hm"
          marginBottom="vxl"
        >
          <Box alignItems="center">
            <Image
              source={images[0].image}
              style={{
                width: ms(100),
                height: ms(100),
                marginBottom: vs(16),
              }}
              tintColor={data?.sessionsCount! > 0 ? undefined : "gray"}
              contentFit="contain"
              transition={400}
            />
            <ReText variant="LabelMedium" textAlign="center">
              {images[0].title}
            </ReText>
          </Box>
          <Box alignItems="center">
            <Image
              source={images[1].image}
              style={{
                width: ms(100),
                height: ms(100),
                marginBottom: vs(16),
              }}
              tintColor={data?.sessionsCount! >= 7 ? undefined : "gray"}
              contentFit="contain"
              transition={400}
            />
            <ReText variant="LabelMedium" textAlign="center">
              {images[1].title}
            </ReText>
          </Box>
          <Box alignItems="center">
            <Image
              source={images[2].image}
              style={{
                width: ms(100),
                height: ms(100),
                marginBottom: vs(16),
              }}
              tintColor={data?.sessionsCount! >= 30 ? undefined : "gray"}
              contentFit="contain"
              transition={400}
            />
            <ReText variant="LabelMedium" textAlign="center">
              {images[2].title}
            </ReText>
          </Box>
          <Box alignItems="center">
            <Image
              source={images[3].image}
              style={{
                width: ms(100),
                height: ms(100),
                marginBottom: vs(16),
              }}
              tintColor={data?.quizzesCount! > 0 ? undefined : "gray"}
              contentFit="contain"
              transition={400}
            />
            <ReText variant="LabelMedium" textAlign="center">
              {images[3].title}
            </ReText>
          </Box>
          <Box alignItems="center">
            <Image
              source={images[4].image}
              style={{
                width: ms(100),
                height: ms(100),
                marginBottom: vs(16),
              }}
              tintColor={data?.quizzesCount! >= 10 ? undefined : "gray"}
              contentFit="contain"
              transition={400}
            />
            <ReText variant="LabelMedium" textAlign="center">
              {images[4].title}
            </ReText>
          </Box>
          <Box alignItems="center">
            <Image
              source={images[5].image}
              style={{
                width: ms(100),
                height: ms(100),
                marginBottom: vs(16),
              }}
              tintColor={data?.quizzesCount! >= 50 ? undefined : "gray"}
              contentFit="contain"
              transition={400}
            />
            <ReText variant="LabelMedium" textAlign="center">
              {images[5].title}
            </ReText>
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
        <Box height={vs(16)} />
      </ScrollView>
    </>
  );
};

export default StudentInfo;

const images = [
  { image: require("@assets/images/1sessions.png"), title: "سمٍّع مرة" },
  {
    image: require("@assets/images/7sessions.png"),
    title: "سمٍّع 7 مرات",
  },
  { image: require("@assets/images/30sessions.png"), title: "سمٍّع 30 مرة" },
  { image: require("@assets/images/quiz.png"), title: "اختبر مرة" },
  { image: require("@assets/images/10quiz.png"), title: "اختبر 10 مرات" },
  { image: require("@assets/images/50quiz.png"), title: "اختبر 50 مرة" },
];
