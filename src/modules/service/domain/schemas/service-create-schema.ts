import { z } from 'zod'

export const ServiceCreateSchema = z.object({
  active: z.boolean().default(true),
  name: z.string().min(1, { message: 'O nome do serviço é obrigatório' }),
  price: z
    .number()
    .positive({ message: 'O preço deve ser um número positivo' }),
})

export type ServiceCreateDTO = z.infer<typeof ServiceCreateSchema>

export const ServiceUpdateSchema = z.object({
  id: z.string(),
  active: z.boolean().default(true),
  name: z.string().min(1, { message: 'O nome do serviço é obrigatório' }),
  price: z
    .number()
    .positive({ message: 'O preço deve ser um número positivo' }),
})

export type ServiceUpdateDTO = z.infer<typeof ServiceUpdateSchema>

export const ServiceGetSchema = z.object({
  id: z.string().min(1, 'Id é obrigatório'),
})

export type ServiceGetDTO = z.infer<typeof ServiceGetSchema>
