'use client'

import { Button, TextInput } from '@mantine/core'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { notifications } from '@mantine/notifications'
import { serviceRequest } from '@/network'

const schema = z.object({
  oldEmail: z.string().email(),
  changingEmail: z.string().email(),
})

export type FormSchemaType = z.infer<typeof schema>

type IProps = {
  oldEmail?: string
  changingEmail?: string
}

export const Change = ({ oldEmail, changingEmail }: IProps) => {
  function handleSubmit(data: FormSchemaType) {
    submitMutation.mutate(data)
  }
  const submitMutation = useMutation({
    mutationFn: async (data: FormSchemaType) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/change-email',
          method: 'POST',
          data,
        },
      })
      return response
    },
    onSuccess: () => {
      notifications.show({
        title: 'E-postanız Değiştirildi',
        message: 'E-posta adresiniz başarıyla değiştirildi...',
        color: 'green',
      })
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Hata',
        message: error.message,
        color: 'red',
      })
    },
  })
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      oldEmail: oldEmail,
      changingEmail: changingEmail,
    },
  })

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmit)}
      className='flex items-center justify-center'
    >
      <div className='w-full max-w-md p-6'>
        <div className='grid gap-5'>
          <Controller
            name='oldEmail'
            control={form.control}
            render={({ field, fieldState }) => (
              <TextInput
                type='email'
                label='Mevcut E-postanız'
                {...field}
                error={fieldState.error?.message}
                placeholder='E-posta adresinizi giriniz'
              />
            )}
          />

          <Controller
            name='changingEmail'
            control={form.control}
            render={({ field, fieldState }) => (
              <TextInput
                type='email'
                label='Yeni E-postanız'
                {...field}
                error={fieldState.error?.message}
                placeholder='Yeni e-posta adresinizi giriniz'
              />
            )}
          />

          {/* <Controller
            name='password'
            control={form.control}
            render={({ field, fieldState }) => (
              <TextInput
                type='email'
                label='Tekrar E-Posta'
                {...field}
                error={fieldState.error?.message}
                placeholder='Yeni e-posta adresinizi tekrar giriniz'
              />
            )}
          /> */}

          <div className='flex justify-center'>
            <Button type='submit' size='md'>
              E-Posta Adresimi Kaydet
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
