import { AppointmentEntity } from '@/src/modules/appointment/domain/entities/appointment-entity'

export interface IAppointmentRepository {
  getByIdAndUser(
    serviceId: string,
    userId: string,
  ): Promise<AppointmentEntity | null>
  getAllByUser(userId: string): Promise<AppointmentEntity[]>
  save(entity: AppointmentEntity): Promise<boolean>
  findById(id: string): Promise<AppointmentEntity | null>
  update(entity: AppointmentEntity): Promise<boolean>
}
