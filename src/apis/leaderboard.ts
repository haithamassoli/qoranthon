import firestore from "@react-native-firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "./users";

export const getUsersLeaderboardQuery = (managerId: string) => {
  return useQuery({
    queryKey: ["usersLeaderboard", managerId],
    queryFn: () => getUsersLeaderboardCollection(managerId),
    cacheTime: 0,
    staleTime: 0,
    networkMode: "online",
  });
};

const getUsersLeaderboardCollection = async (managerId: string) => {
  try {
    let leaderboards: any[] = [];

    const users = await getAllUsers(managerId);
    for (const userDoc of users) {
      const querySnapshot = await firestore()
        .collection("users")
        .doc(userDoc.id)
        .collection("sessions")
        .orderBy("createdAt", "desc")
        .where(
          "createdAt",
          ">",
          new Date(new Date().setDate(new Date().getDate() - 7))
        )
        .get();

      querySnapshot.forEach((doc) => {
        leaderboards.push({
          ...doc.data(),
          id: doc.id,
          name: userDoc.name,
          createdAt: doc.data().createdAt.toDate(),
        });
      });
    }

    return leaderboards as {
      id: string;
      createdAt: Date;
      name: string;
      points: number;
    }[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};
