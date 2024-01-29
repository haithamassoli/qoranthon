import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { ms } from "@utils/platform";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import surahs from "@src/data/surah.json";
import { useEffect, useState } from "react";

const random10Surah = surahs
  .sort(() => 0.5 - Math.random())
  .slice(0, 7)
  .map((surah) => surah.name);

const BrraSalfahVote = () => {
  const {
    brraSalfah,
    randomSurah,
  }: {
    brraSalfah: string;
    randomSurah: string;
  } = useLocalSearchParams();

  const [random10, setRandom10] = useState<string[]>([]);

  const onselect = (surah: string) => {
    router.push(
      // @ts-ignore
      `/salfah/result?barraScore=${
        randomSurah === surah ? 1 : 0
      }&brraSalfah=${brraSalfah}`
    );
  };

  useEffect(() => {
    // merge random10Surah and randomSurah to random10 without duplicate
    const random10SurahWithoutDuplicate = random10Surah.filter(
      (surah) => surah !== randomSurah
    );
    const random10SurahWithDuplicate = [
      ...random10SurahWithoutDuplicate,
      randomSurah,
    ];
    const random10SurahWithDuplicateWithoutDuplicate = [
      ...new Set(random10SurahWithDuplicate),
    ];
    setRandom10(random10SurahWithDuplicateWithoutDuplicate);
  }, []);
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
      <Box paddingHorizontal="hm" paddingBottom="v4xl">
        <ReText
          variant="TitleLarge"
          fontFamily="Cairo-Regular"
          marginBottom="vm"
          color="primary"
          textAlign="center"
        >
          {`برا السالفة هو ${brraSalfah}!
${brraSalfah} ايش اللي برا السالفة؟!`}
        </ReText>
        {random10.map((surah, index) => (
          <TouchableOpacity key={surah} onPress={() => onselect(surah)}>
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
                <ReText variant="TitleLarge">{surah}</ReText>
              </Box>
              <Feather
                name="check-circle"
                size={ms(30)}
                color={Colors.onBackground}
              />
            </Box>
          </TouchableOpacity>
        ))}
      </Box>
    </ScrollView>
  );
};

export default BrraSalfahVote;
