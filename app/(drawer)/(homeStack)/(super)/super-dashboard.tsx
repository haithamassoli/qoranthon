import { sendNotificationMutation } from "@apis/notifications";
import { getAdminsByManagerIdQuery } from "@apis/users";
import Loading from "@components/loading";
import Snackbar from "@components/snackbar";
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
import Animated, { FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ControlledInput from "@components/ui/controlledInput";
import CustomButton from "@components/ui/customButton";
import { Modal, Portal } from "react-native-paper";
import StudentCard from "@components/studentCard";

const SuperScreen = () => {
  const { user } = useStore();
  const navigation: any = useNavigation();
  const {
    data,
    isInitialLoading: isLoading,
    refetch,
    isFetching,
  } = getAdminsByManagerIdQuery(user?.id!);

  const [selected, setSelected] = useState<string[]>([]);
  const [selecting, setSelecting] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { mutate, isLoading: isSending } = sendNotificationMutation();

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
        snackbarText: "اختر الشيوخ المراد إرسال الإشعار لهم",
      });
    }
  };

  const onPressSheikh = (id: string, sheikhName: string, token?: string) => {
    if (selecting) {
      if (!token)
        return useStore.setState({
          snackbarText: "هذا الشيخ لم يفعل الإشعارات",
        });
      if (selected.includes(token)) {
        setSelected((prev) => prev.filter((item) => item !== token));
      } else {
        setSelected((prev) => [...prev, token]);
      }
    } else {
      router.push(`/sheikhs/${id}?sheikhName=${sheikhName}`);
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
          justifyContent="space-between"
          alignItems="center"
          height={vs(60)}
        >
          <Box flexDirection="row" alignItems="center">
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Feather name="menu" size={ms(24)} color={Colors.onBackground} />
            </TouchableOpacity>
            <ReText variant="TitleMedium" marginLeft="hs">
              أهلا
              {user?.role !== "super"
                ? ` بالشيخ ${user?.name.split(" ")[0]}`
                : " بالمدير"}
            </ReText>
          </Box>
          <Box flexDirection="row" gap="hs" alignItems="center">
            <TouchableOpacity onPress={() => router.push("/students/all")}>
              <Feather name="users" size={ms(24)} color={Colors.onBackground} />
            </TouchableOpacity>
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
              onPress={() => router.push("/sheikhs/add-sheikh")}
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
          الشيوخ
        </ReText>
        <FlatList
          contentContainerStyle={{
            paddingBottom: vs(16),
          }}
          ListEmptyComponent={() => (
            <ReText variant="TitleMedium" textAlign="center" marginTop="vm">
              لا يوجد شيوخ
            </ReText>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              colors={[Colors.primary]}
              progressBackgroundColor={Colors.background}
              tintColor={Colors.primary}
            />
          }
          ItemSeparatorComponent={() => <Box height={vs(16)} />}
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <Animated.View entering={FadeInUp.duration(600).delay(200 * index)}>
              <StudentCard
                selected={selected.includes(item.pushNotificationsToken!)}
                onPress={() =>
                  onPressSheikh(item.id, item.name, item.pushNotificationsToken)
                }
                onPressInfo={() =>
                  router.push(`/sheikhs/sheikhInfo/${item.id}`)
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

export default SuperScreen;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: Colors.background,
    paddingVertical: vs(16),
    paddingHorizontal: hs(16),
    marginHorizontal: hs(16),
    borderRadius: ms(12),
  },
});
