import firestore from "@react-native-firebase/firestore";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useStore } from "@zustand/store";

export const getAllSheikhStudentsQuery = (sheikhId: string) => {
  return useQuery({
    queryKey: ["users", sheikhId],
    queryFn: () => getAllSheikhStudents(sheikhId),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const getAllSheikhStudents = async (sheikhId: string) => {
  try {
    const querySnapshot = await firestore()
      .collection("users")
      .where("sheikhId", "==", sheikhId)
      .orderBy("name")
      .get();
    let sheikhStudents: any[] = [];
    querySnapshot.forEach((doc) => {
      sheikhStudents.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    return sheikhStudents as {
      id: string;
      name: string;
      email: string;
      phone?: string;
      studentId: string;
      memorized?: string;
      sheikhId: string;
      role: string;
      notes?: string;
      pushNotificationsToken?: string;
    }[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getUserByIdQuery = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const getUserById = async (userId: string) => {
  try {
    const user = await firestore().collection("users").doc(userId).get();
    return { ...user.data(), id: user.id } as {
      id: string;
      name: string;
      email: string;
      phone?: string;
      sheikhId?: string;
      role: string;
      memorized?: string;
      pushNotificationsToken?: string;
      studentId?: string;
      notes?: string;
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllAdminsQuery = (enabled: boolean) => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: () => getAllAdmins(),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
    enabled,
  });
};

const getAllAdmins = async () => {
  try {
    const querySnapshot = await firestore()
      .collection("users")
      .where("role", "==", "admin")
      .orderBy("name")
      .get();
    let admins: any[] = [];
    querySnapshot.forEach((doc) => {
      admins.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    return admins as {
      id: string;
      name: string;
      email: string;
      phone?: string;
      role: string;
      pushNotificationsToken?: string;
    }[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const editNotesMutation = () => {
  return useMutation({
    mutationFn: ({ studentId, notes }: { studentId: string; notes: string }) =>
      editNotes(studentId, notes),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const editNotes = async (studentId: string, notes: string) => {
  try {
    await firestore().collection("users").doc(studentId).update({ notes });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const editNameMutation = () => {
  return useMutation({
    mutationFn: ({ studentId, name }: { studentId: string; name: string }) =>
      editName(studentId, name),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const editName = async (studentId: string, name: string) => {
  try {
    await firestore().collection("users").doc(studentId).update({ name });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const editPhoneMutation = () => {
  return useMutation({
    mutationFn: ({ studentId, phone }: { studentId: string; phone: string }) =>
      editPhone(studentId, phone),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const editPhone = async (studentId: string, phone: string) => {
  try {
    await firestore().collection("users").doc(studentId).update({ phone });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const editStudentIdMutation = () => {
  return useMutation({
    mutationFn: ({
      studentId,
      newStudentId,
    }: {
      studentId: string;
      newStudentId: string;
    }) => editStudentId(studentId, newStudentId),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const editStudentId = async (studentId: string, newStudentId: string) => {
  try {
    await firestore()
      .collection("users")
      .doc(studentId)
      .update({ studentId: newStudentId });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const editMemorizedMutation = () => {
  return useMutation({
    mutationFn: ({
      studentId,
      memorized,
    }: {
      studentId: string;
      memorized: string;
    }) => editMemorized(studentId, memorized),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const editMemorized = async (studentId: string, memorized: string) => {
  try {
    await firestore().collection("users").doc(studentId).update({ memorized });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export const editSheikhIdMutation = () => {
  return useMutation({
    mutationFn: ({
      studentId,
      sheikhId,
    }: {
      studentId: string;
      sheikhId: string;
    }) => editSheikhId(studentId, sheikhId),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const editSheikhId = async (studentId: string, sheikhId: string) => {
  try {
    await firestore().collection("users").doc(studentId).update({ sheikhId });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getAllUsersQuery = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });
};

const getAllUsers = async () => {
  try {
    const querySnapshot = await firestore()
      .collection("users")
      .where("role", "==", "user")
      .orderBy("name")
      .get();
    let users: any[] = [];
    querySnapshot.forEach((doc) => {
      users.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    return users as {
      id: string;
      name: string;
      email: string;
      phone?: string;
      studentId?: string;
      memorized?: string;
      sheikhId?: string;
      role: string;
      notes?: string;
      pushNotificationsToken?: string;
    }[];
  } catch (error: any) {
    throw new Error(error.message);
  }
};
