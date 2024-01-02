import {
  getNotificationTokensQuery,
  sendNotificationMutation,
} from "@apis/notifications";
import HeaderRight from "@components/headerRight";
import Loading from "@components/loading";
import NotificationCard from "@components/notificationCard";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, ReText } from "@styles/theme";
import { NotificationSchemaType, notificationSchema } from "@src/types/schema";
import { getDataMMKV, storeDataMMKV } from "@utils/helper";
import { hs, ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import ControlledInput from "@components/ui/controlledInput";
import CustomButton from "@components/ui/customButton";
import { Modal, Portal } from "react-native-paper";
import Colors from "@styles/colors";
import Snackbar from "@components/snackbar";
import { Swipeable } from "react-native-gesture-handler";

const keyExtractor = (_: any, index: number) => index.toString();
const ItemSeparatorComponent = () => <Box height={vs(16)} />;

type NotificationProps = {
  item: {
    title: string;
    body: string;
    date: Date;
  };
  index: number;
};

const Notifications = () => {
  const { user } = useStore();
  const navigation: any = useNavigation();
  const notifications = getDataMMKV("notifications");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { data, isInitialLoading: isLoading } = getNotificationTokensQuery(
    user?.role!
  );
  const { mutate, isLoading: isSending } = sendNotificationMutation();

  const { control, handleSubmit } = useForm<NotificationSchemaType>({
    resolver: zodResolver(notificationSchema),
  });

  const onDeleteNotification = (date: Date) => {
    const newNotifications = notifications.filter(
      (item: any) => item.date !== date
    );
    storeDataMMKV("notifications", newNotifications);
    useStore.setState({
      snackbarText: "تم حذف الإشعار بنجاح",
    });
  };

  const sortedNotifications =
    notifications && notifications.sort((a: any, b: any) => b.date - a.date);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  const onSendNotification = (formData: NotificationSchemaType) => {
    mutate(
      {
        tokens: data!,
        body: formData.body,
        title: formData.title,
      },
      {
        onSuccess: () => {
          useStore.setState({
            snackbarText: "تم إرسال الإشعار بنجاح",
          });
          hideModal();
        },
      }
    );
  };

  const renderItem = ({ item, index }: NotificationProps) => (
    <>
      {index === 0 && (
        <ReText variant="BodyMedium">اسحب يسارًا لحذف الإشعار</ReText>
      )}
      <Swipeable
        activeOffsetX={[-100, 200]}
        renderRightActions={() => (
          <TouchableOpacity
            style={{
              overflow: "hidden",
              backgroundColor: Colors.error,
              width: hs(80),
              justifyContent: "center",
              alignItems: "center",
              borderRadius: ms(12),
            }}
            onPress={() => onDeleteNotification(item.date)}
          >
            <Feather name="trash-2" size={ms(24)} color={Colors.onError} />
          </TouchableOpacity>
        )}
      >
        <NotificationCard
          title={item.title}
          body={item.body}
          date={item.date}
        />
      </Swipeable>
    </>
  );

  if (isLoading) return <Loading />;

  return (
    <>
      <Snackbar />
      <Box flex={1} paddingBottom="vl">
        <Drawer.Screen
          options={{
            headerLeft: () => (
              <HeaderRight onPress={() => navigation.openDrawer()} />
            ),
            headerRight: () => (
              <>
                {user?.role === "super" && (
                  <TouchableOpacity onPress={showModal}>
                    <Feather
                      name="plus"
                      size={ms(24)}
                      style={{
                        marginRight: hs(16),
                      }}
                    />
                  </TouchableOpacity>
                )}
              </>
            ),
          }}
        />
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
        <FlatList
          contentContainerStyle={{
            paddingVertical: vs(16),
            paddingHorizontal: hs(16),
            flex: 1,
          }}
          data={sortedNotifications}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListEmptyComponent={
            <Box flex={1} justifyContent="center" alignItems="center">
              <ReText variant="DisplaySmall" textAlign="center">
                لا يوجد إشعارات حالياً
              </ReText>
              <ReText variant="BodyLarge" textAlign="center">
                تبيان
              </ReText>
            </Box>
          }
        />
      </Box>
    </>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: Colors.background,
    paddingVertical: vs(16),
    paddingHorizontal: hs(16),
    marginHorizontal: hs(16),
    borderRadius: ms(12),
  },
});
