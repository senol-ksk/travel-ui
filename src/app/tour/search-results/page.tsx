import { Suspense } from 'react'

import { TourSearchResultClient } from '@/app/tour/search-results/client'
import { TourSearchEngine } from '@/modules/tour'
import { Container } from '@mantine/core'

const TourSearchResultsPage = () => {
  return (
    <div>
      <Suspense>
        <div className='border-b p-3 md:p-5'>
          <Container>
            <TourSearchEngine />
          </Container>
        </div>
        <TourSearchResultClient />
      </Suspense>
    </div>
  )
}

export default TourSearchResultsPage
