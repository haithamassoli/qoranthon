import { TouchableOpacity, ScrollView } from "react-native";
import { Fragment, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Box, ReText } from "@styles/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ms } from "@utils/platform";
import Colors from "@styles/colors";
import { getDataMMKV, storeDataMMKV } from "@utils/helper";

const SalfahVote = () => {
  const {
    brraSalfah,
    randomSurah,
  }: {
    brraSalfah: string;
    randomSurah: string;
  } = useLocalSearchParams();
  const players = getDataMMKV("players");

  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState([{}]);

  const onSelect = (player: string) => {
    if (currentPlayer === players.length - 1) {
      storeDataMMKV("selectedPlayer", [
        ...selectedPlayer,
        {
          player: players[currentPlayer],
          score: player === brraSalfah ? 1 : 0,
        },
      ]);
      router.push(
        // @ts-ignore
        `/salfah/brra-salfah-vote?brraSalfah=${brraSalfah}&randomSurah=${randomSurah}`
      );
    } else {
      if (players[currentPlayer] !== brraSalfah) {
        setSelectedPlayer((prev) => {
          if (prev) {
            return [
              {
                player: players[currentPlayer],
                score: player === brraSalfah ? 1 : 0,
              },
            ];
          } else {
            return [
              {
                player: players[currentPlayer],
                score: player === brraSalfah ? 1 : 0,
              },
              ...prev,
            ];
          }
        });
      }
      setCurrentPlayer((prev) => prev + 1);
    }
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        paddingVertical: useSafeAreaInsets().top,
      }}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="hm"
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
            برا السالفة
          </ReText>
        </Box>
      </Box>
      <Box paddingHorizontal="hm">
        <ReText
          variant="TitleLarge"
          fontFamily="Cairo-Regular"
          marginBottom="vm"
          color="primary"
          textAlign="center"
        >
          {`${players[currentPlayer]} اختار الشخص اللي تظن أنه برا
السالفة!`}
        </ReText>
        {players.map((player: string) => (
          <Fragment key={player}>
            {player !== players[currentPlayer] && (
              <TouchableOpacity onPress={() => onSelect(player)}>
                <Box
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  paddingHorizontal="hm"
                  backgroundColor="surfaceVariant"
                  borderRadius="m"
                  paddingVertical="vm"
                  marginBottom="vm"
                >
                  <Box flexDirection="row" alignItems="center">
                    <ReText variant="TitleLarge">{player}</ReText>
                  </Box>
                  <Feather
                    name="check-circle"
                    size={ms(30)}
                    color={Colors.onBackground}
                  />
                </Box>
              </TouchableOpacity>
            )}
          </Fragment>
        ))}
      </Box>
    </ScrollView>
  );
};

export default SalfahVote;
