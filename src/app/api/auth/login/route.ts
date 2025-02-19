import { wrapper } from '@/src/modules/_shared/middlewares/wrapper'
import { LoginUserSchema } from '@/src/modules/user/domain/schemas/user-schema'
import { container } from '@/src/container'
import { HTTPSTATUS } from '@/src/modules/_shared/middlewares/http.config'
import { UserUseCase } from '@/src/modules/user/application/usecases/user-use-case'

export async function POST(request: Request) {
  return wrapper(async () => {
    const body = await request.json()
    const schema = LoginUserSchema.parse(body)
    const useCase = container.resolve(UserUseCase)
    await useCase.login(schema)
  }, HTTPSTATUS.OK)
}
