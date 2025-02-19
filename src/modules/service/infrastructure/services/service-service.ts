import { inject, injectable } from 'inversify'
import { SERVICE_TYPE } from '@/src/types'
import { IServiceRepository } from '../../domain/interfaces/repositories/i-service-repository'
import { IServiceService } from '../../domain/interfaces/services/i-service-service'
import {
  ServiceCreateDTO,
  ServiceUpdateDTO,
} from '@/src/modules/service/domain/schemas/service-create-schema'
import { ServiceEntity } from '@/src/modules/service/domain/entities/service-entity'
import {
  ForbiddenException,
  NotFoundException,
} from '@/src/modules/_shared/middlewares/catch-errors'
import { UserEntity } from '@/src/modules/user/domain/entities/userEntity'

@injectable()
export class ServiceService implements IServiceService {
  constructor(
    @inject(SERVICE_TYPE.IServiceRepository)
    private serviceRepository: IServiceRepository,
  ) {}

  async getById(serviceId: string): Promise<ServiceEntity> {
    const service = await this.serviceRepository.getById(serviceId)
    if (!service) {
      throw new NotFoundException(`Service não encontrado`)
    }

    return service
  }

  async getAll(): Promise<ServiceEntity[]> {
    return await this.serviceRepository.getAll()
  }

  async create(dto: ServiceCreateDTO, user: UserEntity): Promise<void> {
    if (!user.isAdmin) {
      throw new ForbiddenException(
        'Você não tem permissão para executar esta ação',
      )
    }

    const entity: ServiceEntity = ServiceEntity.Factory.createNewService(
      dto.name,
      dto.price,
    )
    await this.serviceRepository.save(entity)
  }

  async update(dto: ServiceUpdateDTO, user: UserEntity): Promise<void> {
    if (!user.isAdmin) {
      throw new ForbiddenException(
        'Você não tem permissão para executar esta ação',
      )
    }

    const service = await this.serviceRepository.findById(dto.id)
    if (!service) {
      throw new NotFoundException(`Service não encontrado`)
    }

    service.active = dto.active
    service.name = dto.name
    service.price = dto.price

    await this.serviceRepository.update(service)
  }

  async getTotalPriceServices(servicesId: string[]): Promise<number> {
    const services = await Promise.all(
      servicesId.map((serviceId) => this.serviceRepository.getById(serviceId)),
    )

    return services.reduce((acc, service) => {
      if (service && service.active) {
        acc += service.price
      }
      return acc
    }, 0)
  }
}
