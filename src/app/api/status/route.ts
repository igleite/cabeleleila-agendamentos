import { wrapper } from '@/src/modules/_shared/middlewares/wrapper'
import { container } from '@/src/container'
import { StatusUseCase } from '@/src/modules/status/application/use-cases/status-use-case'

export async function GET() {
  return wrapper(async () => {
    const useCase = container.resolve(StatusUseCase)
    return await useCase.execute()
  })
}
