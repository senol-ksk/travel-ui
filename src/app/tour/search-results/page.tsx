import { Suspense } from 'react'

import { TourSearchResultClient } from '@/app/tour/search-results/client'
import { TourSearchEngine } from '@/modules/tour'

const TourSearchResultsPage = () => {
  return (
    <div>
      <Suspense>
        <div className='border-b p-3 md:p-5'>
          <div className='lg:container'>
            <TourSearchEngine />
          </div>
        </div>
        <TourSearchResultClient />
      </Suspense>
    </div>
  )
}

export default TourSearchResultsPage
