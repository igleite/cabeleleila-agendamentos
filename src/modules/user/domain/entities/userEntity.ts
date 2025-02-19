import { Entity } from '@/src/modules/_shared/entities/entity'
import { UniqueEntityID } from '@/src/modules/_shared/entities/unique-entity-id'
import { User } from '@prisma/client'

export class UserEntity extends Entity {
  email: string
  password: string | null
  name: string | null
  emailVerified: Date | null
  isAdmin: boolean

  private constructor(
    email: string,
    password: string | null,
    name: string | null,
    emailVerified: Date | null,
    isAdmin: boolean,
    id?: UniqueEntityID,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt)
    this.email = email
    this.password = password
    this.name = name
    this.emailVerified = emailVerified
    this.isAdmin = isAdmin
  }

  // Factories
  static Factory = class {
    static createNewUser(
      email: string,
      name: string,
      password: string | null,
    ): UserEntity {
      return new UserEntity(email, password, name, null, false)
    }
  }

  // Map
  static Mapper = class {
    static toEntity(data: User | null): UserEntity | null {
      if (!data) return null

      return new UserEntity(
        data.email,
        data.password,
        data.name,
        data.emailVerified,
        data.isAdmin,
        new UniqueEntityID(data.id),
        data.createdAt,
        data.updatedAt,
      )
    }
  }
}
