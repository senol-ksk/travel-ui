'use client'

import { useMemo } from 'react'
import { LoadingOverlay, Skeleton } from '@mantine/core'

import { CheckoutCard } from '@/components/card'

import { useCheckoutMethods } from '@/app/reservation/checkout-query'
import {
  FlightReservationSummary,
  HotelSummaryResponse,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'

import { FlightSummary } from '@/app/reservation/components/flight/summary'
import { HotelSummarySection } from '@/app/reservation/components/hotel/summary'

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
    <CheckoutCard>
      <div className='relative'>
        <LoadingOverlay visible={checkoutDataQuery.isRefetching} />
        {(() => {
          switch (moduleName?.toLowerCase()) {
            case 'flight':
              return (
                <FlightSummary
                  data={
                    checkoutDataMemo?.viewBag.SummaryViewDataResponser
                      .summaryResponse as FlightReservationSummary
                  }
                />
              )
              break
            case 'hotel':
              return (
                <HotelSummarySection
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
    </CheckoutCard>
  )
}

export { ReservationSummarySection }
