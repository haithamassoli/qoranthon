import firestore from "@react-native-firebase/firestore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { shuffleArr } from "@utils/helper";
import { useStore } from "@zustand/store";

export const getQuizzesQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["quizzes"],
    queryFn: () => getQuizzes(),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
    enabled,
  });
};

const getQuizzes = async () => {
  try {
    let quizzes: any[] = [];
    const querySnapshot = await firestore().collection("quizzes").get();
    querySnapshot.forEach((doc) => {
      quizzes.push({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
      });
    });
    return quizzes;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getQuizByIdQuery = (quizId: string) => {
  return useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuizById(quizId),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const getQuizById = async (quizId: string) => {
  try {
    let quiz: any[] = [];
    const querySnapshot = await firestore()
      .collection("quizzes")
      .doc(quizId)
      .collection("questions")
      .get();
    querySnapshot.forEach((doc) => {
      quiz.push({
        id: doc.id,
        question: doc.data().question,
        options: shuffleArr(doc.data().options),
        correctAnswer: doc.data().correctAnswer,
      });
    });
    return shuffleArr(quiz);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addQuizzes = async () => {
  try {
  } catch (error: any) {
    throw new Error(error.message);
  }
};

type Quiz = {
  sheikhId: string;
  sheikhName: string;
  title: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
};
type GameQuiz = {
  sheikhId: string;
  title: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
};

export const addQuizMutation = () => {
  return useMutation({
    mutationFn: (data: Quiz) => addQuiz(data),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};
const addQuiz = async (data: Quiz) => {
  try {
    const quizRef = firestore()
      .collection("quizzes")
      .add({
        createdAt: firestore.FieldValue.serverTimestamp(),
        sheikhId: data.sheikhId,
        sheikhName: data.sheikhName,
        title: data.title,
      })
      .then((docRef) => {
        data.questions.forEach((question: any) => {
          docRef.collection("questions").add({
            question: question.question,
            options: question.options,
            correctAnswer: question.options[0],
          });
        });
      });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteQuizMutation = () => {
  return useMutation({
    mutationFn: (quizId: string) => deleteQuiz(quizId),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};
const deleteQuiz = async (quizId: string) => {
  try {
    await firestore().collection("quizzes").doc(quizId).delete();
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getSheikhQuizzesQuery = (enabled: boolean, sheikhId: string) => {
  return useQuery({
    queryKey: ["gameQuizzes"],
    queryFn: () => getSheikhQuizzes(sheikhId),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
    enabled,
  });
};

const getSheikhQuizzes = async (sheikhId: string) => {
  try {
    let quizzes: any[] = [];
    const querySnapshot = await firestore()
      .collection("games")
      .where("sheikhId", "==", sheikhId)
      .get();
    querySnapshot.forEach((doc) => {
      quizzes.push({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
      });
    });
    return quizzes;
    // for (const quiz of quizzes) {
    //   const querySnapshot = await firestore()
    //     .collection("games")
    //     .doc(quiz.id)
    //     .collection("questions")
    //     .get();
    //   querySnapshot.forEach((doc) => {
    //     questions.push({
    //       ...doc.data(),
    //       id: doc.id,
    //     });
    //   });
    // }
    // return questions;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addGameQuizMutation = () => {
  return useMutation({
    mutationFn: (data: GameQuiz) => addGameQuiz(data),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};
const addGameQuiz = async (data: GameQuiz) => {
  try {
    const quizRef = firestore()
      .collection("games")
      .add({
        createdAt: firestore.FieldValue.serverTimestamp(),
        sheikhId: data.sheikhId,
        shortCode: Math.floor(1000 + Math.random() * 9000).toString(),
        title: data.title,
        state: "draft",
      })
      .then((docRef) => {
        data.questions.forEach((question: any) => {
          docRef.collection("questions").add({
            question: question.question,
            options: question.options,
            correctAnswer: question.options[0],
          });
        });
      });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const deleteGameMutation = () => {
  return useMutation({
    mutationFn: (gameId: string) => deleteGame(gameId),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};
const deleteGame = async (gameId: string) => {
  try {
    await firestore().collection("games").doc(gameId).delete();
  } catch (error: any) {
    throw new Error(error);
  }
};

type Player = {
  shortCode: string;
  playerId: string;
  playerName: string;
};

export const enterGameMutation = () => {
  return useMutation({
    mutationFn: (data: Player) => enterGame(data),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const enterGame = async (data: Player) => {
  try {
    let game: any[] = [];

    await firestore()
      .collection("games")
      .where("state", "==", "waitingForPlayers")
      .where("shortCode", "==", data.shortCode)
      .get()
      .then((querySnapshot) => {
        console.log(querySnapshot);
        if (querySnapshot.empty) {
          throw new Error("لا يوجد غرفة بهذا الرمز");
        }
        let gameRoom: any[] = [];
        querySnapshot.forEach((doc) => {
          gameRoom.push({
            gameId: doc.id,
            gameTitle: doc.data().title,
          });
          const game = firestore()
            .collection("games")
            .doc(doc.id)
            .collection("players")
            .add({
              playerId: data.playerId,
              playerName: data.playerName,
              score: 0,
            });
        });
        game = gameRoom;
      });
    return game;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getGamePlayersQuery = (gameId: string) => {
  return useQuery({
    queryKey: ["gamePlayers", gameId],
    queryFn: () => getGamePlayers(gameId),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const getGamePlayers = async (gameId: string) => {
  try {
    let players: any[] = [];
    const querySnapshot = await firestore()
      .collection("games")
      .doc(gameId)
      .collection("players")
      .orderBy("score", "desc")
      .get();
    querySnapshot.forEach((doc) => {
      players.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    return players;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
