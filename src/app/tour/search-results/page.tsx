import { Suspense } from 'react'
import { TourSearchResultClient } from '@/app/tour/search-results/client'

const TourSearchResultsPage = async () => {
  return (
    <div>
      <Suspense>
        <TourSearchResultClient />
      </Suspense>
    </div>
  )
}

export default TourSearchResultsPage
