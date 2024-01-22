import { Box, ReText } from "@styles/theme";
import { FlatList, Share, StyleSheet, TouchableOpacity } from "react-native";
import { getQuranByPage } from "@apis/quran";
import Loading from "@components/loading";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { hs, ms, vs } from "@utils/platform";
import { width } from "@utils/helper";
import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { useEffect, useState } from "react";
import { useStore } from "@zustand/store";
import Snackbar from "@components/snackbar";
import { router, useLocalSearchParams } from "expo-router";
import { Modal, Portal } from "react-native-paper";
import CustomButton from "@components/ui/customButton";
import { addQuizzesCountMutation } from "@apis/users";
import { useQueryClient } from "@tanstack/react-query";
import NoConnection from "@components/noConnection";
import { useNetInfo } from "@react-native-community/netinfo";

const shuffleArr = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const getRandomBetweenPages = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const NextAyaTest = () => {
  const {
    page,
    page2,
    numOfQuestions,
  }: {
    page: string;
    page2: string;
    numOfQuestions: string;
  } = useLocalSearchParams();

  const { isConnected } = useNetInfo();

  const randomPage = getRandomBetweenPages(+page, +page2);
  const { user } = useStore();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(randomPage);
  const { mutate } = addQuizzesCountMutation();
  const { data, isInitialLoading, isFetching, refetch } =
    getQuranByPage(currentPage);

  const [numErrs, setNumErrs] = useState(0);
  const [visible, setVisible] = useState(false);
  const [exitModal, setExitModal] = useState(false);
  const [ayahs, setAyahs] = useState<Ayahs[] | []>([]);
  const [answer, setAnswer] = useState<Ayahs>();
  const [sec, setSec] = useState<number>(0);
  const [counter, setCounter] = useState<number>(1);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const showExitModal = () => setExitModal(true);
  const hideExitModal = () => setExitModal(false);

  const onAnswer = (item: Ayahs) => {
    if (item.number - 1 === answer?.number) {
      if (counter === +numOfQuestions) {
        if (user?.role === "user") {
          mutate(
            {
              studentId: user?.id!,
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries(["user", user?.id]);
                showModal();
                return;
              },
            }
          );
        } else {
          showModal();
          return;
        }
      }
      setCurrentPage(getRandomBetweenPages(+page, +page2));

      refetch().then(() => {
        setAyahs([]);
        setCounter((prev) => prev + 1);
      });
    } else {
      setNumErrs((prev) => prev + 1);
      useStore.setState({ snackbarText: "الاجابة غير صحيحة حاول مرة أخرى" });
    }
  };

  useEffect(() => {
    if (
      (ayahs.length === 0 || !answer) &&
      data?.ayahs &&
      data.ayahs.length > 0
    ) {
      const randomAyahs = shuffleArr([...data?.ayahs]);
      const checkLastItem =
        randomAyahs[0].number == data.ayahs[data.ayahs.length - 1].number;

      if (checkLastItem) {
        setAyahs(randomAyahs.slice(0, -1));
        setAnswer(randomAyahs[randomAyahs.length - 1]);
      } else {
        setAyahs(randomAyahs.slice(1));
        setAnswer(randomAyahs[0]);
      }
    }
  }, [isFetching]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (visible === false) {
        setSec((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [visible]);

  const onShare = () => {
    Share.share({
      message: `نتائج اختبار الحفظ من تطبيق مجالس\nاختبر نفسك في معرفة الآية التالية\nعدد الأسئلة: ${numOfQuestions}\nالصفحة من: ${page} إلى ${page2}\nعدد الأخطاء: ${numErrs}\nالوقت المستغرق: ${sec} ثانية`,
    }).then((res) => {
      if (res.action === "sharedAction") {
        router.back();
      }
    });
  };

  if (isConnected === false) return <NoConnection refetch={refetch} />;
  if (isInitialLoading) return <Loading />;

  return (
    <>
      <Snackbar />
      <Box
        flex={1}
        paddingHorizontal="hs"
        style={{
          paddingTop: useSafeAreaInsets().top,
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
              fontFamily="CairoReg"
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
            <ReText variant="TitleLarge" fontFamily="CairoReg" color="primary">
              أحسنت. تهانينا
            </ReText>
            <ReText variant="TitleLarge" marginTop="vl" color="tertiary">
              نتائج اختبارك:
            </ReText>
            <ReText variant="LabelMedium">اختبر نفسك في ترتيب الآيات</ReText>
            <ReText marginTop="vm" variant="LabelMedium">
              عدد الأسئلة: ${numOfQuestions}
            </ReText>
            <ReText variant="LabelMedium">
              الصفحات: من {page} إلى {page2}
            </ReText>
            <ReText variant="LabelMedium">عدد الأخطاء: {numErrs}</ReText>
            <ReText variant="LabelMedium">الوقت المستغرق: {sec} ثانية</ReText>
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
        <ReText
          textAlign="center"
          variant="TitleMedium"
          marginTop="vm"
          marginBottom="vxl"
          fontFamily="CairoBold"
        >
          السؤال {counter} من {numOfQuestions}
        </ReText>
        <ReText
          textAlign="center"
          variant="TitleMedium"
          marginBottom="vxl"
          fontFamily="CairoBold"
        >
          ما هي الآية التالية؟
        </ReText>
        <Box
          backgroundColor="secondaryContainer"
          borderRadius="m"
          paddingVertical="vxs"
        >
          <ReText fontFamily="Uthmanic" textAlign="center" variant="TitleLarge">
            {answer?.text.replaceAll("۟", "")}
          </ReText>
        </Box>
        <Box
          width={width}
          height={"60%"}
          paddingHorizontal="hm"
          position="absolute"
          bottom={0}
          left={0}
          backgroundColor="onSurfaceVariant"
        >
          <Box
            flexDirection="row"
            justifyContent="space-between"
            paddingHorizontal="hm"
            paddingVertical="vs"
            alignItems="center"
          >
            <ReText variant="BodyLarge" color="background">
              اختر الإجابة الصحيحة
            </ReText>
            <TouchableOpacity onPress={showExitModal}>
              <Feather name="log-out" size={ms(24)} color={Colors.background} />
            </TouchableOpacity>
          </Box>
          <FlatList
            data={ayahs}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onAnswer(item)}>
                <Box
                  backgroundColor="secondaryContainer"
                  borderRadius="m"
                  paddingVertical="vxs"
                >
                  <ReText
                    fontFamily="Uthmanic"
                    textAlign="center"
                    variant="TitleLarge"
                  >
                    {item.text.replaceAll("۟", "")}
                  </ReText>
                </Box>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <Box height={vs(16)} />}
            ListFooterComponent={() => <Box height={vs(16)} />}
            keyExtractor={(item) => item.number.toString()}
          />
        </Box>
      </Box>
    </>
  );
};

export default NextAyaTest;

const styles = StyleSheet.create({
  modal: {
    backgroundColor: Colors.background,
    paddingVertical: vs(16),
    paddingHorizontal: hs(16),
    marginHorizontal: hs(16),
    borderRadius: ms(12),
  },
});

type Ayahs = {
  number: number;
  text: string;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
  };
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
};
