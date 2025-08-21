import { Suspense } from 'react'
import { Container, Skeleton } from '@mantine/core'

import { FlightSearchView } from '@/app/flight/search-results/client'

export default function FlightSearchResultsPage() {
  return (
    <Suspense fallback={<Skeleton h={2} />}>
      <FlightSearchView />
    </Suspense>
  )
}
