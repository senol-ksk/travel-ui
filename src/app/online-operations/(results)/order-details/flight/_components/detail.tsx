'use client'

import { useQueryStates } from 'nuqs'

import { operationResultParams } from '@/libs/onlineOperations/searchParams'
import {
  FlightBookDetailApiResponse,
  OperationResultWithBookingCodeResponse,
} from '@/app/online-operations/types'
import { useQuery } from '@tanstack/react-query'
import { Alert, Skeleton, Title } from '@mantine/core'

import { serviceRequest } from '@/network'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import { AirlineLogo } from '@/components/airline-logo'
import { CiClock2 } from 'react-icons/ci'
import { MdOutlineChevronRight } from 'react-icons/md'
import { PaymentInfo } from '@/app/online-operations/_components/payment-info'
import { BookDetailCard } from '@/app/online-operations/_components/card'
import { Fragment } from 'react'

export const FlightOrderDetail = () => {
  const [searchParams] = useQueryStates(operationResultParams)

  const bookDetailsDataQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['booking-detail', searchParams],
    queryFn: async () => {
      const response = await serviceRequest<
        OperationResultWithBookingCodeResponse<FlightBookDetailApiResponse>
      >({
        axiosOptions: {
          url: 'api/product/handleOperationResultWithBookingCode',
          params: searchParams,
        },
      })
      return response
    },
  })
  const bookDetailResponseData = bookDetailsDataQuery.data?.data

  if (bookDetailsDataQuery.isLoading) {
    return (
      <div className='grid gap-3'>
        <Skeleton h={30} />
        <Skeleton h={24} w={'75%'} />
        <Skeleton h={20} w={'65%'} />
      </div>
    )
  }

  const summaryResponse =
    bookDetailResponseData?.summaryResponse.summaryResponse

  if (
    !bookDetailsDataQuery.isLoading &&
    (!bookDetailResponseData || !summaryResponse)
  ) {
    return (
      <Alert variant='light' color='red'>
        Sonuç bulunamadı.
      </Alert>
    )
  }

  return (
    <div className='grid gap-3 md:gap-6'>
      {summaryResponse?.flightList.map((flight) => {
        const detail = flight.flightDetail
        const relatedSegments = flight.flightSegments.filter((segment) =>
          detail.flightSegmentKeys.includes(segment.key)
        )

        return relatedSegments.map((segment) => {
          const { arrivalTime, departureTime } = segment
          const arrivalTimeDateObj = dayjs(arrivalTime)
          const departureTimeDateObj = dayjs(departureTime)
          const flightDuration = dayjs.duration(
            arrivalTimeDateObj.diff(departureTimeDateObj)
          )

          return (
            <Fragment key={segment.key}>
              <BookDetailCard>
                <div className='grid gap-4'>
                  <div className='flex justify-between gap-3'>
                    {/* {segment.groupId === 0 && (
                      <Title fw={500} fz={'xl'}>
                        {segment.groupId === 0
                          ? `Gidiş Uçuşu`
                          : segment.groupId === 1 && `Dönüş Uçuşu`}
                      </Title>
                    )} */}
                    <div>
                      {dayjs(departureTime).format('DD MMMM YYYY, ddd')}
                    </div>
                  </div>
                  <div className='flex gap-3'>
                    <div>
                      <AirlineLogo
                        airlineCode={segment.operatingAirline.code}
                        alt={segment.operatingAirline.value}
                      />
                    </div>
                    <div>
                      {segment.operatingAirline.value}{' '}
                      {segment.operatingAirline.code} {segment.flightNumber}
                    </div>
                  </div>
                  <div>
                    <div className='flex items-center gap-1 text-sm'>
                      <div>
                        {summaryResponse?.airportList[segment.origin.code].city}
                        ,{' '}
                        {
                          summaryResponse?.airportList[
                            segment.origin.code
                          ].value.at(0)?.value
                        }
                      </div>
                      <span className='text-xl'>
                        <MdOutlineChevronRight />
                      </span>
                      <div>
                        {
                          summaryResponse?.airportList[segment.destination.code]
                            .city
                        }
                        ,{' '}
                        {
                          summaryResponse?.airportList[
                            segment.destination.code
                          ].value.at(0)?.value
                        }
                      </div>
                    </div>
                  </div>
                  <div className='flex'>
                    <div className='font-medium'>
                      {dayjs(departureTime).format('HH:mm')}{' '}
                      {segment.origin.code}
                    </div>
                    <div className='flex flex-1 items-center justify-center gap-2'>
                      <div className='flex items-center gap-2'>
                        <div>
                          <CiClock2 />
                        </div>
                        <div>
                          {flightDuration.format('HH')}sa{' '}
                          {flightDuration.format('mm')}dk
                        </div>
                      </div>
                    </div>
                    <div className='font-medium'>
                      {dayjs(arrivalTime).format('HH:mm')}{' '}
                      {segment.destination.code}
                    </div>
                  </div>
                </div>
              </BookDetailCard>
            </Fragment>
          )
        })
      })}
      {bookDetailResponseData?.operationViewData.operationResultViewData && (
        <PaymentInfo
          data={
            bookDetailResponseData?.operationViewData.operationResultViewData
          }
        />
      )}
    </div>
  )
}
