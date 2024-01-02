import { sendNotificationMutation } from "@apis/notifications";
import { getAllSheikhStudentsQuery } from "@apis/users";
import Loading from "@components/loading";
import StudentCard from "@components/studentCard";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { NotificationSchemaType, notificationSchema } from "@src/types/schema";
import { hs, ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Snackbar from "@components/snackbar";
import CustomButton from "@components/ui/customButton";
import ControlledInput from "@components/ui/controlledInput";
import { Modal, Portal } from "react-native-paper";

const SheikhScreen = () => {
  const {
    sheikhId,
    sheikhName,
  }: {
    sheikhId: string;
    sheikhName: string;
  } = useLocalSearchParams();

  const [selected, setSelected] = useState<string[]>([]);
  const [selecting, setSelecting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { mutate, isLoading: isSending } = sendNotificationMutation();
  const { data: students, isInitialLoading: isLoadingStudents } =
    getAllSheikhStudentsQuery(sheikhId);

  const { control, handleSubmit } = useForm<NotificationSchemaType>({
    resolver: zodResolver(notificationSchema),
  });

  const onPressBell = () => {
    if (selecting) {
      setSelecting(false);
      setSelected([]);
    } else {
      setSelecting(true);
      useStore.setState({
        snackbarText: "اختر الطلاب المراد إرسال الإشعار لهم",
      });
    }
  };

  const onPressStudent = (id: string, token?: string) => {
    if (selecting) {
      if (!token)
        return useStore.setState({
          snackbarText: "هذا الطالب لم يفعل الإشعارات",
        });
      if (selected.includes(token)) {
        setSelected((prev) => prev.filter((item) => item !== token));
      } else {
        setSelected((prev) => [...prev, token]);
      }
    } else {
      router.push(`/students/${id}`);
    }
  };

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  const onSendNotification = (data: NotificationSchemaType) => {
    mutate(
      {
        tokens: selected,
        body: data.body,
        title: data.title,
      },
      {
        onSuccess: () => {
          useStore.setState({
            snackbarText: "تم إرسال الإشعار بنجاح",
          });
          hideModal();
          setSelected([]);
          setSelecting(false);
        },
      }
    );
  };

  if (isLoadingStudents) return <Loading />;

  return (
    <>
      <Snackbar />
      <Box
        flex={1}
        paddingHorizontal="hm"
        paddingBottom="vl"
        style={{
          paddingTop: useSafeAreaInsets().top,
        }}
      >
        <Portal>
          <Modal
            visible={isModalVisible}
            onDismiss={hideModal}
            contentContainerStyle={styles.modal}
          >
            {isSending ? (
              <Box height={vs(180)}>
                <Loading />
              </Box>
            ) : (
              <>
                <ControlledInput
                  control={control}
                  name="title"
                  label="عنوان الإشعار"
                />
                <ControlledInput
                  control={control}
                  name="body"
                  label="نص الإشعار"
                />
                <CustomButton
                  title="إرسال"
                  onPress={handleSubmit(onSendNotification)}
                />
              </>
            )}
          </Modal>
        </Portal>
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          marginBottom="vxl"
        >
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
              {sheikhName}
            </ReText>
          </Box>
          <Box flexDirection="row" gap="hs" alignItems="center">
            <TouchableOpacity onPress={onPressBell}>
              <Feather
                name={selecting ? "bell-off" : "bell"}
                size={ms(24)}
                color={Colors.onBackground}
              />
            </TouchableOpacity>
            <TouchableOpacity
              // @ts-ignore
              onPress={() =>
                router.push(`/students/add-student?sheikhId=${sheikhId}`)
              }
            >
              <Feather name="plus" size={ms(24)} color={Colors.onBackground} />
            </TouchableOpacity>
          </Box>
        </Box>
        <ReText
          variant="TitleMedium"
          textAlign="center"
          marginVertical="vm"
          fontFamily="CairoBold"
        >
          الطلاب
        </ReText>
        <FlatList
          data={students}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInUp.duration(600).delay(200 * index)}>
              <StudentCard
                selected={selected.includes(item.pushNotificationsToken!)}
                onPress={() =>
                  onPressStudent(item.id, item.pushNotificationsToken)
                }
                onPressInfo={() =>
                  router.push(`/students/studentInfo/${item.id}`)
                }
                item={item}
              />
            </Animated.View>
          )}
          ListEmptyComponent={() => (
            <ReText variant="TitleMedium" textAlign="center" marginTop="vm">
              لا يوجد طلاب
            </ReText>
          )}
          ItemSeparatorComponent={() => <Box height={vs(16)} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: vs(16),
          }}
        />
        {selecting && (
          <CustomButton
            title="إرسال الإشعار"
            onPress={showModal}
            disabled={selected.length === 0}
          />
        )}
      </Box>
    </>
  );
};

export default SheikhScreen;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: Colors.background,
    paddingVertical: vs(16),
    paddingHorizontal: hs(16),
    marginHorizontal: hs(16),
    borderRadius: ms(12),
  },
});
