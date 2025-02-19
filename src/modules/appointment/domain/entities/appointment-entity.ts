import { Entity } from '@/src/modules/_shared/entities/entity'
import { UniqueEntityID } from '@/src/modules/_shared/entities/unique-entity-id'
import { Appointment as PrismaAppointment } from '@prisma/client'

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export class AppointmentEntity extends Entity {
  date: Date
  services: string[]
  total: number
  userId: string
  status: AppointmentStatus

  private constructor(
    date: Date,
    services: string[],
    total: number,
    userId: string,
    status: AppointmentStatus = AppointmentStatus.PENDING,
    id?: UniqueEntityID,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt)
    this.date = date
    this.services = services
    this.total = total
    this.userId = userId
    this.status = status
  }

  // Métodos de domínio
  public updateTotal(total: number) {
    this.total = total
    this.updatedAt = new Date()
  }

  public updateStatus(status: AppointmentStatus) {
    this.status = status
    this.updatedAt = new Date()
  }

  // Factories
  static Factory = class {
    static createNewAppointment(
      date: Date,
      services: string[],
      total: number,
      userId: string,
      status: AppointmentStatus = AppointmentStatus.PENDING,
    ): AppointmentEntity {
      return new AppointmentEntity(date, services, total, userId, status)
    }
  }

  // Map
  static Mapper = class {
    static toEntity(data: PrismaAppointment | null): AppointmentEntity | null {
      if (!data) return null

      return new AppointmentEntity(
        data.date,
        data.services,
        data.total,
        data.userId,
        AppointmentStatus[data.status as keyof typeof AppointmentStatus],
        new UniqueEntityID(data.id),
        data.createdAt,
        data.updatedAt,
      )
    }
  }
}
