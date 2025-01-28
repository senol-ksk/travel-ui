'use client'

import { useTourSearchResultsQuery } from '@/app/tour/search-results/useSearhResults'
import { TourSearchEngine } from '@/modules/tour'
import { Alert, Skeleton } from '@mantine/core'
import { TourSearchResultItem } from './item'
import { FiAlertTriangle } from 'react-icons/fi'
import { TourSearchResultSearchItem } from '@/modules/tour/type'
import { serializeTourDetailPageParams } from '@/modules/tour/detailSearchParams'
import { useRouter } from 'next/navigation'

const TourSearchResultClient = () => {
  const { searchResultsQuery, searchParamsQuery } = useTourSearchResultsQuery()
  const router = useRouter()

  const searchRequestIsLoading =
    searchResultsQuery.isLoading ||
    searchResultsQuery.hasNextPage ||
    searchParamsQuery.isLoading

  const hasNoResult =
    !searchResultsQuery.hasNextPage &&
    searchResultsQuery.data?.pages
      .map((page) =>
        page.code === 1 && page.data.searchResults
          ? page.data.searchResults?.filter((results) => results.items?.length)
              .length
          : 0
      )
      .filter(Number).length === 0

  const handleTourItemSelect = (data: TourSearchResultSearchItem) => {
    const detailUrl = serializeTourDetailPageParams('/tour/detail', {
      productKey: data.key,
      slug: data.slug,
      searchToken: searchParamsQuery.data?.data?.params.searchToken,
      sessionToken: searchParamsQuery.data?.data?.sessionToken,
    })

    router.push(detailUrl)
  }

  if (
    searchResultsQuery.hasNextPage &&
    !searchResultsQuery.isFetchingNextPage
  ) {
    setTimeout(searchResultsQuery.fetchNextPage, 1000)
  }

  if (searchResultsQuery.error) return <div>Bir hata oldu</div>

  return (
    <div>
      <div className='border-b p-3 md:p-5'>
        <div className='lg:container'>
          <TourSearchEngine />
        </div>
      </div>
      <div className='relative'>
        {searchRequestIsLoading ? (
          <Skeleton h={6} className='absolute start-0 end-0 top-0' />
        ) : null}
      </div>
      <div className='px-3 pt-10 lg:container'>
        <div className='grid gap-4 sm:grid-cols-12 md:gap-3'>
          <div className='sm:col-span-4 lg:col-span-3'>
            <div className='rounded-md border border-gray-300 p-3'>
              Filter section
            </div>
          </div>
          <div className='grid gap-4 sm:col-span-8 lg:col-span-9'>
            {hasNoResult ? (
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
            {searchResultsQuery.data?.pages.map((tourPage) => {
              return (
                tourPage?.data &&
                tourPage?.data.searchResults.map((searchResult) => {
                  return searchResult.items
                    ?.sort((a, b) => a.totalPrice.value - b.totalPrice.value)
                    .map((searchResultItem) => {
                      return (
                        <TourSearchResultItem
                          key={searchResultItem.key}
                          data={searchResultItem}
                          onClick={handleTourItemSelect}
                        />
                      )
                    })
                })
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export { TourSearchResultClient }
