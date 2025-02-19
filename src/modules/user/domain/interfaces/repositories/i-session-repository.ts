import { SessionEntity } from '@/src/modules/user/domain/entities/session'

export interface ISessionRepository {
  save(session: SessionEntity): Promise<boolean>
  delete(token: string): Promise<boolean>
  findByToken(id: string): Promise<SessionEntity | null>
  update(session: SessionEntity): Promise<boolean>
}

// findById(id: string): Promise<Session | null>
// findByUserId(userId: string): Promise<Session[]>
