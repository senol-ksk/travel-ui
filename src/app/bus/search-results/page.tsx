import { BusSearchResults } from '@/app/bus/search-results/search-results'
import { Skeleton } from '@mantine/core'
import { Suspense } from 'react'

const BusSearchResultsPage = () => {
  return (
    <Suspense fallback={<Skeleton h={20} />}>
      <BusSearchResults />
    </Suspense>
  )
}

export default BusSearchResultsPage
