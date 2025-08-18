'use client'

import { useMemo } from 'react'
import { LoadingOverlay, Skeleton } from '@mantine/core'

import { useCheckoutMethods } from '@/app/reservation/checkout-query'
import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'

import { FlightSummary } from '@/app/reservation/components/flight/summary'
import { HotelSummarySection } from '@/app/reservation/components/hotel/summary'
import { CarReservationSummary } from '@/app/reservation/components/car/summary'
import { BusSummarySection } from '@/app/reservation/components/bus/summary'
import { TransferSummary } from '@/app/reservation/components/transfer/summary'
import { TourSummary } from '@/app/reservation/components/tour/summary'
import { useCheckoutContext } from '../store'

const ReservationSummarySection = () => {
  const { checkoutData } = useCheckoutMethods()

  const checkoutDataMemo = useMemo(() => checkoutData, [checkoutData])

  const moduleName = useMemo(
    () => checkoutDataMemo?.viewBag.ModuleName,
    [checkoutDataMemo?.viewBag.ModuleName]
  )

  return (
    <div className='relative'>
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
        }
      })()}
    </div>
  )
}

export { ReservationSummarySection }
