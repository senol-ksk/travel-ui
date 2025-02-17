'use client'

import { Alert, Button, Container, Skeleton } from '@mantine/core'
import { createSerializer } from 'nuqs'

import { hotelDetailSearchParams } from '@/modules/hotel/searchParams'
import { useSearchResultParams } from './useSearchQueries'
import { HotelSearchResultItem } from './results-item'

const detailUrlSerializer = createSerializer(hotelDetailSearchParams)

const HotelSearchResults: React.FC = () => {
  const { hotelSearchRequestQuery, searchParamsQuery } = useSearchResultParams()

  const handleLoadMoreActions = async () => {
    hotelSearchRequestQuery.fetchNextPage()
  }

  return (
    <>
      {(hotelSearchRequestQuery.isLoading ||
        searchParamsQuery.isLoading ||
        !hotelSearchRequestQuery.data?.pages ||
        hotelSearchRequestQuery.data?.pages.filter(
          (item) => item?.searchResults[0].items.length
        ).length === 0) && (
        <div className='relative'>
          <div className='absolute start-0 end-0'>
            <Skeleton h={6} radius={0} />
          </div>
        </div>
      )}
      <Container>
        <div className='py-5 lg:py-10'>
          <div className='grid gap-4 md:grid-cols-4 md:gap-3'>
            <div className='md:col-span-1'>
              <div className='rounded-md border border-gray-300 p-3'>
                Filter section
              </div>
            </div>
            <div
              className='grid gap-4 md:col-span-3'
              style={{
                contentVisibility: 'auto',
              }}
            >
              {hotelSearchRequestQuery.data?.pages.map((page) => {
                if (!page) return null
                return (
                  page.searchResults.length &&
                  page.searchResults.map((results) => {
                    return (
                      results.items
                        // .sort((a, b) => a.totalPrice.value - b.totalPrice.value)
                        .map((result) => {
                          const hotelInfo = results.hotelInfos.find(
                            (hotelInfo) => hotelInfo.id === result.hotelId
                          )
                          return (
                            hotelInfo && (
                              <HotelSearchResultItem
                                key={result.hotelId}
                                hotelInfo={hotelInfo}
                                resultItem={result}
                              />
                            )
                          )
                        })
                    )
                  })
                )
              })}
              {hotelSearchRequestQuery.data?.pages &&
                hotelSearchRequestQuery.data?.pages?.filter(
                  (page) => page && page.searchResults[0]?.items.length > 0
                )?.length > 0 &&
                hotelSearchRequestQuery.hasNextPage && (
                  <div className='flex justify-center'>
                    <Button
                      size='md'
                      loaderProps={{
                        type: 'dots',
                      }}
                      type='button'
                      onClick={handleLoadMoreActions}
                      loading={hotelSearchRequestQuery.isFetchingNextPage}
                    >
                      Daha Fazla Yükle
                    </Button>
                  </div>
                )}
              <div className='h-[500px]' />
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export { HotelSearchResults }
