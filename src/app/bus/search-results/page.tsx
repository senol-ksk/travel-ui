import { BusSearchResults } from '@/app/bus/search-results/search-results'
import { BusSearchEngine } from '@/modules/bus'
import { Container, Skeleton } from '@mantine/core'
import { Suspense } from 'react'

const BusSearchResultsPage = () => {
  return (
    <Suspense
      fallback={
        <div>
          <Skeleton h={20} />
        </div>
      }
    >
      <div className='border-b py-4'>
        <Container>
          <BusSearchEngine />
        </Container>
      </div>
      <BusSearchResults />
    </Suspense>
  )
}

export default BusSearchResultsPage
