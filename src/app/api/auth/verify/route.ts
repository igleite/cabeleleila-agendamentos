import { wrapper } from '@/src/modules/_shared/middlewares/wrapper'
import { HTTPSTATUS } from '@/src/modules/_shared/middlewares/http.config'
import { VerifyUserSchema } from '@/src/modules/user/domain/schemas/user-schema'
import { container } from '@/src/container'
import { UserUseCase } from '@/src/modules/user/application/usecases/user-use-case'

export async function GET(request: Request) {
  return wrapper(async () => {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')
    const schema = VerifyUserSchema.parse({ token })

    const useCase = container.resolve(UserUseCase)
    await useCase.verify(schema)
  }, HTTPSTATUS.OK)
}
