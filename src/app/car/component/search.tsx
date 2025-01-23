'use client'

import { useRouter } from 'next/navigation'
import { Loader, Skeleton } from '@mantine/core'
import { useTimeout } from '@mantine/hooks'
import { createSerializer } from 'nuqs'

import { useCarSearchResults } from '@/app/car/search-results/useSearchResult'
import { CarSearchResultItem } from './result-item'
import { CarSearchRequest, CarSearchResultItemType } from '@/app/car/types'
import { carDetailParams } from '../searchParams'

export const createDetailParams = createSerializer(carDetailParams)

type Props = {
  searchRequestParams: CarSearchRequest
}

export const Search: React.FC<Props> = ({ searchRequestParams }) => {
  const router = useRouter()
  const carSearchResult = useCarSearchResults(searchRequestParams)

  const { start: tryFetchNextResults } = useTimeout(() => {
    carSearchResult.fetchNextPage()
  }, 2000)

  const handleCarSelect = (car: CarSearchResultItemType) => {
    const detailParams = createDetailParams({
      selectedProductKey: car.key,
      searchToken: searchRequestParams.params.searchToken,
      sessionToken: searchRequestParams.params.sessionToken,
    })
    router.push(`/car/detail${detailParams}`)
  }

  if (carSearchResult.hasNextPage) {
    tryFetchNextResults()
  }

  if (carSearchResult.isLoading)
    return (
      <div className='flex items-center justify-center pt-3 md:pt-10'>
        <Loader height={30} />
      </div>
    )

  return (
    <div>
      <div className='relative'>
        <div className='absolute start-0 end-0 top-0 h-[20] overflow-hidden'>
          {carSearchResult.hasNextPage ? (
            <Skeleton className='w-full' h={13} />
          ) : null}
        </div>

        <div className='pt-10 md:container'>
          <div className='grid gap-4 md:grid-cols-4 md:gap-3'>
            <div className='md:col-span-1'>
              <div className='rounded-md border border-gray-300 p-3'>
                Filter section
              </div>
            </div>
            <div className='grid gap-4 md:col-span-3'>
              {carSearchResult.data?.pages.map((carPage) => {
                return carPage.data.searchResults.map((searchResult) => {
                  return searchResult.items
                    ?.sort((a, b) => a.totalPrice.value - b.totalPrice.value)
                    .map((carData) => {
                      return (
                        <div key={carData.key}>
                          <CarSearchResultItem
                            item={carData}
                            onSelect={handleCarSelect}
                          />
                        </div>
                      )
                    })
                })
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
