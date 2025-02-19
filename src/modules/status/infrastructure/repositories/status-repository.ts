import { injectable } from 'inversify'
import { IStatusRepository } from '../../domain/interfaces/repository/i-status-repository'

@injectable()
export class StatusRepository implements IStatusRepository {
  status(): Promise<string> {
    return new Promise<string>((resolve) => {
      resolve('Running! 🚀🚀')
    })
  }
}
