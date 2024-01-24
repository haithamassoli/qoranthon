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

export const addQuiz = async () => {
  try {
    await firestore()
      .collection("quizzes")
      .doc("49kZiwTFbtxiBVQsjK2e")
      .collection("questions")
      .add({
        ...quizzes[0].questions[2],
      });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const quizzes = [
  {
    createdAt: new Date(),
    sheikhId: "sheikhId",
    sheikhName: "sheikhName",
    title: "معاني سورة العصر",
    questions: [
      {
        question: "ما معنى كلمة العصر",
        options: [
          "اسم للدهر وهو العشي والنهار فقط",
          "اسم للدهر وهو العشي والنهار والليل",
          "اسم للدهر وهو العشي والليل فقط",
        ],
        correctAnswer: "اسم للدهر وهو العشي والنهار والليل",
      },
      {
        question: "ما معنى كلمة الإنسان",
        options: ["كل بني آدم", "الإناث فقط", "الرجال فقط"],
        correctAnswer: "كل بني آدم",
      },
      {
        question: "ما معنى كلمة خسر",
        options: [
          "فقر ومرض وقلق",
          "يصح مرة ويمرض أخرى ويفتقر مرة ويغتني أخرى",
          "خسران وهلكة ونقصان",
        ],
        correctAnswer: "خسران وهلكة ونقصان",
      },
    ],
  },
  {
    createdAt: new Date(),
    sheikhId: "sheikhId",
    sheikhName: "sheikhName",
    title: "معاني سورة الناس",
    questions: [
      {
        question: "ما معنى كلمة أعوذ",
        options: ["أعتصم", "أحمد", "أنزه"],
        correctAnswer: "أعتصم",
      },
      {
        question: "ما معنى كلمة برب الناس",
        options: [
          "مربيهم وخالقهم ومدبر أحوالهم",
          "الذي يستجيب لهم الطاعات",
          "الذي يقبل منهم الطاعات",
        ],
        correctAnswer: "مربيهم وخالقهم ومدبر أحوالهم",
      },
      {
        question: "ما معنى كلمة الوسواس",
        options: ["الخاطر من الإنسان", "الخاطر من الشيطان", "السحر من الشيطان"],
        correctAnswer: "الخاطر من الشيطان",
      },
      {
        question: "ما معنى كلمة الخناس",
        options: [
          "الذي يظهر ويحضر عند ذكر الله",
          "الذي يختفي ويهرب عند ذكر الله",
          "الذي يخفي الشر للناس",
        ],
        correctAnswer: "الذي يختفي ويهرب عند ذكر الله",
      },
    ],
  },
];

export const addQuizzes = async () => {
  try {
  } catch (error: any) {
    throw new Error(error.message);
  }
};
