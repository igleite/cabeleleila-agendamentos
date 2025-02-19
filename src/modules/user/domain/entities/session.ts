import { Entity } from '@/src/modules/_shared/entities/entity'
import { UniqueEntityID } from '@/src/modules/_shared/entities/unique-entity-id'
import { GUID } from '@/src/modules/_shared/types/GUID'
import { Session as PrismaSession } from '@prisma/client'

export class SessionEntity extends Entity {
  userId: GUID
  token: string
  expires: Date
  lastUsed: Date

  private constructor(
    userId: GUID,
    token: string,
    expires: Date,
    lastUsed: Date,
    id?: UniqueEntityID,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt)
    this.userId = userId
    this.token = token
    this.expires = expires
    this.lastUsed = lastUsed
  }

  // Métodos de domínio
  public updateLastUsed(date: Date) {
    this.lastUsed = date
    this.updatedAt = new Date()
  }

  // Factories
  static Factory = class {
    static createNewSession(
      userId: GUID,
      token: string,
      expires: Date,
    ): SessionEntity {
      return new SessionEntity(userId, token, expires, new Date())
    }
  }

  // Map
  static Mapper = class {
    static toEntity(data: PrismaSession | null): SessionEntity | null {
      if (!data) return null

      return new SessionEntity(
        data.userId,
        data.token,
        data.expires,
        data.lastUsed,
        new UniqueEntityID(data.id),
        data.createdAt,
        data.updatedAt,
      )
    }
  }
}
