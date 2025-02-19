import { PrismaClient } from '@prisma/client'
import { ISessionRepository } from '../../domain/interfaces/repositories/i-session-repository'
import { SessionEntity } from '@/src/modules/user/domain/entities/session'
import { injectable } from 'inversify'
import { UserEntity } from '@/src/modules/user/domain/entities/userEntity'

@injectable()
export class SessionRepository implements ISessionRepository {
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async save(session: SessionEntity): Promise<boolean> {
    const data = await this.prisma.session.create({
      data: {
        id: session.id.toString(),
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        userId: session.userId,
        token: session.token,
        expires: session.expires,
        lastUsed: session.lastUsed,
      },
    })

    return !!data?.id
  }

  async delete(token: string): Promise<boolean> {
    const data = await this.prisma.session.delete({
      where: { token },
    })

    return !!data?.id
  }

  async findByToken(token: string): Promise<SessionEntity | null> {
    const data = await this.prisma.session.findUnique({
      where: { token },
    })

    if (!data) {
      return null
    }

    return SessionEntity.Mapper.toEntity(data)
  }

  async update(session: SessionEntity): Promise<boolean> {
    const data = await this.prisma.session.update({
      where: { id: session.id.toString() },
      data: {
        token: session.token,
        expires: session.expires,
        lastUsed: session.lastUsed,
      },
    })

    return !!data?.id
  }
}

// async findById(id: string): Promise<Session | null> {
//   return this.prisma.session.findUnique({
//     where: { id },
//   })
// }
//
// async findByUserId(userId: string): Promise<Session[]> {
//   return this.prisma.session.findMany({
//     where: { userId },
//   })
// }

//
// async delete(session: Session): Promise<void> {
//   await this.prisma.session.delete({
//     where: { id: session.id },
//   })
// }
