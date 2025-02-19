import {
  AppointmentCreateDTO,
  AppointmentUpdateDTO,
} from '@/src/modules/appointment/domain/schemas/appointment-create-schema'
import { UserEntity } from '@/src/modules/user/domain/entities/userEntity'
import { AppointmentEntity } from '@/src/modules/appointment/domain/entities/appointment-entity'

export interface IAppointmentService {
  getByIdAndUser(
    serviceId: string,
    user: UserEntity,
  ): Promise<AppointmentEntity>
  getAllByUser(user: UserEntity): Promise<AppointmentEntity[]>
  create(dto: AppointmentCreateDTO, user: UserEntity): Promise<void>
  update(dto: AppointmentUpdateDTO, user: UserEntity): Promise<void>
}
