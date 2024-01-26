import { Box, ReText } from "@styles/theme";
import { router, useLocalSearchParams } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@styles/colors";
import { ms, vs } from "@utils/platform";
import { Feather } from "@expo/vector-icons";
import CustomButton from "@components/ui/customButton";

const LobbyScreen = () => {
  const {
    gameId,
    roomTitle,
  }: {
    gameId: string;
    roomTitle: string;
  } = useLocalSearchParams();
  const [players, setPlayers] = useState<any[]>([]);
  const [state, setState] = useState<
    "showingQuestion" | "waitingForPlayers" | "draft" | "showingQuestionResults"
  >("waitingForPlayers");

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("games")
      .doc(gameId)
      .collection("players")
      .onSnapshot((snapshot) => {
        const players = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setPlayers(players);
      });
    const unsubscribe2 = firestore()
      .collection("games")
      .doc(gameId)
      .onSnapshot((snapshot) => {
        const data = snapshot.data();
        setState(data?.state);
      });

    return () => {
      unsubscribe();
      unsubscribe2();
    };
  }, []);

  useEffect(() => {
    if (state === "showingQuestion") {
      router.push(`/quizroom/game-quizzes/${gameId}`);
    }
  }, [state]);

  const onStart = () => {
    firestore().collection("games").doc(gameId).update({
      state: "showingQuestion",
    });
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
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
            <ReText variant="TitleLarge">{roomTitle}</ReText>
          </Box>
        </Box>
        <ReText
          variant="TitleMedium"
          textAlign="center"
          fontFamily="Cairo-Regular"
        >
          في انتظار انضمام اللاعبين...
        </ReText>
        <Box
          flexDirection="row"
          gap="hm"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          marginTop="vl"
        >
          {players.map((player) => (
            <Box key={player.id} marginTop="vm">
              <ReText variant="BodyLarge" color="primary">
                {player.playerName}
              </ReText>
            </Box>
          ))}

          <ReText variant="BodyLarge" color="primary">
            خالد العمري
          </ReText>
          <ReText variant="BodyLarge" color="primary">
            محمد العنزي
          </ReText>
          <ReText variant="BodyLarge" color="primary">
            فهد القحطاني
          </ReText>
          <ReText variant="BodyLarge" color="primary">
            سعد العتيبي
          </ReText>
        </Box>
        <CustomButton
          style={{ marginTop: vs(68) }}
          title="ابدأ الغرفة"
          onPress={onStart}
        />
      </Box>
    </ScrollView>
  );
};

export default LobbyScreen;
