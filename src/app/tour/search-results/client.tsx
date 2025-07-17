'use client'

import {
  ActionIcon,
  Affix,
  Alert,
  Button,
  Checkbox,
  CloseButton,
  Container,
  NativeSelect,
  rem,
  RemoveScroll,
  Skeleton,
  Stack,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'

import { useTourSearchResultsQuery } from '@/app/tour/search-results/useSearchResults'

import { TourSearchResultItem } from './item'
import { filterParser, SortOrderEnums } from '@/modules/tour/searchResultParams'
import { useQueryStates } from 'nuqs'
import { useFilterActions } from './useFilteractions'
import {
  TourSearchResultGroupedItem,
  TourSearchResultSearchItem,
} from '@/modules/tour/type'
import { useMediaQuery, useWindowScroll } from '@mantine/hooks'
import { GoMoveToTop } from 'react-icons/go'
import { useMemo, useRef, useState } from 'react'
import { PriceRangeSlider } from './_components/price-range-slider'
import { cleanObj, formatCurrency, slugify } from '@/libs/util'
import { CiFilter } from 'react-icons/ci'

const TourSearchResultClient = () => {
  const { searchResultsQuery, searchParamsQuery } = useTourSearchResultsQuery()
  const [scroll, scrollTo] = useWindowScroll()

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
      searchResultsQuery.data?.pages
        ?.flatMap((page) =>
          page?.data?.searchResults
            ?.filter((item) => item.items && item.items?.length > 0)
            .flatMap((item) => item.items)
        )
        .filter(Boolean) as TourSearchResultSearchItem[],
    [searchResultsQuery.data?.pages]
  )
  const groupTitles: string[] = []
  const searchGroupedData: (TourSearchResultGroupedItem | undefined)[] =
    searchData
      // .sort((a, b) => {
      //   return a.totalPrice.value - b.totalPrice.value
      // })
      ?.map((item, itemIndex, itemArr) => {
        if (!item) return
        if (groupTitles.includes(item.region.title.trim())) {
          return
        }

        groupTitles.push(item.region.title.trim())

        return {
          ...item,
          relatedItems: itemArr.filter(
            (relatedItem) =>
              relatedItem?.region.title.trim() === item.region.title.trim()
          ),
        }
      })
      .filter(Boolean)

  const minPrice =
    searchData && searchData.length
      ? Math.min(...searchData?.map((item) => item?.tlPrice.value))
      : 0

  const maxPrice =
    searchData && searchData.length
      ? Math.max(...searchData?.map((item) => item?.tlPrice.value))
      : 0

  const nightCountChecks = [
    ...new Set(
      searchData?.map((tourData) => {
        return tourData.tourTime
      })
    ),
  ].sort((a, b) => a - b)

  const regionChecks = [
    ...new Set(searchData?.map((tourData) => tourData.region.title)),
  ]
    .sort()
    .filter(Boolean)

  const filteredData = useFilterActions(searchGroupedData)
  const [filterSectionIsOpened, setFilterSectionIsOpened] = useState(false)
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')

  if (
    !searchParamsQuery.data &&
    (searchParamsQuery.isLoading ||
      searchParamsQuery.isFetching ||
      searchParamsQuery.isRefetching)
  ) {
    return (
      <Container className='py-10'>
        <div className='grid items-start gap-4 sm:grid-cols-12 md:gap-6'>
          <div className='grid gap-3 sm:col-span-4 lg:col-span-3'>
            <Skeleton h={22} />
            <Skeleton h={16} />
          </div>
          <div className='sm:col-span-8 lg:col-span-9'>
            <div className='grid gap-3'>
              <Skeleton h={24} radius={'md'} />
              <Skeleton h={12} w={'85%'} radius={'md'} />
              <Skeleton h={12} w={'75%'} radius={'md'} />
              <Skeleton h={12} w={'50%'} radius={'md'} />
            </div>
          </div>
        </div>
      </Container>
    )
  }

  if (
    !searchParamsQuery.isLoading &&
    searchData?.length === 0 &&
    searchResultsQuery.data?.pages.find((page) => page.code !== 1)
  ) {
    return (
      <Container pt={rem(20)}>
        <Alert title='Bir hata olustu' color='red' radius={'md'}>
          Arama kriterlerini değiştirip tekrar deneyiniz veya{' '}
          <UnstyledButton
            className='text-sm text-blue-500 underline'
            type='button'
            onClick={() => {
              searchParamsQuery.refetch()
            }}
          >
            Yeniden Sorgula.
          </UnstyledButton>
        </Alert>
      </Container>
    )
  }

  return (
    <>
      {searchRequestIsLoading ? (
        <div className='relative'>
          <Skeleton h={6} className='absolute start-0 end-0 top-0' radius={0} />
        </div>
      ) : null}
      <Container className='px-0 py-0 sm:px-3 md:py-10'>
        <div className='grid items-start gap-4 md:grid-cols-12 md:gap-6'>
          <div className='sm:col-span-4 lg:col-span-3'>
            <Transition
              transition={'slide-right'}
              mounted={filterSectionIsOpened || !!isBreakPointMatchesMd}
            >
              {(styles) => (
                <RemoveScroll
                  enabled={filterSectionIsOpened && !isBreakPointMatchesMd}
                >
                  <div
                    className='fixed start-0 end-0 top-0 bottom-0 z-10 bg-white p-3 md:static md:p-0'
                    style={styles}
                  >
                    <div className='flex justify-end md:hidden'>
                      <CloseButton
                        size={'lg'}
                        onClick={() => setFilterSectionIsOpened(false)}
                      />
                    </div>
                    {searchRequestIsLoading || !searchResultsQuery.data ? (
                      <div className='grid gap-2'>
                        <Skeleton h={20} w={150} mb={rem(9)} />
                        <Skeleton h={12} w={220} />
                        <Skeleton h={12} w={170} />
                        <Skeleton h={12} w={190} />
                      </div>
                    ) : (
                      <div>
                        <div className='flex justify-between pb-6'>
                          <Title order={2} fz={'h4'}>
                            Filtreler
                          </Title>
                          <div
                            hidden={
                              Object.keys(cleanObj(filterParams)).length === 0
                            }
                          >
                            <UnstyledButton
                              fz='xs'
                              className='font-semibold text-blue-500'
                              onClick={() => {
                                setFilterParams(null)
                              }}
                            >
                              Temizle
                            </UnstyledButton>
                          </div>
                        </div>
                        <Stack>
                          <div className='py-5'>
                            <div className='flex justify-between gap-2 pb-4 text-sm text-gray-700'>
                              <div>
                                {formatCurrency(
                                  filterParams.priceRange
                                    ? filterParams.priceRange[0]
                                    : minPrice
                                )}
                              </div>
                              <div>
                                {formatCurrency(
                                  filterParams.priceRange
                                    ? filterParams.priceRange[1]
                                    : maxPrice
                                )}
                              </div>
                            </div>
                            <div className='px-3'>
                              <PriceRangeSlider
                                minPrice={Math.floor(minPrice)}
                                maxPrice={Math.ceil(maxPrice)}
                              />
                            </div>
                          </div>
                          <div>
                            <Title order={3} fz={'h5'} mb={8}>
                              Tur Süresi{' '}
                              <small className='text-gray-600'>(Gece)</small>
                            </Title>
                            <Checkbox.Group
                              onChange={(value) => {
                                setFilterParams({
                                  nightCount: value.length
                                    ? value.map(Number)
                                    : null,
                                })
                              }}
                              value={
                                filterParams.nightCount
                                  ? filterParams.nightCount.map(String)
                                  : []
                              }
                            >
                              <Stack gap={rem(6)}>
                                {nightCountChecks.map((count) => (
                                  <Checkbox
                                    label={count}
                                    value={count.toString()}
                                    key={count}
                                  />
                                ))}
                              </Stack>
                            </Checkbox.Group>
                          </div>
                          <div>
                            <Title order={3} fz={'h5'} mb={8}>
                              Bölgeler
                            </Title>
                            <Checkbox.Group
                              onChange={(value) => {
                                setFilterParams({
                                  regions: value.length ? value : null,
                                })
                              }}
                              value={
                                filterParams.regions ? filterParams.regions : []
                              }
                            >
                              <Stack gap={rem(6)}>
                                {regionChecks.map((region, regionIndex) => (
                                  <Checkbox
                                    key={regionIndex}
                                    label={region}
                                    value={slugify(region)}
                                  />
                                ))}
                              </Stack>
                            </Checkbox.Group>
                          </div>
                        </Stack>
                      </div>
                    )}
                  </div>
                </RemoveScroll>
              )}
            </Transition>
          </div>
          <div className='grid gap-3 sm:col-span-8 lg:col-span-9'>
            <div className='flex justify-between gap-3 px-3 md:px-0'>
              <div>
                <Button
                  size='sm'
                  leftSection={<CiFilter size={23} />}
                  color='green'
                  onClick={() => setFilterSectionIsOpened((prev) => !prev)}
                  hiddenFrom='md'
                >
                  Filtreler
                </Button>
              </div>
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
              {!searchRequestIsLoading &&
                searchResultsQuery.data &&
                filteredData?.length === 0 && (
                  <Alert>
                    <div>Sonuç bulunamadı</div>{' '}
                    {filterParams && (
                      <div className='pt-4'>
                        <Button
                          type='button'
                          onClick={() => {
                            setFilterParams(null)
                          }}
                        >
                          Diğer Sonuçlar
                        </Button>
                      </div>
                    )}
                  </Alert>
                )}

              {filteredData?.length === 0 &&
                (searchResultsQuery.isFetching ||
                  searchResultsQuery.isLoading ||
                  !searchResultsQuery.data) && (
                  <>
                    <div className='grid grid-cols-5 items-start gap-3 rounded-md border p-3'>
                      <div className='col-span-1'>
                        <Skeleton h={120} />
                      </div>
                      <div className='col-span-4 grid gap-3'>
                        <Skeleton h={24} />
                        <Skeleton h={20} w={'80%'} />
                        <Skeleton h={18} w={'50%'} />

                        <Skeleton h={18} w={'20%'} />
                      </div>
                    </div>
                    <div className='grid grid-cols-5 items-start gap-3 rounded-md border p-3'>
                      <div className='col-span-1'>
                        <Skeleton h={120} />
                      </div>
                      <div className='col-span-4 grid gap-3'>
                        <Skeleton h={24} />
                        <Skeleton h={20} w={'80%'} />
                        <Skeleton h={18} w={'50%'} />

                        <Skeleton h={18} w={'20%'} />
                      </div>
                    </div>
                    <div className='grid grid-cols-5 items-start gap-3 rounded-md border p-3'>
                      <div className='col-span-1'>
                        <Skeleton h={120} />
                      </div>
                      <div className='col-span-4 grid gap-3'>
                        <Skeleton h={24} />
                        <Skeleton h={20} w={'80%'} />
                        <Skeleton h={18} w={'50%'} />

                        <Skeleton h={18} w={'20%'} />
                      </div>
                    </div>
                  </>
                )}

              {filteredData &&
                filteredData.length > 0 &&
                filteredData.map((data) => {
                  if (!data) return
                  return <TourSearchResultItem data={data} key={data?.key} />
                })}

              {/* {filteredData && filteredData.length > 0 && (
                <Virtuoso
                  ref={virtuoso}
                  useWindowScroll
                  totalCount={filteredData.length}
                  data={searchGroupedData}
                  itemContent={(_, data) => {
                    if (!data) return <span> </span>
                    return (
                      <div className='pb-6'>
                        <TourSearchResultItem data={data} />
                      </div>
                    )
                  }}
                />
              )} */}
            </div>
          </div>
        </div>
      </Container>

      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition='slide-up' mounted={scroll.y > 500}>
          {(transitionStyles) => (
            <ActionIcon
              style={transitionStyles}
              onClick={() => {
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
