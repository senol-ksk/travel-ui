'use client'

import { BusSearchItem } from './components/search-item'
import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  CloseButton,
  Container,
  Drawer,
  Modal,
  NativeSelect,
  rem,
  RemoveScroll,
  Skeleton,
  Stack,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { useState } from 'react'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useTransitionRouter } from 'next-view-transitions'
import { createSerializer, useQueryStates } from 'nuqs'

import { useSearchRequest } from '@/app/bus/useSearchResults'
import {
  BusGender,
  BusSearchResultItem,
  RouteInfo,
  Seat,
  SeatColors,
} from '@/app/bus/types'
import { BusFrame } from '@/app/bus/search-results/components/bus-frame'
import { reservationParsers } from '@/app/reservation/searchParams'
import {
  busSearchParams,
  filterParsers,
  SortOrderEnums,
} from '@/modules/bus/searchParams'
import { useFilterActions } from './filter-actions'
import { cleanObj } from '@/libs/util'
import { PriceNumberFlow } from '@/components/price-numberflow'
import { FaCheck } from 'react-icons/fa'
import { TripDetail } from '@/app/bus/search-results/components/trip-detail'
const skeltonLoader = new Array(3).fill(true)

const BusSearchResults: React.FC = () => {
  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParsers)
  const [filterSectionIsOpened, setFilterSectionIsOpened] = useState(false)
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')

  const {
    searchRequestQuery,
    useSeatControlMutation,
    useBusSeatMutation,
    useBusSearchInitPaymentProcess,
    searchToken,
    sessionToken,
  } = useSearchRequest()

  const seatRequestMutation = useBusSeatMutation()
  const seatControlMutation = useSeatControlMutation()
  const initBusPaymentProcess = useBusSearchInitPaymentProcess()

  const seatData = seatRequestMutation.data
  const routeInfos = seatRequestMutation.data?.routeInfos
  // console.log('Allah derim', routeInfos)
  const router = useTransitionRouter()
  const [seatSelectIsOpened, { open: openSeatSelect, close: closeSeatSelect }] =
    useDisclosure(false)
  const [selectedBus, setSelectedBus] = useState<BusSearchResultItem | null>()
  const [selectedSeats, setSelectedSeatsData] = useState<Seat[]>([])
  const [selectedRouteInfos, setSelecetedRouteInfos] = useState<RouteInfo[]>([])

  if (
    searchRequestQuery.hasNextPage &&
    !searchRequestQuery.isFetchingNextPage
  ) {
    searchRequestQuery.fetchNextPage()
  }

  const handleBusSeatSelect = (bus: BusSearchResultItem) => {
    setSelectedBus(bus)
    openSeatSelect()

    seatRequestMutation.mutate(bus.key)
  }

  const handleCheckSeatStatus = async () => {
    const productKey = selectedBus?.key

    if (productKey) {
      const response = await seatControlMutation.mutateAsync({
        selectedSeats: selectedSeats.map((seat, paxId) => ({
          ...seat,
          paxId: paxId + 1,
        })),
        productKey,
      })

      if (response) {
        const resParams = createSerializer(reservationParsers)

        const paymentResponse =
          await initBusPaymentProcess.mutateAsync(productKey)

        if (paymentResponse?.busJourney && paymentResponse.busJourney.key) {
          const url = resParams('/reservation', {
            productKey: paymentResponse?.busJourney.key,
            searchToken,
            sessionToken,
          })

          router.push(url)
        }
      }

      setSelectedSeatsData([])
    }
  }
  const searchResultPages = searchRequestQuery.data?.pages
  const hasSearchResult = !(
    !searchRequestQuery.isLoading &&
    !searchRequestQuery.hasNextPage &&
    searchResultPages?.some((item) =>
      item?.searchResults.some((results) => results.items.length === 0)
    )
  )

  const busSearchResults = searchResultPages?.flatMap((bus) => {
    return bus?.searchResults.flatMap((result) => result.items)
  }) as BusSearchResultItem[] | null
  const busSearchResultsForFilter = searchResultPages?.flatMap((bus) => {
    return bus?.searchResults.flatMap((result) => result.items)
  }) as BusSearchResultItem[] | null

  const filteredSearchResults = useFilterActions(
    busSearchResultsForFilter ?? []
  )

  const busTypeChecks = [
    ...new Set(busSearchResults?.map((bus) => bus.busType)),
  ]
  const destinationChecks =
    busSearchResults?.map((bus) => ({
      id: bus.destinationId,
      label: bus.destination,
    })) ?? []

  const originChecks =
    busSearchResults?.map((bus) => ({
      id: bus.originId,
      label: bus.origin,
    })) ?? []

  const companyIdChecks =
    busSearchResults?.map((bus) => ({
      id: bus.companyId,
      label: bus.company,
    })) ?? []
  const totalCount = busSearchResults?.length ?? 0
  const storedData = localStorage.getItem('bus-search-engine')
  const parsedData = storedData ? JSON.parse(storedData) : null
  const destinationName = parsedData?.Destination?.Name ?? ''
  const originName = parsedData?.Origin?.Name ?? ''
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
      label: 'Kalkış Saatine Göre',
      value: SortOrderEnums.hourAsc,
    },
  ]
  if (!hasSearchResult) {
    return (
      <div className='container py-3'>
        <Alert color='red'>
          <div> Sonuç bulunamadı.</div>
        </Alert>
      </div>
    )
  }

  return (
    <>
      <div className='relative'>
        {searchRequestQuery.isLoading ||
          (searchRequestQuery.isFetching && (
            <div className='absolute start-0 end-0 top-0'>
              <Skeleton h={5} title='Seferler sorgulanıyor' />
            </div>
          ))}
        <div className='@container pt-5 md:pt-10'>
          <Container>
            <div className='grid items-start gap-0 pb-10 md:grid-cols-4 md:gap-6 md:pb-20'>
              <div className='md:col-span-1'>
                <div>
                  <Transition
                    transition={'slide-right'}
                    mounted={filterSectionIsOpened || !!isBreakPointMatchesMd}
                  >
                    {(styles) => (
                      <RemoveScroll
                        enabled={
                          filterSectionIsOpened && !isBreakPointMatchesMd
                        }
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
                          {searchRequestQuery.isLoading ||
                          searchRequestQuery.isFetching ? (
                            <div>
                              <Skeleton h={20} />
                            </div>
                          ) : (
                            <>
                              <div className='flex justify-between'>
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
                                multiple
                                defaultValue={['busType', 'origin']}
                                classNames={{
                                  control: 'p-2 text-sm',
                                  label: 'p-0',
                                  content: 'p-2',
                                }}
                              >
                                <Accordion.Item value='busType'>
                                  <Accordion.Control>
                                    Oturma Düzeni{' '}
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(values) => {
                                        setFilterParams({
                                          type: values.length ? values : null,
                                        })
                                      }}
                                      value={
                                        filterParams.type
                                          ? filterParams.type
                                          : []
                                      }
                                    >
                                      <Stack gap={rem(6)}>
                                        {busTypeChecks.map(
                                          (item, itemIndex) => {
                                            return (
                                              <Checkbox
                                                key={itemIndex}
                                                label={item}
                                                value={item}
                                              />
                                            )
                                          }
                                        )}
                                      </Stack>
                                    </Checkbox.Group>
                                  </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value='origin'>
                                  <Accordion.Control>
                                    Kalkış Noktası
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(values) => {
                                        setFilterParams({
                                          origin: values.length ? values : null,
                                        })
                                      }}
                                      value={
                                        filterParams.origin
                                          ? filterParams.origin
                                          : []
                                      }
                                    >
                                      <Stack gap={rem(6)}>
                                        {originChecks
                                          .filter(
                                            (item, itemIndex, itemArr) =>
                                              itemArr.findIndex(
                                                (item2) => item.id === item2.id
                                              ) === itemIndex
                                          )
                                          .map((item, itemIndex) => {
                                            return (
                                              <Checkbox
                                                key={itemIndex}
                                                label={item.label}
                                                value={item.id.toString()}
                                              />
                                            )
                                          })}
                                      </Stack>
                                    </Checkbox.Group>
                                  </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value='destination'>
                                  <Accordion.Control>
                                    Varış Noktası
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(values) => {
                                        setFilterParams({
                                          destination: values.length
                                            ? values
                                            : null,
                                        })
                                      }}
                                      value={
                                        filterParams.destination
                                          ? filterParams.destination
                                          : []
                                      }
                                    >
                                      <Stack gap={rem(6)}>
                                        {destinationChecks
                                          .filter(
                                            (item, itemIndex, itemArr) =>
                                              itemArr.findIndex(
                                                (item2) => item.id === item2.id
                                              ) === itemIndex
                                          )
                                          .map((item, itemIndex) => {
                                            return (
                                              <Checkbox
                                                key={itemIndex}
                                                label={item.label}
                                                value={item.id.toString()}
                                              />
                                            )
                                          })}
                                      </Stack>
                                    </Checkbox.Group>
                                  </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value='companies'>
                                  <Accordion.Control>
                                    Firmalar
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(values) => {
                                        setFilterParams({
                                          company: values.length
                                            ? values
                                            : null,
                                        })
                                      }}
                                      value={
                                        filterParams.company
                                          ? filterParams.company
                                          : []
                                      }
                                    >
                                      <Stack gap={rem(6)}>
                                        {companyIdChecks
                                          ?.filter(
                                            (item, itemIndex, itemArr) =>
                                              itemArr.findIndex(
                                                (item2) => item.id === item2.id
                                              ) === itemIndex
                                          )
                                          .map((item, itemIndex) => {
                                            return (
                                              <Checkbox
                                                key={itemIndex}
                                                label={item.label}
                                                value={item.id.toString()}
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
                      </RemoveScroll>
                    )}
                  </Transition>
                </div>
              </div>
              <div className='md:col-span-3'>
                <Skeleton
                  className=''
                  visible={
                    searchRequestQuery.isLoading ||
                    searchRequestQuery.isFetchingNextPage ||
                    searchRequestQuery.isFetching
                  }
                >
                  <div className='flex items-center justify-between gap-1'>
                    <Button
                      size='sm'
                      radius={'md'}
                      color='black'
                      className='border-gray-400 px-8 font-medium md:hidden'
                      variant='outline'
                      onClick={() => setFilterSectionIsOpened((prev) => !prev)}
                    >
                      Filtreler
                    </Button>
                    {totalCount > 1 && (
                      <div className='hidden items-center gap-2 md:flex'>
                        <div className='text-lg font-normal'>
                          Toplam{' '}
                          <span className='text-xl font-bold'>
                            {' '}
                            {totalCount}{' '}
                          </span>
                          otobüs seferi bulundu
                        </div>
                      </div>
                    )}

                    <div className='flex items-center gap-2'>
                      <div className='hidden items-center gap-2 md:flex'>
                        {totalCount > 0 && (
                          <Skeleton
                            className='hidden items-center gap-2 md:flex'
                            visible={
                              searchRequestQuery.isLoading ||
                              searchRequestQuery.isFetchingNextPage ||
                              searchRequestQuery.isFetching
                            }
                          >
                            {filterOptions.map((option) => (
                              <Button
                                size='sm'
                                className={
                                  order === option.value
                                    ? 'rounded-md border-0 bg-blue-200 font-normal text-blue-700'
                                    : 'rounded-md border-gray-400 font-normal text-black hover:bg-blue-50 hover:text-blue-700'
                                }
                                key={option.value}
                                leftSection={
                                  order === option.value ? <FaCheck /> : ''
                                }
                                color='blue'
                                variant={
                                  order === option.value ? 'filled' : 'outline'
                                }
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

                      <Skeleton
                        className='md:hidden'
                        visible={
                          searchRequestQuery.isLoading ||
                          searchRequestQuery.isFetchingNextPage ||
                          searchRequestQuery.isFetching
                        }
                      >
                        <div>
                          <NativeSelect
                            radius={'md'}
                            className='ms-auto w-full font-medium md:w-auto'
                            size='sm'
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
                                label: 'Kalkış Saatine Göre',
                                value: SortOrderEnums.hourAsc,
                              },
                            ]}
                            value={order}
                            onChange={({ currentTarget: { value } }) => {
                              setFilterParams({
                                order: value as SortOrderEnums,
                              })
                            }}
                          />
                        </div>
                      </Skeleton>
                    </div>
                  </div>
                </Skeleton>
                <Skeleton
                  className='mt-3 flex items-center gap-2'
                  visible={
                    searchRequestQuery.isLoading ||
                    searchRequestQuery.isFetchingNextPage ||
                    searchRequestQuery.isFetching
                  }
                >
                  {totalCount > 0 && (
                    <div className='flex items-center gap-2 md:hidden'>
                      <span className='text-sm font-semibold text-gray-500'>
                        Toplam{' '}
                        <span className='text-xl font-bold'>{totalCount}</span>{' '}
                        otobüs seferi bulundu
                      </span>{' '}
                    </div>
                  )}
                </Skeleton>
                <div className='grid gap-4 pt-4'>
                  {searchToken &&
                    sessionToken &&
                    !searchRequestQuery.isFetching &&
                    filteredSearchResults.length === 0 && (
                      <Alert color='red'>
                        <div className='grid gap-4'>
                          <div>Sonuç bulunamadı.</div>
                          {filterParams && (
                            <div>
                              <Button
                                onClick={() => {
                                  setFilterParams(null)
                                }}
                                size='xs'
                              >
                                Diğer Sonuçları Göster
                              </Button>
                            </div>
                          )}
                        </div>
                      </Alert>
                    )}
                  {filteredSearchResults.length === 0 &&
                    (searchRequestQuery.isLoading ||
                      searchRequestQuery.isFetchingNextPage ||
                      searchRequestQuery.isFetching) &&
                    skeltonLoader.map((arr, arrIndex) => (
                      <div
                        key={arrIndex}
                        className='grid grid-cols-4 items-start gap-3 rounded-md border p-3 md:p-5'
                      >
                        <div className='col-span-1'>
                          <Skeleton h={150} />
                        </div>
                        <div className='col-span-3 grid gap-3 align-baseline'>
                          <Skeleton h={16} w={250} />
                          <Skeleton h={16} w={120} />
                          <Skeleton h={16} w={180} />
                        </div>
                      </div>
                    ))}
                  {filteredSearchResults.length > 0 && (
                    <div className='grid gap-4'>
                      {filteredSearchResults?.map((searchItem) => (
                        <BusSearchItem
                          key={searchItem.key}
                          searchItem={searchItem}
                          onSelect={handleBusSeatSelect}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
      <Drawer
        position='right'
        opened={seatSelectIsOpened}
        onClose={() => {
          if (seatControlMutation.isPending || initBusPaymentProcess.isPending)
            return
          setSelecetedRouteInfos([])
          setSelectedSeatsData([])
          setSelectedBus(null)

          closeSeatSelect()
        }}
        title={
          <div className='text-lg font-semibold'> {selectedBus?.company}</div>
        }
        radius={'lg'}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <div className='flex justify-evenly gap-4 pb-3 text-xs leading-none'>
          <div className='flex items-center gap-2'>
            <div>
              <div
                className='inline-block size-[20px] items-center justify-center rounded-t-lg border-t border-r border-b-4 border-l border-gray-600 border-b-gray-600 pt-1'
                style={{ backgroundColor: `var(${SeatColors.MALE})` }}
              ></div>
            </div>
            <span>Erkek (Dolu)</span>
          </div>
          <div className='flex items-center gap-2'>
            <div>
              <div
                className='inline-block size-[20px] items-center justify-center rounded-t-lg border-t border-r border-b-4 border-l border-gray-600 border-b-gray-600 pt-1'
                style={{ backgroundColor: `var(${SeatColors.WOMAN})` }}
              ></div>
            </div>
            <span>Kadın (Dolu)</span>
          </div>
          <div className='flex items-center gap-2'>
            <div>
              <div
                className='inline-block size-[20px] items-center justify-center rounded-t-lg border-t border-r border-b-4 border-l border-gray-600 border-b-gray-600 pt-1'
                style={{ backgroundColor: `var(${SeatColors.AVAILABLE})` }}
              ></div>
            </div>
            <span>Boş Koltuk</span>
          </div>
          <div className='flex items-center gap-2'>
            <div>
              <div
                className='inline-block size-[20px] items-center justify-center rounded-t-lg border-t border-r border-b-4 border-l border-gray-600 border-b-gray-600 pt-1'
                style={{ backgroundColor: `var(${SeatColors.SELECTED})` }}
              ></div>
            </div>
            <span>Seçilen Koltuk</span>
          </div>
        </div>
        <div className='font-nromal flex justify-center text-center text-blue-800'>
          <TripDetail routeInfos={routeInfos} />
        </div>

        {seatRequestMutation.isPending ? (
          <Skeleton h={600} w={'75%'} radius={'xl'} mx='auto' />
        ) : null}
        {seatData?.seats.length ? (
          <>
            <div className='relative h-[calc(100vh-180px)] overflow-hidden'>
              <div className='h-full overflow-auto px-4 pb-[100px]'>
                <BusFrame
                  seats={seatData.seats}
                  maxSelectCountReached={selectedSeats.length === 4}
                  onSeatSelect={(gender, selectedSeatsData) => {
                    setSelectedSeatsData((prev) => {
                      const nextState =
                        gender === BusGender.EMPTY
                          ? [
                              ...prev.filter(
                                (item) => item.no !== selectedSeatsData.no
                              ),
                            ]
                          : [...prev, { ...selectedSeatsData, gender: gender }]

                      return nextState
                    })
                  }}
                />
              </div>
              <div className='fixed right-0 bottom-0 left-0 z-10 bg-white px-4 py-1 shadow-lg md:py-3'>
                <div className='flex items-center gap-3 overflow-x-auto pb-2'>
                  {selectedSeats.length === 0 ? (
                    <div>Koltuk Seçiniz.</div>
                  ) : null}
                  {selectedSeats.map((seat, seatIndex) => {
                    const gender = seat.gender
                    const isMale = gender === BusGender.MALE
                    const isWoman = gender === BusGender.WOMAN

                    const backgroundColor = isMale
                      ? `var(${SeatColors.MALE})`
                      : isWoman
                        ? `var(${SeatColors.WOMAN})`
                        : ''

                    return (
                      <div
                        key={seatIndex}
                        className='flex size-[36px] items-center justify-center rounded-t-lg border-b-4 border-b-gray-600 pt-1 text-sm text-black'
                        style={{
                          backgroundColor,
                        }}
                      >
                        <div className='relative'>{seat.no}</div>
                      </div>
                    )
                  })}
                </div>
                <small className='text-dark-200'>
                  (Tek seferde en fazla 4 koltuk seçebilirsiniz)
                </small>
                <div className='flex items-center pt-4'>
                  {selectedSeats.length > 0 && (
                    <div className='text-2xl font-semibold'>
                      <PriceNumberFlow
                        value={selectedSeats.reduce((a, b) => {
                          return b.totalPrice.value + a
                        }, 0)}
                      />
                    </div>
                  )}
                  <div className='ms-auto'>
                    <Button
                      disabled={!selectedSeats.length}
                      onClick={handleCheckSeatStatus}
                      loading={
                        seatControlMutation.isPending ||
                        initBusPaymentProcess.isPending
                      }
                    >
                      Onayla ve Devam Et
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          seatData?.seats.length === 0 &&
          seatRequestMutation.isSuccess && <div>No seat data</div>
        )}
      </Drawer>
    </>
  )
}

export { BusSearchResults }
