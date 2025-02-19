import 'reflect-metadata'
import { Container } from 'inversify'
import {
  APPOINTMENT_TYPE,
  SERVICE_TYPE,
  STATUS_TYPE,
  USER_TYPE,
} from '@/src/types'
import { StatusUseCase } from '@/src/modules/status/application/use-cases/status-use-case'
import { IStatusService } from './modules/status/domain/interfaces/service/i-status-service'
import { IStatusRepository } from '@/src/modules/status/domain/interfaces/repository/i-status-repository'
import { StatusService } from '@/src/modules/status/infrastructure/services/status-service'
import { StatusRepository } from '@/src/modules/status/infrastructure/repositories/status-repository'
import { IUserService } from '@/src/modules/user/domain/interfaces/services/i-user-service'
import { UserService } from '@/src/modules/user/infrastructure/services/user-service'
import { ISessionRepository } from '@/src/modules/user/domain/interfaces/repositories/i-session-repository'
import { SessionRepository } from '@/src/modules/user/infrastructure/repositories/session-repository'
import { UserRepository } from '@/src/modules/user/infrastructure/repositories/user-repository'
import { IUserRepository } from '@/src/modules/user/domain/interfaces/repositories/i-user-repository'
import { UserUseCase } from '@/src/modules/user/application/usecases/user-use-case'
import { IVerificationTokenRepository } from '@/src/modules/user/domain/interfaces/repositories/i-verification-token-repository'
import { VerificationTokenRepository } from '@/src/modules/user/infrastructure/repositories/verification-token-repository'
import { ServiceUseCase } from '@/src/modules/service/application/usecases/service-use-case'
import { IServiceService } from '@/src/modules/service/domain/interfaces/services/i-service-service'
import { IServiceRepository } from '@/src/modules/service/domain/interfaces/repositories/i-service-repository'
import { ServiceRepository } from '@/src/modules/service/infrastructure/repositories/service-repository'
import { ServiceService } from '@/src/modules/service/infrastructure/services/service-service'
import { AppointmentUseCase } from '@/src/modules/appointment/application/usecases/appointment-use-case'
import { IAppointmentService } from '@/src/modules/appointment/domain/interfaces/services/i-appointment-service'
import { IAppointmentRepository } from '@/src/modules/appointment/domain/interfaces/repositories/i-appointment-repository'
import { AppointmentService } from '@/src/modules/appointment/infrastructure/services/appointment-service'
import { AppointmentRepository } from '@/src/modules/appointment/infrastructure/repositories/appointment-repository'
import { DashboardUseCase } from '@/src/modules/dashboard/dashboard-use-case'

const container = new Container()

// status
container.bind(StatusUseCase).toSelf()
container.bind<IStatusService>(STATUS_TYPE.IStatusService).to(StatusService)
container
  .bind<IStatusRepository>(STATUS_TYPE.IStatusRepository)
  .to(StatusRepository)

// user
container.bind(UserUseCase).toSelf()
container.bind<IUserService>(USER_TYPE.IUserService).to(UserService)
container.bind<IUserRepository>(USER_TYPE.IUserRepository).to(UserRepository)
container
  .bind<ISessionRepository>(USER_TYPE.ISessionRepository)
  .to(SessionRepository)

container
  .bind<IVerificationTokenRepository>(USER_TYPE.IVerificationTokenRepository)
  .to(VerificationTokenRepository)

// service
container.bind(ServiceUseCase).toSelf()
container.bind<IServiceService>(SERVICE_TYPE.IServiceService).to(ServiceService)
container
  .bind<IServiceRepository>(SERVICE_TYPE.IServiceRepository)
  .to(ServiceRepository)

// appointment
container.bind(AppointmentUseCase).toSelf()
container
  .bind<IAppointmentService>(APPOINTMENT_TYPE.IAppointmentService)
  .to(AppointmentService)
container
  .bind<IAppointmentRepository>(APPOINTMENT_TYPE.IAppointmentRepository)
  .to(AppointmentRepository)

// dashboard
container.bind(DashboardUseCase).toSelf()

export { container }
