import { wrapper } from '@/src/modules/_shared/middlewares/wrapper'
import { HTTPSTATUS } from '@/src/modules/_shared/middlewares/http.config'
import { getTokenCookie } from '@/src/modules/_shared/utils/token'
import { container } from '@/src/container'
import { DashboardUseCase } from '@/src/modules/dashboard/dashboard-use-case'

export async function GET() {
  return wrapper(async () => {
    const token = getTokenCookie()
    const useCase = container.resolve(DashboardUseCase)
    return await useCase.dashboard(token)
  }, HTTPSTATUS.OK)
}
