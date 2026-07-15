import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters."),
  phone: z
    .string()
    .trim()
    .min(8, "Enter a valid phone number.")
    .max(20, "Enter a valid phone number."),
  birthDate: z.string().optional(),
});

export const addressSchema = z.object({
  receiverName: z.string().trim().min(2, "Enter receiver name."),
  phone: z
    .string()
    .trim()
    .min(8, "Enter a valid phone number.")
    .max(20, "Enter a valid phone number."),
  addressLine: z.string().trim().min(5, "Enter a valid address."),
  city: z.string().trim().min(2, "Enter city."),
  isPrimary: z.boolean(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(8, "Password must contain at least 8 characters."),
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
