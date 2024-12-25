import { type SearchParams } from 'nuqs/server'

// import { getHotelSearchResultParams } from './request-model'
import { HotelSearchResults } from '@/app/hotel/search-results/search-result'
import { Suspense } from 'react'
import { Loader, Skeleton } from '@mantine/core'
import { useSearchResultParams } from './request-model'
import { hotelSearchParamsCahce } from '@/modules/hotel/searchParams'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const HotelSearchResultsPage: React.FC<PageProps> = async ({
  searchParams,
}) => {
  await hotelSearchParamsCahce.parse(searchParams)

  return (
    <Suspense fallback={<Loader />}>
      <HotelSearchResults />
    </Suspense>
  )
}

export default HotelSearchResultsPage
