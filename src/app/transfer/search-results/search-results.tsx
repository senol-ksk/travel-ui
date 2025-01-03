'use client'

import { useQueryStates } from 'nuqs'

import { transferSearchParams } from '@/modules/transfer/searchParams.client'
import { useTransferSearchResults } from './useSearchResults'
import { Skeleton } from '@mantine/core'
import { TransferSearchItem } from '@/app/transfer/search-results/search-item'

import { TransferVehicle } from '@/app/transfer/types'

const TransferSearchResults = () => {
  const transferSearchResultsQuery = useTransferSearchResults()

  if (transferSearchResultsQuery.hasNextPage) {
    setTimeout(() => {
      transferSearchResultsQuery.fetchNextPage()
    }, 1000)
  }

  const handleVehicleSelect = (vehicle: TransferVehicle) => {}

  return (
    <div className='relative'>
      {transferSearchResultsQuery.isLoading ||
      transferSearchResultsQuery.hasNextPage ? (
        <div className='absolute end-0 start-0 top-0'>
          <Skeleton h={5} />
        </div>
      ) : null}
      <div className='pt-4 @container md:pt-10'>
        <div className='grid gap-4 lg:container md:grid-cols-4 md:gap-3'>
          <div className='md:col-span-1'>
            <div className='rounded-md border border-gray-300 p-3'>
              Filter section
            </div>
          </div>
          <div className='grid gap-4 md:col-span-3'>
            {!transferSearchResultsQuery.hasNextPage &&
            transferSearchResultsQuery.data?.pages.filter(
              (page) => page.searchResults.at(-1)?.vehicles.length
            ).length === 0 ? (
              <div>No Result</div>
            ) : null}

            {transferSearchResultsQuery.data?.pages.map(({ searchResults }) => {
              return searchResults.map(({ vehicles }) => {
                return vehicles
                  .sort(
                    (a, b) =>
                      a.transferData.bookDetail.sortPrice -
                      b.transferData.bookDetail.sortPrice
                  )
                  .map((vehicle) => {
                    return (
                      <TransferSearchItem
                        key={vehicle.id}
                        data={vehicle}
                        onSelect={handleVehicleSelect}
                      />
                    )
                  })
              })
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export { TransferSearchResults }
