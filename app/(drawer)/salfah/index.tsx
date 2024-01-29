import HeaderRight from "@components/headerRight";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, ReText } from "@styles/theme";
import {
  SalfahValidationSchemaType,
  salfahValidationSchema,
} from "@src/types/schema";
import { router, useNavigation } from "expo-router";
import { useFieldArray, useForm } from "react-hook-form";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView, TouchableOpacity } from "react-native";
import CustomButton from "@components/ui/customButton";
import ControlledInput from "@components/ui/controlledInput";
import { Feather } from "@expo/vector-icons";
import { ms } from "@utils/platform";
import Colors from "@styles/colors";
import { getDataMMKV, storeDataMMKV } from "@utils/helper";

const SalfahScreen = () => {
  const navigation: any = useNavigation();
  const players = getDataMMKV("players");

  const { control, handleSubmit } = useForm<SalfahValidationSchemaType>({
    resolver: zodResolver(salfahValidationSchema),
    defaultValues: {
      players: players || [
        {
          name: "",
        },
        {
          name: "",
        },
        {
          name: "",
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "players",
    rules: {
      required: true,
      minLength: 2,
      maxLength: 12,
      validate: (value) => {
        return value.every((player) => player.name !== "");
      },
    },
    control,
  });

  const onSubmit = (data: SalfahValidationSchemaType) => {
    console.log(data);
    // make data array of strings
    const players = data.players
      .map((player) => player.name)
      .filter((a) => a !== "");

    storeDataMMKV("players", players);
    storeDataMMKV("selectedPlayer", []);
    router.push(`/salfah/salfah-game`);
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
        marginBottom="vxl"
        marginRight="hs"
      >
        <HeaderRight onPress={() => navigation.openDrawer()} />
        <ReText variant="TitleLarge" marginLeft="hs">
          برا السالفة
        </ReText>
        <Box width={"10%"} />
      </Box>
      <Box paddingHorizontal="hm">
        <ReText
          variant="TitleLarge"
          fontFamily="Cairo-Regular"
          textAlign="center"
          marginBottom="vl"
        >
          أسماء اللاعبين
        </ReText>
        <ReText variant="TitleSmall">* يمنع تكرار اسم اللاعب</ReText>
        <ReText variant="TitleSmall">* أقل حد مسموح به للعب 3</ReText>
        <Box height={ms(16)} />
        {fields.map((field, index) => (
          <Box key={field.id}>
            {index > 2 && (
              <TouchableOpacity
                style={{
                  position: "absolute",
                  top: ms(10),
                  right: ms(10),
                  zIndex: 10,
                }}
                onPress={() => remove(index)}
              >
                <Feather name="x" size={ms(30)} color={Colors.onBackground} />
              </TouchableOpacity>
            )}
            <ControlledInput
              name={`players.${index}.name`}
              control={control}
              defaultValue={players && players[index]}
              placeholder={`اللاعب ${index + 1}`}
            />
          </Box>
        ))}
        <CustomButton
          title="إضافة لاعب جديد"
          mode="text"
          onPress={() =>
            append({
              name: "",
            })
          }
        />
        <CustomButton title="بدء اللعبة" onPress={handleSubmit(onSubmit)} />
      </Box>
    </ScrollView>
  );
};

export default SalfahScreen;
