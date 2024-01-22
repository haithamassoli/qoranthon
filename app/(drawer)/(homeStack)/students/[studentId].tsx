import { getStudentSessionsQuery } from "@apis/sessions";
import { getUserByIdQuery } from "@apis/users";
import Loading from "@components/loading";
import SessionCard from "@components/sessionCard";
import Snackbar from "@components/snackbar";
import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { ms, vs } from "@utils/platform";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, RefreshControl, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const StudentScreen = () => {
  const {
    studentId,
  }: {
    studentId: string;
  } = useLocalSearchParams();

  const {
    data,
    isInitialLoading: isLoading,
    refetch,
    isFetching,
  } = getUserByIdQuery(studentId);
  const { data: sessions, isInitialLoading: isLoadingSessions } =
    getStudentSessionsQuery(studentId);

  if (isLoading || isLoadingSessions) return <Loading />;

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
              {data?.name}
            </ReText>
          </Box>
          <TouchableOpacity
            // @ts-ignore
            onPress={() => router.push(`/quran?studentId=${studentId}`)}
            style={{
              alignItems: "center",
            }}
          >
            <Feather name="plus" size={ms(24)} color={Colors.onBackground} />
            <ReText variant="LabelMedium">جلسة جديدة</ReText>
          </TouchableOpacity>
        </Box>
        <ReText
          variant="TitleMedium"
          textAlign="center"
          marginVertical="vm"
          fontFamily="Cairo-Bold"
        >
          الجلسات السابقة
        </ReText>
        <FlatList
          data={sessions}
          renderItem={({ item }) => (
            <SessionCard
              werd={item.werd}
              sessionRate={item.sessionRate}
              sessionType={item.sessionType}
              createdAt={item.createdAt}
              studentId={studentId}
              sessionId={item.id}
              onPress={() =>
                router.push(`/sessions/${item.id}?studentId=${studentId}`)
              }
            />
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

export default StudentScreen;
