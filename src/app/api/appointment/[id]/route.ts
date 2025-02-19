import { wrapper } from '@/src/modules/_shared/middlewares/wrapper'
import { container } from '@/src/container'
import { NextRequest } from 'next/server'
import { HTTPSTATUS } from '@/src/modules/_shared/middlewares/http.config'
import { getTokenCookie } from '@/src/modules/_shared/utils/token'
import { AppointmentGetSchema } from '@/src/modules/appointment/domain/schemas/appointment-create-schema'
import { AppointmentUseCase } from '@/src/modules/appointment/application/usecases/appointment-use-case'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return wrapper(async () => {
    const schema = AppointmentGetSchema.parse({ id: params.id })
    const token = getTokenCookie()

    const useCase = container.resolve(AppointmentUseCase)
    return await useCase.getByIdAndUser(schema, token)
  }, HTTPSTATUS.OK)
}
