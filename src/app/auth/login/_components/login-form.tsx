'use client'

import { Controller, useForm } from 'react-hook-form'
import { z } from '@/libs/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Anchor, Button, PasswordInput, TextInput } from '@mantine/core'
import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'
import { Link, useTransitionRouter } from 'next-view-transitions'
import { serviceRequest } from '@/network'

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
    setAuthError(false)

    const response = await serviceRequest<{
      name: string
      returnUrl: null
      searchToken: null
      sessionToken: null
      userAuthenticationToken: string
    }>({
      axiosOptions: {
        url: 'api/account/login',
        method: 'post',
        data: {
          loginForm: {
            email: formData.email,
            password: formData.password,
          },
        },
      },
    })

    if (!response?.success) {
      setAuthError(true)
      return
    }

    await signIn('credentials', {
      name: response.data?.name,
      redirect: false,
    })
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
                size='md'
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
                size='md'
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
        <div className='text-center'>
          <Anchor component={Link} href={'/auth/forgot-password'}>
            Şifremi unuttum
          </Anchor>
        </div>
      </form>
    </div>
  )
}
