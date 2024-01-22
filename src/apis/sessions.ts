import firestore from "@react-native-firebase/firestore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@zustand/store";
import { SessionRate, SessionType } from "@src/types/data";

type Session = {
  numPitfalls: number;
  numErrs: number;
  images: string[];
  createdAt: Date;
  studentId: string;
  sessionType: SessionType;
  sessionRate: SessionRate;
  notes?: string;
  werd: string;
  points: number;
};

export const addSessionMutation = () => {
  return useMutation({
    mutationFn: (data: Session) => addSession(data),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const addSession = async (data: Session) => {
  try {
    await firestore()
      .collection("users")
      .doc(data.studentId)
      .update({
        sessionsCount: firestore.FieldValue.increment(1),
      });
    const session = await firestore()
      .collection("users")
      .doc(data.studentId)
      .collection("sessions")
      .add({
        ...data,
        werd: data.werd || "",
        notes: data.notes || "",
      });
    return session;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getStudentSessionsQuery = (studentId: string) => {
  return useQuery({
    queryKey: ["sessions", studentId],
    queryFn: () => getStudentSessions(studentId),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const getStudentSessions = async (studentId: string) => {
  try {
    const querySnapshot = await firestore()
      .collection("users")
      .doc(studentId)
      .collection("sessions")
      .orderBy("createdAt", "desc")
      .get();
    let sessions: any[] = [];
    querySnapshot.forEach((doc) => {
      sessions.push({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data().createdAt.toDate(),
      });
    });
    return sessions as {
      id: string;
      numPitfalls: number;
      numErrs: number;
      images: string[];
      createdAt: Date;
      studentId: string;
      sessionType: SessionType;
      sessionRate: SessionRate;
      notes?: string;
      werd: string;
      points: number;
    }[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getSessionByIdQuery = (studentId: string, sessionId: string) => {
  return useQuery({
    queryKey: ["sessions", studentId, sessionId],
    queryFn: () => getSessionById(studentId, sessionId),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const getSessionById = async (studentId: string, sessionId: string) => {
  try {
    const session = await firestore()
      .collection("users")
      .doc(studentId)
      .collection("sessions")
      .doc(sessionId)
      .get();
    return {
      ...session.data(),
      id: session.id,
      createdAt: session.data().createdAt.toDate(),
    } as {
      id: string;
      numPitfalls: number;
      numErrs: number;
      notes?: string;
      werd: string;
      images: string[];
      createdAt: Date;
      studentId: string;
      sessionType: SessionType;
      sessionRate: SessionRate;
      points: number;
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteSessionMutation = () => {
  return useMutation({
    mutationFn: (data: { studentId: string; sessionId: string }) =>
      deleteSession(data),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const deleteSession = async (data: {
  studentId: string;
  sessionId: string;
}) => {
  try {
    await firestore()
      .collection("users")
      .doc(data.studentId)
      .collection("sessions")
      .doc(data.sessionId)
      .delete();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
