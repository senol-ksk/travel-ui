'use client'

import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, PasswordInput, TextInput } from '@mantine/core'
import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'
import { useTransitionRouter } from 'next-view-transitions'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type LoginSchemaType = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const session = useSession()
  const [authError, setAuthError] = useState(false)
  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  })
  const router = useTransitionRouter()

  const submitHandler = async (formData: LoginSchemaType) => {
    console.log(formData)
    setAuthError(false)

    const response = await signIn('credentials', {
      ...formData,
      redirect: false,
    })
    console.log(response)
    if (response?.error) {
      setAuthError(true)
    }
  }

  if (session.status === 'authenticated') router.replace('/')

  return (
    <div>
      {authError && <Alert color='red'>kullanici bulunamadi</Alert>}
      <form
        className='flex flex-col gap-4'
        onSubmit={form.handleSubmit(submitHandler)}
      >
        <Controller
          control={form.control}
          name='email'
          defaultValue=''
          render={({ field, fieldState }) => {
            return (
              <TextInput
                {...field}
                label='E-posta'
                error={fieldState.error?.message}
                autoComplete='email'
              />
            )
          }}
        />
        <Controller
          control={form.control}
          name='password'
          defaultValue=''
          render={({ field, fieldState }) => {
            return (
              <PasswordInput
                {...field}
                label='Şifre'
                error={fieldState.error?.message}
                autoComplete='current-password'
              />
            )
          }}
        />
        <div className='flex justify-center'>
          <Button
            type='submit'
            loading={form.formState.isSubmitting || form.formState.isLoading}
          >
            Gönder
          </Button>
        </div>
      </form>
    </div>
  )
}
