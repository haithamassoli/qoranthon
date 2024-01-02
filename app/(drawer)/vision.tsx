import HeaderRight from "@components/headerRight";
import ControlledInput from "@components/ui/controlledInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { VisionSchemaType, visionSchema } from "@src/types/schema";
import { useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useForm } from "react-hook-form";
import CustomButton from "@components/ui/customButton";
import { editVisionMutation, getVisionQuery } from "@apis/vision";
import Loading from "@components/loading";
import { useStore } from "@zustand/store";
import Snackbar from "@components/snackbar";
import { useQueryClient } from "@tanstack/react-query";
import { Box } from "@styles/theme";

const Vision = () => {
  const { user } = useStore();
  const queryClient = useQueryClient();
  const navigation: any = useNavigation();
  const { data, isInitialLoading } = getVisionQuery();
  const { mutate, isLoading } = editVisionMutation();
  const { control, handleSubmit } = useForm<VisionSchemaType>({
    resolver: zodResolver(visionSchema),
  });

  const onPress = (data: VisionSchemaType) => {
    mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries(["vision"]);
        useStore.setState({ snackbarText: "تم تحديث الرؤية بنجاح" });
      },
    });
  };

  if (isInitialLoading || isLoading) return <Loading />;

  return (
    <>
      <Snackbar />
      <Drawer.Screen
        options={{
          headerLeft: () => (
            <HeaderRight onPress={() => navigation.openDrawer()} />
          ),
        }}
      />
      <Box flex={1} paddingHorizontal="hm" paddingVertical="vm">
        <ControlledInput
          control={control}
          name="vision"
          multiline
          inputMode="text"
          textAlignVertical="top"
          defaultValue={data?.vision}
          contentStyle={{
            height: user?.role === "super" ? "90%" : "100%",
          }}
          editable={user?.role === "super"}
          mode="outlined"
        />
        {user?.role === "super" && (
          <CustomButton
            title="تحديث"
            onPress={handleSubmit(onPress)}
            style={{
              width: "100%",
            }}
          />
        )}
      </Box>
    </>
  );
};

export default Vision;
