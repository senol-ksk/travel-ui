'use client'

import { operationResultParams } from '@/libs/onlineOperations/searchParams'
import { serviceRequest } from '@/network'
import { Alert, Skeleton, Stack, Title } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'
import { useMemo } from 'react'

import {
  BusBookDetailApiResponse,
  OperationResultWithBookingCodeResponse,
} from '@/app/online-operations/types'
import { BookDetailCard } from '@/app/online-operations/_components/card'
import dayjs from 'dayjs'
import { PaymentInfo } from '@/app/online-operations/_components/payment-info'
import clsx from 'clsx'

export const TransferBookDetail = () => {
  const [searchParams] = useQueryStates(operationResultParams)

  const bookDetailsDataQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['booking-detail', searchParams],
    queryFn: async () => {
      const response = await serviceRequest<
        OperationResultWithBookingCodeResponse<BusBookDetailApiResponse>
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
    busJourney,
    busJourney: {
      bus: { arrivalDate, departureDate },
      origin,
      destination,
      selectedSeats,
    },
  } = summaryResponse
  const arrivalDateObj = dayjs(arrivalDate)
  const departureDateObj = dayjs(departureDate)

  return (
    <div className='grid gap-3 md:gap-5'>
      <BookDetailCard>
        <Title fz='lg' mb={'lg'}>
          Sefer Bilgileri
        </Title>
        <div>
          <div>
            <strong>Firma:</strong> {busJourney.company}
          </div>
          <div>
            <strong>Kalkış:</strong>{' '}
            {departureDateObj.format('DD MMMM YYYY, HH:mm')} {' - '} {origin}
          </div>
          <div>
            <strong>Varış:</strong>{' '}
            {arrivalDateObj.format('DD MMMM YYYY, HH:mm')} {' - '} {destination}
          </div>
          <div>
            <strong>Seçili koltuklar</strong>:
            <div className='flex flex-wrap gap-3 pt-2'>
              {selectedSeats.map((seat, seatIndex) => {
                return (
                  <div
                    key={seatIndex}
                    className={clsx(
                      'flex size-9 items-center justify-center rounded font-semibold',
                      {
                        'bg-pink-200': seat.gender === 1,
                        'bg-blue-200': seat.gender === 0,
                      }
                    )}
                  >
                    {seat.no}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </BookDetailCard>
      {bookingDetailData.operationViewData.operationResultViewData && (
        <PaymentInfo
          data={bookingDetailData?.operationViewData.operationResultViewData}
        />
      )}
    </div>
  )
}
