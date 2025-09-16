'use client'

import { useMemo } from 'react'

import { useCheckoutMethods } from '@/app/reservation/checkout-query'
import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'

import { FlightSummary } from '@/app/reservation/components/flight/summary'
import { HotelSummarySection } from '@/app/reservation/components/hotel/summary'
import { CarReservationSummary } from '@/app/reservation/components/car/summary'
import { BusSummarySection } from '@/app/reservation/components/bus/summary'
import { TransferSummary } from '@/app/reservation/components/transfer/summary'
import { TourSummary } from '@/app/reservation/components/tour/summary'
import { CyprusPackageSummarySection } from '@/app/reservation/components/cyprusPackage/cyprusPackage'
// import { useCheckoutContext } from '../store'

const ReservationSummarySection = () => {
  const { checkoutData } = useCheckoutMethods()

  const checkoutDataMemo = useMemo(
    () => checkoutData,
    [checkoutData]
  ) as ProductPassengerApiResponseModel

  const moduleName = useMemo(
    () => checkoutDataMemo?.viewBag.ModuleName,
    [checkoutDataMemo?.viewBag.ModuleName]
  )

  if (!checkoutDataMemo) return <div></div>

  const { viewBag } = checkoutDataMemo

  return (
    <div className='relative'>
      {(() => {
        switch (moduleName?.toLowerCase()) {
          case 'flight':
            return <FlightSummary data={viewBag} />
          case 'hotel':
            return <HotelSummarySection data={viewBag} />
          case 'carrental':
            return <CarReservationSummary data={viewBag} />
          case 'bus':
            return <BusSummarySection data={viewBag} />
          case 'transfer':
            return <TransferSummary data={viewBag} />
          case 'tour':
            return <TourSummary data={viewBag} />
          case 'cypruspackage':
            return <CyprusPackageSummarySection data={viewBag} />
          default:
            return null // TODO: implement an error view
        }
      })()}
    </div>
  )
}

export { ReservationSummarySection }
