import { z } from 'zod'

export const nameSchema = z
  .string()
  .min(2, 'O nome deve ter pelo menos 2 caracteres')
  .trim() // Remove espaços extras antes e depois do nome
  .regex(/^[A-Za-záàãâéèêíóòôõúçÁÀÃÂÉÈÊÍÓÒÔÕÚÇ\s]+$/, {
    message: 'O nome pode conter apenas letras e espaços',
  })

export const emailSchema = z
  .string()
  .email('Formato de email inválido')
  .refine((value) => value !== '', { message: 'O email é necessário' })

export const registerSchema = z.object({
  email: emailSchema,
  name: nameSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
})

export const passwordSchema = z
  .string()
  .min(6, 'A senha deve ter pelo menos 6 caracteres')
  // .regex(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula') // Exige pelo menos uma letra maiúscula
  // .regex(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula') // Exige pelo menos uma letra minúscula
  // .regex(/[0-9]/, 'A senha deve conter pelo menos um número') // Exige pelo menos um número
  // .regex(
  //   /[@$!%*?&]/,
  //   'A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &)',
  // )
  .refine(
    (value) => !/\s/.test(value),
    'A senha não pode conter espaços em branco',
  )

export const loginPasswordSchema = z
  .string()
  .min(6, 'A senha deve ter pelo menos 6 caracteres')
  .refine(
    (value) => !/\s/.test(value),
    'A senha não pode conter espaços em branco',
  )
