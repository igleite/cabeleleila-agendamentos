import { UserEntity } from '@/src/modules/user/domain/entities/userEntity'
import {
  CreateUserDTO,
  LoginUserDTO,
  MagicLinkUserDTO,
  VerifyUserDTO,
} from '@/src/modules/user/domain/schemas/user-schema'

export interface IUserService {
  register(dto: CreateUserDTO): Promise<UserEntity>
  login(dto: LoginUserDTO): Promise<void>
  logout(token: string): Promise<void>
  validateSession(token: string): Promise<UserEntity>
  magicLink(dto: MagicLinkUserDTO): Promise<void>
  verify(dto: VerifyUserDTO): Promise<void>
}
