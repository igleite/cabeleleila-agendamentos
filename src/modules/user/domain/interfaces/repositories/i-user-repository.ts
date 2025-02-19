import { UserEntity } from '../../entities/userEntity'

export interface IUserRepository {
  save(user: UserEntity): Promise<boolean>
  findById(id: string): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
  // update(user: User): Promise<User>
  // delete(user: User): Promise<void>
}
