import { inject, injectable } from 'inversify'
import { USER_TYPE } from '@/src/types'
import { IUserService } from '@/src/modules/user/domain/interfaces/services/i-user-service'
import {
  CreateUserDTO,
  LoginUserDTO,
  MagicLinkUserDTO,
  VerifyUserDTO,
} from '@/src/modules/user/domain/schemas/user-schema'
import { UserEntity } from '@/src/modules/user/domain/entities/userEntity'

@injectable()
export class UserUseCase {
  constructor(
    @inject(USER_TYPE.IUserService) private userService: IUserService,
  ) {}

  async register(dto: CreateUserDTO): Promise<UserEntity> {
    return this.userService.register(dto)
  }

  async login(dto: LoginUserDTO): Promise<void> {
    await this.userService.login(dto)
  }

  async logout(token: string): Promise<void> {
    await this.userService.logout(token)
  }

  async validateSession(token: string): Promise<UserEntity | null> {
    return await this.userService.validateSession(token)
  }

  async magicLink(dto: MagicLinkUserDTO): Promise<void> {
    await this.userService.magicLink(dto)
  }

  async verify(dto: VerifyUserDTO): Promise<void> {
    await this.userService.verify(dto)
  }
}
