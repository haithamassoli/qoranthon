import { getUsersLeaderboardQuery } from "@apis/leaderboard";
import HeaderRight from "@components/headerRight";
import Loading from "@components/loading";
import { Ionicons } from "@expo/vector-icons";
import { Box, ReText } from "@styles/theme";
import { ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { FlatList } from "react-native";

const Leaderboard = () => {
  const navigation: any = useNavigation();
  const { user } = useStore();
  const { data, isInitialLoading } = getUsersLeaderboardQuery(
    user?.managerId || user?.id!
  );

  const mergedData = data?.reduce(
    (acc, item) => {
      const existingItem = acc.find((i) => i.name === item.name);
      if (existingItem) {
        existingItem.points += item.points;
      } else {
        acc.push(item);
      }
      return acc;
    },
    [] as {
      id: string;
      name: string;
      points: number;
    }[]
  );

  console.log(mergedData);

  if (isInitialLoading) return <Loading />;

  return (
    <>
      <Drawer.Screen
        options={{
          headerLeft: () => (
            <HeaderRight onPress={() => navigation.openDrawer()} />
          ),
        }}
      />
      <Box
        flexDirection="row"
        paddingHorizontal="hl"
        alignItems="flex-end"
        marginTop="vxl"
      >
        <Box
          width={"33%"}
          height={vs(62)}
          style={{
            backgroundColor: "#CD7F32",
          }}
        >
          <ReText variant="TitleSmall" textAlign="center">
            {fakeData?.[2]?.name}
          </ReText>
        </Box>
        <Box
          width={"33%"}
          height={vs(132)}
          style={{
            backgroundColor: "#FFD700",
          }}
        >
          <ReText variant="TitleSmall" textAlign="center">
            {fakeData?.[0]?.name}
          </ReText>
        </Box>
        <Box
          width={"33%"}
          height={vs(88)}
          style={{
            backgroundColor: "#C0C0C0",
          }}
        >
          <ReText variant="TitleSmall" textAlign="center">
            {fakeData?.[1]?.name}
          </ReText>
        </Box>
      </Box>
      <FlatList
        data={fakeData}
        renderItem={({ item, index }) => (
          <>
            {![0, 1, 2].includes(index) && (
              <Box
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: vs(10),
                  paddingHorizontal: vs(15),
                }}
              >
                <ReText variant="BodyMedium">
                  {index + 1}. {item.name}
                </ReText>
                <ReText variant="BodyMedium">
                  <Ionicons name="trophy-outline" size={ms(14)} color="black" />
                  {item.points}
                </ReText>
              </Box>
            )}
          </>
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <ReText variant="BodyMedium" textAlign="center" marginTop="vm">
            لا يوجد طلاب
          </ReText>
        }
      />
    </>
  );
};

export default Leaderboard;

const fakeData = [
  {
    createdAt: "2024-01-01T21:00:00.622Z",
    id: "sXF5XMpCTBGRvsssssZiBIN7K",
    name: "عبيدة",
    points: 10,
  },
  {
    createdAt: "2024-01-04T21:00:00.845Z",
    id: "m1cgPoWqynasdabXnRl20Uz4",
    name: "إبراهيم الخطيب ",
    points: 53,
  },
  {
    createdAt: "2024-01-01T21:00:00.622Z",
    id: "sXF5XMpCTBfdGRvZiBIN7K",
    name: " 1عبيدة",
    points: 10,
  },
  {
    createdAt: "2024-01-04T21:00:00.845Z",
    id: "m1cgPodsWqynbXnRl20Uz4",
    name: "إبراهيم الخsssطيب ",
    points: 53,
  },
  {
    createdAt: "2024-01-01T21:00:00.622Z",
    id: "sXF5XMpCaaTBGRvZiBIN7K",
    name: "عبssيدة",
    points: 10,
  },
  {
    createdAt: "2024-01-04T21:00:00.845Z",
    id: "m1cgPoWqynbXnRla20Uz4",
    name: "إبراهيم ssالخطيب ",
    points: 53,
  },
  {
    createdAt: "2024-01-01T21:00:00.622Z",
    id: "sXF5XMpCTBGRvZiBIsN7K",
    name: "عبيsدة",
    points: 10,
  },
  {
    createdAt: "2024-01-04T21:00:00.845Z",
    id: "m1cgPoWqynbXnRl20Usadz4",
    name: "إبراهيم sالخطيب ",
    points: 53,
  },
];
