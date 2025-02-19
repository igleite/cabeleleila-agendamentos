import { inject, injectable } from 'inversify'
import { IAppointmentService } from '@/src/modules/appointment/domain/interfaces/services/i-appointment-service'
import { APPOINTMENT_TYPE, SERVICE_TYPE, USER_TYPE } from '@/src/types'
import { IAppointmentRepository } from '@/src/modules/appointment/domain/interfaces/repositories/i-appointment-repository'
import { IVerificationTokenRepository } from '@/src/modules/user/domain/interfaces/repositories/i-verification-token-repository'
import {
  AppointmentCreateDTO,
  AppointmentUpdateDTO,
} from '@/src/modules/appointment/domain/schemas/appointment-create-schema'
import {
  ForbiddenException,
  NotFoundException,
} from '@/src/modules/_shared/middlewares/catch-errors'
import { UserEntity } from '@/src/modules/user/domain/entities/userEntity'
import { IServiceService } from '@/src/modules/service/domain/interfaces/services/i-service-service'
import {
  AppointmentEntity,
  AppointmentStatus,
} from '../../domain/entities/appointment-entity'

@injectable()
export class AppointmentService implements IAppointmentService {
  constructor(
    @inject(APPOINTMENT_TYPE.IAppointmentRepository)
    private appointmentRepository: IAppointmentRepository,
    @inject(USER_TYPE.IVerificationTokenRepository)
    private tokenRepository: IVerificationTokenRepository,
    @inject(SERVICE_TYPE.IServiceService)
    private serviceService: IServiceService,
  ) {}

  async getByIdAndUser(
    serviceId: string,
    user: UserEntity,
  ): Promise<AppointmentEntity> {
    const appointment = await this.appointmentRepository.getByIdAndUser(
      serviceId,
      user.id.toString(),
    )
    if (!appointment) {
      throw new NotFoundException(`Agendamento não encontrado`)
    }

    if (!user.isAdmin) {
      if (appointment.userId !== user.id.toString()) {
        throw new ForbiddenException(
          'Você não tem permissão para alterar visualizar este agendamento',
        )
      }
    }

    return appointment
  }

  async getAllByUser(user: UserEntity): Promise<AppointmentEntity[]> {
    return await this.appointmentRepository.getAllByUser(user.id.toString())
  }

  async create(dto: AppointmentCreateDTO, user: UserEntity): Promise<void> {
    const total = await this._getTotalPriceServices(dto.services)

    const entity = AppointmentEntity.Factory.createNewAppointment(
      dto.date,
      dto.services,
      total,
      user.id.toString(),
    )

    await this.appointmentRepository.save(entity)
  }

  async update(dto: AppointmentUpdateDTO, user: UserEntity): Promise<void> {
    const appointment = await this.appointmentRepository.getByIdAndUser(
      dto.id,
      user.id.toString(),
    )

    if (!appointment) {
      throw new NotFoundException(`Agendamento não encontrado`)
    }

    if (!user.isAdmin) {
      if (appointment.userId !== user.id.toString()) {
        throw new ForbiddenException(
          'Você não tem permissão para alterar este agendamento',
        )
      }
    }

    const now = new Date()
    const timeDifference = appointment.date.getTime() - now.getTime()
    const hoursDifference = timeDifference / (1000 * 3600)

    if (!user.isAdmin) {
      if (hoursDifference <= -48) {
        throw new ForbiddenException(
          'O prazo de 48 horas já foi ultrapassado. A alteração deve ser feita por telefone.',
        )
      }
    }

    const total = await this._getTotalPriceServices(dto.services)

    appointment.date = dto.date
    appointment.services = dto.services

    appointment.updateTotal(total)

    const previousStatus = appointment.status
    appointment.updateStatus(dto.status)

    if (!user.isAdmin) {
      const isCanceling = dto.status === AppointmentStatus.CANCELED
      const statusChanged = previousStatus !== appointment.status

      if (statusChanged && !isCanceling) {
        throw new ForbiddenException(
          'Você não tem permissão para alterar este agendamento',
        )
      }
    }

    await this.appointmentRepository.update(appointment)
  }

  private async _getTotalPriceServices(serviceId: string[]): Promise<number> {
    return await this.serviceService.getTotalPriceServices(serviceId)
  }
}
