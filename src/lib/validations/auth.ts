import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Insira um e-mail válido'),
  password: z.string().min(6, 'A senha deve conter pelo menos 6 caracteres'),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'O nome deve conter pelo menos 2 caracteres'),
  email: z.string().email('Insira um e-mail válido'),
  password: z.string().min(6, 'A senha deve conter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'Confirme sua senha'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
