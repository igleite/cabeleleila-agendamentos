'use client'

import { Button } from '@/src/components/ui/button'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Calendar, ClipboardList, Home, LogOut } from 'lucide-react'

export default function Page() {
  const isAdmin: boolean =
    document.cookie
      .split('; ')
      .find((row) => row.startsWith('isAdmin='))
      ?.split('=')[1] === 'true'

  const router = useRouter()

  const handleRedirectToServices = () => {
    router.push('/app/services')
  }

  const handleRedirectToAppointments = () => {
    router.push('/app/appointments')
  }

  const handleRedirectToDashboard = () => {
    router.push('/app/dashboard')
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout')
      router.push('/auth/login')
    } catch (error) {
      console.error('Erro ao realizar logout:', error)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold tracking-tight">
        Cabeleleila Leila Salão
      </h1>

      <div>
        <Button
          className="mr-4 rounded-md bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
          onClick={handleRedirectToDashboard}
        >
          <Home className="mr-2" />
          Dashboard
        </Button>

        {isAdmin && (
          <Button
            className="mr-4 rounded-md bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
            onClick={handleRedirectToServices}
          >
            <ClipboardList className="mr-2" />
            Serviços
          </Button>
        )}

        <Button
          className="mr-4 rounded-md bg-purple-500 px-4 py-2 text-white transition hover:bg-purple-600"
          onClick={handleRedirectToAppointments}
        >
          <Calendar className="mr-2" />
          Agendamentos
        </Button>
        <Button
          variant="outline"
          className="mr-4 rounded-md"
          onClick={handleLogout}
        >
          <LogOut className="mr-2" /> Logout
        </Button>
      </div>
    </div>
  )
}
