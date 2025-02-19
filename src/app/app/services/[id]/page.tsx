'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import axios from 'axios'
import { ArrowLeft } from 'lucide-react'
import { ServiceEntity } from '@/src/modules/service/domain/entities/service-entity'
import { toast } from 'sonner'
import Page from '@/src/app/page'

export default function EditService() {
  const router = useRouter()
  const params = useParams()
  const [service, setService] = useState({
    id: '',
    name: '',
    price: '',
  })

  useEffect(() => {
    loadService()
  }, [])

  async function loadService() {
    try {
      const response = await axios.get(`/api/service/${params.id}`)
      const serviceData: ServiceEntity = response.data.data as ServiceEntity

      setService({
        id: serviceData.id.value,
        name: serviceData.name,
        price: serviceData.price.toString(),
      })
    } catch (error) {
      console.error('Erro ao carregar serviço:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await axios.put(`/api/service`, {
        id: service.id,
        name: service.name,
        price: parseFloat(service.price),
      })
      router.push('/app/services')
    } catch (error) {
      // @ts-ignore
      toast.error(error.response.data.message)
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto space-y-4 p-4">
      <Page />
      <div className="container mx-auto py-10">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.push('/app/service')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">Editar Serviço</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={service.name}
              onChange={(e) => setService({ ...service, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={service.price}
              onChange={(e) =>
                setService({ ...service, price: e.target.value })
              }
              required
            />
          </div>

          <Button type="submit">Salvar</Button>
        </form>
      </div>
    </div>
  )
}
