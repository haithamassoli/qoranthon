import { draftGameMutation, getGamePlayersQuery } from "@apis/quizzes";
import Loading from "@components/loading";
import { Feather, Ionicons } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { hs, ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { router, useLocalSearchParams } from "expo-router";
import { FlatList, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ResultScreen = () => {
  const {
    quizId,
  }: {
    quizId: string;
  } = useLocalSearchParams();

  const { user } = useStore();
  const { data, isInitialLoading } = getGamePlayersQuery(quizId);
  const { mutate: draft } = draftGameMutation();

  const onBack = () => {
    if (user?.role === "user") {
      router.replace("/quizroom/");
    } else {
      draft(quizId, {
        onSuccess: () => router.replace("/quizroom/"),
      });
    }
  };

  if (isInitialLoading) return <Loading />;

  return (
    <Box
      flex={1}
      paddingHorizontal="hm"
      style={{
        paddingVertical: useSafeAreaInsets().top,
      }}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="vxl"
      >
        <Box flexDirection="row" alignItems="center">
          <TouchableOpacity onPress={onBack}>
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
            النتائج
          </ReText>
        </Box>
      </Box>
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
            fontFamily="Cairo-Bold"
            textAlign="center"
          >
            {data?.[2]?.playerName}
          </ReText>
          <ReText
            variant="BodyLarge"
            fontFamily="Cairo-Bold"
            textAlign="center"
          >
            {data?.[2]?.score}
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
            fontFamily="Cairo-Bold"
            textAlign="center"
          >
            {data?.[0]?.playerName}
          </ReText>
          <ReText
            variant="BodyMedium"
            fontFamily="Cairo-Bold"
            textAlign="center"
          >
            {data?.[0]?.score}
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
            fontFamily="Cairo-Bold"
            textAlign="center"
          >
            {data?.[1]?.playerName}
          </ReText>
          <ReText
            variant="BodyMedium"
            fontFamily="Cairo-Bold"
            textAlign="center"
          >
            {data?.[1]?.score}
          </ReText>
        </Box>
      </Box>
      <FlatList
        data={data}
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
                  {index + 1}. {item.playerName}
                </ReText>
                <Box
                  flexDirection="row"
                  justifyContent="center"
                  alignItems="center"
                  gap="hxs"
                >
                  <ReText variant="BodyLarge">{item.score}</ReText>
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
    </Box>
  );
};

export default ResultScreen;
