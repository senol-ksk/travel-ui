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
import { filterParsers, FuelTypes } from '@/modules/carrent/types'
import { SortBySelect } from '@/app/car/component/sort-by-select'
import { useFilterActions } from '@/app/car/search-results/filter-actions'
import { cleanObj } from '@/libs/util'
import { CiFilter } from 'react-icons/ci'
import { useState } from 'react'

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
          <div className='py-10'>
            <div className='grid items-start gap-4 md:grid-cols-4 md:gap-5'>
              <div className='md:col-span-1'>
                <Transition
                  transition={'slide-right'}
                  mounted={filterSectionIsOpened || !!isBreakPointMatchesMd}
                >
                  {(styles) => (
                    <div
                      className='fixed start-0 end-0 top-0 bottom-0 z-10 bg-white md:static'
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
                                  Object.keys(cleanObj(filterParams)).length ===
                                  0
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
                                <Accordion.Control>Şanzıman</Accordion.Control>
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
                                        ? filterParams.transmission.map(String)
                                        : []
                                    }
                                  >
                                    <Stack gap={rem(6)}>
                                      <Checkbox
                                        label='Otomatik Vites'
                                        value={'1'}
                                      />
                                      <Checkbox label='Düz Vites' value={'0'} />
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
                                        seatCount: value.length ? value : null,
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
                                <Accordion.Control>Kategori</Accordion.Control>
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
                                      {categoryChecks.map((data, dataIndex) => (
                                        <Checkbox
                                          key={dataIndex}
                                          label={data}
                                          value={data}
                                        />
                                      ))}
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
                                        {brandChecks.map((data, dataIndex) => (
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
                            </Accordion>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </Transition>
              </div>
              <div className='grid gap-4 md:col-span-3'>
                <div className='flex items-center gap-2 pb-3'>
                  <div>
                    <Button
                      size='sm'
                      leftSection={<CiFilter size={23} />}
                      // variant='outline'
                      color='green'
                      onClick={() => setFilterSectionIsOpened((prev) => !prev)}
                      hiddenFrom='md'
                    >
                      Filtreler
                    </Button>
                  </div>

                  <div className='relative ms-auto'>
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
