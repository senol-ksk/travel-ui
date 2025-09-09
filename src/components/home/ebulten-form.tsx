'use client'

import React from 'react'
import { TextInput, Button, Text, Box } from '@mantine/core'
import { CiMail } from 'react-icons/ci'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { serviceRequest } from '@/network'
import { notifications } from '@mantine/notifications'
import Link from 'next/link'
const schema = z.object({
  email: z.string().email(),
})
type SchemaType = z.infer<typeof schema>

const EbultenForm = () => {
  const form = useForm({
    resolver: zodResolver(schema),
  })
  function handleSubmit(data: SchemaType) {
    submitMutiation.mutate(data)
  }
  const submitMutiation = useMutation({
    mutationFn: async (data: SchemaType) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: 'api/account/e-bulten',
          method: 'POST',
          data,
        },
      })
      return response
    },
    onSuccess: (response) => {
      if (response?.success) {
        notifications.show({
          title: 'Kullanıcı bilgileriniz güncellendi',
          message: <div>Bilgileriniz Başarıyla Güncellenmiştir.</div>,
          position: 'top-right',
          color: 'green',
          classNames: {
            root: 'bg-green-50',
          },
        })
      }
    },
    onError: () => {
      notifications.show({
        title: 'Hata',
        message: 'lütfen tekrar deneyiniz',
        color: 'red',
        position: 'top-right',
        classNames: {
          root: 'bg-red-50',
        },
      })
    },
  })
  return (
    <Box className='my-15 rounded-2xl bg-blue-700 p-6 text-white shadow-lg md:p-10'>
      <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-col items-start gap-4 md:flex-row md:items-center'>
          <div className='rounded-full bg-white p-3'>
            <CiMail size={50} className='text-blue-800' />
          </div>
          <div>
            <Text fw={600} size='lg' className='text-start'>
              Bültenimize Kaydolun!
            </Text>
            <Text size='sm' className='mt-1 text-start'>
              En son fırsatları, özel indirimleri, seyahat ilhamını alın ve
              dünyayı tek seferde bir tatille fethedin.{' '}
              <strong>#ParaflyTravel</strong>
            </Text>
          </div>
        </div>

        <div className='flex flex-col gap-2 md:items-end'>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <TextInput
                type='email'
                {...form.register('email')}
                error={form.formState.errors.email?.message}
                placeholder='E-posta adresiniz'
                classNames={{
                  input: 'w-full sm:w-100 rounded',
                }}
                radius='md'
                size='md'
              />
              <Button
                color='orange'
                radius='md'
                type='submit'
                size='md'
                className='hover:bg-orange-600'
              >
                Üye Ol
              </Button>
            </div>
          </form>
          <Text size='xs' className='text-white/80'>
            Bu onay kutusunu tıklayarak, ParaflyTravel’dan haber bültenleri ve
            teklifler almayı kabul ediyorum.
            <Link
              href='/kullanim-sartlari-ve-genel-kosullar'
              className='ml-1 underline'
            >
              Ayrıntılar
            </Link>
          </Text>
        </div>
      </div>
    </Box>
  )
}

export { EbultenForm }
