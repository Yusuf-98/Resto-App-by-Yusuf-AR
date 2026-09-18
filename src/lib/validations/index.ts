import { z } from 'zod';

// --- Login Schema ---
export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  rememberMe: z.boolean().optional(),
});

// --- Register Schema ---
export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Email tidak valid'),
    phone: z
      .string()
      .min(10, 'Nomor HP minimal 10 digit')
      .max(15, 'Nomor HP maksimal 15 digit')
      .regex(/^[0-9+\-\s()]+$/, 'Format nomor HP tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

// --- Checkout Schema ---
export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(10, 'Alamat minimal 10 karakter'),
  phone: z.string().optional(),
  paymentMethod: z.string().min(1, 'Pilih metode pembayaran'),
  notes: z.string().optional(),
});

// --- Review Schema ---
export const reviewSchema = z.object({
  star: z.number().min(1).max(5),
  comment: z.string().min(10, 'Komentar minimal 10 karakter'),
});

// --- Update Profile Schema ---
export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  phone: z
    .string()
    .min(10, 'Nomor HP minimal 10 digit')
    .regex(/^[0-9+\-\s()]+$/, 'Format nomor HP tidak valid'),
  address: z.string().optional(),
});

// --- Inferred Types ---
export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export type ReviewFormValues = z.infer<typeof reviewSchema>;
export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
