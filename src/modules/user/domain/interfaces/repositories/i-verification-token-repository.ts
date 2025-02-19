import { VerificationTokenEntity } from '@/src/modules/user/domain/entities/verification-token'

export interface IVerificationTokenRepository {
  save(verificationToken: VerificationTokenEntity): Promise<boolean>
  findByToken(token: string): Promise<VerificationTokenEntity | null>
  deleteByToken(token: string): Promise<boolean>
  // findByEmail(email: string): Promise<VerificationToken | null>
}
