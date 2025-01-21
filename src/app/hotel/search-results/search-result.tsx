'use client'

import { Button, Skeleton, Title } from '@mantine/core'

import { createSerializer, useQueryStates } from 'nuqs'
import {
  hotelDetailSearchParams,
  hotelSearchParamParser,
} from '@/modules/hotel/searchParams'
import { useSearchResultParams } from './request-model'
import { HotelSearchEngine } from '@/modules/hotel'
import { HotelSearchResultItem } from './results-item'
import { useTransitionRouter } from 'next-view-transitions'
import {
  HotelSearchResultHotelInfo,
  HotelSearchResultItemType,
} from '@/app/hotel/types'

const detailUrlSerializer = createSerializer(hotelDetailSearchParams)

const HotelSearchResults: React.FC = () => {
  const { hotelSearchRequestQuery, searchParams, searchParamsQuery } =
    useSearchResultParams()

  // if (
  //   hotelSearchRequestQuery.hasNextPage &&
  //   !hotelSearchRequestQuery.isFetching
  // ) {
  //   hotelSearchRequestQuery.fetchNextPage()
  // }

  const router = useTransitionRouter()
  function handleRedirectToDetail({
    hotelInfo,
    resultItem,
  }: {
    hotelInfo: HotelSearchResultHotelInfo
    resultItem: HotelSearchResultItemType
  }) {
    const detailUrl = detailUrlSerializer(`/hotel/${hotelInfo.slug}`, {
      slug: hotelInfo.slug,
      productKey: resultItem.key,
      searchToken: searchParamsQuery.data?.hotelSearchApiRequest.searchToken,
      sessionToken: searchParamsQuery.data?.hotelSearchApiRequest.sessionToken,
      propertyName: hotelInfo.name,
      hotelSlug: hotelInfo.slug,
      type: searchParams.type,
    })

    router.push(detailUrl)
  }

  return (
    <>
      {(hotelSearchRequestQuery.isLoading || searchParamsQuery.isLoading) && (
        <div className='relative'>
          <div className='absolute end-0 start-0'>
            <Skeleton h={6} radius={0} />
          </div>
        </div>
      )}
      <div className='py-5 lg:container lg:py-10'>
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
              return (
                page.searchResults.length &&
                page.searchResults.map((results) => {
                  return results.items
                    .sort((a, b) => a.totalPrice.value - b.totalPrice.value)
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
                            onSelect={handleRedirectToDetail}
                          />
                        )
                      )
                    })
                })
              )
            })}
            {hotelSearchRequestQuery.hasNextPage && (
              <div className='flex justify-center'>
                <Button
                  size='md'
                  loaderProps={{
                    type: 'dots',
                  }}
                  type='button'
                  onClick={() => hotelSearchRequestQuery.fetchNextPage()}
                  loading={hotelSearchRequestQuery.isFetchingNextPage}
                >
                  Daha Fazla Yükle
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export { HotelSearchResults }
