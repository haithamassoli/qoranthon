import Snackbar from "@components/snackbar";
import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { ms } from "@utils/platform";
import { router } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ControlledInput from "@components/ui/controlledInput";
import CustomButton from "@components/ui/customButton";
import {
  QuizValidationSchemaType,
  quizValidationSchema,
} from "@src/types/schema";
import { addQuizMutation } from "@apis/quizzes";
import Loading from "@components/loading";
import { useStore } from "@zustand/store";

const AddQuizScreen = () => {
  const { user } = useStore();
  const { control, handleSubmit, reset } = useForm<QuizValidationSchemaType>({
    resolver: zodResolver(quizValidationSchema),
    defaultValues: {
      title: undefined,
      questions: [
        {
          options: [, , "", ""],
        },
      ],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "questions",
    rules: { required: true },
    control,
  });
  const { mutate, isLoading } = addQuizMutation();
  const onSubmit = (data: QuizValidationSchemaType) => {
    console.log(data.questions);
    // check if there is empty question
    const emptyQuestion = data.questions.find(
      (question) => question.question === ""
    );
    if (emptyQuestion) {
      useStore.setState({
        snackbarText: "لا يمكن ترك السؤال فارغ",
      });
      return;
    }

    const emptyOption = data.questions.find(
      (question) => question.options[0] === "" || question.options[1] === ""
    );
    if (emptyOption) {
      useStore.setState({
        snackbarText: "لا يمكن ترك الخيار فارغ",
      });
      return;
    }

    mutate(
      {
        // @ts-ignore
        questions: data?.questions,
        sheikhId: user!?.id,
        sheikhName: user!?.name,
        title: data.title,
      },
      {
        onSuccess: () => {
          useStore.setState({
            snackbarText: "تم إضافة الاختبار بنجاح",
          });
          router.back();
        },
      }
    );
  };
  if (isLoading) return <Loading />;
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
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
              إضافة اختبار
            </ReText>
          </Box>
        </Box>

        <ControlledInput
          name="title"
          label="عنوان الاختبار"
          control={control}
          mode="flat"
        />
        {fields.map((field, index) => (
          <Box
            key={field.id}
            backgroundColor="surfaceVariant"
            paddingHorizontal="hm"
            paddingTop="vm"
            marginBottom="vm"
          >
            <ControlledInput
              name={`questions.${index}.question`}
              control={control}
              mode="flat"
              label={`السؤال ${index + 1}`}
            />
            <ControlledInput
              name={`questions.${index}.options.0`}
              control={control}
              label={`الخيار الأول - الإجابة الصحيحة`}
              mode="flat"
            />
            <ControlledInput
              name={`questions.${index}.options.1`}
              control={control}
              mode="flat"
              label={`الخيار الثاني`}
            />
            <ControlledInput
              name={`questions.${index}.options.2`}
              control={control}
              mode="flat"
              label="الخيار الثالث - اختياري"
            />
            <ControlledInput
              name={`questions.${index}.options.3`}
              control={control}
              mode="flat"
              label={`الخيار الرابع - اختياري`}
            />
          </Box>
        ))}
        <CustomButton
          title="إضافة سؤال جديد"
          mode="text"
          onPress={() =>
            append({
              question: "",
              options: ["", "", "", ""],
            })
          }
        />
        <CustomButton title="إضافة" onPress={handleSubmit(onSubmit)} />
      </Box>
    </ScrollView>
  );
};

export default AddQuizScreen;
