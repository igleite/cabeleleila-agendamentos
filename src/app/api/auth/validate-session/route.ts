import { cookies } from 'next/headers'
import { wrapper } from '@/src/modules/_shared/middlewares/wrapper'
import { HTTPSTATUS } from '@/src/modules/_shared/middlewares/http.config'
import { UnauthorizedException } from '@/src/modules/_shared/middlewares/catch-errors'
import { container } from '@/src/container'
import { UserUseCase } from '@/src/modules/user/application/usecases/user-use-case'

export async function GET() {
  return wrapper(async () => {
    const cookieStore = cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      throw new UnauthorizedException()
    }

    const useCase = container.resolve(UserUseCase)
    return await useCase.validateSession(token)
  }, HTTPSTATUS.OK)
}
