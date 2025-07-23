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
  RemoveScroll,
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
  transferSearchParams,
} from '@/modules/transfer/searchParams.client'
import { useQueryStates } from 'nuqs'
import { useFilterActions } from './useFilterActions'
import { PriceRangeSlider } from './_components/price-slider'
import { cleanObj, formatCurrency } from '@/libs/util'
import { useState } from 'react'
import { useMediaQuery } from '@mantine/hooks'
import { CiFilter } from 'react-icons/ci'
import { FaCheck } from 'react-icons/fa'

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
  const filterOptions = [
    {
      label: 'En Ucuz',
      value: SortOrderEnums.priceAsc,
    },
    {
      label: 'En Pahalı',
      value: SortOrderEnums.priceDesc,
    },
  ]
  const totalCount = searchResults.length ?? 0
  // const destinationName = searchResults[0].transferData.selectedTransferDetail

  if (transferSearchResultsQuery.hasNextPage) {
    transferSearchResultsQuery.fetchNextPage()
  }

  return (
    <div className='relative'>
      <Container py={'lg'}>
        <div className='grid gap-0 md:grid-cols-8 md:gap-7'>
          <div className='md:col-span-2'>
            <Transition
              transition={'slide-right'}
              mounted={filterSectionIsOpened || !!isBreakPointMatchesMd}
            >
              {(styles) => (
                <RemoveScroll
                  enabled={filterSectionIsOpened && !isBreakPointMatchesMd}
                >
                  <div
                    className='fixed start-0 end-0 top-0 bottom-0 z-10 overflow-y-auto bg-white p-3 md:static md:p-0'
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
                              fz='sm'
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
                            <div className='px-3'>
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
                </RemoveScroll>
              )}
            </Transition>
          </div>
          <div className='md:col-span-6'>
            <div className='flex justify-between gap-1 pb-3'>
              <Skeleton
                className='col-span-2 hidden md:flex'
                visible={
                  !transferSearchResultsQuery.data ||
                  transferSearchResultsQuery.isLoading
                }
              >
                <>
                  <div className='hidden items-center gap-2 md:flex'>
                    <div>
                      <span className='text-lg font-bold'>Transferiniz</span>{' '}
                      için toplam{' '}
                      <span className='text-lg font-bold'> {totalCount}</span>{' '}
                      araç bulduk!
                    </div>
                  </div>
                </>
              </Skeleton>
              <Skeleton
                className='flex items-center justify-between gap-1 md:justify-end'
                visible={
                  !transferSearchResultsQuery.data ||
                  transferSearchResultsQuery.isLoading
                }
              >
                <div>
                  <Button
                    size='sm'
                    color='black'
                    className='flex border-gray-400 px-6 font-medium md:hidden'
                    variant='outline'
                    onClick={() => setFilterSectionIsOpened((prev) => !prev)}
                    hiddenFrom='md'
                  >
                    Filtreler
                  </Button>
                </div>
                <div className='flex items-center justify-end gap-1'>
                  {filterOptions.map((option) => (
                    <Button
                      size='sm'
                      className={
                        order === option.value
                          ? 'rounded-md border-0 bg-blue-200 px-3 font-medium text-blue-700'
                          : 'rounded-md border-gray-400 px-3 font-medium text-black hover:bg-blue-50 hover:text-blue-700'
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
                </div>
              </Skeleton>
              <div>
                <NativeSelect
                  className='hidden font-medium'
                  size='sm'
                  value={order ? order : ''}
                  data={[
                    { label: 'En Ucuz', value: SortOrderEnums.priceAsc },
                    {
                      label: 'En Pahalı',
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
            <Skeleton
              className='col-span-2 mt-2 mb-4 flex md:hidden'
              visible={
                !transferSearchResultsQuery.data ||
                transferSearchResultsQuery.isLoading
              }
            >
              <>
                <div className='flex items-center gap-2 md:hidden'>
                  <div className='text-sm font-semibold text-gray-500'>
                    Transferiniz için toplam {totalCount} araç bulduk!
                  </div>
                </div>
              </>
            </Skeleton>
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
