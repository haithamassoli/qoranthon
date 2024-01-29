import { z } from "zod";
import { Role } from "./data";

export const loginValidationSchema = z.object({
  email: z
    .string({
      required_error: "البريد الإلكتروني يجب أن لا يكون فارغًا",
    })
    .email("البريد الإلكتروني غير صالح"),
  password: z
    .string({
      required_error: "كلمة المرور يجب أن لا تكون فارغة",
    })
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type LoginValidationSchemaType = z.infer<typeof loginValidationSchema>;

export const studentLoginValidationSchema = z.object({
  studentId: z
    .string({
      required_error: "رقم الطالب يجب أن لا يكون فارغًا",
    })
    .min(6, "رقم الطالب يجب أن يكون 6 أرقام")
    .max(6, "رقم الطالب يجب أن يكون 6 أرقام"),
});

export type StudentLoginValidationSchemaType = z.infer<
  typeof studentLoginValidationSchema
>;

export const registerValidationSchema = z.object({
  name: z
    .string({
      required_error: "الاسم يجب أن لا يكون فارغًا",
    })
    .min(4, "الاسم يجب أن يكون 4 أحرف على الأقل"),
  phone: z.optional(
    z
      .string()
      .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
      .max(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
  ),
  email: z
    .string({
      required_error: "البريد الإلكتروني يجب أن لا يكون فارغًا",
    })
    .email("البريد الإلكتروني غير صالح"),
  password: z
    .string({
      required_error: "كلمة المرور يجب أن لا تكون فارغة",
    })
    .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type RegisterValidationSchemaType = z.infer<
  typeof registerValidationSchema
>;

export const studentValidationSchema = z.object({
  name: z
    .string({
      required_error: "الاسم يجب أن لا يكون فارغًا",
    })
    .min(4, "الاسم يجب أن يكون 4 أحرف على الأقل"),
  studentId: z
    .string({
      required_error: "رقم الطالب يجب أن لا يكون فارغًا",
    })
    .min(6, "رقم الطالب يجب أن يكون 6 أرقام")
    .max(6, "رقم الطالب يجب أن يكون 6 أرقام"),
  phone: z.optional(
    z
      .string()
      .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
      .max(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
  ),
});

export type StudentValidationSchemaType = z.infer<
  typeof studentValidationSchema
>;
export const quizValidationSchema = z.object({
  title: z.string({
    required_error: "العنوان يجب أن لا يكون فارغًا",
  }),
  questions: z
    .array(
      z.object({
        question: z.string({
          required_error: "السؤال يجب أن لا يكون فارغًا",
        }),
        options: z
          .array(
            z.string({
              required_error: "الخيار يجب أن لا يكون فارغًا",
            })
          )
          .min(2, "الخيارات يجب أن تكون خيارين على الأقل")
          .max(4, "الخيارات يجب أن تكون أربعة خيارات على الأكثر"),
      })
    )
    .min(1, "الأسئلة يجب أن تكون سؤال واحد على الأقل"),
});

export type QuizValidationSchemaType = z.infer<typeof quizValidationSchema>;
export const salfahValidationSchema = z.object({
  players: z
    .array(
      z.object({
        name: z.string({
          required_error: "الاسم يجب أن لا يكون فارغًا",
        }),
      })
    )
    .min(3, "اللاعبين يجب أن يكونوا لاعبين اثنين على الأقل")
    .refine(
      (items) => new Set(items.map((item) => item.name)).size === items.length,
      {
        message: "يجب أن يكون اللاعبين مختلفين",
      }
    ),
});

export type SalfahValidationSchemaType = z.infer<typeof salfahValidationSchema>;
export const enterGameValidationSchema = z.object({
  shortCode: z.string({
    required_error: "رمز الدخول يجب أن لا يكون فارغًا",
  }),
});

export type EnterGameValidationSchemaType = z.infer<
  typeof enterGameValidationSchema
>;
export const editStudentValidationSchema = z.object({
  name: z.optional(
    z
      .string({
        required_error: "الاسم يجب أن لا يكون فارغًا",
      })
      .min(4, "الاسم يجب أن يكون 4 أحرف على الأقل")
  ),
  newStudentId: z.optional(
    z
      .string({
        required_error: "رقم الطالب يجب أن لا يكون فارغًا",
      })
      .min(6, "رقم الطالب يجب أن يكون 6 أرقام")
      .max(6, "رقم الطالب يجب أن يكون 6 أرقام")
  ),
  phone: z.optional(
    z
      .string()
      .min(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
      .max(10, "رقم الهاتف يجب أن يكون 10 أرقام على الأقل")
  ),
  memorized: z.optional(
    z.string({
      required_error: "الحفظ يجب أن لا يكون فارغًا",
    })
  ),
  email: z.optional(
    z
      .string({
        required_error: "البريد الإلكتروني يجب أن لا يكون فارغًا",
      })
      .email("البريد الإلكتروني غير صالح")
  ),
  password: z.optional(
    z
      .string({
        required_error: "كلمة المرور يجب أن لا تكون فارغة",
      })
      .min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل")
  ),
});

export type EditStudentValidationSchemaType = z.infer<
  typeof editStudentValidationSchema
>;

export const validationSessionSchema = z.object({
  sessionType: z.enum(["مراجعة", "جديد"], {
    required_error: "نوع الجلسة يجب أن لا تكون فارغة",
  }),
  sessionRate: z.enum(["ممتاز", "جيد جدا", "جيد", "مقبول", "إعادة"], {
    required_error: "تقييم الجلسة يجب أن لا تكون فارغة",
  }),
  werd: z.string({
    required_error: "الورد يجب أن لا يكون فارغًا",
  }),
  notes: z.optional(
    z.string({
      required_error: "الملاحظات يجب أن لا تكون فارغة",
    })
  ),
});

export type ValidationSessionSchemaType = z.infer<
  typeof validationSessionSchema
>;

export const studentNoteSchema = z.object({
  notes: z.string({
    required_error: "الملاحظات يجب أن لا تكون فارغة",
  }),
});

export type StudentNoteSchemaType = z.infer<typeof studentNoteSchema>;

export const searchSchema = z.object({
  search: z
    .string({
      required_error: "البحث يجب أن لا يكون فارغا",
    })
    .max(3, "يجب أن يكون البحث رقمًا بين 1 و 604"),
  search2: z.optional(z.string()),
});

export type SearchSchemaType = z.infer<typeof searchSchema>;

export const notificationSchema = z.object({
  title: z.string({
    required_error: "العنوان يجب أن لا يكون فارغا",
  }),
  body: z.string({
    required_error: "النص يجب أن لا يكون فارغا",
  }),
});

export type NotificationSchemaType = z.infer<typeof notificationSchema>;

export const visionSchema = z.object({
  vision: z.string({
    required_error: "العنوان يجب أن لا يكون فارغا",
  }),
});

export type VisionSchemaType = z.infer<typeof visionSchema>;

export interface IUser {
  // apiKey: string;
  // appName: string;
  // createdAt: string;
  // email: string;
  // emailVerified: boolean;
  // isAnonymous: boolean;
  // lastLoginAt: string;
  // providerData: [
  //   {
  //     displayName?: string;
  //     email: string;
  //     phoneNumber?: string;
  //     photoURL?: string;
  //     providerId: string;
  //     uid: string;
  //   }
  // ];
  // stsTokenManager: {
  //   accessToken: string;
  //   expirationTime: number;
  //   refreshToken: string;
  // };
  id: string;
  role: Role;
  name: string;
  studentId?: string;
  pushNotificationsToken?: string;
  sheikhId?: string;
  managerId?: string;
  phone?: string;
}
