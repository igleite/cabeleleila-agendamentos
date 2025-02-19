import { injectable } from 'inversify'
import { IServiceRepository } from '../../domain/interfaces/repositories/i-service-repository'
import { ServiceEntity } from '@/src/modules/service/domain/entities/service-entity'
import { PrismaClient } from '@prisma/client'

@injectable()
export class ServiceRepository implements IServiceRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async getById(serviceId: string): Promise<ServiceEntity | null> {
    const data = await this.prisma.service.findUnique({
      where: { id: serviceId },
    })

    if (!data) {
      return null
    }

    return ServiceEntity.Mapper.toEntity(data)
  }

  async getAll(): Promise<ServiceEntity[]> {
    const data = await this.prisma.service.findMany({
      where: { active: true },
    })

    if (!data || data.length === 0) {
      return []
    }

    return data
      .map((service) => ServiceEntity.Mapper.toEntity(service))
      .filter((ser) => ser !== null)
  }

  async save(entity: ServiceEntity): Promise<boolean> {
    const data = await this.prisma.service.create({
      data: {
        id: entity.id.toString(),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        active: entity.active,
        name: entity.name,
        price: entity.price,
      },
    })

    return !!data?.id
  }

  async findById(id: string): Promise<ServiceEntity | null> {
    const data = await this.prisma.service.findUnique({
      where: { id },
    })

    if (!data) {
      return null
    }

    return ServiceEntity.Mapper.toEntity(data)
  }

  async update(entity: ServiceEntity): Promise<boolean> {
    const data = await this.prisma.service.update({
      where: { id: entity.id.toString() },
      data: {
        updatedAt: entity.updatedAt,
        active: entity.active,
        name: entity.name,
        price: entity.price,
      },
    })

    return !!data?.id
  }
}
