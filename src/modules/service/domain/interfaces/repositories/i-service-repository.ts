import { ServiceEntity } from '@/src/modules/service/domain/entities/service-entity'

export interface IServiceRepository {
  getById(serviceId: string): Promise<ServiceEntity | null>
  getAll(): Promise<ServiceEntity[]>
  save(entity: ServiceEntity): Promise<boolean>
  findById(id: string): Promise<ServiceEntity | null>
  update(entity: ServiceEntity): Promise<boolean>
}
