import CustomButton from "@components/ui/customButton";
import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { getDataMMKV } from "@utils/helper";
import { ms, vs } from "@utils/platform";
import { router } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import surah from "@src/data/surah.json";

const randomSurah = surah[Math.floor(Math.random() * surah.length)].name;

const SalfahGame = () => {
  const players = getDataMMKV("players");
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [count, setCount] = useState(1);
  const [brraSalfah, setBrraSalfah] = useState(
    players[Math.floor(Math.random() * players.length)]
  );
  const random = players.filter(
    (player: string) => player !== players[currentPlayer]
  );

  const onNext = () => {
    if (count === 1) {
      setCount(2);
    } else if (count === 2) {
      if (currentPlayer === players.length - 1) {
        setCurrentPlayer(0);
        setCount(3);
      } else {
        setCount(1);
        setCurrentPlayer((prev) => prev + 1);
      }
    } else if (count === 3) {
      setCount(4);
    } else {
      if (currentPlayer === players.length - 1) {
        setCurrentPlayer(Math.floor(Math.random() * players.length));
      } else {
        setCurrentPlayer((prev) => prev + 1);
      }
    }
  };

  const onVote = () => {
    router.push(
      // @ts-ignore
      `/salfah/salfah-vote?brraSalfah=${brraSalfah}&randomSurah=${randomSurah}`
    );
  };

  return (
    <Box
      flex={1}
      style={{
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
      <Box flex={1} marginTop="v2xl" alignItems="center">
        <ReText variant="TitleLarge" color="primary">
          {count >= 3 ? "وقت الأسئلة" : players[currentPlayer]}
        </ReText>
        {count === 1 ? (
          <ReText
            variant="TitleLarge"
            marginTop="vl"
            color="primary"
            textAlign="center"
            fontFamily="Cairo-Regular"
          >
            {`اعطوا الجوال لـ${players[currentPlayer]}
اضغط التالي حتى تعرف هل أنت برا
السالفة أو داخلها ولا تحلي أحد غيرك
يشوف الشاشة`}
          </ReText>
        ) : count === 2 ? (
          <ReText
            variant="TitleLarge"
            marginTop="vl"
            color="primary"
            textAlign="center"
            fontFamily="Cairo-Regular"
          >
            {brraSalfah === players[currentPlayer]
              ? `أنت اللي برا السالفة! حاول تعرف وش
السالفة بالضبط من كلام البقية أو
اقتعهم يصوتون على الشخص الخطأ!`
              : `انت داخل السالفة واللي هي
${randomSurah}
هدفك في اللعبة معرفة مين منكم اللي
برا السالفة. اضغط التالي!`}
          </ReText>
        ) : count === 3 ? (
          <ReText
            variant="TitleLarge"
            marginTop="vl"
            color="primary"
            textAlign="center"
            fontFamily="Cairo-Regular"
          >
            {`كل شخص راح يسأل شخص ثاني
سؤال متعلق بالسالفة، اصغطوا التالي
حتى تعرفون مين راح يسأل مين`}
          </ReText>
        ) : (
          <ReText
            variant="TitleLarge"
            marginTop="vl"
            color="primary"
            textAlign="center"
            fontFamily="Cairo-Regular"
          >
            {`${players[currentPlayer]} اسأل ${
              random[Math.floor(Math.random() * random.length)]
            } سؤال منعلق
بالسالفة! اختار سؤالك بعناية حتى اللي
برا السالفة ما يعرف عن ايش تتكلمون`}
          </ReText>
        )}
        <CustomButton
          title={"التالي"}
          onPress={onNext}
          style={{
            width: "80%",
            marginTop: vs(100),
          }}
        />
        {count >= 3 && (
          <CustomButton
            title={"صوت"}
            onPress={onVote}
            style={{
              width: "80%",
              marginTop: vs(16),
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default SalfahGame;
