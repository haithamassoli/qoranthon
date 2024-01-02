import firestore from "@react-native-firebase/firestore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@zustand/store";

export const getVisionQuery = () => {
  return useQuery({
    queryKey: ["vision"],
    queryFn: () => getVision(),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

export const getVision = async () => {
  try {
    const response = await firestore()
      .collection("vision")
      .doc("ECeIki1NMjuXJHtQxi6Z")
      .get();
    return response.data();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const editVisionMutation = () => {
  return useMutation({
    mutationFn: (data: { vision: string }) => editVision(data),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const editVision = async (data: { vision: string }) => {
  try {
    await firestore()
      .collection("vision")
      .doc("ECeIki1NMjuXJHtQxi6Z")
      .update({ vision: data.vision });
    return;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const getContactQuery = () => {
  return useQuery({
    queryKey: ["contact"],
    queryFn: () => getContact(),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

export const getContact = async () => {
  try {
    const response = await firestore()
      .collection("contact")
      .doc("EeFafHxJBEsKh8N1yjKJ")
      .get();
    return response.data();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const editContactMutation = () => {
  return useMutation({
    mutationFn: (data: { contact: string }) => editContact(data),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const editContact = async (data: { contact: string }) => {
  try {
    await firestore()
      .collection("contact")
      .doc("EeFafHxJBEsKh8N1yjKJ")
      .update({ contact: data.contact });
    return;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
