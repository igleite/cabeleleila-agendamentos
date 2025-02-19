import { injectable } from 'inversify'
import { IAppointmentRepository } from '../../domain/interfaces/repositories/i-appointment-repository'
import { PrismaClient } from '@prisma/client'
import { AppointmentEntity } from '@/src/modules/appointment/domain/entities/appointment-entity'

@injectable()
export class AppointmentRepository implements IAppointmentRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async getByIdAndUser(
    serviceId: string,
    userId: string,
  ): Promise<AppointmentEntity | null> {
    const data = await this.prisma.appointment.findUnique({
      where: {
        id: serviceId,
        userId,
      },
    })

    if (!data) {
      return null
    }

    return AppointmentEntity.Mapper.toEntity(data)
  }

  async getAllByUser(userId: string): Promise<AppointmentEntity[]> {
    const data = await this.prisma.appointment.findMany({
      where: { userId },
    })

    if (!data || data.length === 0) {
      return []
    }

    return data
      .map((appointment) => AppointmentEntity.Mapper.toEntity(appointment))
      .filter((ser) => ser !== null)
  }

  async save(entity: AppointmentEntity): Promise<boolean> {
    const data = await this.prisma.appointment.create({
      data: {
        id: entity.id.toString(),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        date: entity.date,
        services: entity.services,
        total: entity.total,
        userId: entity.userId,
      },
    })

    return !!data?.id
  }

  async findById(id: string): Promise<AppointmentEntity | null> {
    const data = await this.prisma.appointment.findUnique({
      where: { id },
    })

    if (!data) {
      return null
    }

    return AppointmentEntity.Mapper.toEntity(data)
  }

  async update(entity: AppointmentEntity): Promise<boolean> {
    const data = await this.prisma.appointment.update({
      where: { id: entity.id.toString() },
      data: {
        updatedAt: entity.updatedAt,
        date: entity.date,
        services: entity.services,
        total: entity.total,
        status: entity.status,
      },
    })

    return !!data?.id
  }
}
