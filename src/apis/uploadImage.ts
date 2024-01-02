import storage from "@react-native-firebase/storage";
import { useMutation } from "@tanstack/react-query";
import { useStore } from "@zustand/store";

export const uploadImageMutation = () => {
  return useMutation({
    mutationFn: (images: string[]) => uploadImageAsync(images),
    onError: (error: any) => {
      useStore.setState({ snackbarText: error.message });
    },
  });
};

async function uploadImageAsync(images: string[]) {
  const promises = images.map(async (image) => {
    const response = await fetch(image);
    const blob = await response.blob();
    const fileName = image.split("/").pop();
    const fileRef = storage().ref(`images/${fileName}-${Date.now()}`);
    await fileRef.put(blob);
    return await fileRef.getDownloadURL();
  });
  return await Promise.all(promises);

  // const response = await fetch(images);
  // const blob = await response.blob();
  // const fileName = images.split("/").pop();
  // const fileRef = storage().ref(`images/${fileName}-${Date.now()}`);
  // await fileRef.put(blob);
  // return await fileRef.getDownloadURL();
}
