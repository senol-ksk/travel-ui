'use client'

import { Suspense } from 'react'
import { useSearchResultsQueries } from '../search-queries'
import { Flight } from '@/modules/flight'
import { FlightSearchResults } from './results'
import { Skeleton } from '@mantine/core'

const FlightSearchView = () => {
  const { searchResultsQuery } = useSearchResultsQueries()

  return (
    <>
      {searchResultsQuery.isLoading || searchResultsQuery.isFetching ? (
        <div className='relative'>
          <div className='absolute start-0 end-0 top-0 bottom-0 h-[8px]'>
            <Skeleton h={6} />
          </div>
        </div>
      ) : null}
      <div className='grid px-3 py-5 md:grid-cols-4 md:gap-3 md:py-9 lg:container'>
        <div className='md:col-span-1'>
          Filter section
          <div className='rounded-md border border-gray-300 p-3'>
            <div className='pb-3'>Aktarma</div>
            {/* <Stack>
              <Checkbox label='Aktarmasız' />
              <Checkbox label='1 Aktarma' />
            </Stack> */}
          </div>
        </div>
        <div className='relative md:col-span-3'>
          {searchResultsQuery.data && searchResultsQuery.data.pages.length && (
            <FlightSearchResults data={searchResultsQuery.data?.pages} />
          )}
        </div>
      </div>
    </>
  )
}

export { FlightSearchView }
