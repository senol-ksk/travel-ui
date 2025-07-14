import { Container, Skeleton } from '@mantine/core'
import { Suspense } from 'react'
import { FlightOrderDetail } from './_components/detail'

export default function FlightBookDetailPage() {
  return (
    <Container
      maw={700}
      py={{
        base: 'md',
        md: 'xl',
      }}
      className='grid gap-3 md:gap-5'
    >
      <Suspense fallback={<Skeleton h={20} />}>
        <FlightOrderDetail />
      </Suspense>
    </Container>
  )
}
