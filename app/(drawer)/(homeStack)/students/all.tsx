import { FlatList, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Box, ReText } from "@styles/theme";
import { ms, vs } from "@utils/platform";
import Animated, { FadeInUp } from "react-native-reanimated";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Colors from "@styles/colors";
import { getAllUsersQuery } from "@apis/users";
import Loading from "@components/loading";

const AllStudents = () => {
  const { data, isInitialLoading } = getAllUsersQuery();

  if (isInitialLoading) return <Loading />;
  return (
    <Box
      flex={1}
      paddingHorizontal="hm"
      paddingBottom="vl"
      style={{
        paddingTop: useSafeAreaInsets().top,
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
            جميع الطلاب
          </ReText>
        </Box>
      </Box>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.duration(600).delay(200 * index)}>
            <TouchableOpacity
              onPress={() =>
                router.push(`/students/studentInfo/${item.id}?role=super`)
              }
            >
              <Box
                height={vs(52)}
                flexDirection="row"
                alignItems="center"
                paddingHorizontal="hm"
                backgroundColor="secondaryContainer"
                borderRadius="l"
              >
                <Feather
                  name="user"
                  size={ms(24)}
                  color={Colors.onSecondaryContainer}
                />
                <ReText
                  variant="BodyLarge"
                  color="onSecondaryContainer"
                  marginLeft="hs"
                >
                  {item.name}
                </ReText>
              </Box>
            </TouchableOpacity>
          </Animated.View>
        )}
        ListEmptyComponent={() => (
          <ReText variant="TitleMedium" textAlign="center" marginTop="vm">
            لا يوجد طلاب
          </ReText>
        )}
        ItemSeparatorComponent={() => <Box height={vs(16)} />}
      />
    </Box>
  );
};

export default AllStudents;
