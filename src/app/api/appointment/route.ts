import { HTTPSTATUS } from '@/src/modules/_shared/middlewares/http.config'
import { wrapper } from '@/src/modules/_shared/middlewares/wrapper'
import { getTokenCookie } from '@/src/modules/_shared/utils/token'
import {
  AppointmentCreateSchema,
  AppointmentUpdateSchema,
} from '@/src/modules/appointment/domain/schemas/appointment-create-schema'
import { container } from '@/src/container'
import { AppointmentUseCase } from '@/src/modules/appointment/application/usecases/appointment-use-case'

export async function GET() {
  return wrapper(async () => {
    const token = getTokenCookie()

    const useCase = container.resolve(AppointmentUseCase)
    return await useCase.getAllByUser(token)
  }, HTTPSTATUS.OK)
}

export async function POST(request: Request) {
  return wrapper(async () => {
    const token = getTokenCookie()

    const body = await request.json()
    const schema = AppointmentCreateSchema.parse(body)
    const useCase = container.resolve(AppointmentUseCase)
    await useCase.create(schema, token)
  }, HTTPSTATUS.CREATED)
}

export async function PUT(request: Request) {
  return wrapper(async () => {
    const token = getTokenCookie()

    const body = await request.json()
    const schema = AppointmentUpdateSchema.parse(body)
    const useCase = container.resolve(AppointmentUseCase)
    await useCase.update(schema, token)
  }, HTTPSTATUS.NO_CONTENT)
}
