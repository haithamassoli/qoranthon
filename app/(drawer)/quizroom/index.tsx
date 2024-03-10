import { enterGameMutation, getSheikhQuizzesQuery } from "@apis/quizzes";
import GameCard from "@components/gameCard";
import HeaderRight from "@components/headerRight";
import Loading from "@components/loading";
import Snackbar from "@components/snackbar";
import ControlledInput from "@components/ui/controlledInput";
import CustomButton from "@components/ui/customButton";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, ReText } from "@styles/theme";
import {
  EnterGameValidationSchemaType,
  enterGameValidationSchema,
} from "@src/types/schema";
import { ms, vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { router, useNavigation } from "expo-router";
import { useForm } from "react-hook-form";
import { FlatList, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const QuizRoomScreen = () => {
  const navigation: any = useNavigation();
  const { user } = useStore();
  const { mutate, isLoading } = enterGameMutation();
  const { data, isInitialLoading } = getSheikhQuizzesQuery(
    user?.role !== "user",
    user?.id!
  );

  const { control, handleSubmit } = useForm<EnterGameValidationSchemaType>({
    resolver: zodResolver(enterGameValidationSchema),
  });

  const onSubmit = (data: EnterGameValidationSchemaType) => {
    console.log(data);
    mutate(
      {
        playerId: user?.id!,
        shortCode: data.shortCode,
        playerName: user?.name!,
      },
      {
        onSuccess: (data) => {
          router.push(
            `/quizroom/game-quizzes/lobby?gameId=${data[0].gameId}&roomTitle=${data[0].gameTitle}`
          );
        },
      }
    );
  };

  if (isLoading) return <Loading />;

  return (
    <Box
      flex={1}
      style={{
        paddingVertical: useSafeAreaInsets().top,
      }}
    >
      <Snackbar />
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        marginBottom="vxl"
        marginRight="hs"
      >
        <HeaderRight onPress={() => navigation.openDrawer()} />
        <ReText variant="TitleLarge" marginLeft="hs">
          غرف الاختبارات
        </ReText>
        <Box width={"10%"} />
      </Box>
      {user?.role === "user" ? (
        <Box
          flex={1}
          justifyContent="center"
          alignItems="center"
          width={"70%"}
          alignSelf="center"
        >
          <ReText variant="TitleLarge">ادخل رمز الغرفة</ReText>
          <ControlledInput
            name="shortCode"
            control={control}
            onSubmitEditing={handleSubmit(onSubmit)}
          />
          <CustomButton
            title="دخول"
            mode="text"
            onPress={handleSubmit(onSubmit)}
          />
        </Box>
      ) : (
        <Box paddingHorizontal="hm">
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <ReText variant="TitleLarge">الغرف</ReText>
            <TouchableOpacity
              onPress={() => router.push("/quizroom/game-quizzes/add-quiz")}
            >
              <Feather name="plus" size={ms(30)} color="black" />
            </TouchableOpacity>
          </Box>
          <ReText variant="BodyLarge" marginTop="vs">
            {data?.length === 0
              ? "لا يوجد غرف حتى الآن"
              : "اضغط على الاختبار لبدء الغرفة"}
          </ReText>
          <>
            {isInitialLoading ? (
              <Box height={"90%"}>
                <Loading />
              </Box>
            ) : (
              <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{
                  paddingBottom: vs(236),
                }}
                ItemSeparatorComponent={() => <Box height={vs(16)} />}
                renderItem={({ item }) => (
                  <GameCard
                    id={item.id}
                    createdAt={item.createdAt}
                    title={item.title}
                    sheikhId={item.sheikhId}
                    onPress={() =>
                      router.push(
                        `/quizroom/game-quizzes/lobby?gameId=${item.id}&roomTitle=${item.title}`
                      )
                    }
                  />
                )}
              />
            )}
          </>
        </Box>
      )}
    </Box>
  );
};

export default QuizRoomScreen;
