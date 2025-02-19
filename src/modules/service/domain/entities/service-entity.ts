import { Entity } from '@/src/modules/_shared/entities/entity'
import { UniqueEntityID } from '@/src/modules/_shared/entities/unique-entity-id'
import { Service as PrismaService } from '@prisma/client'

export class ServiceEntity extends Entity {
  name: string
  price: number
  active: boolean

  constructor(
    name: string,
    price: number,
    active = true,
    id?: UniqueEntityID,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt)
    this.name = name
    this.price = price
    this.active = active
  }

  // Métodos de domínio
  public updatePrice(price: number) {
    this.price = price
    this.updatedAt = new Date()
  }

  // Factory
  static Factory = class {
    static createNewService(name: string, price: number): ServiceEntity {
      return new ServiceEntity(name, price, true)
    }
  }

  // Mapper
  static Mapper = class {
    static toEntity(data: PrismaService | null): ServiceEntity | null {
      if (!data) return null
      return new ServiceEntity(
        data.name,
        data.price,
        data.active,
        new UniqueEntityID(data.id),
        data.createdAt,
        data.updatedAt,
      )
    }
  }
}
