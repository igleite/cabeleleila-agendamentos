import { wrapper } from '@/src/modules/_shared/middlewares/wrapper'
import { container } from '@/src/container'
import { ServiceUseCase } from '@/src/modules/service/application/usecases/service-use-case'
import { NextRequest } from 'next/server'
import { HTTPSTATUS } from '@/src/modules/_shared/middlewares/http.config'
import { ServiceGetSchema } from '@/src/modules/service/domain/schemas/service-create-schema'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  return wrapper(async () => {
    const schema = ServiceGetSchema.parse({ id: params.id })

    const useCase = container.resolve(ServiceUseCase)
    return await useCase.getById(schema)
  }, HTTPSTATUS.OK)
}
