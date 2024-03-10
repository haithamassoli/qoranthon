import { router, useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import HeaderRight from "@components/headerRight";
import { deleteRequestMutation, getRequestsQuery } from "@apis/auth";
import Loading from "@components/loading";
import { Box, ReText } from "@styles/theme";
import { FlatList, TouchableOpacity } from "react-native";
import { hs, ms, vs } from "@utils/platform";
import Colors from "@styles/colors";
import { Swipeable } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { useStore } from "@zustand/store";
import Snackbar from "@components/snackbar";
import RequestCard from "@components/requestCard";
import { useQueryClient } from "@tanstack/react-query";

const ItemSeparatorComponent = () => <Box height={vs(16)} />;

type NotificationProps = {
  item: {
    id: string;
    telegram: string;
    name: string;
    createdAt: Date;
    sex: "ذكر" | "أنثى";
  };
  index: number;
};

const RegistrationRequestsScreen = () => {
  const navigation: any = useNavigation();
  const { data, isInitialLoading } = getRequestsQuery();
  const { mutate, isLoading } = deleteRequestMutation();
  const queryClient = useQueryClient();

  const onDelete = (id: string) => {
    mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["requests"]);
        useStore.setState({ snackbarText: "تم حذف الطلب بنجاح" });
      },
    });
  };

  const renderItem = ({ item, index }: NotificationProps) => (
    <>
      {index === 0 && (
        <>
          <ReText variant="BodyMedium">اضعط على الطلب لإضافة الطالب</ReText>
          <ReText variant="BodyMedium" marginBottom="vs">
            اسحب يسارًا لحذف الطلب
          </ReText>
        </>
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
            onPress={() => onDelete(item.id)}
          >
            <Feather name="trash-2" size={ms(24)} color={Colors.onError} />
          </TouchableOpacity>
        )}
      >
        <RequestCard
          onPress={() => router.push(`/modal?name=${item.name}&id=${item.id}`)}
          name={item.name}
          telegram={item.telegram}
          createdAt={item.createdAt}
          sex={item.sex}
        />
      </Swipeable>
    </>
  );

  if (isInitialLoading || isLoading) return <Loading />;

  return (
    <>
      <Snackbar />
      <Drawer.Screen
        options={{
          headerLeft: () => (
            <HeaderRight onPress={() => navigation.openDrawer()} />
          ),
        }}
      />
      <Box flex={1} paddingBottom="vl">
        <FlatList
          contentContainerStyle={{
            paddingVertical: vs(16),
            paddingHorizontal: hs(16),
            flex: 1,
          }}
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ItemSeparatorComponent}
          ListEmptyComponent={
            <Box flex={1} justifyContent="center" alignItems="center">
              <ReText variant="DisplaySmall" textAlign="center">
                لا يوجد طلبات تسجيل حالياً
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

export default RegistrationRequestsScreen;
