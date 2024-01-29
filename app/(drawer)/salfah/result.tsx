import { Feather, Ionicons } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { getDataMMKV } from "@utils/helper";
import { hs, ms, vs } from "@utils/platform";
import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SalfahResultScreen = () => {
  const {
    barraScore,
    brraSalfah,
  }: {
    barraScore: string;
    brraSalfah: string;
  } = useLocalSearchParams();

  const selectedPlayer = getDataMMKV("selectedPlayer");
  const [players, setPlayers] = useState<any[]>([]);

  const sortHighScore = () => {
    //  merge selectedPlayer and brraSalfah to data without duplicate

    const selectedPlayerWithDuplicate = [
      ...selectedPlayer,
      {
        player: brraSalfah,
        score: +barraScore,
      },
    ];

    return selectedPlayerWithDuplicate.sort((a, b) => {
      return b.score - a.score;
    });
  };

  useEffect(() => {
    setPlayers(sortHighScore());
  }, []);

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
            {players?.[2]?.player}
          </ReText>
          <ReText
            variant="BodyLarge"
            fontFamily="Cairo-Bold"
            textAlign="center"
          >
            {players?.[2]?.score}
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
            {players?.[0]?.player}
          </ReText>
          <ReText
            variant="BodyMedium"
            fontFamily="Cairo-Bold"
            textAlign="center"
          >
            {players?.[0]?.score}
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
            {players?.[1]?.player}
          </ReText>
          <ReText
            variant="BodyMedium"
            fontFamily="Cairo-Bold"
            textAlign="center"
          >
            {players?.[1]?.score}
          </ReText>
        </Box>
      </Box>
      <FlatList
        data={players}
        contentContainerStyle={{
          paddingHorizontal: hs(16),
        }}
        renderItem={({ item, index }) => (
          <Fragment key={item.player}>
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
                  {index + 1}. {item.player}
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
          </Fragment>
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

export default SalfahResultScreen;
