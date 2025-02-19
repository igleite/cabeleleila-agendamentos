import { IUserService } from '../../domain/interfaces/services/i-user-service'
import { IUserRepository } from '../../domain/interfaces/repositories/i-user-repository'
import { inject, injectable } from 'inversify'
import { USER_TYPE } from '@/src/types'
import { UserEntity } from '../../domain/entities/userEntity'
import {
  CreateUserDTO,
  LoginUserDTO,
  MagicLinkUserDTO,
  VerifyUserDTO,
} from '@/src/modules/user/domain/schemas/user-schema'
import { ISessionRepository } from '@/src/modules/user/domain/interfaces/repositories/i-session-repository'
import { SessionEntity } from '@/src/modules/user/domain/entities/session'
import {
  hashPassword,
  verifyPassword,
} from '@/src/modules/_shared/utils/hash-password'
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@/src/modules/_shared/middlewares/catch-errors'
import { cookies } from 'next/headers'
import { getToken } from '@/src/modules/_shared/utils/token'
import { IVerificationTokenRepository } from '@/src/modules/user/domain/interfaces/repositories/i-verification-token-repository'
import { VerificationTokenEntity } from '@/src/modules/user/domain/entities/verification-token'
import { sendEmail } from '@/src/modules/_shared/utils/send-email'

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(USER_TYPE.IUserRepository) private userRepository: IUserRepository,
    @inject(USER_TYPE.ISessionRepository)
    private sessionRepository: ISessionRepository,
    @inject(USER_TYPE.IVerificationTokenRepository)
    private tokenRepository: IVerificationTokenRepository,
  ) {}

  async register(dto: CreateUserDTO): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(dto.email)
    if (existingUser) {
      throw new ConflictException('Email já em uso!')
    }

    let pass = null
    if (dto.password) {
      pass = await hashPassword(dto.password)
    }
    const user: UserEntity = UserEntity.Factory.createNewUser(
      dto.email,
      dto.name,
      pass,
    )

    const success = await this.userRepository.save(user)
    if (!success) {
      throw new UnprocessableEntityException(
        'Não foi possível cadastrar o usuário.',
      )
    }

    return user
  }

  async login(dto: LoginUserDTO): Promise<void> {
    const user: UserEntity | null = await this.userRepository.findByEmail(
      dto.email,
    )

    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciais inválidas.')
    }

    const isValid: boolean = await verifyPassword(dto.password, user.password)
    if (!isValid) {
      throw new UnauthorizedException('Credenciais inválidas.')
    }

    const userId = user.id.toString()

    const token = await getToken({ userId })

    const expires = new Date()
    expires.setHours(expires.getHours() + 24)

    const session: SessionEntity = SessionEntity.Factory.createNewSession(
      userId,
      token,
      expires,
    )

    const success = await this.sessionRepository.save(session)
    if (!success) {
      throw new UnprocessableEntityException(
        'Não foi possível iniciar a sessão.',
      )
    }

    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })
  }

  async logout(token: string): Promise<void> {
    const data = await this.sessionRepository.findByToken(token)
    if (!data) {
      throw new UnprocessableEntityException(
        'Não foi possível encerrar a sessão.',
      )
    }

    const success = await this.sessionRepository.delete(token)
    if (!success) {
      throw new UnprocessableEntityException(
        'Não foi possível encerrar a sessão.',
      )
    }

    cookies().delete('auth_token')
  }

  async validateSession(token: string): Promise<UserEntity> {
    const session = await this.sessionRepository.findByToken(token)
    if (!session) {
      throw new NotFoundException('Sessão não encontrada.')
    }

    if (!session || session.expires < new Date()) {
      cookies().delete('auth_token')
      throw new ForbiddenException()
    }

    session.updateLastUsed(new Date())

    const success = await this.sessionRepository.update(session)
    if (!success) {
      throw new UnprocessableEntityException(
        'Não foi possível atualizar a sessão.',
      )
    }

    const user = await this.userRepository.findById(session.userId)
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.')
    }

    return user
  }

  async magicLink(dto: MagicLinkUserDTO): Promise<void> {
    const user = await this.userRepository.findByEmail(dto.email)
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.')
    }

    const token = await getToken({ email: user.email })
    const expires = new Date()
    expires.setMinutes(expires.getMinutes() + 15)

    const verificationToken: VerificationTokenEntity =
      VerificationTokenEntity.Factory.createNewToken(token, user.email, expires)

    const result = await this.tokenRepository.save(verificationToken)
    if (!result) {
      throw new UnprocessableEntityException(
        'Não foi possível enviar o link por e-mail.',
      )
    }

    await sendEmail(user.email, token)
  }

  async verify(dto: VerifyUserDTO): Promise<void> {
    const verificationToken = await this.tokenRepository.findByToken(dto.token)
    if (!verificationToken || verificationToken.expires < new Date()) {
      throw new NotFoundException('Token inválido ou expirado')
    }

    const user = await this.userRepository.findByEmail(verificationToken.email)
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.')
    }

    let success: boolean
    success = await this.tokenRepository.deleteByToken(verificationToken.token)
    if (!success) {
      throw new UnprocessableEntityException(
        'Não foi possível deletar o token.',
      )
    }

    const userId = user.id.toString()
    const token = await getToken({ userId })

    const expires = new Date()
    expires.setHours(expires.getHours() + 24)

    const session = SessionEntity.Factory.createNewSession(
      userId,
      token,
      expires,
    )

    success = await this.sessionRepository.save(session)
    if (!success) {
      throw new UnprocessableEntityException(
        'Não foi possível iniciar a sessão.',
      )
    }

    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    cookies().set('isAdmin', String(user.isAdmin), {
      maxAge: 60 * 60 * 24, // 24 horas
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
  }
}
