import { Suspense } from 'react'
import type { SearchParams } from 'nuqs/server'

import { Container } from '@mantine/core'

import { TourSearchResultClient } from '@/app/tour/search-results/client'
import { TourSearchEngine } from '@/modules/tour'
import { loadTourSearchParams } from '@/modules/cruise/searchResultParams'
import { CruiseSearchEngine } from '@/modules/cruise'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const TourSearchResultsPage = async ({ searchParams }: PageProps) => {
  const { isCruise } = await loadTourSearchParams(searchParams)
  return (
    <div>
      <Suspense>
        <div className='border-b p-3 md:p-5'>
          <Container>
            {isCruise ? <CruiseSearchEngine /> : <TourSearchEngine />}
          </Container>
        </div>
        <TourSearchResultClient />
      </Suspense>
    </div>
  )
}

export default TourSearchResultsPage
