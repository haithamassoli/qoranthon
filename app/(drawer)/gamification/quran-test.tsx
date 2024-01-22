import { Box, ReText } from "@styles/theme";
import {
  FlatList,
  LayoutAnimation,
  Share,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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

const shuffleArr = (arr: any[]) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const QuranTest = () => {
  const {
    page,
  }: {
    page: string;
  } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { data, isInitialLoading } = getQuranByPage(+page);
  const { user } = useStore();
  const { mutate } = addQuizzesCountMutation();
  const [numErrs, setNumErrs] = useState(0);
  const [visible, setVisible] = useState(false);
  const [isDown, setIsDown] = useState(true);
  const [ayahs, setAyahs] = useState<Ayahs[] | []>([]);
  const [answer, setAnswer] = useState<Ayahs[] | []>([]);
  const [sec, setSec] = useState<number>(0);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const onAnswer = (item: Ayahs) => {
    let arrCopy = [...ayahs];
    const sortedAyahsByNumber = arrCopy.sort((a, b) => a.number - b.number);
    if (item.number === sortedAyahsByNumber[0].number) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setAnswer([...answer, item]);
      setAyahs((prev) => {
        if (prev.length === 1) {
          if (user?.role === "user") {
            mutate(
              {
                studentId: user?.id!,
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries(["user", user?.id]);
                  showModal();
                },
              }
            );
          } else {
            showModal();
          }
        }
        return prev.filter((ayah) => ayah.number !== item.number);
      });
    } else {
      setNumErrs(numErrs + 1);
      useStore.setState({ snackbarText: "الاجابة غير صحيحة حاول مرة أخرى" });
    }
  };

  useEffect(() => {
    if (ayahs.length === 0) {
      const randomAyahs = shuffleArr(data?.ayahs || []);
      setAyahs(randomAyahs || []);
    }
  }, [data?.ayahs]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ayahs.length !== 0) {
        setSec((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [ayahs]);

  const onShare = () => {
    Share.share({
      message: `نتائج اختبار الحفظ من تطبيق مجالس\nاختبر نفسك في ترتيب الآيات\nالصفحة: ${page}\nعدد الأخطاء: ${numErrs}\nالوقت المستغرق: ${sec} ثانية`,
    }).then((res) => {
      if (res.action === "sharedAction") {
        router.back();
      }
    });
  };

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
              صفحة: {page}
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
        <FlatList
          data={answer}
          renderItem={({ item }) => (
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
          )}
          ItemSeparatorComponent={() => <Box height={vs(16)} />}
          ListEmptyComponent={
            <Box flex={1} justifyContent="center" alignItems="center">
              <ReText
                textAlign="center"
                variant="TitleMedium"
                fontFamily="CairoBold"
              >
                رتب الآيات بشكل صحيح
              </ReText>
            </Box>
          }
          keyExtractor={(item) => item.number.toString()}
        />
        <Box
          width={width}
          height={"40%"}
          paddingHorizontal="hm"
          position="absolute"
          bottom={0}
          left={0}
          backgroundColor="onSurfaceVariant"
          borderTopLeftRadius="l"
          borderTopRightRadius="l"
          style={
            isDown
              ? {
                  bottom: 0,
                }
              : {
                  top: useSafeAreaInsets().top,
                }
          }
        >
          <Box
            flexDirection="row"
            justifyContent="space-between"
            paddingHorizontal="hm"
            paddingVertical="vs"
            alignItems="center"
          >
            <TouchableOpacity onPress={() => setIsDown(!isDown)}>
              <Feather
                name={isDown ? "chevron-up" : "chevron-down"}
                size={ms(24)}
                color={Colors.background}
              />
            </TouchableOpacity>
            <ReText variant="BodyLarge" color="background">
              ترتيب الآيات
            </ReText>
            <TouchableOpacity onPress={() => router.back()}>
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

export default QuranTest;

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
