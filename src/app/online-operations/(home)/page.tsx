'use client'

import { Button, TextInput, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { MdOutlineChevronRight } from 'react-icons/md'

import {
  operationResultFormSchema,
  OperationResultFormSchemaType,
  operationResultParams,
} from '@/libs/onlineOperations/searchParams'
import { createSerializer } from 'nuqs'
import { useTransitionRouter } from 'next-view-transitions'
import {
  HotelBookingDetailApiResponse,
  OperationResultWithBookingCodeResponse,
} from '@/app/online-operations/types'
import { serviceRequest } from '@/network'
import { Route } from 'next'

export default function OnlineOperationsPage() {
  const form = useForm({
    resolver: zodResolver(operationResultFormSchema),
  })
  const router = useTransitionRouter()

  const handleMutation = useMutation({
    mutationFn: async (data: OperationResultFormSchemaType) => {
      const response = await serviceRequest<
        OperationResultWithBookingCodeResponse<HotelBookingDetailApiResponse>
      >({
        axiosOptions: {
          url: 'api/product/handleOperationResultWithBookingCode',
          params: data,
        },
      })
      return response
    },
    mutationKey: ['booking-result-mutation'],
    onSuccess(query, { bookingCode, firstName, lastName }) {
      if (query?.success) {
        // query.data.operationResultWithBookingCode.productDataViewResponser.dataViewResponsers[1].summaryResponse.moduleName
        const moduleName =
          query.data?.summaryResponse.summaryResponse.moduleName.toLowerCase()

        const resultUrlSerializer = createSerializer(operationResultParams)
        // https://localhost:3000/online-operations/order-details/hotel?bookingCode=HD-2506RK9L&firstName=ESIN&lastName=AKCAY+ALAN
        const resultUrl = resultUrlSerializer(
          `online-operations/order-details/${moduleName}`,
          {
            bookingCode,
            firstName,
            lastName,
          }
        ) as Route

        router.push(resultUrl)
      }
    },
  })

  return (
    <div>
      <Title
        fz={{
          base: 'h3',
          md: 'h1',
        }}
      >
        Seyahatinizi Görüntüleyin
      </Title>

      <div className='text-md pt-4 pb-7 md:pt-6 md:pb-9 md:text-lg'>
        Yapmış olduğunuz tüm rezervasyonlarınıza ait detayları, bu alandan
        görüntüleyebilirsiniz.
      </div>

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
              size={'md'}
            />
          </div>
          <div>
            <TextInput
              label='Ad'
              {...form.register('firstName')}
              error={form.formState.errors.firstName?.message}
              size={'md'}
            />
          </div>
          <div>
            <TextInput
              label='Soyad'
              {...form.register('lastName')}
              error={form.formState.errors.lastName?.message}
              size={'md'}
            />
          </div>
        </div>
        <div className='flex justify-center pt-4 md:pt-7'>
          <Button
            type='submit'
            size='lg'
            loading={handleMutation.isPending}
            rightSection={<MdOutlineChevronRight />}
          >
            Görüntüle
          </Button>
        </div>
      </form>
    </div>
  )
}
