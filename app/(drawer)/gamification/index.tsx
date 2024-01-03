import HeaderRight from "@components/headerRight";
import CustomButton from "@components/ui/customButton";
import { zodResolver } from "@hookform/resolvers/zod";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { SearchSchemaType, searchSchema } from "@src/types/schema";
import { ms, vs } from "@utils/platform";
import { router, useNavigation } from "expo-router";
import { useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SelectDropdown from "react-native-select-dropdown";
import ControlledInput from "@components/ui/controlledInput";
import { useState } from "react";
import { HelperText } from "react-native-paper";

const Gamification = () => {
  const navigation: any = useNavigation();
  const [type, setType] = useState<"ما هي الآية التالية؟" | "ترتيب الآيات">(
    "ما هي الآية التالية؟"
  );
  const [customError, setCustomError] = useState<string>("");
  const { control, handleSubmit, reset, setError } = useForm<SearchSchemaType>({
    resolver: zodResolver(searchSchema),
  });

  const onSearch = (data: SearchSchemaType) => {
    if (type === "ترتيب الآيات") {
      if (isNaN(+data.search) || +data.search < 1 || +data.search > 604) {
        setError("search", {
          message: "يجب أن يكون البحث رقمًا بين 1 و 604",
          type: "custom",
          types: {
            custom: "يجب أن يكون البحث رقمًا بين 1 و 604",
          },
        });
        return;
      }
      reset();
      // @ts-ignore
      router.push(`/gamification/quran-test?page=${data.search}`);
    } else {
      if (!data.search2) return setCustomError("يجب تحديد الصفحات");
      if (!data.numOfQuestions || +data.numOfQuestions < 1)
        return setCustomError("يجب تحديد عدد الأسئلة");
      if (
        isNaN(+data.search) ||
        +data.search < 1 ||
        +data.search > 604 ||
        isNaN(+data.search2) ||
        +data.search2 < 1 ||
        +data.search2 > 604 ||
        +data.search2 < +data.search
      ) {
        setCustomError(
          "يجب أن يكون البحث رقمًا بين 1 و 604 والأولى أصغر من الأخرى"
        );
        return;
      }
      reset();
      router.push(
        // @ts-ignore
        `/gamification/next-aya-test?page=${data.search}&page2=${data.search2}&numOfQuestions=${data.numOfQuestions}`
      );
    }
  };
  return (
    <Box
      flex={1}
      style={{
        paddingTop: useSafeAreaInsets().top,
      }}
    >
      <Box flexDirection="row" alignItems="center" gap="hs">
        <HeaderRight onPress={() => navigation.openDrawer()} />
        <ReText variant="TitleMedium">اختبار الحفظ</ReText>
      </Box>
      <Box paddingHorizontal="hm" paddingTop="vl">
        <ReText variant="BodyLarge" marginBottom="vxs">
          اختبر نفسك في:
        </ReText>
        <SelectDropdown
          data={["ما هي الآية التالية؟", "ترتيب الآيات"]}
          buttonStyle={{
            width: "100%",
            marginBottom: vs(16),
            height: vs(48),
            borderRadius: ms(8),
            backgroundColor: Colors.background,
            borderColor: Colors.onBackground,
            borderWidth: 0.8,
          }}
          buttonTextStyle={{
            textAlign: "left",
            color: Colors.onBackground,
            fontFamily: "CairoBold",
            fontSize: ms(14),
          }}
          defaultButtonText="نوع الجلسة"
          dropdownStyle={styles.dropdown}
          rowStyle={styles.row}
          defaultValueByIndex={0}
          rowTextStyle={styles.rowText}
          onSelect={(item) => setType(item)}
          rowTextForSelection={(item) => item}
        />
        <Box alignItems="center">
          {type === "ترتيب الآيات" ? (
            <ControlledInput
              control={control}
              name="search"
              placeholder="ادحل الصفحة المطلوبة"
              label="الصفحة"
              mode="outlined"
              width={"100%"}
            />
          ) : (
            <Box gap="vs" width="100%">
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <ReText variant="BodyLarge">من</ReText>
                <Box width={"50%"}>
                  <ControlledInput
                    control={control}
                    noError
                    name="search"
                    label="الصفحة"
                    mode="outlined"
                    width={"100%"}
                  />
                </Box>
              </Box>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <ReText variant="BodyLarge">إلى</ReText>
                <Box width={"50%"}>
                  <ControlledInput
                    control={control}
                    noError
                    name="search2"
                    label="الصفحة"
                    mode="outlined"
                    width={"100%"}
                  />
                </Box>
              </Box>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <ReText variant="BodyLarge">عدد</ReText>
                <Box width={"50%"}>
                  <ControlledInput
                    control={control}
                    noError
                    name="numOfQuestions"
                    defaultValue="5"
                    label="الأسئلة"
                    mode="outlined"
                    width={"100%"}
                  />
                </Box>
              </Box>
              <HelperText
                type="error"
                visible={!!customError}
                style={{
                  marginTop: vs(12),
                  width: "100%",
                  fontSize: ms(14),
                }}
              >
                {customError}
              </HelperText>
            </Box>
          )}
        </Box>
        <CustomButton
          title="اختبار"
          onPress={handleSubmit(onSearch)}
          style={{ marginTop: vs(16) }}
          mode="contained"
        />
      </Box>
    </Box>
  );
};

export default Gamification;

const styles = StyleSheet.create({
  dropdown: {
    borderRadius: ms(8),
    backgroundColor: Colors.background,
    borderColor: Colors.onBackground,
    borderWidth: 0.8,
  },
  row: {
    width: "100%",
    backgroundColor: Colors.background,
    borderColor: Colors.onBackground,
    borderWidth: 0.6,
  },
  rowText: {
    fontFamily: "CairoReg",
    fontSize: ms(14),
    textAlign: "left",
    color: Colors.onBackground,
  },
});
