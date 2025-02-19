import { PrismaClient } from '@prisma/client'
import { IUserRepository } from '../../domain/interfaces/repositories/i-user-repository'
import { injectable } from 'inversify'
import { UserEntity } from '../../domain/entities/userEntity'

@injectable()
export class UserRepository implements IUserRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async findById(id: string): Promise<UserEntity | null> {
    const data = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!data) {
      return null
    }

    return UserEntity.Mapper.toEntity(data)
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const data = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!data) {
      return null
    }

    return UserEntity.Mapper.toEntity(data)
  }

  async save(user: UserEntity): Promise<boolean> {
    const data = await this.prisma.user.create({
      data: {
        id: user.id.toString(),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        password: user.password,
        name: user.name,
        emailVerified: user.emailVerified,
      },
    })

    return !!data?.id
  }

  // async update(user: User): Promise<User> {
  //   return this.prisma.user.update({
  //     where: { id: user.id },
  //     data: {
  //       email: user.email,
  //       password: user.password,
  //       name: user.name,
  //       emailVerified: user.emailVerified,
  //     },
  //   })
  // }
  //
  // async delete(user: User): Promise<void> {
  //   await this.prisma.user.delete({
  //     where: { id: user.id },
  //   })
  // }
}
