'use client'

import {
  ActionIcon,
  Affix,
  Alert,
  Container,
  NativeSelect,
  Skeleton,
  Transition,
} from '@mantine/core'

import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso'

import { useTourSearchResultsQuery } from '@/app/tour/search-results/useSearchResults'

import { TourSearchResultItem } from './item'
import { filterParser, SortOrderEnums } from '@/modules/tour/searchResultParams'
import { useQueryStates } from 'nuqs'
import { useFilterActions } from './useFilteractions'
import { TourSearchResultSearchItem } from '@/modules/tour/type'
import { useWindowScroll } from '@mantine/hooks'
import { GoMoveToTop } from 'react-icons/go'
import { useMemo, useRef } from 'react'

const TourSearchResultClient = () => {
  const { searchResultsQuery } = useTourSearchResultsQuery()
  const [scroll, scrollTo] = useWindowScroll()
  const virtuoso = useRef<VirtuosoHandle>(null)

  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParser)

  const searchRequestIsLoading =
    searchResultsQuery.isLoading || searchResultsQuery.hasNextPage

  if (
    searchResultsQuery.hasNextPage &&
    !searchResultsQuery.isFetchingNextPage
  ) {
    searchResultsQuery.fetchNextPage()
  }

  const searchData = useMemo(
    () =>
      searchResultsQuery.data?.pages?.flatMap((page) =>
        page?.data?.searchResults
          ?.filter((item) => item.items && item.items?.length > 0)
          .flatMap((item) => item.items)
      ) as TourSearchResultSearchItem[],
    [searchResultsQuery.data?.pages]
  )

  const filteredData = useFilterActions(searchData ?? [])

  console.log(filteredData)

  return (
    <>
      <div>
        {searchRequestIsLoading ? (
          <div className='relative'>
            <Skeleton
              h={6}
              className='absolute start-0 end-0 top-0'
              radius={0}
            />
          </div>
        ) : null}
        <Container className='py-10'>
          <div className='grid gap-4 sm:grid-cols-12 md:gap-6'>
            <div className='sm:col-span-4 lg:col-span-3'>
              <div>Filtreler</div>
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
                {filteredData && filteredData.length > 0 && (
                  <Virtuoso
                    ref={virtuoso}
                    useWindowScroll
                    totalCount={filteredData.length}
                    data={filteredData}
                    itemContent={(_, data) => {
                      if (!data) return <span> </span>
                      return (
                        <div className='pb-6'>
                          <TourSearchResultItem data={data} />
                        </div>
                      )
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition='slide-up' mounted={scroll.y > 500}>
          {(transitionStyles) => (
            <ActionIcon
              style={transitionStyles}
              onClick={() => {
                virtuoso.current?.scrollToIndex({
                  index: 0,
                })
                scrollTo({ y: 0 })
              }}
              radius={'xl'}
              variant='default'
              size={36}
            >
              <GoMoveToTop />
            </ActionIcon>
          )}
        </Transition>
      </Affix>
    </>
  )
}

export { TourSearchResultClient }
