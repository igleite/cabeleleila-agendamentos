import { inject, injectable } from 'inversify'
import { SERVICE_TYPE, USER_TYPE } from '@/src/types'
import { IServiceService } from '../../domain/interfaces/services/i-service-service'
import {
  ServiceGetDTO,
  ServiceCreateDTO,
  ServiceUpdateDTO,
} from '../../domain/schemas/service-create-schema'
import { ServiceEntity } from '@/src/modules/service/domain/entities/service-entity'
import { IUserService } from '@/src/modules/user/domain/interfaces/services/i-user-service'

@injectable()
export class ServiceUseCase {
  constructor(
    @inject(SERVICE_TYPE.IServiceService)
    private serviceService: IServiceService,
    @inject(USER_TYPE.IUserService) private userService: IUserService,
  ) {}

  async getById(dto: ServiceGetDTO): Promise<ServiceEntity> {
    return await this.serviceService.getById(dto.id)
  }

  async getAll(): Promise<ServiceEntity[]> {
    return await this.serviceService.getAll()
  }

  async create(dto: ServiceCreateDTO, token: string): Promise<void> {
    const user = await this.userService.validateSession(token)
    await this.serviceService.create(dto, user)
  }

  async update(dto: ServiceUpdateDTO, token: string): Promise<void> {
    const user = await this.userService.validateSession(token)
    await this.serviceService.update(dto, user)
  }
}
