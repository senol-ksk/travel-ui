'use client'

import { useTransferSearchResults } from './useSearchResults'
import {
  Alert,
  Button,
  Checkbox,
  CloseButton,
  Container,
  Divider,
  NativeSelect,
  rem,
  Skeleton,
  Stack,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'

import { TransferSearchItem } from '@/app/transfer/search-results/search-item'
import {
  filterParsers,
  SortOrderEnums,
} from '@/modules/transfer/searchParams.client'
import { useQueryStates } from 'nuqs'
import { useFilterActions } from './useFilterActions'
import { PriceRangeSlider } from './_components/price-slider'
import { cleanObj, formatCurrency } from '@/libs/util'
import { useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { CiFilter } from 'react-icons/ci'

const skeltonLoader = new Array(3).fill(true)

const TransferSearchResults = () => {
  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParsers)
  const { searchResultsQuery: transferSearchResultsQuery } =
    useTransferSearchResults()

  const [filterSectionIsOpened, setFilterSectionIsOpened] = useState(false)
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')

  const searchResults =
    transferSearchResultsQuery.data?.pages.flatMap((page) =>
      page.searchResults.flatMap((searchResults) => searchResults.vehicles)
    ) ?? []

  const maxPrice = Math.ceil(
    Math.max(
      ...searchResults.map((data) => data.transferData.bookDetail.sortPrice)
    )
  )
  const minPrice = Math.floor(
    Math.min(
      ...searchResults.map((data) => data.transferData.bookDetail.sortPrice)
    )
  )
  const vehicleTypeChecks = searchResults.map((result) => ({
    id: result.vehicleType,
    label: result?.vehicleTitle?.split('-')?.shift()?.trim(),
  }))
  const paxChecks = [
    ...new Set(
      searchResults.map((result) => result.transferInfo.transferMax.pax)
    ),
  ].sort((a, b) => +a - +b)

  const filteredData = useFilterActions(searchResults)

  if (transferSearchResultsQuery.hasNextPage) {
    transferSearchResultsQuery.fetchNextPage()
  }

  return (
    <div className='relative'>
      <Container py={'lg'}>
        <div className='grid gap-4 md:grid-cols-4 md:gap-7'>
          <div className='md:col-span-1'>
            <Transition
              transition={'slide-right'}
              mounted={filterSectionIsOpened || !!isBreakPointMatchesMd}
            >
              {(styles) => (
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
                  {!transferSearchResultsQuery.data ||
                  transferSearchResultsQuery.isFetchingNextPage ? (
                    <div className='grid gap-2'>
                      <Skeleton h={20} w={150} mb={rem(9)} />
                      <Skeleton h={12} w={220} />
                      <Skeleton h={12} w={170} />
                      <Skeleton h={12} w={190} />
                    </div>
                  ) : (
                    <>
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
                      <div>
                        <div className='pb-5'>
                          <div className='flex justify-between pb-4'>
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
                          <div className='px-2'>
                            <PriceRangeSlider
                              minPrice={minPrice}
                              maxPrice={maxPrice}
                            />
                          </div>
                        </div>
                        <Divider my={'md'} />
                        <div>
                          <Title order={5}>Araç Türleri</Title>
                          <Checkbox.Group
                            pt={rem(12)}
                            onChange={(values) => {
                              setFilterParams({
                                vehicle: values.length
                                  ? values.map(String)
                                  : null,
                              })
                            }}
                            value={
                              filterParams.vehicle ? filterParams.vehicle : []
                            }
                          >
                            <Stack gap={rem(6)}>
                              {vehicleTypeChecks
                                .filter(
                                  (item, itemIndex, itemArr) =>
                                    itemArr.findIndex(
                                      (item2) => item.id === item2.id
                                    ) === itemIndex
                                )
                                .map((data, dataIndex) => (
                                  <Checkbox
                                    key={dataIndex}
                                    label={data.label}
                                    value={data.id.toString()}
                                  />
                                ))}
                            </Stack>
                          </Checkbox.Group>
                        </div>
                        <Divider my={'md'} />
                        <div>
                          <Title order={5}>Alabileceği Yolcu Sayısı</Title>
                          <Checkbox.Group
                            pt={rem(12)}
                            value={filterParams.pax ? filterParams.pax : []}
                            onChange={(values) => {
                              setFilterParams({
                                pax: values.length ? values : null,
                              })
                            }}
                          >
                            <Stack gap={rem(6)}>
                              {paxChecks.map((data) => (
                                <Checkbox
                                  key={data}
                                  label={data}
                                  value={data}
                                />
                              ))}
                            </Stack>
                          </Checkbox.Group>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </Transition>
          </div>
          <div className='md:col-span-3'>
            <div className='flex justify-between pb-5'>
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
                  size='sm'
                  value={order ? order : ''}
                  data={[
                    { label: 'Fiyat Artan', value: SortOrderEnums.priceAsc },
                    {
                      label: 'Fiyat Azalan',
                      value: SortOrderEnums.priceDesc,
                    },
                  ]}
                  onChange={({ target: { value } }) => {
                    setFilterParams({
                      order: value as SortOrderEnums,
                    })
                  }}
                />
              </div>
            </div>
            <div className='grid gap-4 md:gap-6'>
              {filteredData.length === 0 &&
                (!transferSearchResultsQuery.data ||
                  transferSearchResultsQuery.isLoading) &&
                skeltonLoader.map((arr, arrIndex) => (
                  <div
                    key={arrIndex}
                    className='grid grid-cols-4 items-start gap-3 rounded-md border p-3 md:p-5'
                  >
                    <div className='col-span-1'>
                      <Skeleton h={100} />
                    </div>
                    <div className='col-span-3 grid gap-3 align-baseline'>
                      <Skeleton h={16} w={250} />
                      <Skeleton h={16} w={120} />
                      <Skeleton h={16} w={180} />
                    </div>
                  </div>
                ))}

              {!transferSearchResultsQuery.isFetchingNextPage &&
                !transferSearchResultsQuery.isLoading &&
                !transferSearchResultsQuery.isFetching &&
                transferSearchResultsQuery.data &&
                transferSearchResultsQuery.data.pages &&
                filteredData.length === 0 && <Alert>Sonuç bulunamadı</Alert>}

              {filteredData?.map((data) => {
                return <TransferSearchItem key={data.id} data={data} />
              })}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export { TransferSearchResults }
