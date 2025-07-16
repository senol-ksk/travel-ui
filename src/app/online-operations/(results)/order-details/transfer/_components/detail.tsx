'use client'

import { operationResultParams } from '@/libs/onlineOperations/searchParams'
import { serviceRequest } from '@/network'
import { Alert, Grid, Image, Skeleton, Stack, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'
import { useMemo } from 'react'

import {
  OperationResultWithBookingCodeResponse,
  TransferBookDetailApiResponse,
} from '@/app/online-operations/types'
import { BookDetailCard } from '@/app/online-operations/_components/card'
import dayjs from 'dayjs'
import { PaymentInfo } from '@/app/online-operations/_components/payment-info'

export const TransferBookDetail = () => {
  const [searchParams] = useQueryStates(operationResultParams)

  const bookDetailsDataQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['booking-detail', searchParams],
    queryFn: async () => {
      const response = await serviceRequest<
        OperationResultWithBookingCodeResponse<TransferBookDetailApiResponse>
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
  const summaryResponse = bookingDetailData?.summaryResponse.summaryResponse

  if (!bookingDetailData && bookDetailsDataQuery.isLoading)
    return (
      <Stack>
        <Skeleton h={30} />
        <Skeleton h={24} w={'75%'} />
        <Skeleton h={20} w={'65%'} />
      </Stack>
    )

  if (!summaryResponse)
    return (
      <Alert variant='light' color='red'>
        Sonuç bulunamadı.
      </Alert>
    )
  const {
    selectResponse,
    selectResponse: {
      adultPassengerCount,
      childrenPassengerCount,
      babyPassengerCount,
    },
  } = summaryResponse
  const totalPassengerCount =
    adultPassengerCount + childrenPassengerCount + babyPassengerCount
  return (
    <div className='grid gap-3 md:gap-5'>
      <BookDetailCard>
        <Title fz={'lg'}>Araç Bilgisi</Title>
        <Grid gutter={'md'}>
          <Grid.Col span={{ md: 4 }}>
            <Image
              src={selectResponse.transferVehicle.transferInfo?.vehiclePhotoUrl}
              fallbackSrc=''
              alt=''
            />
          </Grid.Col>
          <Grid.Col span={{ md: 8 }}>
            <Title order={2} fz={'lg'}>
              {selectResponse.transferVehicle.vehicleTitle}
            </Title>
            <div>{totalPassengerCount} Yolcu</div>
          </Grid.Col>
        </Grid>
      </BookDetailCard>
      <Grid>
        <Grid.Col span={{ md: 6 }}>
          <BookDetailCard className='h-full'>
            <Title order={4} mb={'md'}>
              Alış Bilgileri
            </Title>
            <div>{dayjs(selectResponse.pickupDate).format('DD MMMM YYYY')}</div>
            <div>Saat: {dayjs(selectResponse.pickupDate).format('HH:mm')}</div>
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: selectResponse.pickupPointName,
                }}
              />
            </div>
          </BookDetailCard>
        </Grid.Col>
        <Grid.Col span={{ md: 6 }}>
          <BookDetailCard className='h-full'>
            <Title order={4} mb={'md'}>
              Varış Yeri
            </Title>
            <div>{selectResponse.dropPointName}</div>
          </BookDetailCard>
        </Grid.Col>
      </Grid>

      {bookingDetailData.operationViewData.operationResultViewData && (
        <PaymentInfo
          data={bookingDetailData?.operationViewData.operationResultViewData}
        />
      )}
    </div>
  )
}
