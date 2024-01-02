import { getStudentSessionsQuery } from "@apis/sessions";
import Loading from "@components/loading";
import SessionCard from "@components/sessionCard";
import Snackbar from "@components/snackbar";
import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { router, useNavigation } from "expo-router";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const UserScreen = () => {
  const { user } = useStore();
  const navigation: any = useNavigation();

  const {
    data: sessions,
    isInitialLoading: isLoading,
    refetch,
    isFetching,
  } = getStudentSessionsQuery(user?.id!);
  if (isLoading) return <Loading />;

  return (
    <>
      <Snackbar />
      <Box
        flex={1}
        paddingHorizontal="hm"
        style={{
          paddingTop: useSafeAreaInsets().top,
        }}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
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
          <TouchableOpacity
            onPress={() =>
              router.push(
                `/students/studentInfo/${user?.id!}?sheikhId=${user?.sheikhId!}`
              )
            }
          >
            <Feather name="info" size={ms(24)} color={Colors.onBackground} />
          </TouchableOpacity>
        </Box>
        <ReText
          variant="TitleLarge"
          textAlign="center"
          marginTop="vm"
          marginBottom="v2xl"
        >
          الجلسات السابقة
        </ReText>
        <FlatList
          data={sessions}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              colors={[Colors.primary]}
              progressBackgroundColor={Colors.background}
              tintColor={Colors.primary}
            />
          }
          renderItem={({ item }) => (
            <SessionCard
              werd={item.werd}
              sessionId={item.id}
              studentId={user?.id!}
              sessionRate={item.sessionRate}
              sessionType={item.sessionType}
              createdAt={item.createdAt}
              onPress={() =>
                router.push(`/sessions/${item.id}?studentId=${user?.id!}`)
              }
            />
          )}
          ListEmptyComponent={() => (
            <ReText variant="TitleMedium" textAlign="center" marginTop="vm">
              لا يوجد جلسات سابقة
            </ReText>
          )}
          ItemSeparatorComponent={() => <Box height={vs(16)} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingBottom: vs(16),
          }}
        />
      </Box>
    </>
  );
};

export default UserScreen;
