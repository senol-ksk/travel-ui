'use client'

import { Button, Container, TextInput, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { serviceRequest } from '@/network'
import { OperationResultWithBookingCodeResponse } from './types'

const schema = z.object({
  firstName: z.string().min(3).nonempty(),
  lastName: z.string().min(3).nonempty(),
  bookingCode: z.string().nonempty().min(3),
})

type SchemaType = z.infer<typeof schema>

export default function OnlineOperationsPage() {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  const handleMutation = useMutation({
    mutationFn: async (data: SchemaType) => {
      const response =
        await serviceRequest<OperationResultWithBookingCodeResponse>({
          axiosOptions: {
            url: 'api/product/handleOperationResultWithBookingCode',
            params: data,
          },
        })
      return response
    },
    mutationKey: ['result-mutation'],
  })

  return (
    <Container py={'md'}>
      <Title fz={'xl'}>Seyahatinizi Görüntüleyin</Title>
      <p>
        Yapmış olduğunuz tüm rezervasyonlarınıza ait detayları, bu alandan
        görüntüleyebilirsiniz.
      </p>
      <form
        onSubmit={form.handleSubmit((data) => {
          handleMutation.mutate(data)
        })}
      >
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
          <div>
            <TextInput
              label='PNR No'
              {...form.register('bookingCode')}
              error={form.formState.errors.bookingCode?.message}
            />
          </div>
          <div>
            <TextInput
              label='Ad'
              {...form.register('firstName')}
              error={form.formState.errors.firstName?.message}
            />
          </div>
          <div>
            <TextInput
              label='Soyad'
              {...form.register('lastName')}
              error={form.formState.errors.lastName?.message}
            />
          </div>
        </div>
        <div className='flex justify-center pt-4'>
          <Button type='submit' loading={handleMutation.isPending}>
            Devam et
          </Button>
        </div>
      </form>
    </Container>
  )
}
