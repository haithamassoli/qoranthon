import firestore from "@react-native-firebase/firestore";
import { useMutation } from "@tanstack/react-query";
import { sendNotification } from "@utils/sendNotification";
import { useStore } from "@zustand/store";

export const addNotificationTokenMutation = () => {
  return useMutation({
    mutationFn: ({
      userId,
      pushNotificationsToken,
    }: {
      userId: string;
      pushNotificationsToken: string;
    }) => addNotificationToken(userId, pushNotificationsToken),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

export const addNotificationToken = async (
  userId: string,
  pushNotificationsToken: string
) => {
  try {
    await firestore()
      .collection("users")
      .doc(userId)
      .update({ pushNotificationsToken });

    await firestore().collection("pushNotificationsTokens").add({
      pushNotificationsToken,
    });
    return;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const sendNotificationMutation = () => {
  return useMutation({
    mutationFn: ({
      tokens,
      title,
      body,
    }: {
      tokens: string[];
      title: string;
      body: string;
    }) => sendNotification(tokens, title, body),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};
