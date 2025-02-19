import { wrapper } from '@/src/modules/_shared/middlewares/wrapper'
import { HTTPSTATUS } from '@/src/modules/_shared/middlewares/http.config'
import {
  ServiceCreateSchema,
  ServiceUpdateSchema,
} from '@/src/modules/service/domain/schemas/service-create-schema'
import { container } from '@/src/container'
import { ServiceUseCase } from '@/src/modules/service/application/usecases/service-use-case'
import { getTokenCookie } from '@/src/modules/_shared/utils/token'

export async function GET() {
  return wrapper(async () => {
    const useCase = container.resolve(ServiceUseCase)
    return await useCase.getAll()
  }, HTTPSTATUS.OK)
}

export async function POST(request: Request) {
  return wrapper(async () => {
    const token = getTokenCookie()

    const body = await request.json()
    const schema = ServiceCreateSchema.parse(body)
    const useCase = container.resolve(ServiceUseCase)
    await useCase.create(schema, token)
  }, HTTPSTATUS.CREATED)
}

export async function PUT(request: Request) {
  return wrapper(async () => {
    const token = getTokenCookie()

    const body = await request.json()
    const schema = ServiceUpdateSchema.parse(body)
    const useCase = container.resolve(ServiceUseCase)
    await useCase.update(schema, token)
  }, HTTPSTATUS.NO_CONTENT)
}
