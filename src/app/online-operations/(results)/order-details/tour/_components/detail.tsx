'use client'

import {
  OperationResultWithBookingCodeResponse,
  TourBookingDetailApiResponse,
} from '@/app/online-operations/types'
import { operationResultParams } from '@/libs/onlineOperations/searchParams'
import { serviceRequest } from '@/network'
import { Alert, Grid, Image, Skeleton, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'

import dayjs from 'dayjs'
import dayjsLocale from 'dayjs/locale/tr'
import { useQueryStates } from 'nuqs'
import { useMemo } from 'react'
dayjs.locale(dayjsLocale)

export const TourOrderDetail = () => {
  const [searchParams] = useQueryStates(operationResultParams)

  const bookDetailsDataQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['booking-detail', searchParams],
    queryFn: async () => {
      const response = await serviceRequest<
        OperationResultWithBookingCodeResponse<TourBookingDetailApiResponse>
      >({
        axiosOptions: {
          url: 'api/product/handleOperationResultWithBookingCode',
          params: searchParams,
        },
      })
      return response
    },
  })
  const bookingDetailData = useMemo(
    () => bookDetailsDataQuery.data?.data,
    [bookDetailsDataQuery.data?.data]
  )

  if (!bookDetailsDataQuery.data && bookDetailsDataQuery.isLoading)
    return (
      <div className='grid gap-3 md:gap-5'>
        <Skeleton h={30} />
        <Skeleton h={24} w={'75%'} />
        <Skeleton h={20} w={'65%'} />
      </div>
    )

  const productDataViewResponser =
    bookingDetailData?.operationViewData.operationResultViewData
  const summaryResponse = bookingDetailData?.summaryResponse.summaryResponse

  if (!summaryResponse || !productDataViewResponser) {
    return (
      <Alert variant='light' color='red'>
        Sonuç bulunamadı.
      </Alert>
    )
  }

  const { package: tourPackage } = summaryResponse

  return (
    <div className='grid gap-3 md:gap-5'>
      <div className='grid gap-6 rounded-md border p-3 md:p-5'>
        <div>
          <Grid gutter={'lg'}>
            <Grid.Col span={{ md: 4 }}>
              <Image
                src={tourPackage.imageUrl}
                fallbackSrc='/default-room.jpg'
                alt={tourPackage.title}
              />
            </Grid.Col>
            <Grid.Col span={{ md: 8 }}>
              <Title fz={'lg'}>{tourPackage.description}</Title>
              <div className='mt-2 flex flex-col gap-3 text-sm'>
                <div>{tourPackage.title}</div>

                <div>
                  <div>
                    <strong>Giriş: </strong>
                    {dayjs(tourPackage.startDate).format('DD MMMM dddd YYYY')} 
                  </div>
                  <div>
                    <strong>Çıkış: </strong>
                    {dayjs(tourPackage.endDate).format('DD MMMM dddd YYYY')} 
                  </div>
                </div>
              </div>
            </Grid.Col>
          </Grid>
        </div>
      </div>
      <div className='grid gap-6 rounded-md border p-3 md:p-5'>
        <div>
          <Title order={2} fz={'lg'}>
            Otel{' '}
          </Title>
          {tourPackage.hotelInformations.map((hotel, hotelIndex) => (
            <div key={hotelIndex}>{hotel.name}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
