'use client'

import { Alert, Container, NativeSelect, Skeleton } from '@mantine/core'
import { FiAlertTriangle } from 'react-icons/fi'
import { Virtuoso } from 'react-virtuoso'

import { useTourSearchResultsQuery } from '@/app/tour/search-results/useSearchResults'

import { TourSearchResultItem } from './item'
import { filterParser, SortOrderEnums } from '@/modules/tour/searchResultParams'
import { useQueryStates } from 'nuqs'
import { useFilterActions } from './useFilteractions'
import { TourSearchResultSearchItem } from '@/modules/tour/type'

const TourSearchResultClient = () => {
  const { searchResultsQuery, searchParamsQuery } = useTourSearchResultsQuery()
  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParser)

  const searchRequestIsLoading =
    searchResultsQuery.isLoading ||
    searchResultsQuery.hasNextPage ||
    searchParamsQuery.isLoading

  if (
    searchResultsQuery.hasNextPage &&
    !searchResultsQuery.isFetchingNextPage
  ) {
    searchResultsQuery.fetchNextPage()
  }

  const searchData = searchResultsQuery.data?.pages?.flatMap((page) =>
    page?.data?.searchResults?.flatMap((item) => item.items)
  ) as TourSearchResultSearchItem[]

  const filteredData = useFilterActions(searchData ?? [])

  const searchIsCompleted =
    !searchRequestIsLoading && !searchResultsQuery.hasNextPage

  const searchResponsePages = searchResultsQuery.data?.pages
  const hasResult = searchIsCompleted
    ? searchResponsePages?.some((searchData) =>
        searchData?.data?.searchResults?.some(
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
          <Skeleton h={6} className='absolute start-0 end-0 top-0' radius={0} />
        </div>
      ) : null}
      <Container className='py-10'>
        <div className='grid gap-4 sm:grid-cols-12 md:gap-6'>
          <div className='sm:col-span-4 lg:col-span-3'>
            <div className='rounded-md border border-gray-300 p-3'>
              Filter section
            </div>
          </div>
          <div className='grid gap-3 sm:col-span-8 lg:col-span-9'>
            <div className='flex justify-between gap-3'>
              <div></div>
              <div>
                <NativeSelect
                  data={[
                    {
                      label: 'Fiyat (Ucuzdan pahalıya)',
                      value: SortOrderEnums.priceAsc,
                    },
                    {
                      label: 'Fiyat (Pahalıdan ucuza)',
                      value: SortOrderEnums.priceDesc,
                    },
                    {
                      label: 'Tarihe Göre (En erken)',
                      value: SortOrderEnums.dateAsc,
                    },
                    {
                      label: 'Tarihe Göre (En geç)',
                      value: SortOrderEnums.dateDesc,
                    },
                  ]}
                  onChange={({ target: { value } }) => {
                    setFilterParams({
                      order: value as SortOrderEnums,
                    })
                  }}
                  value={order}
                />
              </div>
            </div>
            <div className='grid gap-5'>
              <Virtuoso
                useWindowScroll
                totalCount={filteredData?.length}
                data={filteredData}
                itemContent={(_, data) => {
                  return (
                    <div className='pb-6'>
                      <TourSearchResultItem data={data} />
                    </div>
                  )
                }}
              />
              {/* {searchData?.map((searchItem) => {
                return (
                  <TourSearchResultItem
                    key={searchItem?.key}
                    data={searchItem as TourSearchResultSearchItem}
                    onClick={handleTourItemSelect}
                  />
                )
              })} */}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export { TourSearchResultClient }
