import { getUsersLeaderboardQuery } from "@apis/leaderboard";
import HeaderRight from "@components/headerRight";
import Loading from "@components/loading";
import { Ionicons } from "@expo/vector-icons";
import { Box, ReText } from "@styles/theme";
import { hs, ms, vs } from "@utils/platform";
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
      return acc.sort((a, b) => b.points - a.points);
    },
    [] as {
      id: string;
      name: string;
      points: number;
    }[]
  );

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
      <Box height={vs(36)} />
      <Box
        flexDirection="row"
        paddingHorizontal="hs"
        alignItems="flex-end"
        marginTop="v2xl"
      >
        <Box
          width={"33%"}
          height={vs(62)}
          justifyContent="center"
          style={{
            backgroundColor: "#CC8F32",
          }}
        >
          <Ionicons
            name="trophy-outline"
            style={{
              position: "absolute",
              top: vs(-42),
              left: "32%",
            }}
            size={ms(42)}
            color="#CC8F32"
          />
          <ReText
            variant="TitleSmall"
            fontFamily="CairoBold"
            textAlign="center"
          >
            {mergedData?.[2]?.name}
          </ReText>
          <ReText variant="BodyLarge" fontFamily="CairoBold" textAlign="center">
            {mergedData?.[2]?.points}
          </ReText>
        </Box>
        <Box
          width={"33%"}
          height={vs(132)}
          justifyContent="center"
          style={{
            backgroundColor: "#FFD700",
          }}
        >
          <Ionicons
            name="trophy-outline"
            style={{
              position: "absolute",
              top: vs(-42),
              left: "32%",
            }}
            size={ms(42)}
            color="#FFD700"
          />
          <ReText
            variant="TitleSmall"
            fontFamily="CairoBold"
            textAlign="center"
          >
            {mergedData?.[0]?.name}
          </ReText>
          <ReText
            variant="BodyMedium"
            fontFamily="CairoBold"
            textAlign="center"
          >
            {mergedData?.[0]?.points}
          </ReText>
        </Box>
        <Box
          width={"33%"}
          height={vs(88)}
          justifyContent="center"
          style={{
            backgroundColor: "#C0C0C0",
          }}
        >
          <Ionicons
            name="trophy-outline"
            style={{
              position: "absolute",
              top: vs(-42),
              left: "32%",
            }}
            size={ms(42)}
            color="#C0C0C0"
          />
          <ReText
            variant="TitleSmall"
            fontFamily="CairoBold"
            textAlign="center"
          >
            {mergedData?.[1]?.name}
          </ReText>
          <ReText
            variant="BodyMedium"
            fontFamily="CairoBold"
            textAlign="center"
          >
            {mergedData?.[1]?.points}
          </ReText>
        </Box>
      </Box>
      <FlatList
        data={mergedData}
        contentContainerStyle={{
          paddingHorizontal: hs(16),
        }}
        renderItem={({ item, index }) => (
          <>
            {![0, 1, 2].includes(index) && (
              <Box
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: vs(10),
                }}
              >
                <ReText variant="BodyLarge">
                  {index + 1}. {item.name}
                </ReText>
                <Box
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap="hxs"
                >
                  <ReText variant="BodyLarge">{item.points}</ReText>
                  <Ionicons name="trophy-outline" size={ms(16)} color="black" />
                </Box>
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
