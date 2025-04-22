'use client'

import { Button, Container, TextInput, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { serviceRequest } from '@/network'

const schema = z.object({
  bookingCode: z.string().nonempty(),
  surname: z.string().min(3).max(60),
})

type SchemaType = z.infer<typeof schema>

export default function OnlineCheckInPage() {
  const form = useForm({
    resolver: zodResolver(schema),
  })

  const pnrInfoMutation = useMutation({
    mutationKey: ['check-pnr-info'],
    mutationFn: async (params: SchemaType) => {
      const response = serviceRequest<{
        airlineCode: string
        bookingCode: string
        name: string
        surname: string
      } | null>({
        axiosOptions: {
          url: 'api/product/flightCheckInStatus',
          params,
        },
      })

      return response
    },
  })

  return (
    <Container className='py-4'>
      <Title>Online Check-in</Title>
      <p>
        Satın aldığınız uçak biletleri için hava yolu web sitesi online check-in
        linkine kolayca yönlendirilirsiniz.
      </p>
      <form
        className='mx-auto grid max-w-3xl grid-cols-1 gap-4 pt-4 sm:grid-cols-2'
        onSubmit={form.handleSubmit((data) => {
          console.log(data)
          pnrInfoMutation.mutate(data)
        })}
      >
        <div>
          <TextInput label='PNR No' {...form.register('bookingCode')} />
        </div>
        <div>
          <TextInput label='Soyad' {...form.register('surname')} />
        </div>
        <div className='flex justify-center sm:col-span-2'>
          <Button type='submit'>Sorgula</Button>
        </div>
      </form>
    </Container>
  )
}
