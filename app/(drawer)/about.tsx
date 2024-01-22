import HeaderRight from "@components/headerRight";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Box, ReText } from "@styles/theme";
import { ms } from "@utils/platform";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Linking, TouchableOpacity } from "react-native";

const About = () => {
  const navigation: any = useNavigation();
  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="space-between"
      paddingTop="vm"
      paddingBottom="vxl"
      style={{
        backgroundColor: "#1F2022",
      }}
    >
      <Drawer.Screen
        options={{
          headerBackgroundContainerStyle: { backgroundColor: "#1F2022" },
          headerTitleStyle: {
            color: "white",
          },
          headerLeft: () => (
            <HeaderRight
              color="white"
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />
      <Box>
        <Image
          source={require("@assets/icon.png")}
          contentFit="contain"
          style={{
            width: ms(200),
            height: ms(200),
          }}
        />
        <ReText variant="HeadlineSmall" textAlign="center" color="background">
          v1.0.0
        </ReText>
      </Box>
      <Box alignItems="center">
        <ReText
          variant="TitleSmall"
          textAlign="center"
          marginBottom="vs"
          color="background"
        >
          للتواصل مع مطور البرنامج هيثم عسولي
        </ReText>
        <Box flexDirection="row" gap="hm">
          {/* <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.facebook.com/assoli.55/")
            }
          >
            <AntDesign name="facebook-square" size={ms(28)} color="white" />
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "mailto:haitham.b.assoli@gmail.com?subject=مجالسbody=مرحباً هيثم،"
              )
            }
          >
            <Feather name="mail" size={ms(28)} color="white" />
          </TouchableOpacity>
          {/* <TouchableOpacity
            onPress={() =>
              Linking.openURL("https://www.linkedin.com/in/haithamassoli/")
            }
          >
            <AntDesign name="linkedin-square" size={ms(28)} color="white" />
          </TouchableOpacity> */}
        </Box>
      </Box>
    </Box>
  );
};

export default About;
