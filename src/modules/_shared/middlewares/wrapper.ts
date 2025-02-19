import { NextResponse } from 'next/server'
import { HTTPSTATUS } from './http.config'
import { AppError, formatZodError } from './app-error'
import { z } from 'zod'

export async function wrapper(
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  handler: Function,
  customStatus: number = HTTPSTATUS.OK,
) {
  try {
    const data = await handler()
    if (
      customStatus === HTTPSTATUS.NO_CONTENT ||
      customStatus === HTTPSTATUS.FOUND
    ) {
      return new NextResponse(null, { status: customStatus })
    }

    return NextResponse.json(
      {
        data,
      },
      { status: customStatus },
    )
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          message: 'Formato JSON inválido, verifique seu corpo de solicitação',
        },
        { status: HTTPSTATUS.BAD_REQUEST },
      )
    }

    if (error instanceof z.ZodError) {
      return formatZodError(error)
    }

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          message: error.message,
          errorCode: error.errorCode,
        },
        { status: error.statusCode },
      )
    }

    // Handle generic errors
    return NextResponse.json(
      {
        message: 'Internal Server Error',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        error: error?.message || 'Unknown error occurred',
      },
      { status: HTTPSTATUS.INTERNAL_SERVER_ERROR },
    )
  }
}
