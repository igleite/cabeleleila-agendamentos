export const STATUS_TYPE = {
  IStatusService: Symbol.for('IStatusService'),
  IStatusRepository: Symbol.for('IStatusRepository'),
}

export const USER_TYPE = {
  ISessionRepository: Symbol.for('ISessionRepository'),
  IUserRepository: Symbol.for('IUserRepository'),
  IVerificationTokenRepository: Symbol.for('IVerificationTokenRepository'),
  IUserService: Symbol.for('IUserService'),
}

export const SERVICE_TYPE = {
  IServiceRepository: Symbol.for('IServiceRepository'),
  IServiceService: Symbol.for('IServiceService'),
}

export const APPOINTMENT_TYPE = {
  IAppointmentRepository: Symbol.for('IAppointmentRepository'),
  IAppointmentService: Symbol.for('IAppointmentService'),
}
