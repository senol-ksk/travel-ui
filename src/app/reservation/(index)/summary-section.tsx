'use client'

import { CheckoutCard } from '@/components/card'
import { useCheckoutMethods } from '../checkout-query'
import { useMemo } from 'react'
import { FlightSummary } from '../components/flight/summary'
import { FlightReservationSummary } from '@/types/passengerViewModel'
import { Skeleton } from '@mantine/core'

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
        <Skeleton h={20} radius={'md'} />
        <Skeleton height={16} radius='xl' w={'75%'} />
        <Skeleton height={8} radius='xl' />
        <Skeleton height={8} radius='xl' />
      </div>
    )
  }

  return (
    <CheckoutCard>
      {(() => {
        switch (moduleName) {
          case 'Flight':
            return (
              <FlightSummary
                data={
                  checkoutDataMemo?.viewBag.SummaryViewDataResponser
                    .summaryResponse as FlightReservationSummary
                }
              />
            )
            break
          case 'Hotel':
            return <div>Hotel summary</div>
          default:
            return <div>No summary section</div>
            break
        }
      })()}
    </CheckoutCard>
  )
}

export { ReservationSummarySection }
