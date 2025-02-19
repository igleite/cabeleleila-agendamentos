import { cookies } from 'next/headers'
import { wrapper } from '@/src/modules/_shared/middlewares/wrapper'
import { HTTPSTATUS } from '@/src/modules/_shared/middlewares/http.config'
import { container } from '@/src/container'
import { UserUseCase } from '@/src/modules/user/application/usecases/user-use-case'

export async function POST() {
  return wrapper(async () => {
    const cookieStore = cookies()
    const token = cookieStore.get('auth_token')?.value

    if (token) {
      const useCase = container.resolve(UserUseCase)
      await useCase.logout(token)
    }
  }, HTTPSTATUS.NO_CONTENT)
}
