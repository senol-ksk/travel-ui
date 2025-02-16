'use client'

import { useTransferSearchResults } from './useSearchResults'
import { Alert, Container, Skeleton } from '@mantine/core'
import { FiAlertTriangle } from 'react-icons/fi'

import { TransferSearchItem } from '@/app/transfer/search-results/search-item'

const TransferSearchResults = () => {
  const transferSearchResultsQuery = useTransferSearchResults()

  if (transferSearchResultsQuery.hasNextPage) {
    transferSearchResultsQuery.fetchNextPage()
  }

  return (
    <div className='relative'>
      {transferSearchResultsQuery.isLoading ||
      transferSearchResultsQuery.hasNextPage ? (
        <div className='absolute start-0 end-0 top-0'>
          <Skeleton h={5} />
        </div>
      ) : null}
      <div className='@container pt-4 md:pt-10'>
        <Container>
          <div className='grid gap-4 md:grid-cols-4 md:gap-3'>
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
                <Alert
                  variant='light'
                  color='red'
                  title='Sonuç bulunamadı'
                  icon={<FiAlertTriangle size={'100%'} />}
                >
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. At
                  officiis, quae tempore necessitatibus placeat saepe.
                </Alert>
              ) : null}

              {transferSearchResultsQuery.data?.pages.map(
                ({ searchResults }) => {
                  return searchResults.map(({ vehicles }) => {
                    return vehicles
                      .sort(
                        (a, b) =>
                          a.transferData.bookDetail.sortPrice -
                          b.transferData.bookDetail.sortPrice
                      )
                      .map((vehicle) => {
                        return (
                          <TransferSearchItem key={vehicle.id} data={vehicle} />
                        )
                      })
                  })
                }
              )}
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export { TransferSearchResults }
