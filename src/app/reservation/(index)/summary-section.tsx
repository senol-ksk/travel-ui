'use client'

import { useMemo } from 'react'
import { LoadingOverlay, Skeleton } from '@mantine/core'

import { CheckoutCard } from '@/components/card'

import { useCheckoutMethods } from '@/app/reservation/checkout-query'
import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'

import { FlightSummary } from '@/app/reservation/components/flight/summary'
import { HotelSummarySection } from '@/app/reservation/components/hotel/summary'
import { CarReservationSummary } from '@/app/reservation/components/car/summary'
import { BusSummarySection } from '@/app/reservation/components/bus/summary'
import { TransferSummary } from '@/app/reservation/components/transfer/summary'
import { TourSummary } from '@/app/reservation/components/tour/summary'

const ReservationSummarySection = () => {
  const { checkoutDataQuery } = useCheckoutMethods()
  const checkoutDataMemo = useMemo(
    () => checkoutDataQuery.data?.data,
    [checkoutDataQuery.data?.data]
  )

  const moduleName = useMemo(
    () => checkoutDataMemo?.viewBag.ModuleName,
    [checkoutDataMemo?.viewBag.ModuleName]
  )

  if (checkoutDataQuery.isLoading) {
    return (
      <div className='relative grid gap-3'>
        <Skeleton h={120} radius={'md'} />
        <Skeleton height={16} radius='xl' w={'75%'} />
        <Skeleton height={8} radius='xl' />
        <Skeleton height={8} radius='xl' />
      </div>
    )
  }

  return (
    <div className='relative'>
      <LoadingOverlay visible={checkoutDataQuery.isRefetching} />
      {(() => {
        switch (moduleName?.toLowerCase()) {
          case 'flight':
            return (
              <FlightSummary
                data={
                  checkoutDataMemo?.viewBag as ProductPassengerApiResponseModel['viewBag']
                }
              />
            )
          case 'hotel':
            return (
              <HotelSummarySection
                data={
                  checkoutDataMemo?.viewBag as ProductPassengerApiResponseModel['viewBag']
                }
              />
            )
          case 'carrental':
            return (
              <CarReservationSummary
                data={
                  checkoutDataMemo?.viewBag as ProductPassengerApiResponseModel['viewBag']
                }
              />
            )
          case 'bus':
            return (
              <BusSummarySection
                data={
                  checkoutDataMemo?.viewBag as ProductPassengerApiResponseModel['viewBag']
                }
              />
            )
          case 'transfer':
            return (
              <TransferSummary
                data={
                  checkoutDataMemo?.viewBag as ProductPassengerApiResponseModel['viewBag']
                }
              />
            )
          case 'tour':
            return (
              <TourSummary
                data={
                  checkoutDataMemo?.viewBag as ProductPassengerApiResponseModel['viewBag']
                }
              />
            )
          default:
            return <div>No summary section</div>
            break
        }
      })()}
    </div>
  )
}

export { ReservationSummarySection }
