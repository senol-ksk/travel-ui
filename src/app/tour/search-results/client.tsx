'use client'

import { Alert, Container, Skeleton } from '@mantine/core'
import { FiAlertTriangle } from 'react-icons/fi'
import { useRouter } from 'next/navigation'

import { useTourSearchResultsQuery } from '@/app/tour/search-results/useSearhResults'

import { TourSearchResultItem } from './item'
import { TourSearchResultSearchItem } from '@/modules/tour/type'
import { serializeTourDetailPageParams } from '@/modules/tour/detailSearchParams'

const TourSearchResultClient = () => {
  const { searchResultsQuery, searchParamsQuery } = useTourSearchResultsQuery()
  const router = useRouter()

  const searchRequestIsLoading =
    searchResultsQuery.isLoading ||
    searchResultsQuery.hasNextPage ||
    searchParamsQuery.isLoading

  const searchResultPages = searchResultsQuery.data?.pages

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
    searchResultsQuery.fetchNextPage()
  }

  const searchIsCompleted =
    !searchRequestIsLoading && !searchResultsQuery.hasNextPage

  const searchResponsePages = searchResultsQuery.data?.pages
  const hasResult = searchIsCompleted
    ? searchResponsePages?.some((searchData) =>
        searchData.data.searchResults.some(
          (searchResult) => searchResult.items?.length
        )
      )
    : true

  if (!hasResult || searchResultsQuery.isError || searchParamsQuery.isError) {
    return (
      <Container size={'sm'}>
        <div className='py-4'>
          <Alert
            variant='light'
            color='red'
            title='Sonuç bulunamadı'
            icon={<FiAlertTriangle size={'100%'} />}
          >
            <div>Sonuç bulunamadı.</div>
          </Alert>
        </div>
      </Container>
    )
  }

  return (
    <div>
      {searchRequestIsLoading ? (
        <div className='relative'>
          <Skeleton h={6} className='absolute start-0 end-0 top-0' />
        </div>
      ) : null}
      <Container className='py-10'>
        <div className='grid gap-4 sm:grid-cols-12 md:gap-3'>
          <div className='sm:col-span-4 lg:col-span-3'>
            <div className='rounded-md border border-gray-300 p-3'>
              Filter section
            </div>
          </div>
          <div
            className='grid gap-4 sm:col-span-8 lg:col-span-9'
            style={{
              contentVisibility: 'auto',
            }}
          >
            {searchResultPages?.map((tourPage) => {
              return (
                tourPage?.data &&
                tourPage?.data.searchResults.map((searchResult) => {
                  return searchResult.items
                    ?.sort((a, b) => a.totalPrice.value - b.totalPrice.value)
                    .map((searchResultItem) => {
                      return (
                        <TourSearchResultItem
                          key={searchResultItem.key}
                          providerName={searchResult.diagnostics.providerName}
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
      </Container>
    </div>
  )
}

export { TourSearchResultClient }
