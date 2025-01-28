import { Flight } from '@/modules/flight'
import { FlightSearchView } from './search-results'
import { Suspense } from 'react'
import { Skeleton } from '@mantine/core'

export default function FlightSearchResultsPage() {
  return (
    <>
      <div className='border-b p-3'>
        <div className='lg:container'>
          <Flight />
        </div>
      </div>
      <Suspense fallback={<Skeleton h={2} />}>
        <FlightSearchView />
      </Suspense>
    </>
  )
}
