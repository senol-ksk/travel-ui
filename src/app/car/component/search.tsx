'use client'

import { useRouter } from 'next/navigation'
import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  CloseButton,
  Container,
  rem,
  RemoveScroll,
  ScrollAreaAutosize,
  Skeleton,
  Stack,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { createSerializer, useQueryStates } from 'nuqs'
import { upperFirst, useMediaQuery } from '@mantine/hooks'

import { useCarSearchResults } from '@/app/car/search-results/useSearchResult'
import { CarSearchResultItem } from '@/app/car/component/result-item'
import { CarSearchRequest, CarSearchResultItemType } from '@/app/car/types'
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
    const detailParams = createDetailParams({
      selectedProductKey: car.key,
      searchToken: searchRequestParams.params.searchToken,
      sessionToken: searchRequestParams.params.sessionToken,
    })
    router.push(`/car/detail${detailParams}`)
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

  return (
    <div>
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
                                <Title order={2} fz={'h4'} mb={rem(20)}>
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
                                    className='font-semibold text-blue-500'
                                    onClick={() => {
                                      setFilterParams(null)
                                    }}
                                  >
                                    Temizle
                                  </UnstyledButton>
                                </div>
                              </div>
                              <Accordion
                                defaultValue={['fuelType', 'provider']}
                                multiple
                                classNames={{
                                  control: 'p-2 text-sm',
                                  label: 'p-0',
                                }}
                              >
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
                                        {fuelTypeChecks?.map((fuelType) => {
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
                                      <Stack gap={rem(6)}>
                                        {providerChecks.map(
                                          (provider, providerIndex) => {
                                            return (
                                              <Checkbox
                                                key={providerIndex}
                                                label={provider}
                                                value={provider}
                                              />
                                            )
                                          }
                                        )}
                                      </Stack>
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
                                          label='Otomatik Vites'
                                          value={'1'}
                                        />
                                        <Checkbox
                                          label='Düz Vites'
                                          value={'0'}
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
                                      <Stack gap={rem(6)}>
                                        {categoryChecks.map(
                                          (data, dataIndex) => (
                                            <Checkbox
                                              key={dataIndex}
                                              label={data}
                                              value={data}
                                            />
                                          )
                                        )}
                                      </Stack>
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
                                          {brandChecks.map(
                                            (data, dataIndex) => (
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
                                            )
                                          )}
                                        </Stack>
                                      </ScrollAreaAutosize>
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
                    className='col-span-1 hidden md:col-span-3 md:flex'
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
                          için{' '}
                          <span className='text-md font-bold'>
                            {totalCount}
                          </span>{' '}
                          araç bulduk!
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
                            ? 'rounded-md border-0 bg-blue-200 font-medium text-blue-700'
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
                    <span className='text-sm font-semibold text-gray-500'>
                      Toplam {totalCount} araç bulundu
                    </span>
                  </>
                </Skeleton>
                <div className='grid gap-4 pb-20 md:gap-6'>
                  {carSearchResult.isLoading &&
                    skeltonLoader.map((arr, arrIndex) => (
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
                    ))}

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
          </div>
        </Container>
      </div>
    </div>
  )
}
