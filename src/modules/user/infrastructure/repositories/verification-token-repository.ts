import { PrismaClient } from '@prisma/client'
import { IVerificationTokenRepository } from '../../domain/interfaces/repositories/i-verification-token-repository'
import { injectable } from 'inversify'
import { VerificationTokenEntity } from '@/src/modules/user/domain/entities/verification-token'

@injectable()
export class VerificationTokenRepository
  implements IVerificationTokenRepository
{
  private prisma: PrismaClient

  constructor() {
    this.prisma = new PrismaClient()
  }

  async save(verificationToken: VerificationTokenEntity): Promise<boolean> {
    const data = await this.prisma.verificationToken.create({
      data: {
        id: verificationToken.id.toString(),
        createdAt: verificationToken.createdAt,
        token: verificationToken.token,
        email: verificationToken.email,
        expires: verificationToken.expires,
      },
    })

    return !!data?.id
  }

  async findByToken(token: string): Promise<VerificationTokenEntity | null> {
    const data = await this.prisma.verificationToken.findUnique({
      where: { token },
    })

    if (!data) {
      return null
    }

    return VerificationTokenEntity.Mapper.toEntity(data)
  }

  async deleteByToken(token: string): Promise<boolean> {
    const data = await this.prisma.verificationToken.delete({
      where: { token },
    })

    return !!data?.id
  }

  // async findByEmail(email: string): Promise<VerificationToken | null> {
  //   return this.prisma.verificationToken.findFirst({
  //     where: { email },
  //   })
  // }

  // async delete(verificationToken: VerificationToken): Promise<void> {
  //   await this.prisma.verificationToken.delete({
  //     where: { token: verificationToken.token },
  //   })
  // }
}
