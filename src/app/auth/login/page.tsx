'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form'
import { Mail } from 'lucide-react'
import { toast } from 'sonner'
import { loginSchema } from '@/src/modules/_shared/schemas/schemas'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const magicLinkForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
    },
  })

  const onMagicLinkSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        toast.error('Falha em enviar magic link')
        return
      }

      toast.success('Magic link enviado para o seu e -mail')
    } catch (error) {
      console.error(error)
      toast.error('O registro falhou')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bem vindo de volta</CardTitle>
          <CardDescription>Faça login na sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...magicLinkForm}>
            <form
              onSubmit={magicLinkForm.handleSubmit(onMagicLinkSubmit)}
              className="space-y-4"
            >
              <FormField
                control={magicLinkForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type="email"
                          className="pl-10"
                          placeholder="Digite o seu email"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Enviando ...' : 'Enviar Magic Link'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Não tem uma conta?{' '}
            <a href="/auth/register" className="text-primary hover:underline">
              Inscrever-se
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
