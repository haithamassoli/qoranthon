import firestore from "@react-native-firebase/firestore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllUsers } from "./users";

export const getUsersLeaderboardQuery = (managerId: string) => {
  return useQuery({
    queryKey: ["usersLeaderboard"],
    queryFn: () => getUsersLeaderboardCollection(managerId),
  });
};

const getUsersLeaderboardCollection = async (managerId: string) => {
  try {
    let leaderboards: any[] = [];
    await getAllUsers(managerId).then((data) => {
      data.forEach(async (userDoc) => {
        await firestore()
          .collection("users")
          .doc(userDoc.id)
          .collection("leaderboard")
          .orderBy("createdAt", "desc")
          .limit(14)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              leaderboards.push({
                ...doc.data(),
                id: doc.id,
                name: userDoc.name,
                createdAt: doc.data().createdAt.toDate(),
              });
            });
          });
      });
    });
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
