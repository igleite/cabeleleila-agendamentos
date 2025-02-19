'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import axios from 'axios'
import { toast } from 'sonner'
import Page from '@/src/app/page'

export default function NewService() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    price: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await axios.post('/api/service', {
        name: formData.name,
        price: Number(formData.price),
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
          <h1 className="text-2xl font-bold">Novo Serviço</h1>
        </div>

        <form onSubmit={handleSubmit} className="max-w-md space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Serviço</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Preço</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: e.target.value })
              }
              required
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit">Salvar</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/app/service')}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
