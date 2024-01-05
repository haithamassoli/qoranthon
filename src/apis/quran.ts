import { useQuery } from "@tanstack/react-query";
import { useStore } from "@zustand/store";

export const getQuranByPage = (page: number) => {
  return useQuery({
    queryKey: ["quran", page],
    queryFn: () => getQuran(page),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
    cacheTime: 0,
    staleTime: 0,
    networkMode: "online",
  });
};

const getQuran = async (page: number) => {
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/page/${page}/quran-uthmani`
    );
    const data = await response.json();
    return data.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
