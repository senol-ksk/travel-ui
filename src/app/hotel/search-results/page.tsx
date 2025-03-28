import { type SearchParams } from 'nuqs/server'

import { HotelSearchResults } from '@/app/hotel/search-results/search-result'
import { Suspense } from 'react'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const HotelSearchResultsPage: React.FC<PageProps> = async ({
  searchParams,
}) => {
  const params = await searchParams

  return (
    <Suspense>
      <HotelSearchResults slug={params.path as string} />
    </Suspense>
  )
}

export default HotelSearchResultsPage
