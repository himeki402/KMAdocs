import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
    username: z.string().min(4, "Tên đăng nhập phải có ít nhất 4 ký tự"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  username: z.string().min(4, "Tên đăng nhập phải có ít nhất 4 ký tự"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;

export const validateRegister = (data: RegisterFormData) => {
  try {
    registerSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return {
        success: false,
        errors: {
          name: fieldErrors.name?.[0],
          username: fieldErrors.username?.[0],
          password: fieldErrors.password?.[0],
          confirmPassword: fieldErrors.confirmPassword?.[0],
        },
      };
    }
    return { success: false, errors: { form: "Đã xảy ra lỗi" } };
  }
};

export const validateLogin = (data: LoginFormData) => {
  try {
    loginSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;
      return {
        success: false,
        errors: {
          username: fieldErrors.username?.[0],
          password: fieldErrors.password?.[0],
        },
      };
    }
    return { success: false, errors: { form: "Đã xảy ra lỗi" } };
  }
};