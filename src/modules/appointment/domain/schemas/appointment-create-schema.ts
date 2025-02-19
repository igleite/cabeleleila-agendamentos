import { z } from 'zod'
import { AppointmentStatus } from '@/src/modules/appointment/domain/entities/appointment-entity'

export const AppointmentCreateSchema = z.object({
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Formato de data inválido',
    })
    .transform((val) => new Date(val)),
  services: z.array(z.string()),
  status: z
    .enum([
      AppointmentStatus.PENDING,
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.IN_PROGRESS,
      AppointmentStatus.COMPLETED,
      AppointmentStatus.CANCELED,
    ])
    .default(AppointmentStatus.PENDING),
})

export type AppointmentCreateDTO = z.infer<typeof AppointmentCreateSchema>

export const AppointmentUpdateSchema = z.object({
  id: z.string(),
  date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Formato de data inválido',
    })
    .transform((val) => new Date(val)),
  services: z.array(z.string()),
  status: z
    .enum([
      AppointmentStatus.PENDING,
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.IN_PROGRESS,
      AppointmentStatus.COMPLETED,
      AppointmentStatus.CANCELED,
    ])
    .default(AppointmentStatus.PENDING),
})

export type AppointmentUpdateDTO = z.infer<typeof AppointmentUpdateSchema>

export const AppointmentGetSchema = z.object({
  id: z.string().min(1, 'Id é obrigatório'),
})

export type AppointmentGetDTO = z.infer<typeof AppointmentGetSchema>
