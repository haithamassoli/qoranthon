import { deleteUserMutation } from "@apis/auth";
import { getUserByIdQuery } from "@apis/users";
import Loading from "@components/loading";
import SheikhInfoTable from "@components/sheikhInfoTable";
import Snackbar from "@components/snackbar";
import CustomButton from "@components/ui/customButton";
import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { Box, ReText } from "@styles/theme";
import { useQueryClient } from "@tanstack/react-query";
import { ms } from "@utils/platform";
import { useStore } from "@zustand/store";
import { router, useLocalSearchParams } from "expo-router";
import { TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SheikhInfo = () => {
  const {
    sheikhInfo,
  }: {
    sheikhInfo: string;
  } = useLocalSearchParams();

  const queryClient = useQueryClient();
  const { mutate, isLoading } = deleteUserMutation();
  const { data, isInitialLoading: isLoadingInfo } =
    getUserByIdQuery(sheikhInfo);

  const onDelete = () => {
    mutate(sheikhInfo, {
      onSuccess: () => {
        useStore.setState({
          snackbarText: "تم حذف الشيخ بنجاح",
        });
        queryClient.invalidateQueries(["users"]);
        router.push("/");
      },
    });
  };

  if (isLoading || isLoadingInfo) return <Loading />;

  return (
    <>
      <Snackbar />
      <Box
        flex={1}
        paddingHorizontal="hm"
        justifyContent="space-between"
        paddingBottom="vl"
        style={{
          paddingTop: useSafeAreaInsets().top,
        }}
      >
        <Box>
          <Box marginBottom="vxl">
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
                {data?.name}
              </ReText>
            </Box>
          </Box>
          <SheikhInfoTable
            id={data?.id!}
            name={data?.name!}
            email={data?.email!}
            password={data?.password!}
            phone={data?.phone!}
          />
        </Box>
        <CustomButton
          mode="contained"
          style={{
            backgroundColor: Colors.secondary,
          }}
          title="حذف الشيخ"
          onPress={onDelete}
        />
      </Box>
    </>
  );
};

export default SheikhInfo;
