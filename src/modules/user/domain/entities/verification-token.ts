import { Entity } from '@/src/modules/_shared/entities/entity'
import { UniqueEntityID } from '@/src/modules/_shared/entities/unique-entity-id'
import { VerificationToken as PrismaVerificationToken } from '@prisma/client'

export class VerificationTokenEntity extends Entity {
  token: string
  email: string
  expires: Date

  private constructor(
    token: string,
    email: string,
    expires: Date,
    id?: UniqueEntityID,
    createdAt?: Date,
  ) {
    super(id, createdAt)
    this.token = token
    this.email = email
    this.expires = expires
  }

  // Factories
  static Factory = class {
    static createNewToken(
      token: string,
      email: string,
      expires: Date,
    ): VerificationTokenEntity {
      return new VerificationTokenEntity(token, email, expires)
    }
  }

  // Map
  static Mapper = class {
    static toEntity(
      data: PrismaVerificationToken | null,
    ): VerificationTokenEntity | null {
      if (!data) return null

      return new VerificationTokenEntity(
        data.token,
        data.email,
        data.expires,
        new UniqueEntityID(data.id),
        data.createdAt,
      )
    }
  }
}
