'use client'

import { useRouter } from 'next/navigation'
import {
  Accordion,
  Checkbox,
  Container,
  rem,
  Skeleton,
  Stack,
  Title,
} from '@mantine/core'
import { createSerializer, useQueryStates } from 'nuqs'

import { useCarSearchResults } from '@/app/car/search-results/useSearchResult'
import { CarSearchResultItem } from './result-item'
import { CarSearchRequest, CarSearchResultItemType } from '@/app/car/types'
import { carDetailParams } from '../searchParams'
import { filterParsers, FuelTypes } from '@/modules/carrent/types'
import { SortBySelect } from './sort-by-select'
import { useFilterActions } from '../search-results/filter-actions'
import { FilterEnum } from 'zod'

export const createDetailParams = createSerializer(carDetailParams)

type Props = {
  searchRequestParams: CarSearchRequest
}

export const Search: React.FC<Props> = ({ searchRequestParams }) => {
  const router = useRouter()
  const carSearchResult = useCarSearchResults(searchRequestParams)
  const [filterParams, setFilterParams] = useQueryStates(filterParsers)

  const handleCarSelect = (car: CarSearchResultItemType) => {
    const detailParams = createDetailParams({
      selectedProductKey: car.key,
      searchToken: searchRequestParams.params.searchToken,
      sessionToken: searchRequestParams.params.sessionToken,
    })
    router.push(`/car/detail${detailParams}`)
  }

  const allPages = carSearchResult?.data?.pages.flatMap((page) =>
    page.data.searchResults.flatMap((searchResult) => searchResult.items)
  ) as CarSearchResultItemType[]

  const fuelTypeChecks = [
    ...new Set(allPages?.map((carData) => carData.carDetail.fuelType)),
  ]

  const filteredPageItems = useFilterActions(allPages)

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

        <Container>
          <div className='py-10'>
            <div className='grid gap-4 md:grid-cols-4 md:gap-5'>
              <div className='md:col-span-1'>
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
                      <Title order={2} fz={'h4'} mb={rem(20)}>
                        Filtreler
                      </Title>
                      <Accordion
                        multiple
                        classNames={{
                          control: 'p-2 text-sm',
                          label: 'p-0',
                        }}
                      >
                        <Accordion.Item value='fuelType'>
                          <Accordion.Control>Yakıt Tipi test</Accordion.Control>
                          <Accordion.Panel>
                            <Checkbox.Group
                              onChange={(value) => {
                                setFilterParams({
                                  fuelTypes: value.length
                                    ? value.map(Number)
                                    : null,
                                })
                              }}
                              defaultValue={filterParams.fuelTypes?.map(String)}
                            >
                              <Stack>
                                {fuelTypeChecks?.map((car) => {
                                  return (
                                    <Checkbox
                                      key={car}
                                      label={FuelTypes[car]}
                                      value={'' + (car - 1)}
                                    />
                                  )
                                })}
                              </Stack>
                            </Checkbox.Group>
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    </>
                  )}
                </div>
              </div>
              <div className='grid gap-4 md:col-span-3'>
                <div className='grid grid-cols-2 items-center justify-between pb-3'>
                  <div></div>
                  <div className='relative justify-self-end'>
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
