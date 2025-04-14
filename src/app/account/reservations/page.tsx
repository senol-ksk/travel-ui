import { Suspense } from 'react'
import { Skeleton, Title } from '@mantine/core'

import { ReservationList } from './_components/reservation-list'

const ReservationSkeleton = () => (
  <div className='grid gap-3'>
    <Skeleton h={20} />
    <Skeleton h={20} />
  </div>
)

export default async function ReservationPage() {
  return (
    <div>
      <Title mb={'md'} fz={'h3'}>
        Rezervasyonlar
      </Title>
      <Suspense fallback={<ReservationSkeleton />}>
        <div>
          <ReservationList />
        </div>
      </Suspense>
    </div>
  )
}
