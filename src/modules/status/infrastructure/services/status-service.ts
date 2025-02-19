import { inject, injectable } from 'inversify'
import { IStatusService } from '../../domain/interfaces/service/i-status-service'
import { IStatusRepository } from '../../domain/interfaces/repository/i-status-repository'
import { STATUS_TYPE } from '@/src/types'

@injectable()
export class StatusService implements IStatusService {
  private repository: IStatusRepository

  constructor(
    @inject(STATUS_TYPE.IStatusRepository) repository: IStatusRepository,
  ) {
    this.repository = repository
  }

  async status(): Promise<string> {
    return await this.repository.status()
  }
}
