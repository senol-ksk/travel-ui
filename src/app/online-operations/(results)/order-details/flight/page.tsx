import { Skeleton } from '@mantine/core'
import { Suspense } from 'react'
import { FlightOrderDetail } from './_components/detail'

export default function FlightBookDetailPage() {
  return (
    <Suspense fallback={<Skeleton h={20} />}>
      <FlightOrderDetail />
    </Suspense>
  )
}
