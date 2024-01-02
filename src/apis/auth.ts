import { storeDataMMKV } from "@utils/helper";
import firestore from "@react-native-firebase/firestore";
import { useMutation } from "@tanstack/react-query";
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
  phone?: string;
}
interface IRegisterStudentData {
  name: string;
  studentId: string;
  sheikhId: string;
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
            sheikhId: doc.data().sheikhId || null,
            pushNotificationsToken: doc.data().pushNotificationsToken || null,
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
      register(data.name, data.email.toLowerCase(), data.password, data.phone),
    onError: (error: any) => {
      useStore.setState({ snackbarText: error.message });
    },
  });
};

const register = async (
  name: string,
  email: string,
  password: string,
  phone?: string
) => {
  try {
    await firestore()
      .collection("users")
      .add({
        email,
        password,
        name,
        role: "admin",
        phone: phone || null,
        createdAt: new Date(),
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
      .add({
        createdAt: new Date(),
        role: "user",
        name: data.name,
        sheikhId: data.sheikhId,
        phone: data.phone || null,
        studentId: data.studentId,
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
