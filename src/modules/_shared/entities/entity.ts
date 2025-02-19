import { UniqueEntityID } from './unique-entity-id'

export abstract class Entity {
  readonly id: UniqueEntityID
  readonly createdAt: Date
  updatedAt: Date

  protected constructor(
    id?: UniqueEntityID,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.id = id ?? new UniqueEntityID()
    this.createdAt = createdAt ?? new Date()
    this.updatedAt = updatedAt ?? new Date()
  }

  public equals(entity: Entity) {
    return entity === this || entity.id === this.id
  }
}
