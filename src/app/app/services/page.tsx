'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/src/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/ui/table'
import { Pencil, Plus } from 'lucide-react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ServiceEntity } from '@/src/modules/service/domain/entities/service-entity'
import Page from '@/src/app/page'

export default function ServiceList() {
  const [services, setServices] = useState<ServiceEntity[]>([])
  const router = useRouter()

  useEffect(() => {
    loadServices()
  }, [])

  async function loadServices() {
    try {
      const response = await axios.get('/api/service')
      const data: ServiceEntity[] = await response.data?.data
      setServices(data)
    } catch (error) {
      console.error('Erro ao carregar serviços:', error)
    }
  }

  return (
    <div className="container mx-auto space-y-4 p-4">
      <Page />
      <div className="container mx-auto py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Serviços</h1>
          <Button onClick={() => router.push('/app/services/new')}>
            <Plus className="mr-2 h-4 w-4" /> Novo Serviço
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id.toString()}>
                <TableCell>{service.name}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(service.price)}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      router.push(`/app/services/${service.id.value}`)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
