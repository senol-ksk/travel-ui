import { BusSearchResults } from '@/app/bus/search-results/search-results'
import { BusSearchEngine } from '@/modules/bus'
import { Skeleton } from '@mantine/core'
import { Suspense } from 'react'

const BusSearchResultsPage = () => {
  return (
    <Suspense
      fallback={
        <div>
          <Skeleton />
        </div>
      }
    >
      <div className='border-b py-4'>
        <div className='lg:container'>
          <BusSearchEngine />
        </div>
      </div>
      <BusSearchResults />
    </Suspense>
  )
}

export default BusSearchResultsPage
