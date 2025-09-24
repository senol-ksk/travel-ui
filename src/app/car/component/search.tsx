'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  CloseButton,
  Collapse,
  Container,
  rem,
  RemoveScroll,
  ScrollAreaAutosize,
  Skeleton,
  Spoiler,
  Stack,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { createSerializer, useQueryStates } from 'nuqs'
import { upperFirst, useDisclosure, useMediaQuery } from '@mantine/hooks'

import { useCarSearchResults } from '@/app/car/search-results/useSearchResult'
import { CarSearchResultItem } from '@/app/car/component/result-item'
import {
  CarSearchRequest,
  CarSearchResultItemType,
  Params,
} from '@/app/car/types'
import { carDetailParams } from '@/app/car/searchParams'
import {
  filterParsers,
  FuelTypes,
  SortOrderEnums,
} from '@/modules/carrent/types'

import { useFilterActions } from '@/app/car/search-results/filter-actions'
import { cleanObj } from '@/libs/util'
import { useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { SortBySelect } from './sort-by-select'
import { type Route } from 'next'
import { CarRentSearchPanel } from '@/modules/carrent'
import { IoSearchSharp } from 'react-icons/io5'
import dayjs from 'dayjs'
import { Loaderbanner } from '@/app/hotel/search-results/components/loader-banner'
import { getContent } from '@/libs/cms-data'
import { CmsContent, Widgets } from '@/types/cms-types'
import { useQuery } from '@tanstack/react-query'
import { MdLocalCarWash } from 'react-icons/md'

export const createDetailParams = createSerializer(carDetailParams)

const skeltonLoader = new Array(3).fill(true)

type Props = {
  searchRequestParams: CarSearchRequest
}

export const Search: React.FC<Props> = ({ searchRequestParams }) => {
  const router = useRouter()
  const carSearchResult = useCarSearchResults(searchRequestParams)
  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParsers)

  const [filterSectionIsOpened, setFilterSectionIsOpened] = useState(false)
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')

  const handleCarSelect = (car: CarSearchResultItemType) => {
    const detailParams = createDetailParams('/car/detail', {
      selectedProductKey: car.key,
      searchToken: searchRequestParams.params.searchToken,
      sessionToken: searchRequestParams.params.sessionToken,
    }) as Route
    router.push(detailParams)
  }

  const allPages = carSearchResult?.data?.pages.flatMap((page) =>
    page.data.searchResults.flatMap((searchResult) => {
      const items = searchResult.items

      items?.forEach((element) => {
        element.pickupStation = searchResult.pickupStation
        element.returnStation = searchResult.returnStation
      })

      return searchResult.items
    })
  ) as CarSearchResultItemType[] | null

  const fuelTypeChecks = [
    ...new Set(allPages?.map((carData) => carData.carDetail.fuelType)),
  ]
  const providerChecks = [
    ...new Set(allPages?.map((carData) => carData.carDetail.vendorName)),
  ]
  const seatCountChecks = [
    ...new Set(allPages?.map((carData) => carData.carDetail.seatCount)),
  ]
  const categoryChecks = [
    ...new Set(allPages?.map((carData) => carData.carDetail.category)),
  ]
  const brandChecks = [
    ...new Set(allPages?.map((carData) => carData.carDetail.name)),
  ]

  const filteredPageItems = useFilterActions(allPages ?? [])
  const totalCount = allPages?.length ?? 0
  const destinationName =
    searchRequestParams.params.carRentalSearchPanel.destination[0].name
  const filterOptions = [
    {
      label: 'Fiyata Göre Artan ',
      value: SortOrderEnums.priceAsc,
    },
    {
      label: 'Fiyata Göre Azalan',
      value: SortOrderEnums.priceDesc,
    },
  ]
  if (carSearchResult.hasNextPage && !carSearchResult.isFetchingNextPage) {
    carSearchResult.fetchNextPage()
  }

  const [isSearchEngineOpened, { toggle: toggleSearchEngineVisibility }] =
    useDisclosure(false)

  const { data: cmsData } = useQuery({
    queryKey: ['cms-data', 'arac-arama'],
    queryFn: () =>
      getContent<CmsContent<Widgets, Params>>('arac-arama').then(
        (response) => response?.data
      ),
  })
  const loaderBannerCar =
    cmsData?.widgets?.filter((x) => x.point === 'loader_banner_car_react') ?? []

  return (
    <>
      <div className='border-t bg-white shadow'>
        <Container>
          <div className='relative flex items-center gap-2 py-2 text-xs font-semibold text-blue-800 md:hidden'>
            <button
              className='absolute start-0 end-0 top-0 bottom-0 z-10'
              onClick={toggleSearchEngineVisibility}
            />
            <div>
              <div>
                {
                  searchRequestParams.params.carRentalSearchPanel.origin.at(0)
                    ?.name
                }
              </div>
              <div>
                {dayjs(
                  searchRequestParams.params.carRentalSearchPanel.pickupDate
                ).format('DD MMM')}{' '}
                - {searchRequestParams.params.carRentalSearchPanel.pickupHour}
                :00
              </div>
            </div>

            <div className='z-0 ms-auto rounded-md bg-blue-100 p-2'>
              <IoSearchSharp size={24} className='text-blue-800' />
            </div>
          </div>
          <Collapse in={isBreakPointMatchesMd || isSearchEngineOpened}>
            <div className='py-3'>
              <CarRentSearchPanel />
            </div>
          </Collapse>
        </Container>
      </div>
      <div className='relative'>
        <div className='absolute start-0 end-0 top-0 h-[20] overflow-hidden'>
          {carSearchResult.isFetching ||
          carSearchResult.isFetchingNextPage ||
          carSearchResult.isLoading ? (
            <Skeleton className='w-full' h={6} />
          ) : null}
        </div>

        <Container className='md:px-md px-0'>
          <div className='md:py-10'>
            <div className='grid items-start gap-4 md:grid-cols-4 md:gap-5'>
              <div className='md:col-span-1'>
                <Transition
                  transition={'slide-right'}
                  mounted={filterSectionIsOpened || !!isBreakPointMatchesMd}
                >
                  {(styles) => (
                    <RemoveScroll
                      enabled={filterSectionIsOpened && !isBreakPointMatchesMd}
                    >
                      <div
                        className='fixed start-0 end-0 top-0 bottom-0 z-10 overflow-y-auto bg-white md:static'
                        style={styles}
                      >
                        <div className='flex justify-end md:hidden'>
                          <CloseButton
                            size={'lg'}
                            onClick={() => setFilterSectionIsOpened(false)}
                          />
                        </div>
                        <div>
                          {carSearchResult.isFetching ||
                          carSearchResult.isFetchingNextPage ||
                          carSearchResult.isLoading ? (
                            <div className='grid gap-3'>
                              <Skeleton h={24} />
                              <Skeleton h={12} width={'60%'} />
                              <Skeleton h={12} width={'88%'} />
                              <Skeleton h={12} width={'75%'} />
                            </div>
                          ) : (
                            <>
                              <div className='flex justify-between gap-2'>
                                <Title
                                  className='text-xl font-medium'
                                  mb={rem(20)}
                                >
                                  Filtreler
                                </Title>

                                <div
                                  hidden={
                                    Object.keys(cleanObj(filterParams))
                                      .length === 0
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
                              <Accordion
                                defaultValue={['fuelType', 'provider', 'brand']}
                                multiple
                                classNames={{
                                  root: 'filter-accordion',
                                  control: 'text-md font-medium',
                                }}
                              >
                                <Accordion.Item value='provider'>
                                  <Accordion.Control>
                                    Kiralama Şirketi
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(value) => {
                                        setFilterParams({
                                          provider: value.length ? value : null,
                                        })
                                      }}
                                      value={
                                        filterParams.provider
                                          ? filterParams.provider
                                          : []
                                      }
                                    >
                                      <Spoiler
                                        maxHeight={130}
                                        showLabel='Daha fazla göster'
                                        hideLabel='Daha az göster'
                                      >
                                        <Stack gap={rem(6)}>
                                          {providerChecks
                                            .sort((a, b) => a.localeCompare(b))
                                            .map((provider, providerIndex) => {
                                              return (
                                                <Checkbox
                                                  key={providerIndex}
                                                  label={provider}
                                                  value={provider}
                                                />
                                              )
                                            })}
                                        </Stack>
                                      </Spoiler>
                                    </Checkbox.Group>
                                  </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value='brand'>
                                  <Accordion.Control>Marka</Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(value) => {
                                        setFilterParams({
                                          brand: value.length ? value : null,
                                        })
                                      }}
                                      value={
                                        filterParams.brand
                                          ? filterParams.brand
                                          : []
                                      }
                                    >
                                      <ScrollAreaAutosize mah={200}>
                                        <Stack gap={rem(6)}>
                                          {brandChecks
                                            .sort((a, b) => a.localeCompare(b))
                                            .map((data, dataIndex) => (
                                              <Checkbox
                                                key={dataIndex}
                                                label={data
                                                  .split(' ')
                                                  .map(
                                                    (item) =>
                                                      upperFirst(
                                                        item.toLocaleLowerCase()
                                                      ) + ' '
                                                  )}
                                                value={data}
                                              />
                                            ))}
                                        </Stack>
                                      </ScrollAreaAutosize>
                                    </Checkbox.Group>
                                  </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value='fuelType'>
                                  <Accordion.Control>
                                    Yakıt Tipi
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(value) => {
                                        setFilterParams({
                                          fuelTypes: value.length
                                            ? value.map(Number)
                                            : null,
                                        })
                                      }}
                                      value={
                                        filterParams.fuelTypes?.length
                                          ? filterParams.fuelTypes?.map(String)
                                          : []
                                      }
                                    >
                                      <Stack gap={rem(6)}>
                                        {fuelTypeChecks
                                          ?.sort((a, b) =>
                                            FuelTypes[a].localeCompare(
                                              FuelTypes[b]
                                            )
                                          )
                                          .map((fuelType) => {
                                            return (
                                              <Checkbox
                                                key={fuelType}
                                                label={FuelTypes[fuelType]}
                                                value={'' + fuelType}
                                              />
                                            )
                                          })}
                                      </Stack>
                                    </Checkbox.Group>
                                  </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value='category'>
                                  <Accordion.Control>
                                    Kategori
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(value) => {
                                        setFilterParams({
                                          category: value.length ? value : null,
                                        })
                                      }}
                                      value={
                                        filterParams.category
                                          ? filterParams.category
                                          : []
                                      }
                                    >
                                      <Spoiler
                                        maxHeight={130}
                                        showLabel='Daha fazla göster'
                                        hideLabel='Daha az göster'
                                      >
                                        <Stack gap={rem(6)}>
                                          {categoryChecks
                                            .sort((a, b) => a.localeCompare(b))
                                            .map((data, dataIndex) => (
                                              <Checkbox
                                                key={dataIndex}
                                                label={data}
                                                value={data}
                                              />
                                            ))}
                                        </Stack>
                                      </Spoiler>
                                    </Checkbox.Group>
                                  </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value='transmission'>
                                  <Accordion.Control>
                                    Şanzıman
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(value) => {
                                        setFilterParams({
                                          transmission: value.length
                                            ? value.map(Number)
                                            : null,
                                        })
                                      }}
                                      value={
                                        filterParams.transmission
                                          ? filterParams.transmission.map(
                                              String
                                            )
                                          : []
                                      }
                                    >
                                      <Stack gap={rem(6)}>
                                        <Checkbox
                                          label='Manuel Vites'
                                          value={'0'}
                                        />
                                        <Checkbox
                                          label='Otomatik Vites'
                                          value={'1'}
                                        />
                                      </Stack>
                                    </Checkbox.Group>
                                  </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value='seatCount'>
                                  <Accordion.Control>
                                    Koltuk Sayısı
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(value) => {
                                        setFilterParams({
                                          seatCount: value.length
                                            ? value
                                            : null,
                                        })
                                      }}
                                      value={
                                        filterParams.seatCount
                                          ? filterParams.seatCount
                                          : []
                                      }
                                    >
                                      <Stack gap={rem(6)}>
                                        {seatCountChecks.map(
                                          (seat, seatIndex) => (
                                            <Checkbox
                                              key={seatIndex}
                                              label={seat}
                                              value={seat}
                                            />
                                          )
                                        )}
                                      </Stack>
                                    </Checkbox.Group>
                                  </Accordion.Panel>
                                </Accordion.Item>
                              </Accordion>
                            </>
                          )}
                        </div>
                      </div>
                    </RemoveScroll>
                  )}
                </Transition>
              </div>
              <div className='grid gap-3 md:col-span-3'>
                <div className='grid grid-cols-3 items-center gap-2 md:grid-cols-5'>
                  <Skeleton
                    className='col-span-1 hidden py-1 md:col-span-3 md:flex'
                    visible={
                      carSearchResult.isFetching ||
                      carSearchResult.isFetchingNextPage ||
                      carSearchResult.isLoading
                    }
                  >
                    <>
                      <div className='hidden items-center gap-2 md:flex'>
                        <div>
                          <span className='text-md font-bold'>
                            {destinationName},
                          </span>{' '}
                          İçin{' '}
                          <span className='text-md font-bold'>
                            {totalCount}
                          </span>{' '}
                          Araç Bulundu
                        </div>
                      </div>
                    </>
                  </Skeleton>

                  <Skeleton
                    className='flex px-2 md:hidden'
                    visible={
                      carSearchResult.isFetching ||
                      carSearchResult.isFetchingNextPage ||
                      carSearchResult.isLoading
                    }
                  >
                    <Button
                      color='black'
                      className='rounded-md border-gray-400 font-medium'
                      variant='outline'
                      onClick={() => setFilterSectionIsOpened((prev) => !prev)}
                    >
                      Filtreler
                    </Button>
                  </Skeleton>
                  <Skeleton
                    className='col-span-2 hidden items-center justify-end gap-2 md:col-span-2 md:flex'
                    visible={
                      carSearchResult.isFetching ||
                      carSearchResult.isFetchingNextPage ||
                      carSearchResult.isLoading
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
                  <div className='relative col-span-2 ms-auto flex md:hidden'>
                    <Skeleton
                      visible={
                        carSearchResult.isFetching ||
                        carSearchResult.isFetchingNextPage ||
                        carSearchResult.isLoading
                      }
                    >
                      <SortBySelect />
                    </Skeleton>
                  </div>
                </div>
                <Skeleton
                  className='flex items-center gap-2 px-3 md:hidden'
                  visible={
                    carSearchResult.isFetching ||
                    carSearchResult.isFetchingNextPage ||
                    carSearchResult.isLoading
                  }
                >
                  <>
                    <span className='text-sm'>
                      Toplam{' '}
                      <span className='text-md font-semibold'>
                        {totalCount}
                      </span>{' '}
                      Araç Bulundu
                    </span>
                  </>
                </Skeleton>
                {carSearchResult.isFetching && (
                  <div className='grid gap-4 pb-20 md:gap-6'>
                    {skeltonLoader.map((arr, arrIndex) => {
                      const skeleton = (
                        <div
                          key={arrIndex}
                          className='grid grid-cols-4 items-start gap-3 rounded-md border p-3 md:p-5'
                        >
                          <div className='col-span-1'>
                            <Skeleton h={150} />
                          </div>
                          <div className='col-span-3 grid gap-3 align-baseline'>
                            <Skeleton h={16} maw={250} />
                            <Skeleton h={16} maw={120} />
                            <Skeleton h={16} maw={180} />
                          </div>
                        </div>
                      )

                      if (arrIndex === 0) {
                        return (
                          <React.Fragment key={arrIndex}>
                            {skeleton}
                            <Loaderbanner
                              data={loaderBannerCar}
                              moduleName='Aracınız'
                              ıcon={MdLocalCarWash}
                            />
                          </React.Fragment>
                        )
                      }

                      return skeleton
                    })}
                  </div>
                )}

                {!carSearchResult.isFetching &&
                  !carSearchResult.isFetchingNextPage &&
                  !carSearchResult.isLoading &&
                  filteredPageItems?.length === 0 && (
                    <div>
                      <Alert color='red'>Sonuç bulunamadı</Alert>
                    </div>
                  )}
                {filteredPageItems?.map((carData) => {
                  if (!carData) return null

                  return (
                    <div key={carData?.key}>
                      <CarSearchResultItem
                        item={carData}
                        onSelect={() => handleCarSelect(carData)}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}
