'use client'

import React from 'react'
import {
  ActionIcon,
  Affix,
  Alert,
  Button,
  Checkbox,
  CloseButton,
  Collapse,
  Container,
  NativeSelect,
  rem,
  RemoveScroll,
  Skeleton,
  Spoiler,
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
import { useDisclosure, useMediaQuery, useWindowScroll } from '@mantine/hooks'
import { GoMoveToTop } from 'react-icons/go'
import { useMemo, useState } from 'react'
import { PriceRangeSlider } from './_components/price-range-slider'
import { cleanObj, formatCurrency, slugify } from '@/libs/util'
import { FaCheck } from 'react-icons/fa'
import { useDestinationGetBySlug } from '@/hooks/destination'
import { CruiseSearchEngine } from '@/modules/cruise'
import { TourSearchEngine } from '@/modules/tour'
import { IoSearchSharp } from 'react-icons/io5'
import dayjs from 'dayjs'
import { MdTour } from 'react-icons/md'
import { Loaderbanner } from '@/app/hotel/search-results/components/loader-banner'
import { getContent } from '@/libs/cms-data'
import { CmsContent, Widgets } from '@/types/cms-types'
import { useQuery } from '@tanstack/react-query'
import { Params } from '@/app/car/types'

const skeltonLoader = new Array(3).fill(true)

const TourSearchResultClient = () => {
  const { searchResultsQuery, searchParamsQuery, searchParams } =
    useTourSearchResultsQuery()
  const [scroll, scrollTo] = useWindowScroll()

  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParser)

  const { data: cmsData } = useQuery({
    queryKey: ['cms-data', 'tur-arama'],
    queryFn: () =>
      getContent<CmsContent<Widgets, Params>>('tur-arama').then(
        (response) => response?.data
      ),
  })
  const loaderBannerTour =
    cmsData?.widgets?.filter((x) => x.point === 'loader_banner_tour_react') ??
    []

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

  const departurePointChecks = [
    ...new Map(
      searchData
        ?.flatMap(
          (tourData) =>
            tourData.departurePoints?.map((departurePoint) => ({
              title: departurePoint.title,
              code: departurePoint.code,
            })) || []
        )
        .map((item) => [item.code, item])
    ).values(),
  ]
    .sort((a, b) => a.code.localeCompare(b.code))
    .filter((item) => item.code)

  const transportTypeChecks = [
    ...new Set(
      searchData?.map((tourData) => tourData.transportType).filter(Boolean)
    ),
  ]
    .sort()
    .filter(Boolean)

  const filteredData = useFilterActions(searchGroupedData)
  const [filterSectionIsOpened, setFilterSectionIsOpened] = useState(false)
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')
  const [isSearchEngineOpened, { toggle: toggleSearchEngineVisibility }] =
    useDisclosure(false)
  const filterOptions = [
    {
      label: 'Fiyata Göre Artan ',
      value: SortOrderEnums.priceAsc,
    },
    {
      label: 'Fiyata Göre Azalan',
      value: SortOrderEnums.priceDesc,
    },
    {
      label: 'En Erken',
      value: SortOrderEnums.dateAsc,
    },
    {
      label: 'En Geç',
      value: SortOrderEnums.dateDesc,
    },
  ]
  const totalCount = searchData?.length ?? 0

  const destinationInfoQuery = useDestinationGetBySlug({
    slugs: [searchParams.destinationSlug as string],
    moduleName: 'Tour',
  })
  if (
    !searchParamsQuery.data &&
    (searchParamsQuery.isLoading ||
      searchParamsQuery.isFetching ||
      searchParamsQuery.isRefetching)
  ) {
    return (
      <Container className='px-0 py-0 sm:px-3 md:py-10'>
        <div className='grid items-start gap-4 md:grid-cols-12 md:gap-6'>
          <div className='sm:col-span-4 lg:col-span-3'>
            <div className='grid gap-2'>
              <Skeleton h={20} w={150} mb={rem(9)} />
              <Skeleton h={12} w={220} />
              <Skeleton h={12} w={170} />
              <Skeleton h={12} w={190} />
              <Skeleton h={12} w={160} />
              <Skeleton h={12} w={200} />
              <Skeleton h={12} w={180} />
              <Skeleton h={12} w={140} />
            </div>
          </div>
          <div className='grid gap-2 sm:col-span-8 lg:col-span-9'>
            <div className='flex justify-between gap-3 md:px-0'>
              <Skeleton h={24} w={200} className='hidden md:flex' />
              <Skeleton h={32} w={100} />
            </div>
            <div className='grid gap-5'>
              {skeltonLoader.map((_, index) => (
                <div
                  key={index}
                  className='grid grid-cols-5 items-start gap-3 rounded-md border p-3'
                >
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
              ))}
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
      <div className='border-b py-0 md:p-5'>
        <Container>
          <div className='relative flex items-center gap-2 py-2 text-xs font-semibold text-blue-800 md:hidden'>
            <button
              className='absolute start-0 end-0 top-0 bottom-0 z-10'
              onClick={toggleSearchEngineVisibility}
            />
            <div>
              {destinationInfoQuery.data.find(
                (destination) =>
                  destination?.Result.Slug === searchParams.destinationSlug
              )?.Result.Name ?? searchParams.destinationSlug}
            </div>
            <div>
              {dayjs(searchParams.checkinDate).format('DD MMM YYYY')} -{' '}
              {dayjs(searchParams.checkoutDate).format('DD MMM YYYY')}
            </div>
            <div className='z-0 ms-auto rounded-md bg-blue-100 p-2'>
              <IoSearchSharp size={24} className='text-blue-800' />
            </div>
          </div>
          <Collapse in={isBreakPointMatchesMd || isSearchEngineOpened}>
            <div className='py-3 md:py-0'>
              {searchParams.isCruise ? (
                <CruiseSearchEngine />
              ) : (
                <TourSearchEngine />
              )}
            </div>
          </Collapse>
        </Container>
      </div>
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
                          <Title className='text-xl font-medium'>
                            Filtreler
                          </Title>
                          <div
                            hidden={
                              Object.keys(cleanObj(filterParams)).length === 0
                            }
                          >
                            <UnstyledButton
                              fz='xs'
                              className='px-4 font-semibold text-blue-500'
                              onClick={() => {
                                setFilterParams(null)
                              }}
                            >
                              Temizle
                            </UnstyledButton>
                          </div>
                        </div>
                        <Stack
                          classNames={{
                            root: 'filter-accordion',
                          }}
                        >
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
                            <div className='mb-2 font-medium'>
                              Tur Süresi{' '}
                              <small className='text-gray-600'>(Gece)</small>
                            </div>
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
                                    label={<div>{count} Gece</div>}
                                    value={count.toString()}
                                    key={count}
                                  />
                                ))}
                              </Stack>
                            </Checkbox.Group>
                          </div>
                          <div>
                            <div className='mb-2 font-medium'>Bölgeler</div>
                            <Spoiler
                              className='mb-5 grid gap-3 pb-3'
                              maxHeight={245}
                              showLabel='Daha fazla göster'
                              hideLabel='Daha az göster'
                            >
                              <Checkbox.Group
                                onChange={(value) => {
                                  setFilterParams({
                                    regions: value.length ? value : null,
                                  })
                                }}
                                value={
                                  filterParams.regions
                                    ? filterParams.regions
                                    : []
                                }
                              >
                                <Stack gap={rem(6)}>
                                  {regionChecks
                                    .sort((a, b) => a.localeCompare(b))
                                    .map((region, regionIndex) => (
                                      <Checkbox
                                        key={regionIndex}
                                        label={region}
                                        value={slugify(region)}
                                      />
                                    ))}
                                </Stack>
                              </Checkbox.Group>
                            </Spoiler>
                          </div>
                          {departurePointChecks.length > 0 && (
                            <div>
                              <div className='mb-2 font-medium'>
                                Çıkış Noktası{' '}
                              </div>
                              <Spoiler
                                className='mb-3 grid gap-3 pb-3'
                                maxHeight={150}
                                showLabel='Daha fazla göster'
                                hideLabel='Daha az göster'
                              >
                                <Checkbox.Group
                                  onChange={(value) => {
                                    setFilterParams({
                                      departurePoints: value.length
                                        ? value
                                        : null,
                                    })
                                  }}
                                  value={
                                    filterParams.departurePoints
                                      ? filterParams.departurePoints
                                      : []
                                  }
                                >
                                  <Stack gap={rem(6)}>
                                    {departurePointChecks.map(
                                      (departurePoint, departurePointIndex) => (
                                        <Checkbox
                                          key={departurePointIndex}
                                          label={departurePoint.title}
                                          value={departurePoint.code ?? ''}
                                        />
                                      )
                                    )}
                                  </Stack>
                                </Checkbox.Group>
                              </Spoiler>
                            </div>
                          )}
                          {transportTypeChecks.length > 0 && (
                            <div>
                              <div className='mb-2 font-medium'>
                                Ulaşım Tipi{' '}
                              </div>
                              <Spoiler
                                className='mb-5 grid gap-3 pb-3'
                                maxHeight={100}
                                showLabel='Daha fazla göster'
                                hideLabel='Daha az göster'
                              >
                                <Checkbox.Group
                                  onChange={(value) => {
                                    setFilterParams({
                                      transportType: value.length
                                        ? value
                                        : null,
                                    })
                                  }}
                                  value={
                                    filterParams.transportType
                                      ? filterParams.transportType
                                      : []
                                  }
                                >
                                  <Stack gap={rem(6)}>
                                    {transportTypeChecks
                                      .sort((a, b) => a - b)
                                      .map((transportType, transportIndex) => (
                                        <Checkbox
                                          key={transportIndex}
                                          label={
                                            transportType === 1
                                              ? 'Uçak'
                                              : transportType === 2
                                                ? 'Otobüs'
                                                : transportType === 3
                                                  ? 'Tren'
                                                  : ''
                                          }
                                          value={transportType.toString()}
                                        />
                                      ))}
                                  </Stack>
                                </Checkbox.Group>
                              </Spoiler>
                            </div>
                          )}
                        </Stack>
                      </div>
                    )}
                  </div>
                </RemoveScroll>
              )}
            </Transition>
          </div>
          <div className='grid gap-2 sm:col-span-8 lg:col-span-9'>
            <div className='flex justify-between gap-3 md:px-0'>
              <Skeleton
                className='hidden md:flex'
                visible={searchRequestIsLoading || !filteredData}
              >
                <div className='hidden items-center gap-2 md:flex'>
                  <div>
                    <span className='text-lg'>Toplam</span>{' '}
                    <span className='text-xl font-bold'>{totalCount}</span> Tur
                    Bulundu
                  </div>
                </div>
              </Skeleton>

              {totalCount > 0 && (
                <div>
                  <Button
                    size='sm'
                    color='black'
                    className='mx-1 flex border-gray-400 px-8 font-medium md:hidden'
                    variant='outline'
                    onClick={() => setFilterSectionIsOpened((prev) => !prev)}
                  >
                    Filtreler
                  </Button>
                </div>
              )}
              {totalCount > 0 && (
                <div>
                  <NativeSelect
                    leftSection={<FaCheck />}
                    className='font-medium md:hidden'
                    data={[
                      {
                        label: 'Fiyata Göre Artan ',
                        value: SortOrderEnums.priceAsc,
                      },
                      {
                        label: 'Fiyata Göre Azalan',
                        value: SortOrderEnums.priceDesc,
                      },
                      {
                        label: 'En Erken',
                        value: SortOrderEnums.dateAsc,
                      },
                      {
                        label: 'En Geç',
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
              )}
              {totalCount > 0 && (
                <Skeleton
                  className='hidden items-center justify-end gap-1 md:flex'
                  visible={
                    searchRequestIsLoading ||
                    (!searchParamsQuery.isLoading && searchData?.length === 0)
                  }
                >
                  {filterOptions.map((option) => (
                    <Button
                      size='sm'
                      className={
                        order === option.value
                          ? 'rounded-md border-0 bg-blue-100 font-medium text-blue-700'
                          : 'rounded-md border-gray-400 font-normal text-black hover:bg-blue-50 hover:text-blue-700'
                      }
                      key={option.value}
                      leftSection={order === option.value ? <FaCheck /> : ''}
                      color='blue'
                      variant={order === option.value ? 'filled' : 'outline'}
                      onClick={() =>
                        setFilterParams({
                          order: option.value,
                        })
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </Skeleton>
              )}
            </div>
            {totalCount > 0 && (
              <Skeleton
                className='flex items-center gap-2 px-1 md:hidden'
                visible={
                  searchResultsQuery.isFetching ||
                  searchResultsQuery.isLoading ||
                  !searchResultsQuery.data
                }
              >
                <span className='text-sm'>
                  Toplam{' '}
                  <span className='text-xl font-semibold'>{totalCount}</span>{' '}
                  Tur Bulundu
                </span>
              </Skeleton>
            )}
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

              {searchResultsQuery.isFetching &&
                skeltonLoader.map((arr, arrIndex) => {
                  const skeleton = (
                    <div
                      key={arrIndex}
                      className='grid grid-cols-5 items-start gap-3 rounded-md border p-3'
                    >
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
                  )

                  if (arrIndex === 0) {
                    return (
                      <React.Fragment key={arrIndex}>
                        {skeleton}
                        <Loaderbanner
                          data={loaderBannerTour}
                          moduleName='Turunuz'
                          ıcon={MdTour}
                        />
                      </React.Fragment>
                    )
                  }

                  return skeleton
                })}

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
