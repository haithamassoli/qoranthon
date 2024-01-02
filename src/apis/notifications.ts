import firestore from "@react-native-firebase/firestore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Role } from "@src/types/data";
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

export const getNotificationTokensQuery = (role: Role) => {
  return useQuery({
    queryKey: ["notificationTokens"],
    queryFn: () => getNotificationTokens(),
    enabled: role === "super",
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const getNotificationTokens = async () => {
  try {
    const tokens = await firestore()
      .collection("pushNotificationsTokens")
      .get();
    return tokens.docs.map((token) => token.data().pushNotificationsToken);
  } catch (error: any) {
    throw new Error(error.message);
  }
};
