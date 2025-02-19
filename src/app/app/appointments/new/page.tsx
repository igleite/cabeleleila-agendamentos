'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ServiceEntity } from '@/src/modules/service/domain/entities/service-entity'
import Page from '@/src/app/page'

type AppointmentForm = {
  serviceIds: string[]
  date: string
  time: string
}

export default function NewAppointment() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [services, setServices] = useState<ServiceEntity[]>([])
  const [form, setForm] = useState<AppointmentForm>({
    serviceIds: [],
    date: '',
    time: '',
  })

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/service')
        if (!response.ok) {
          throw new Error('Falha ao carregar serviços')
        }
        const data = await response.json()
        const servicesList = Array.isArray(data.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : []
        setServices(servicesList)
      } catch (err) {
        console.error('Erro ao carregar serviços:', err)
        setError('Não foi possível carregar a lista de serviços')
      }
    }

    fetchServices()
  }, [])

  // Para debug
  // console.log('services:', services)

  // Função para alternar seleção de serviço
  const toggleService = (serviceId: string) => {
    setForm((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const dateTime = new Date(`${form.date}T${form.time}`)

      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          services: form.serviceIds,
          date: dateTime.toISOString(),
        }),
      })

      if (!response.ok) {
        throw new Error('Falha ao criar agendamento')
      }

      router.push('/app/appointments')
      router.refresh()
    } catch (err) {
      setError('Erro ao criar agendamento. Tente novamente.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="container mx-auto space-y-4 p-4">
      <Page />
      <div className="container mx-auto max-w-2xl p-4">
        <h1 className="mb-6 text-2xl font-bold">Novo Agendamento</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label className="mb-2 block font-semibold">Data</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-md border p-2"
            />
          </div>

          <div className="mb-4">
            <label className="mb-2 block font-semibold">Horário</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              required
              className="w-full rounded-md border p-2"
            />
          </div>

          <div>
            <label className="mb-2 block font-semibold">
              Selecione os Serviços
            </label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service.id.value}
                  onClick={() => toggleService(service.id.value)}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    form.serviceIds.includes(service.id.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  } `}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded border-2 ${
                        form.serviceIds.includes(service.id.value)
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-300'
                      } `}
                    >
                      {form.serviceIds.includes(service.id.value) && (
                        <svg
                          className="h-3 w-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <span className="font-medium">{service.name}</span>
                  </div>
                </div>
              ))}
            </div>
            {form.serviceIds.length === 0 && (
              <p className="mt-2 text-sm text-red-500">
                Selecione pelo menos um serviço
              </p>
            )}
          </div>

          {error && <div className="text-sm text-red-500">{error}</div>}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {isLoading ? 'Criando...' : 'Criar Agendamento'}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-md border px-4 py-2 hover:bg-gray-100"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
