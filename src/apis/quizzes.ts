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
