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
import { useStore } from "@zustand/store";
import { draftGameMutation, startGameMutation } from "@apis/quizzes";
import Loading from "@components/loading";
import Snackbar from "@components/snackbar";

const LobbyScreen = () => {
  const {
    gameId,
    roomTitle,
  }: {
    gameId: string;
    roomTitle: string;
  } = useLocalSearchParams();
  const { user } = useStore();
  const [players, setPlayers] = useState<any[]>([]);
  const [code, setCode] = useState("");
  const [state, setState] = useState<
    "showingQuestion" | "waitingForPlayers" | "draft" | "showingQuestionResults"
  >("waitingForPlayers");
  const { mutate, isLoading } = startGameMutation();
  const { mutate: draft } = draftGameMutation();

  const onBack = () => {
    draft(gameId, {
      onSuccess: () => router.back(),
    });
  };

  useEffect(() => {
    if (user?.role !== "user") {
      mutate(gameId, {
        onSuccess: (shortCode) => {
          setCode(shortCode);
        },
      });
    }
  }, []);

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
      router.push(`/quizroom/game-quizzes/${gameId}?roomTitle=${roomTitle}`);
    }
  }, [state]);

  const onStart = () => {
    if (players.length < 1) {
      return useStore.setState({
        snackbarText: "يجب أن يكون هناك لاعبين اثنين على الأقل",
      });
    }
    firestore().collection("games").doc(gameId).update({
      state: "showingQuestion",
    });
  };

  if (isLoading) return <Loading />;

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <Snackbar />
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
            <ReText variant="TitleLarge">{roomTitle}</ReText>
          </Box>
        </Box>
        <ReText
          variant="TitleMedium"
          textAlign="center"
          fontFamily="Cairo-Bold"
        >
          رمز الغرفة: {code}
        </ReText>
        <ReText variant="TitleMedium" textAlign="center">
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
        </Box>
        {user?.role !== "user" && (
          <CustomButton
            style={{ marginTop: vs(68) }}
            title="ابدأ الغرفة"
            onPress={onStart}
          />
        )}
      </Box>
    </ScrollView>
  );
};

export default LobbyScreen;
