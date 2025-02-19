'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import Link from 'next/link'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>(
    'loading',
  )

  useEffect(() => {
    const verifyToken = async () => {
      const token = searchParams.get('token')

      if (!token) {
        setStatus('error')
        return
      }

      try {
        const response = await fetch(`/api/auth/verify?token=${token}`)
        if (response.ok) {
          setStatus('success')
          router.push('/app/dashboard')
        } else {
          setStatus('error')
        }
      } catch (error) {
        console.error('Erro na verificação:', error)
        setStatus('error')
      }
    }

    verifyToken()
  }, [searchParams, router])

  return (
    <div className="container-fluid flex h-screen flex-col items-center justify-center">
      <div className="mx-auto w-full max-w-[350px] space-y-6">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">
              {status === 'loading' && 'Verificando seu acesso'}
              {status === 'error' && 'Erro na verificação'}
              {status === 'success' && 'Verificação concluída'}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {status === 'loading' && (
              <div className="flex flex-col items-center space-y-4 py-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Aguarde enquanto verificamos suas credenciais...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center space-y-4">
                <p className="text-center text-sm text-muted-foreground">
                  Não foi possível verificar seu token. <br />O link pode ter
                  expirado ou ser inválido.
                </p>
                <Button asChild variant="default" className="w-full">
                  <Link href="/auth/login">Voltar para o login</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
