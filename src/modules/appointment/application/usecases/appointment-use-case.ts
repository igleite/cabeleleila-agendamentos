import { inject, injectable } from 'inversify'
import { APPOINTMENT_TYPE, USER_TYPE } from '@/src/types'
import { IAppointmentService } from '../../domain/interfaces/services/i-appointment-service'
import {
  AppointmentCreateDTO,
  AppointmentGetDTO,
  AppointmentUpdateDTO,
} from '@/src/modules/appointment/domain/schemas/appointment-create-schema'
import { IUserService } from '@/src/modules/user/domain/interfaces/services/i-user-service'
import { AppointmentEntity } from '@/src/modules/appointment/domain/entities/appointment-entity'

@injectable()
export class AppointmentUseCase {
  constructor(
    @inject(APPOINTMENT_TYPE.IAppointmentService)
    private appointmentService: IAppointmentService,
    @inject(USER_TYPE.IUserService) private userService: IUserService,
  ) {}

  async getByIdAndUser(
    dto: AppointmentGetDTO,
    token: string,
  ): Promise<AppointmentEntity> {
    const user = await this.userService.validateSession(token)
    return await this.appointmentService.getByIdAndUser(dto.id, user)
  }

  async getAllByUser(token: string): Promise<AppointmentEntity[]> {
    const user = await this.userService.validateSession(token)
    return await this.appointmentService.getAllByUser(user)
  }

  async create(dto: AppointmentCreateDTO, token: string): Promise<void> {
    const user = await this.userService.validateSession(token)
    await this.appointmentService.create(dto, user)
  }

  async update(dto: AppointmentUpdateDTO, token: string): Promise<void> {
    const user = await this.userService.validateSession(token)
    await this.appointmentService.update(dto, user)
  }
}
