import { Flight } from '@/modules/flight'
import { FlightSearchView } from './search-results'
import { Suspense } from 'react'
import { Container, Skeleton } from '@mantine/core'

export default function FlightSearchResultsPage() {
  return (
    <>
      <div className='border-b p-3'>
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
