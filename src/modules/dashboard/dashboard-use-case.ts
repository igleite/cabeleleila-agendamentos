import { inject, injectable } from 'inversify'
import { SERVICE_TYPE, USER_TYPE } from '@/src/types'
import { IServiceService } from '@/src/modules/service/domain/interfaces/services/i-service-service'
import { IUserService } from '@/src/modules/user/domain/interfaces/services/i-user-service'
import { ForbiddenException } from '@/src/modules/_shared/middlewares/catch-errors'
import { PrismaClient } from '@prisma/client'
import { AppointmentStatus } from '@/src/modules/appointment/domain/entities/appointment-entity'

@injectable()
export class DashboardUseCase {
  private prisma: PrismaClient

  constructor(
    @inject(SERVICE_TYPE.IServiceService)
    private serviceService: IServiceService,
    @inject(USER_TYPE.IUserService) private userService: IUserService,
  ) {
    this.prisma = new PrismaClient()
  }

  async dashboard(token: string): Promise<any> {
    const user = await this.userService.validateSession(token)
    if (!user.isAdmin || !user) {
      throw new ForbiddenException(
        'Você não tem permissão para executar esta ação',
      )
    }

    // Buscar dados dos últimos 30 dias
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    // Total de agendamentos nos últimos 30 dias
    const totalAppointments = await this.prisma.appointment.count({
      where: {
        date: { gte: thirtyDaysAgo },
      },
    })

    // Faturamento total (apenas agendamentos concluídos)
    const revenue = await this.prisma.appointment.aggregate({
      where: {
        date: { gte: thirtyDaysAgo },
        status: AppointmentStatus.COMPLETED,
      },
      _sum: { total: true },
    })

    // Serviços mais populares (ajustado para MongoDB)
    const appointments = await this.prisma.appointment.findMany({
      where: { date: { gte: thirtyDaysAgo } },
      select: { services: true }, // Pegamos apenas os serviços
    })

    // Contagem de frequência dos serviços
    const serviceCount: Record<string, number> = {}

    appointments.forEach(({ services }) => {
      services.forEach((service) => {
        serviceCount[service] = (serviceCount[service] || 0) + 1
      })
    })

    // Buscar os nomes dos serviços mais populares
    const popularServicesWithNames = await this.prisma.service.findMany({
      where: {
        id: {
          in: Object.keys(serviceCount), // Buscar serviços pelos IDs mais populares
        },
      },
      select: {
        id: true,
        name: true,
      },
    })

    // Associar os nomes aos serviços
    const popularServices = popularServicesWithNames.map((service) => ({
      serviceId: service.id,
      serviceName: service.name,
      count: serviceCount[service.id],
    }))

    // Análise de horários (quantos agendamentos por hora)
    const appointmentsByHour = await this.prisma.appointment.findMany({
      where: { date: { gte: thirtyDaysAgo } },
      select: { date: true },
    })

    const hourlyDistribution: Record<string, number> = {}

    appointmentsByHour.forEach(({ date }) => {
      const hour = date.getHours().toString().padStart(2, '0') // Formato "HH"
      hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1
    })

    // Crescimento semanal (quantos agendamentos por semana)
    const weeklyDistribution: Record<string, number> = {}

    appointmentsByHour.forEach(({ date }) => {
      const weekNumber = this.getWeekNumber(date)
      weeklyDistribution[weekNumber] = (weeklyDistribution[weekNumber] || 0) + 1
    })

    return {
      metrics: {
        totalAppointments,
        revenue: revenue._sum.total || 0,
      },
      popularServices,
      hourlyDistribution,
      weeklyGrowth: weeklyDistribution,
    }
  }

  private getWeekNumber(date: Date) {
    const startOfYear = new Date(date.getFullYear(), 0, 1)
    const diff = date.getTime() - startOfYear.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24 * 7)).toString()
  }
}
