import { Suspense } from 'react'
import { HotelBookingSummary } from './_components/summary'
import { Skeleton } from '@mantine/core'

export default async function HotelBookingDetailPage() {
  return (
    <Suspense fallback={<Skeleton h={20} />}>
      <HotelBookingSummary />
    </Suspense>
  )
}
