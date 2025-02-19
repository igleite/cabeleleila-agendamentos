'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
  AppointmentEntity,
  AppointmentStatus,
} from '@/src/modules/appointment/domain/entities/appointment-entity'
import { toast } from 'sonner'
import Page from '@/src/app/page'

export default function AppointmentDetails({
  params,
}: {
  params: { id: string }
}) {
  const [appointment, setAppointment] = useState<AppointmentEntity | null>(null)
  const [services, setServices] = useState<any[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [status, setStatus] = useState<AppointmentStatus>(
    AppointmentStatus.PENDING,
  )
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar o agendamento
        const appointmentResponse = await axios.get(
          `/api/appointment/${params.id}`,
        )
        const appointmentData = appointmentResponse.data.data
        setAppointment(appointmentData)
        setSelectedServices(appointmentData.services || [])
        setStatus(appointmentData.status)

        // Buscar todos os serviços disponíveis
        const servicesResponse = await axios.get('/api/service')
        const servicesData = servicesResponse.data.data
        setServices(servicesData)

        // Configurar data e hora inicial
        const appointmentDate = new Date(appointmentData.date)
        setDate(appointmentDate.toISOString().split('T')[0])
        setTime(appointmentDate.toTimeString().slice(0, 5))
      } catch (err) {
        setError('Erro ao carregar os dados')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) => {
      const newSelected = prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]

      // Calcula o novo total baseado nos serviços selecionados
      const newTotal = services
        .filter((service) => newSelected.includes(service.id.value))
        .reduce((sum, service) => sum + service.price, 0)

      setTotal(newTotal)
      return newSelected
    })
  }

  const handleUpdate = async () => {
    try {
      if (selectedServices.length === 0) {
        toast.error('Selecione pelo menos um serviço')
        return
      }

      // Verifica se a data do agendamento está a mais de 48 horas
      // const appointmentDate = new Date(appointment?.date!)
      // const now = new Date()
      // const diffInHours =
      //   (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)

      // if (diffInHours < 48) {
      //   toast.error('O prazo de 48 horas já foi ultrapassado. A alteração deve ser feita por telefone.')
      //   return
      // }

      const newDate = new Date(`${date}T${time}`)
      await axios.put(`/api/appointment`, {
        id: appointment?.id.value,
        date: newDate.toISOString(),
        services: selectedServices,
        status,
      })
      toast.success('Agendamento atualizado com sucesso!')
      router.refresh()
    } catch (err) {
      // @ts-ignore
      toast.error(err.response.data.message)
      console.error(err)
    }
  }

  // Atualiza o total inicial quando o componente carrega
  useEffect(() => {
    if (services.length > 0 && selectedServices.length > 0) {
      const initialTotal = services
        .filter((service) => selectedServices.includes(service.id.value))
        .reduce((sum, service) => sum + service.price, 0)
      setTotal(initialTotal)
    }
  }, [services, selectedServices])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    )
  }

  if (error || !appointment) {
    return <div className="text-center text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto space-y-4 p-4">
      <Page />
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Detalhes do Agendamento</h1>
          <button
            onClick={() => router.back()}
            className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Voltar
          </button>
        </div>

        <div className="rounded-lg border p-6 shadow-lg">
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border p-2"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Horário</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-md border p-2"
                step="1800" // Opcional: permite apenas intervalos de 30 minutos
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AppointmentStatus)}
                className="w-full rounded-md border p-2"
              >
                {Object.values(AppointmentStatus).map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption === 'PENDING' && 'Pendente'}
                    {statusOption === 'CONFIRMED' && 'Confirmado'}
                    {statusOption === 'IN_PROGRESS' && 'Em Andamento'}
                    {statusOption === 'COMPLETED' && 'Concluído'}
                    {statusOption === 'CANCELED' && 'Cancelado'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block font-semibold">Serviços</label>
            <div className="space-y-2">
              {services.map((service) => (
                <div
                  key={service.id.value}
                  className="flex items-center rounded-md border p-3"
                >
                  <input
                    type="checkbox"
                    id={service.id.value}
                    checked={selectedServices.includes(service.id.value)}
                    onChange={() => handleServiceToggle(service.id.value)}
                    className="mr-3 h-4 w-4"
                  />
                  <label htmlFor={service.id} className="flex-1">
                    <p className="font-medium">{service.name}</p>
                    <p className="text-gray-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(service.price)}
                    </p>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2 block font-semibold">Valor Total</label>
            <p>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(total)}
            </p>
          </div>

          <button
            onClick={handleUpdate}
            className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Atualizar Agendamento
          </button>
        </div>
      </div>
    </div>
  )
}
