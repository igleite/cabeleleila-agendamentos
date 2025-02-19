import { wrapper } from '@/src/modules/_shared/middlewares/wrapper'
import { CreateUserSchema } from '@/src/modules/user/domain/schemas/user-schema'
import { HTTPSTATUS } from '@/src/modules/_shared/middlewares/http.config'
import { container } from '@/src/container'
import { UserUseCase } from '@/src/modules/user/application/usecases/user-use-case'

export async function POST(request: Request) {
  return wrapper(async () => {
    const body = await request.json()
    const schema = CreateUserSchema.parse(body)
    const useCase = container.resolve(UserUseCase)
    return await useCase.register(schema)
  }, HTTPSTATUS.CREATED)
}
