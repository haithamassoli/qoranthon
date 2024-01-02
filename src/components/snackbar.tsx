import { Box, ReText } from "@styles/theme";
import { vs } from "@utils/platform";
import { useStore } from "@zustand/store";
import { useEffect, useState } from "react";
import { Snackbar as PSnackbar } from "react-native-paper";

const Snackbar = () => {
  const { snackbarText } = useStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (snackbarText) {
      setVisible(true);
    }
  }, [snackbarText]);

  const onDismiss = () => {
    setVisible(false);
    useStore.setState({ snackbarText: "" });
  };
  return (
    <Box
      flex={1}
      position="absolute"
      zIndex="modal"
      bottom={vs(24)}
      width={"100%"}
    >
      <PSnackbar
        visible={visible}
        onDismiss={onDismiss}
        duration={5000}
        action={{
          label: "حسنا",
          onPress: onDismiss,
        }}
      >
        <ReText variant="BodySmall" textAlign="left" color="background">
          {snackbarText}
        </ReText>
      </PSnackbar>
    </Box>
  );
};

export default Snackbar;
