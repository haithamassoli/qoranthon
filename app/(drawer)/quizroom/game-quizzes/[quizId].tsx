import CustomButton from "@components/ui/customButton";
import { Feather } from "@expo/vector-icons";
import firestore from "@react-native-firebase/firestore";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { width } from "@utils/helper";
import { hs, ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { router, useLocalSearchParams } from "expo-router";
import { Fragment, useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Modal, Portal, ProgressBar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type GameQuiz = {
  id: string;
  index: number;
  correctAnswer: string;
  question: string;
  options: string[];
};

const GameQuizScreen = () => {
  const {
    quizId,
    roomTitle,
  }: {
    quizId: string;
    roomTitle: string;
  } = useLocalSearchParams();

  const ref = useRef<FlatList>(null);
  const { user } = useStore();

  const [exitModal, setExitModal] = useState(false);
  const [timer, setTimer] = useState(30);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [data, setData] = useState<GameQuiz[]>([]);

  const showExitModal = () => setExitModal(true);
  const hideExitModal = () => setExitModal(false);

  const onAnswer = async (option: string) => {
    setAnswer(option);
    await firestore()
      .collection("games")
      .doc(quizId)
      .collection("answers")
      .add({
        question: data[currentIndex].question,
        answer: option,
        score:
          option === data[currentIndex].correctAnswer
            ? firestore.FieldValue.increment(1)
            : firestore.FieldValue.increment(0),
        playerId: user?.id,
        playerName: user?.name,
        gameId: quizId,
      });
    await firestore()
      .collection("games")
      .doc(quizId)
      .collection("players")
      .where("playerId", "==", user?.id)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({
            score:
              option === data[currentIndex].correctAnswer
                ? firestore.FieldValue.increment(1)
                : firestore.FieldValue.increment(0),
          });
        });
      });
  };

  const handleNotAnswered = async () => {
    if (user?.role !== "user") {
      setShowResult(true);
    }
  };

  const onNextQus = async () => {
    setShowResult(false);
    if (currentIndex >= data!.length - 1) {
      firestore().collection("games").doc(quizId).update({
        state: "showingResult",
      });
    } else {
      firestore().collection("games").doc(quizId).update({
        state: "nextQuestion",
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prev) => prev - 1);
      } else if (timer === 0) {
        clearInterval(interval);
        handleNotAnswered();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection("games")
      .doc(quizId)
      .collection("questions")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc, index) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setData(data as GameQuiz[]);
      });

    const unsubscribe2 = firestore()
      .collection("games")
      .doc(quizId)
      .collection("answers")
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });
        setAnswers(data);

        const unsubscribe3 = firestore()
          .collection("games")
          .doc(quizId)
          .collection("players")
          .onSnapshot((snapshot2) => {
            const data2 = snapshot2.docs.map((doc2) => {
              return {
                id: doc2.id,
                ...doc2.data(),
              };
            });

            if (data2.length > 0 && data.length > 0) {
              const playersAnswered = data.filter(
                (answer) => answer?.question === data[currentIndex]?.question
              );
              if (
                playersAnswered.length === data2.length &&
                playersAnswered.length > 0
              ) {
                setTimer(0);
              }
            }
          });
      });

    const unsubscribe4 = firestore()
      .collection("games")
      .doc(quizId)
      .onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (data?.state === "nextQuestion") {
          setAnswer("");
          setTimer(30);
          setCurrentIndex((prev) => prev + 1);
          ref.current?.scrollToIndex({
            index: currentIndex + 1,
            animated: true,
          });
          snapshot.ref.update({
            state: "showingQuestion",
          });
        } else if (data?.state === "showingResult") {
          router.push(
            `/quizroom/game-quizzes/result?quizId=${quizId}&roomTitle=${roomTitle}`
          );
        }
      });
    return () => {
      unsubscribe();
      unsubscribe2();
      unsubscribe4();
    };
  }, []);

  return (
    <Box
      flex={1}
      style={{
        paddingVertical: useSafeAreaInsets().top,
      }}
    >
      <Portal>
        <Modal
          visible={exitModal}
          onDismiss={hideExitModal}
          contentContainerStyle={styles.modal}
        >
          <ReText
            variant="TitleMedium"
            paddingBottom="vm"
            fontFamily="Cairo-Regular"
            color="primary"
          >
            هل تريد الخروج؟
          </ReText>
          <Box
            flexDirection="row"
            justifyContent="flex-end"
            alignItems="center"
            gap="hs"
          >
            <CustomButton mode="text" title="لا" onPress={hideExitModal} />
            <CustomButton
              title="نعم"
              onPress={() => router.replace("/quizroom/")}
            />
          </Box>
        </Modal>
      </Portal>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: vs(46),
          right: hs(26),
          zIndex: 999,
        }}
        onPress={showExitModal}
      >
        <Feather name="x" size={ms(24)} color={Colors.primary} />
      </TouchableOpacity>
      <FlatList
        data={data}
        ref={ref}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Box
            width={width}
            justifyContent="space-between"
            paddingHorizontal="hs"
            height={"100%"}
          >
            <Box>
              <ReText
                textAlign="center"
                variant="TitleMedium"
                marginTop="vm"
                marginBottom="vm"
                fontFamily="Cairo-Bold"
              >
                السؤال {index + 1} من {data?.length.toString()}
              </ReText>
              <ReText
                textAlign="center"
                variant="TitleMedium"
                marginBottom="vxl"
                fontFamily="Cairo-Bold"
              >
                {item.question}؟
              </ReText>
              <ReText
                textAlign="center"
                variant="TitleMedium"
                marginBottom="vs"
                fontFamily="Cairo-Bold"
              >
                {timer}
              </ReText>
              <ProgressBar
                style={{
                  transform: [{ rotate: "180deg" }],
                  height: ms(8),
                  borderRadius: ms(12),
                  width: "100%",
                }}
                progress={timer / 30}
              />
            </Box>
            <Box>
              {showResult && (
                <TouchableOpacity onPress={onNextQus}>
                  <ReText
                    variant="LabelLarge"
                    textAlign="center"
                    fontFamily="Cairo-Regular"
                  >
                    {currentIndex >= data!.length - 1
                      ? "النتيجة"
                      : "السؤال التالي"}
                  </ReText>
                </TouchableOpacity>
              )}
              {item.options.map((option: string, index: number) => (
                <Fragment key={index.toString()}>
                  {option.length > 0 && (
                    <TouchableOpacity
                      key={option}
                      disabled={!!answer || user?.role !== "user"}
                      onPress={() => onAnswer(option)}
                      style={{}}
                    >
                      <Box
                        borderRadius="m"
                        backgroundColor={
                          user?.role !== "user"
                            ? option === item.correctAnswer && timer <= 0
                              ? "tertiaryContainer"
                              : "secondaryContainer"
                            : answer &&
                              option === item.correctAnswer &&
                              timer <= 0
                            ? "tertiaryContainer"
                            : answer &&
                              answer === option &&
                              answer !== item.correctAnswer &&
                              timer <= 0
                            ? "errorContainer"
                            : "secondaryContainer"
                        }
                        paddingVertical="vs"
                        borderWidth={
                          answer && answer === option ? 4 : undefined
                        }
                        borderColor={
                          answer && answer === option ? "primary" : undefined
                        }
                        marginTop="vs"
                        paddingHorizontal="vs"
                        flexDirection="row"
                        justifyContent="space-between"
                        alignItems="center"
                        gap="hxs"
                      >
                        <ReText variant="LabelLarge">{option}</ReText>
                        {showResult && (
                          <ReText variant="LabelLarge">
                            {
                              answers.filter(
                                (answer) =>
                                  answer?.answer === option &&
                                  answer?.question === item.question
                              ).length
                            }
                          </ReText>
                        )}
                      </Box>
                    </TouchableOpacity>
                  )}
                </Fragment>
              ))}
            </Box>
          </Box>
        )}
      />
    </Box>
  );
};

export default GameQuizScreen;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: Colors.background,
    paddingVertical: vs(16),
    paddingHorizontal: hs(16),
    marginHorizontal: hs(16),
    borderRadius: ms(12),
  },
});
