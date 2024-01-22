import { getAllSheikhStudentsQuery } from "@apis/users";
import Loading from "@components/loading";
import Snackbar from "@components/snackbar";
import StudentCard from "@components/studentCard";
import ControlledInput from "@components/ui/controlledInput";
import CustomButton from "@components/ui/customButton";
import { Feather, Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { NotificationSchemaType, notificationSchema } from "@src/types/schema";
import { hs, ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { router, useNavigation } from "expo-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { sendNotificationMutation } from "@apis/notifications";

const ListEmptyComponent = () => (
  <ReText variant="TitleMedium" textAlign="center" marginTop="vm">
    لا يوجد طلاب
  </ReText>
);

const ItemSeparatorComponent = () => <Box height={vs(16)} />;

const AdminScreen = () => {
  const { user } = useStore();
  const navigation: any = useNavigation();
  const [selected, setSelected] = useState<string[]>([]);
  const [selecting, setSelecting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    data,
    isInitialLoading: isLoading,
    isFetching,
    refetch,
  } = getAllSheikhStudentsQuery(user?.id!);
  const { mutate, isLoading: isSending } = sendNotificationMutation();

  const { control, handleSubmit, setFocus } = useForm<NotificationSchemaType>({
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

  const onSelectAll = () => {
    if (selected.length === data?.length) {
      setSelected([]);
    } else {
      const arr = data
        ?.map((item) => item.pushNotificationsToken)
        .filter((item) => item);

      if (arr?.length !== data?.length) {
        useStore.setState({
          snackbarText: "هناك طلاب لم يفعلوا الإشعارات",
        });
      }
      setSelected(arr);
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

  if (isLoading) return <Loading />;

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
                  onSubmitEditing={() => setFocus("body")}
                />
                <ControlledInput
                  control={control}
                  name="body"
                  label="نص الإشعار"
                  onSubmitEditing={handleSubmit(onSendNotification)}
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
          justifyContent="space-between"
          alignItems="center"
          height={vs(60)}
        >
          <Box flexDirection="row" alignItems="center">
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Feather name="menu" size={ms(24)} color={Colors.onBackground} />
            </TouchableOpacity>
            <ReText variant="TitleMedium" marginLeft="hs">
              أهلا بالشيخ {user?.name.split(" ")[0]}
            </ReText>
          </Box>
          <Box flexDirection="row" gap="hs" alignItems="center">
            {selecting && (
              <TouchableOpacity onPress={onSelectAll}>
                <Ionicons
                  name="checkmark-done"
                  size={ms(24)}
                  color={Colors.onBackground}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onPressBell}>
              <Feather
                name={selecting ? "bell-off" : "bell"}
                size={ms(24)}
                color={Colors.onBackground}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/students/add-student")}
            >
              <Feather name="plus" size={ms(24)} color={Colors.onBackground} />
            </TouchableOpacity>
          </Box>
        </Box>
        <ReText
          variant="TitleLarge"
          textAlign="center"
          marginTop="vm"
          marginBottom="v2xl"
        >
          الطلاب
        </ReText>
        <FlatList
          contentContainerStyle={{
            paddingBottom: vs(16),
          }}
          data={data}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              colors={[Colors.primary]}
              // size={"large"}
              progressBackgroundColor={Colors.background}
              tintColor={Colors.primary}
            />
          }
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListEmptyComponent={ListEmptyComponent}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInUp.duration(600).delay(200 * index)}>
              <StudentCard
                selected={selected.includes(item.pushNotificationsToken!)}
                onPress={() =>
                  onPressStudent(item.id, item.pushNotificationsToken)
                }
                onPressInfo={() =>
                  router.push(
                    `/students/studentInfo/${item.id}?sheikhName=${user?.name}&sheikhPhone=${user?.phone}`
                  )
                }
                item={item}
              />
            </Animated.View>
          )}
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

export default AdminScreen;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: Colors.background,
    paddingVertical: vs(16),
    paddingHorizontal: hs(16),
    marginHorizontal: hs(16),
    borderRadius: ms(12),
  },
});
