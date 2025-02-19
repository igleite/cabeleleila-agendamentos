import {
  ServiceCreateDTO,
  ServiceUpdateDTO,
} from '@/src/modules/service/domain/schemas/service-create-schema'
import { ServiceEntity } from '@/src/modules/service/domain/entities/service-entity'
import { UserEntity } from '@/src/modules/user/domain/entities/userEntity'

export interface IServiceService {
  getById(serviceId: string): Promise<ServiceEntity>
  getAll(): Promise<ServiceEntity[]>
  create(dto: ServiceCreateDTO, user: UserEntity): Promise<void>
  update(dto: ServiceUpdateDTO, user: UserEntity): Promise<void>
  getTotalPriceServices(servicesId: string[]): Promise<number>
}
