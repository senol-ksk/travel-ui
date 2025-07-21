'use client'

import { Button, Container, TextInput, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import { z } from '@/libs/zod'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { serviceRequest } from '@/network'
import { MdOutlineChevronRight } from 'react-icons/md'

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
    <div>
      <Title>Online Check-in</Title>
      <div className='pt-4 pb-7 text-lg md:pt-6 md:pb-9'>
        Satın aldığınız uçak biletleri için hava yolu web sitesi online check-in
        linkine kolayca yönlendirilirsiniz.
      </div>
      <form
        onSubmit={form.handleSubmit((data) => {
          pnrInfoMutation.mutate(data)
        })}
      >
        <div className='mx-auto grid max-w-3xl grid-cols-1 gap-4 pt-4 sm:grid-cols-2'>
          <div>
            <TextInput
              label='PNR No'
              {...form.register('bookingCode')}
              error={form.formState.errors.bookingCode?.message}
              size='md'
            />
          </div>
          <div>
            <TextInput
              label='Soyad'
              {...form.register('surname')}
              error={form.formState.errors.surname?.message}
              size='md'
            />
          </div>
        </div>
        <div className='flex justify-center pt-4 md:pt-7'>
          <Button
            type='submit'
            size='lg'
            rightSection={<MdOutlineChevronRight />}
          >
            Sorgula
          </Button>
        </div>
      </form>
    </div>
  )
}
