import { getQuizByIdQuery } from "@apis/quizzes";
import Loading from "@components/loading";
import CustomButton from "@components/ui/customButton";
import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { wait, width } from "@utils/helper";
import { hs, ms, vs } from "@utils/platform";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, Share, StyleSheet, TouchableOpacity } from "react-native";
import { Modal, Portal, ProgressBar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const QuizScreen = () => {
  const {
    quizId,
    quizTitle,
  }: {
    quizId: string;
    quizTitle: string;
  } = useLocalSearchParams();

  const ref = useRef<FlatList>(null);
  const { data, isInitialLoading } = getQuizByIdQuery(quizId);

  const [visible, setVisible] = useState(false);
  const [exitModal, setExitModal] = useState(false);
  const [timer, setTimer] = useState(30);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const showExitModal = () => setExitModal(true);
  const hideExitModal = () => setExitModal(false);

  const onShare = () => {
    Share.share({
      message: `نتائج اختبار تطبيق مجالس
الاختبار: ${quizTitle}
المعدل: ${((correct / data!?.length) * 100).toFixed(1)}%
عدد الأسئلة: ${data?.length}
عدد الأخطاء: ${wrong}`,
    }).then((res) => {
      if (res.action === "sharedAction") {
        router.back();
      }
    });
  };

  const onAnswer = async (option: string) => {
    setAnswer(option);
    await wait(2000);
    if (option === data?.[currentIndex].correctAnswer) {
      setCorrect((prev) => prev + 1);
    } else {
      setWrong((prev) => prev + 1);
    }
    if (currentIndex === data!.length - 1) {
      showModal();
    } else {
      setAnswer("");
      setTimer(30);
      setCurrentIndex((prev) => prev + 1);
      ref.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const handleNotAnswered = async () => {
    await wait(2000);
    setWrong((prev) => prev + 1);
    if (currentIndex >= data!.length - 1) {
      showModal();
    } else {
      setAnswer("");
      setTimer(30);
      setCurrentIndex((prev) => prev + 1);
      ref.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0 && answer.length === 0) {
        setTimer((prev) => prev - 1);
      } else if (timer === 0 && answer.length === 0) {
        clearInterval(interval);
        setAnswer("not answered");
        handleNotAnswered();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  if (isInitialLoading) return <Loading />;

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
            <CustomButton title="نعم" onPress={() => router.back()} />
          </Box>
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <ReText
              variant="TitleLarge"
              fontFamily="Cairo-Regular"
              color="primary"
            >
              {wrong > correct ? "حاول مرة أخرى 😔" : "أحسنت. تهانينا 🎉"}
            </ReText>
            <ReText
              variant="TitleLarge"
              fontFamily="Cairo-Regular"
              color="primary"
            >
              {((correct / data!?.length) * 100).toFixed(1)}%
            </ReText>
          </Box>
          <ReText variant="TitleLarge" marginTop="vl" color="tertiary">
            نتائج اختبارك في:
          </ReText>
          <ReText variant="LabelMedium">{quizTitle}</ReText>
          <ReText marginTop="vm" variant="LabelMedium">
            عدد الأسئلة: {data?.length}
          </ReText>
          <ReText variant="LabelMedium">عدد الأخطاء: {wrong}</ReText>
          {/* <ReText variant="LabelMedium">الوقت المستغرق: {sec} ثانية</ReText> */}
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-end"
            gap="hs"
            marginTop="vl"
          >
            <CustomButton
              title="خروج"
              mode="outlined"
              onPress={() => router.back()}
            />
            <CustomButton title="شارك" onPress={onShare} />
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
              {item.options.map((option: string) => (
                <TouchableOpacity
                  key={option}
                  disabled={!!answer}
                  onPress={() => onAnswer(option)}
                  style={{}}
                >
                  <Box
                    borderRadius="m"
                    backgroundColor={
                      answer && option === item.correctAnswer
                        ? "tertiaryContainer"
                        : answer &&
                          answer === option &&
                          answer !== item.correctAnswer
                        ? "errorContainer"
                        : "secondaryContainer"
                    }
                    paddingVertical="vs"
                    marginTop="vs"
                    paddingHorizontal="vs"
                  >
                    <ReText variant="LabelLarge">{option}</ReText>
                  </Box>
                </TouchableOpacity>
              ))}
            </Box>
          </Box>
        )}
      />
    </Box>
  );
};

export default QuizScreen;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: Colors.background,
    paddingVertical: vs(16),
    paddingHorizontal: hs(16),
    marginHorizontal: hs(16),
    borderRadius: ms(12),
  },
});
