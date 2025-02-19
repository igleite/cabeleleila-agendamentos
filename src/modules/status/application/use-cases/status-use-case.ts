import { inject, injectable } from 'inversify'
import { IStatusService } from '@/src/modules/status/domain/interfaces/service/i-status-service'
import { STATUS_TYPE } from '@/src/types'

@injectable()
export class StatusUseCase {
  private service: IStatusService

  constructor(@inject(STATUS_TYPE.IStatusService) service: IStatusService) {
    this.service = service
  }

  async execute(): Promise<string> {
    return await this.service.status()
  }
}
