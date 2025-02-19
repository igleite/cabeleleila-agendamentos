import { z } from 'zod'
import {
  emailSchema,
  loginPasswordSchema,
  passwordSchema,
} from '@/src/modules/_shared/schemas/schemas'

export const CreateUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema.optional(),
  name: z.string().min(1, 'O nome é necessário'),
})

export type CreateUserDTO = z.infer<typeof CreateUserSchema>

export const LoginUserSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
})

export type LoginUserDTO = z.infer<typeof LoginUserSchema>

export const MagicLinkUserSchema = z.object({
  email: emailSchema,
})

export type MagicLinkUserDTO = z.infer<typeof MagicLinkUserSchema>

export const VerifyUserSchema = z.object({
  token: z.string().min(1, 'Token é obrigatório'),
})

export type VerifyUserDTO = z.infer<typeof VerifyUserSchema>
