'use client'

import { useEffect, useState } from 'react'
import {
  AppointmentEntity,
  AppointmentStatus,
} from '@/src/modules/appointment/domain/entities/appointment-entity'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Page from '@/src/app/page'

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<AppointmentEntity[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<
    AppointmentEntity[]
  >([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isFiltering, setIsFiltering] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('/api/appointment')
        const data: AppointmentEntity[] = response.data.data
        setAppointments(data)
        setFilteredAppointments(data)
      } catch (err) {
        setError('Erro ao carregar os agendamentos')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const handleFilter = () => {
    if (!startDate || !endDate) {
      toast.error('Selecione um período válido')
      return
    }

    const filtered = appointments.filter((appointment) => {
      const start = new Date(startDate)
      start.setDate(start.getDate() + 1)
      start.setHours(0, 0, 0, 0)

      const end = new Date(endDate)
      end.setDate(end.getDate() + 1)
      end.setHours(23, 59, 59, 999)

      const appointmentDate = new Date(appointment.date)

      return (
        appointmentDate.getTime() >= start.getTime() &&
        appointmentDate.getTime() <= end.getTime()
      )
    })

    setFilteredAppointments(filtered)
    setIsFiltering(true)
  }

  const clearFilter = () => {
    setStartDate('')
    setEndDate('')
    setFilteredAppointments(appointments)
    setIsFiltering(false)
  }

  const getStatusColor = (status: AppointmentStatus) => {
    const colors = {
      [AppointmentStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [AppointmentStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
      [AppointmentStatus.IN_PROGRESS]: 'bg-purple-100 text-purple-800',
      [AppointmentStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [AppointmentStatus.CANCELED]: 'bg-red-100 text-red-800',
    }
    return colors[status]
  }

  const getStatusText = (status: AppointmentStatus) => {
    const statusTexts = {
      [AppointmentStatus.PENDING]: 'Pendente',
      [AppointmentStatus.CONFIRMED]: 'Confirmado',
      [AppointmentStatus.IN_PROGRESS]: 'Em Andamento',
      [AppointmentStatus.COMPLETED]: 'Concluído',
      [AppointmentStatus.CANCELED]: 'Cancelado',
    }
    return statusTexts[status]
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    )
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto space-y-4 p-4">
      <Page />
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Meus Agendamentos</h1>
          <button
            onClick={() => router.push('/app/appointments/new')}
            className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Novo Agendamento
          </button>
        </div>

        <div className="mb-6 rounded-lg border p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div>
              <label className="mb-2 block font-semibold">Data Inicial</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-md border p-2"
              />
            </div>
            <div>
              <label className="mb-2 block font-semibold">Data Final</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-md border p-2"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleFilter}
                className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Filtrar
              </button>
            </div>
            {isFiltering && (
              <div className="flex items-end">
                <button
                  onClick={clearFilter}
                  className="w-full rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  Limpar Filtro
                </button>
              </div>
            )}
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <p className="text-gray-500">Nenhum agendamento encontrado.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredAppointments.map((appointment) => (
              <div
                key={appointment.id.value}
                className="rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-gray-600">
                    Data:{' '}
                    {new Date(appointment.date).toLocaleDateString('pt-BR')}
                  </p>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                      appointment.status,
                    )}`}
                  >
                    {getStatusText(appointment.status)}
                  </span>
                </div>
                <p className="text-gray-600">
                  Horário:{' '}
                  {new Date(appointment.date).toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="mt-2 text-gray-600">
                  Total:{' '}
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(appointment.total)}
                </p>
                <button
                  onClick={() =>
                    router.push(`/app/appointments/${appointment.id.value}`)
                  }
                  className="mt-4 w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                >
                  Ver Detalhes
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
