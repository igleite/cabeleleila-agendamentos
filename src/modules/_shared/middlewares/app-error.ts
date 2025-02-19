import { ErrorCode } from './error-code.enum'
import { HTTPSTATUS, HttpStatusCode } from './http.config'
import { z } from 'zod'
import { NextResponse } from 'next/server'

export const formatZodError = (error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    field: err.path.join('.'),
    message: err.message,
  }))

  return NextResponse.json(
    {
      message: 'A validação falhou',
      errors,
    },
    { status: HTTPSTATUS.BAD_REQUEST },
  )
}

export class AppError extends Error {
  public statusCode: HttpStatusCode
  public errorCode?: ErrorCode

  constructor(
    message: string,
    statusCode = HTTPSTATUS.INTERNAL_SERVER_ERROR,
    errorCode?: ErrorCode,
  ) {
    super(message)
    this.statusCode = statusCode
    this.errorCode = errorCode
    Error.captureStackTrace(this, this.constructor)
  }
}
