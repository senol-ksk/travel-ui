import { Suspense } from 'react'
import { Container, Skeleton } from '@mantine/core'

import { Flight } from '@/modules/flight'
import { FlightSearchView } from '@/app/flight/search-results/client'

export default function FlightSearchResultsPage() {
  return (
    <>
      <div className='border-b py-3'>
        <Container>
          <Flight />
        </Container>
      </div>
      <Suspense fallback={<Skeleton h={2} />}>
        <FlightSearchView />
      </Suspense>
    </>
  )
}
