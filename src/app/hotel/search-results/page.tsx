import { type SearchParams } from 'nuqs/server'

// import { getHotelSearchResultParams } from './request-model'
import { HotelSearchResults } from '@/app/hotel/search-results/search-result'
import { Suspense } from 'react'
import { Loader } from '@mantine/core'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const HotelSearchResultsPage: React.FC<PageProps> = async () => {
  return (
    <Suspense>
      <HotelSearchResults />
    </Suspense>
  )
}

export default HotelSearchResultsPage
