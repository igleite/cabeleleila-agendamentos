import { ErrorCode } from './error-code.enum'
import { HTTPSTATUS, HttpStatusCode } from './http.config'
import { AppError } from './app-error'

export class NotFoundException extends AppError {
  constructor(message = 'Recurso não encontrado', errorCode?: ErrorCode) {
    super(message, HTTPSTATUS.NOT_FOUND, errorCode || ErrorCode.NOT_FOUND)
  }
}

export class BadRequestException extends AppError {
  constructor(message = 'Requisição inválida', errorCode?: ErrorCode) {
    super(message, HTTPSTATUS.BAD_REQUEST, errorCode || ErrorCode.BAD_REQUEST)
  }
}

export class UnauthorizedException extends AppError {
  constructor(message = 'Acesso não autorizado', errorCode?: ErrorCode) {
    super(message, HTTPSTATUS.UNAUTHORIZED, errorCode || ErrorCode.UNAUTHORIZED)
  }
}

export class ForbiddenException extends AppError {
  constructor(message = 'Acesso proibido', errorCode?: ErrorCode) {
    super(message, HTTPSTATUS.FORBIDDEN, errorCode || ErrorCode.FORBIDDEN)
  }
}

export class ConflictException extends AppError {
  constructor(message = 'Conflito de dados', errorCode?: ErrorCode) {
    super(message, HTTPSTATUS.CONFLICT, errorCode || ErrorCode.CONFLICT)
  }
}

export class UnprocessableEntityException extends AppError {
  constructor(message = 'Entidade não processável', errorCode?: ErrorCode) {
    super(
      message,
      HTTPSTATUS.UNPROCESSABLE_ENTITY,
      errorCode || ErrorCode.UNPROCESSABLE_ENTITY,
    )
  }
}

export class InternalServerException extends AppError {
  constructor(message = 'Erro interno do servidor', errorCode?: ErrorCode) {
    super(
      message,
      HTTPSTATUS.INTERNAL_SERVER_ERROR,
      errorCode || ErrorCode.INTERNAL_SERVER_ERROR,
    )
  }
}

export class ServiceUnavailableException extends AppError {
  constructor(message = 'Serviço indisponível', errorCode?: ErrorCode) {
    super(
      message,
      HTTPSTATUS.SERVICE_UNAVAILABLE,
      errorCode || ErrorCode.SERVICE_UNAVAILABLE,
    )
  }
}

export class HttpException extends AppError {
  constructor(
    message = 'Erro na requisição HTTP',
    statusCode: HttpStatusCode,
    errorCode?: ErrorCode,
  ) {
    super(message, statusCode, errorCode)
  }
}
