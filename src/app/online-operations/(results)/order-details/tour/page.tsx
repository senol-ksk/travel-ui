import { Suspense } from 'react'
import { TourOrderDetail } from './_components/detail'
import { Skeleton } from '@mantine/core'

export default async function HotelBookingDetailPage() {
  return (
    <Suspense fallback={<Skeleton h={20} />}>
      <TourOrderDetail />
    </Suspense>
  )
}
