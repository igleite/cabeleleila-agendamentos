'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import Page from '@/src/app/page'
import { toast } from 'sonner'

export default function Dashboard() {
  const isAdmin: boolean =
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('isAdmin='))
      ?.split('=')[1] === 'true'

  const [dashboardData, setDashboardData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  useEffect(() => {
    const fetchData = async () => {
      if (!isAdmin) {
        setIsLoading(false)
        return
      }

      try {
        const response = await axios.get('/api/dashboard')
        setDashboardData(response.data.data)
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        toast.error(err.response.data.message)

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setError(err.response.data.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (!isAdmin) {
    return (
      <div className="container mx-auto space-y-4 p-4">
        <Page />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="container mx-auto space-y-4 p-4">
        <Page />
        <div className="text-center text-red-500">{error}</div>
      </div>
    )
  }

  // Transformando os dados de crescimento semanal para um formato adequado
  const weeklyGrowthData = Object.entries(dashboardData.weeklyGrowth).map(
    ([week, count]) => ({
      week,
      count,
    }),
  )

  // Transformando os dados dos horários de pico para um formato adequado
  const hourlyData = Object.entries(dashboardData.hourlyDistribution).map(
    ([hour, count]) => ({
      hour,
      count,
    }),
  )

  // Ajustando os dados de serviços mais populares
  const popularServicesData = dashboardData.popularServices.map(
    (service: any) => ({
      name: service.serviceName, // Nome do serviço
      value: service.count, // Contagem
    }),
  )

  return (
    <div className="container mx-auto space-y-4 p-4">
      <Page />
      <div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Agendamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.metrics.totalAppointments}
              </div>
              <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Faturamento Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(dashboardData.metrics.revenue)}
              </div>
              <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-2 grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Crescimento Semanal</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={weeklyGrowthData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="week"
                    tickFormatter={(week) => `Semana ${week}`}
                    className="text-sm"
                  />
                  <YAxis className="text-sm" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    name="Agendamentos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Serviços Mais Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={popularServicesData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label
                  >
                    {popularServicesData.map((_: any, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Horários de Pico</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={hourlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                    className="text-sm"
                  />
                  <YAxis className="text-sm" />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    name="Agendamentos"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
