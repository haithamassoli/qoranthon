import HeaderRight from "@components/headerRight";
import NotificationCard from "@components/notificationCard";
import Snackbar from "@components/snackbar";
import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { getDataMMKV, storeDataMMKV } from "@utils/helper";
import { hs, ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { FlatList, TouchableOpacity } from "react-native";
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
  const navigation: any = useNavigation();
  const notifications = getDataMMKV("notifications");

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

  return (
    <>
      <Snackbar />
      <Box flex={1} paddingBottom="vl">
        <Drawer.Screen
          options={{
            headerLeft: () => (
              <HeaderRight onPress={() => navigation.openDrawer()} />
            ),
          }}
        />
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
                مجالس
              </ReText>
            </Box>
          }
        />
      </Box>
    </>
  );
};

export default Notifications;
