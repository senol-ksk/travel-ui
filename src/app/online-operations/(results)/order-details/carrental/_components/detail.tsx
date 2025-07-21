'use client'

import { useQueryStates } from 'nuqs'
import { operationResultParams } from '@/libs/onlineOperations/searchParams'
import { useQuery } from '@tanstack/react-query'
import { serviceRequest } from '@/network'
import {
  CarBookingDetailApiResponse,
  OperationResultWithBookingCodeResponse,
} from '@/app/online-operations/types'
import { Fragment, useMemo } from 'react'
import { Alert, Grid, GridCol, Image, Skeleton, Title } from '@mantine/core'
import { BookDetailCard } from '@/app/online-operations/_components/card'
import dayjs from 'dayjs'
import { PaymentInfo } from '@/app/online-operations/_components/payment-info'

export const CarRentalBookDetail = () => {
  const [searchParams] = useQueryStates(operationResultParams)

  const bookDetailsDataQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['booking-detail', searchParams],
    queryFn: async () => {
      const response = await serviceRequest<
        OperationResultWithBookingCodeResponse<CarBookingDetailApiResponse>
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

  if (!bookingDetailData && bookDetailsDataQuery.isLoading)
    return (
      <div className='grid gap-3 md:gap-5'>
        <Skeleton h={30} />
        <Skeleton h={24} w={'75%'} />
        <Skeleton h={20} w={'65%'} />
      </div>
    )

  if (!bookingDetailData)
    return (
      <Alert variant='light' color='red'>
        Sonuç bulunamadı.
      </Alert>
    )

  const { summaryResponse } = bookingDetailData.summaryResponse
  const {
    detailResponse: { items },
  } = summaryResponse

  return (
    <div className='grid gap-3 md:gap-5'>
      {items.map((item) => {
        const { pickupDate, returnDate, pickupCode, returnCode } =
          item.carDetail
        const pickupDateObj = dayjs(pickupDate)
        const returnDateObj = dayjs(returnDate)
        const rentDuration = returnDateObj.diff(pickupDate, 'days')

        return (
          <Fragment key={item.key}>
            <BookDetailCard>
              <Title mb={'lg'} fz={'lg'}>
                Araç Bilgisi
              </Title>
              <Grid>
                <Grid.Col span={{ md: 4 }}>
                  <BookDetailCard>
                    <Image
                      src={item.carDetail.imageUrl}
                      alt={item.carDetail.name}
                    />
                  </BookDetailCard>
                </Grid.Col>
                <Grid.Col span={{ md: 8 }}>
                  <Title fz={'md'}>
                    {item.carDetail.name}{' '}
                    <small>{item.carDetail.category}</small>{' '}
                  </Title>
                  <div>
                    <strong>Kiralama Süresi:</strong> {rentDuration} Gün
                  </div>
                </Grid.Col>
              </Grid>
            </BookDetailCard>
            <Grid>
              <GridCol span={6}>
                <BookDetailCard>
                  <Title order={4} fz='md' mb={'md'}>
                    Alış Tarihi
                  </Title>
                  <div>{pickupDateObj.format('DD MMMM YYYY')}</div>
                  <div>Saat: {pickupDateObj.format('HH:mm')}</div>
                  <div>{pickupCode}</div>
                </BookDetailCard>
              </GridCol>
              <GridCol span={6}>
                <BookDetailCard>
                  <Title order={4} fz='md' mb={'md'}>
                    Teslim Tarihi
                  </Title>
                  <div>{returnDateObj.format('DD MMMM YYYY')}</div>
                  <div>Saat: {returnDateObj.format('HH:mm')}</div>
                  <div>{returnCode}</div>
                </BookDetailCard>
              </GridCol>
            </Grid>
          </Fragment>
        )
      })}

      {bookingDetailData.operationViewData.operationResultViewData && (
        <PaymentInfo
          data={bookingDetailData?.operationViewData.operationResultViewData}
        />
      )}
    </div>
  )
}
