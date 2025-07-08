'use client'

import { Button, TextInput, Title } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useForm } from 'react-hook-form'
import { MdOutlineChevronRight } from 'react-icons/md'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'

import { z } from '@/libs/zod'
import { serviceRequest } from '@/network'
import { RiErrorWarningLine } from 'react-icons/ri'
import { FlightRefundApiResponse } from '@/app/online-operations/types'
import { createSerializer } from 'nuqs'
import { flightRefundParams } from '@/libs/onlineOperations/searchParams'
import { useTransitionRouter } from 'next-view-transitions'

const schema = z.object({
  bookingCode: z.string().nonempty(),
  surname: z.string().min(2).nonempty(),
})

type FormSchemaType = z.infer<typeof schema>

export default function CancelFlightPage() {
  const form = useForm({
    resolver: zodResolver(schema),
  })
  const router = useTransitionRouter()

  const submitMutation = useMutation({
    mutationKey: ['book-refund-mutation'],
    mutationFn: async (params: FormSchemaType) => {
      const response = await serviceRequest<FlightRefundApiResponse>({
        axiosOptions: {
          url: 'api/product/bookRefundData',
          params,
        },
      })
      return response
    },
    onSuccess: (query, { bookingCode, surname }) => {
      if (!query?.success || !query.data) {
        notifications.show({
          title: 'PNR bulunamadı.',
          message: 'Lutfen PNR ve Soyad bilgilerini gözden geçirin',
          icon: <RiErrorWarningLine size={20} />,
          position: 'top-right',
          color: 'white',
          autoClose: 5000,
          classNames: {
            icon: 'bg-transparent size-[auto]',
            root: 'bg-red-600 text-white',
            title: 'text-white',
            description: 'text-white',
            closeButton: 'text-white',
          },
        })
      }

      if (!!query?.data && query.success) {
        const refundPageSerializer = createSerializer(flightRefundParams)
        const refundUrl = refundPageSerializer(
          `/online-operations/refund/${query.data[1].summaryResponse.moduleName.toLocaleLowerCase()}`,
          {
            bookingCode,
            surname,
          }
        )
        router.push(refundUrl)
      }
    },
  })

  return (
    <div>
      <Title>Uçak bileti, iptal/iade işlemleri</Title>
      <div className='pt-4 pb-7 text-lg md:pt-6 md:pb-9'>
        Web sitemiz üzerinden satın aldığınız uçak biletlerinizi sadece 2 kolay
        adımda iptal edebilirsiniz.
      </div>
      <form
        onSubmit={form.handleSubmit((data) => {
          submitMutation.mutate(data)
        })}
      >
        <div className='mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2'>
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
            loading={submitMutation.isPending}
          >
            Sorgula
          </Button>
        </div>
      </form>
    </div>
  )
}
