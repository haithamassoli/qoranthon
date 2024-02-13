import { storeDataMMKV } from "@utils/helper";
import firestore from "@react-native-firebase/firestore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useStore } from "@zustand/store";

interface ILoginData {
  email: string;
  password: string;
}
interface IStudentLoginData {
  studentId: string;
}

interface IRegisterData {
  name: string;
  email: string;
  password: string;
  managerId: string;
  phone?: string;
}
interface IRegisterStudentData {
  name: string;
  studentId: string;
  sheikhId: string;
  managerId: string;
  phone?: string;
}

export const loginMutation = () => {
  return useMutation({
    mutationFn: (data: ILoginData) =>
      login(data.email.toLowerCase(), data.password),
    onSuccess: (data: any) => {
      useStore.setState({ user: data, snackbarText: "تم تسجيل الدخول بنجاح" });
    },
    onError: (error: any) => {
      useStore.setState({ snackbarText: error.message });
    },
  });
};

const login = async (email: string, password: string) => {
  try {
    let userWithInfo = {};
    await firestore()
      .collection("users")
      .where("email", "==", email)
      .where("password", "==", password)
      .get()
      .then((res) => {
        if (!res.docs.length) {
          throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        }
        res.forEach((doc) => {
          userWithInfo = {
            id: doc.id,
            email: doc.data().email,
            role: doc.data().role,
            name: doc.data().name,
            pushNotificationsToken: doc.data().pushNotificationsToken || null,
            managerId: doc.data().managerId,
            phone: doc.data().phone || null,
          };
          storeDataMMKV("user", userWithInfo);
        });
      });
    return userWithInfo;
  } catch (error: any) {
    throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
  }
};

export const studentLoginMutation = () => {
  return useMutation({
    mutationFn: (data: IStudentLoginData) => studentLogin(data.studentId),
    onSuccess: (data: any) => {
      useStore.setState({ user: data, snackbarText: "تم تسجيل الدخول بنجاح" });
    },
    onError: (error: any) => {
      useStore.setState({ snackbarText: error.message });
    },
  });
};

const studentLogin = async (studentId: string) => {
  try {
    let userWithInfo = {};
    await firestore()
      .collection("users")
      .where("studentId", "==", studentId)
      .get()
      .then((res) => {
        if (!res.docs.length) {
          throw new Error("رقم تسجيل الطالب غير صحيح");
        }
        res.forEach((doc) => {
          userWithInfo = {
            id: doc.id,
            studentId: doc.data().studentId,
            role: doc.data().role,
            name: doc.data().name,
            sheikhId: doc.data().sheikhId,
            pushNotificationsToken: doc.data().pushNotificationsToken || null,
            managerId: doc.data().managerId,
          };
        });
        storeDataMMKV("user", userWithInfo);
      });
    return userWithInfo;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const registerMutation = () => {
  return useMutation({
    mutationFn: (data: IRegisterData) =>
      register(
        data.name,
        data.email.toLowerCase(),
        data.password,
        data.managerId,
        data.phone
      ),
    onError: (error: any) => {
      useStore.setState({ snackbarText: error.message });
    },
  });
};

const register = async (
  name: string,
  email: string,
  password: string,
  managerId: string,
  phone?: string
) => {
  try {
    await firestore()
      .collection("users")
      .where("email", "==", email)
      .get()
      .then((res) => {
        if (res.docs.length) {
          throw new Error("البريد الإلكتروني مسجل مسبقاً");
        }
      });
    await firestore()
      .collection("users")
      .add({
        email,
        password,
        name,
        role: "admin",
        phone: phone || null,
        createdAt: new Date(),
        managerId,
      });
    return;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const addStudentMutation = () => {
  return useMutation({
    mutationFn: (data: IRegisterStudentData) => addStudent(data),
    onError: (error: any) => {
      useStore.setState({ snackbarText: error.message });
    },
  });
};

const addStudent = async (data: IRegisterStudentData) => {
  try {
    await firestore()
      .collection("users")
      .where("studentId", "==", data.studentId)
      .get()
      .then((res) => {
        if (res.docs.length) {
          throw new Error("رقم تسجيل الطالب مسجل مسبقاً");
        }
      });
    await firestore()
      .collection("users")
      .add({
        createdAt: new Date(),
        role: "user",
        name: data.name,
        managerId: data.managerId,
        sheikhId: data.sheikhId,
        phone: data.phone || null,
        studentId: data.studentId,
        sessionsCount: 0,
        quizzesCount: 0,
      });
    return;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const logoutMutation = () => {
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      useStore.setState({ snackbarText: "تم تسجيل الخروج بنجاح", user: null });
    },
    onError: (error: any) => {
      useStore.setState({ snackbarText: error.message });
    },
  });
};
export const logout = async () => storeDataMMKV("user", null);

export const deleteUserMutation = () => {
  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const deleteUser = async (userId: string) => {
  try {
    await firestore().collection("users").doc(userId).delete();
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const editEmailMutation = () => {
  return useMutation({
    mutationFn: ({ id, email }: { id: string; email: string }) =>
      editEmail(id, email),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const editEmail = async (id: string, email: string) => {
  try {
    await firestore().collection("users").doc(id).update({ email });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const editPasswordMutation = () => {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      editPassword(id, password),
    onError: (error: any) => useStore.setState({ snackbarText: error.message }),
  });
};

const editPassword = async (id: string, password: string) => {
  try {
    await firestore().collection("users").doc(id).update({ password });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

type Request = {
  name: string;
  telegram: string;
  sex: Sex;
};

type Sex = "ذكر" | "أنثى";
export const addRequestMutation = () => {
  return useMutation({
    mutationFn: (data: Request) =>
      addRequest(data.name, data.telegram, data.sex),
    onError: (error: any) => {
      useStore.setState({ snackbarText: error.message });
    },
  });
};

const addRequest = async (name: string, telegram: string, sex: Sex) => {
  try {
    await firestore().collection("requests").add({
      name,
      telegram,
      sex,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const getRequestsQuery = () => {
  return useQuery({
    queryKey: ["requests"],
    queryFn: () => getRequests(),
    onError: (error: any) => {
      useStore.setState({ snackbarText: error.message });
    },
  });
};
const getRequests = async () => {
  try {
    const requests: (Request & { id: string } & { createdAt: Date })[] = [];
    await firestore()
      .collection("requests")
      .orderBy("createdAt", "desc")
      .get()
      .then((res) => {
        res.forEach((doc) => {
          requests.push({
            ...doc.data(),
            id: doc.id,
            name: doc.data().name,
            telegram: doc.data().telegram,
            sex: doc.data().sex,
            createdAt: doc.data().createdAt.toDate(),
          });
        });
      });
    return requests;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const deleteRequestMutation = () => {
  return useMutation({
    mutationFn: (id: string) => deleteRequest(id),
    onError: (error: any) => {
      useStore.setState({ snackbarText: error.message });
    },
  });
};

const deleteRequest = async (id: string) => {
  try {
    await firestore().collection("requests").doc(id).delete();
  } catch (error: any) {
    throw new Error(error.message);
  }
};
