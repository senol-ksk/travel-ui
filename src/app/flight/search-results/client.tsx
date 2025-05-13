'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  useDisclosure,
  useMediaQuery,
  useMounted,
  useScrollIntoView,
} from '@mantine/hooks'
import {
  Accordion,
  Alert,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Container,
  Drawer,
  Loader,
  Modal,
  NativeSelect,
  rem,
  Skeleton,
  Stack,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { useQueryStates } from 'nuqs'
import { CiFilter } from 'react-icons/ci'
import { IoAirplaneSharp } from 'react-icons/io5'
import { GoArrowRight } from 'react-icons/go'

import { useSearchResultsQueries } from '@/app/flight/search-queries'
import {
  AirlineCode,
  ClientDataType,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
} from '@/app/flight/type'
import { MemoizedFlightSearchResultsDomestic } from '@/app/flight/search-results/domestic-flight'
import { MemoizedFlightSearchResultsInternational } from '@/app/flight/search-results/international-flight'

import { filterParsers, SortOrderEnums } from '@/modules/flight/searchParams'
import { useFilterActions } from './filter-actions'
import { HourRangeSlider } from './components/hour-range'
import { DrawerFlight } from './components/drawer-flight'
import dayjs from 'dayjs'
import { Virtuoso } from 'react-virtuoso'

type SelectedPackageStateProps = {
  flightDetailSegment: FlightDetailSegment
  flightFareInfo: FlightFareInfo
  flightDetails: FlightDetail
}

const FlightSearchView = () => {
  const {
    searchResultsQuery,
    searchSessionTokenQuery,
    submitFlightData,
    getAirlineByCodeList,
    getAirportsByCodeList,
    searchParams,
  } = useSearchResultsQueries()
  const searchQueryData = useMemo(
    () => searchResultsQuery?.data,
    [searchResultsQuery?.data]
  )
  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParsers)
  const airlineDataObj = getAirlineByCodeList.data

  // list `filteredData` in the client, for other calculations, mutations...etc, use query data itself
  const { filteredData } = useFilterActions(searchQueryData)

  const [isReturnFlightVisible, setIsReturnFlightVisible] = useState(false)
  const { departureDate, returnDate } = searchParams
  const isSameDay = dayjs(departureDate).isSame(returnDate, 'd')

  const [selectedFlightItemPackages, setSelectedFlightItemPackages] = useState<{
    packages: SelectedPackageStateProps[] | undefined | null
    flights: ClientDataType[]
  } | null>()
  const [
    packageDrawerOpened,
    { open: openPackageDrawer, close: closePackageDrawer },
  ] = useDisclosure(false)

  const isDomestic = useMemo(
    () =>
      searchQueryData?.every((detailSegment) =>
        detailSegment?.details.every((detail) => detail.isDomestic)
      ),
    [searchQueryData]
  )

  // if true this means Round trip, otherwise international or one way flight
  const tripKind = useMemo(
    () =>
      isDomestic &&
      !!searchQueryData?.filter((results) => results.fareInfo.groupId > 0)
        .length,
    [isDomestic, searchQueryData]
  )

  // this is for flight select. first this should be called, then `handlePackageSelect`
  const handleFlightSelect = (flight: ClientDataType) => {
    const packages = flight.package.map((pack) => ({
      flightDetailSegment: pack.segments.at(0),
      flightFareInfo: pack.fareInfo,
      flightDetails: pack.details.at(0),
    })) as SelectedPackageStateProps[]
    // setSelectedFlightItem(flight)

    if (flight.package.length <= 1) {
      handlePackageSelect(packages[0])
      return
    }

    setSelectedFlightItemPackages((prevValues) => ({
      packages,
      flights:
        prevValues?.flights.length && flight.fareInfo.groupId !== 0
          ? [prevValues.flights[0], flight]
          : [flight],
    }))

    openPackageDrawer()
  }

  // this, `handlePackageSelect`, should called after package is selected. handle domestic and roundtrip,
  // in  round trip and domestic case return flight section must be visible. otherwise redirect to reservation page
  // and handle scroll if user must select return flight
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    duration: 700,
  })
  const handlePackageSelect = async (data: SelectedPackageStateProps) => {
    selectedFlightKeys.current.push(data.flightFareInfo.key)

    closePackageDrawer()

    if (!tripKind) {
      await submitFlightData.mutateAsync(selectedFlightKeys.current.toString())
    }

    if (tripKind && selectedFlightItemPackages?.flights.length === 1) {
      scrollIntoView()
      setIsReturnFlightVisible(true)
    } else {
      await submitFlightData.mutateAsync(selectedFlightKeys.current.toString())
      selectedFlightKeys.current = []
    }
  }

  const resetSelectedFlights = useCallback(() => {
    setIsReturnFlightVisible(false)
    setSelectedFlightItemPackages(null)
    selectedFlightKeys.current = []
  }, [])

  useEffect(() => {
    return () => {
      resetSelectedFlights()
    }
  }, [resetSelectedFlights, searchParams])

  const selectedFlightKeys = useRef<string[]>([])
  const isFlightSubmitting = submitFlightData.isPending

  const [filterSectionIsOpened, setFilterSectionIsOpened] = useState(false)
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')
  const mounted = useMounted()

  if (!mounted)
    return (
      <Container className='grid gap-3 py-4'>
        <Skeleton h={30} radius='sm' />
        <Skeleton h={20} radius='sm' w={'90%'} />
        <Skeleton h={16} radius='sm' w={'95%'} />
      </Container>
    )

  return (
    <>
      {searchResultsQuery.isLoading ||
      searchResultsQuery.isFetching ||
      searchResultsQuery.isFetchingNextPage ||
      searchSessionTokenQuery.isLoading ? (
        <div className='relative'>
          <div className='absolute start-0 end-0 top-0 bottom-0 h-[8px]'>
            <Skeleton h={6} />
          </div>
        </div>
      ) : null}

      <Container ref={targetRef} className='pt-5 pb-20'>
        <div className='grid md:grid-cols-5 md:gap-3'>
          <div className='md:col-span-1'>
            <Transition
              transition={'slide-right'}
              mounted={filterSectionIsOpened || !!isBreakPointMatchesMd}
            >
              {(styles) => (
                <div
                  className='fixed start-0 end-0 top-0 bottom-0 z-10 bg-white p-3 md:static'
                  style={styles}
                >
                  <div className='flex justify-end md:hidden'>
                    <CloseButton
                      size={'lg'}
                      onClick={() => setFilterSectionIsOpened(false)}
                    />
                  </div>
                  {searchResultsQuery.isLoading ||
                  searchResultsQuery.isFetching ||
                  searchResultsQuery.isFetchingNextPage ||
                  searchSessionTokenQuery.isLoading ? (
                    <div className='grid gap-2'>
                      <Skeleton h={25} className='grow-0' w={'100%'} />
                      <Skeleton h={18} w={150} />
                      <div className='flex gap-1'>
                        <Skeleton className='size-4' />
                        <Skeleton className='flex-1' />
                      </div>
                      <div className='flex gap-1'>
                        <Skeleton className='size-4' />
                        <Skeleton className='flex-1' />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className='flex justify-between gap-2'>
                        <Title order={2} fz={'h4'} mb={rem(20)}>
                          Filtreler
                        </Title>
                        <div>
                          <UnstyledButton
                            className='font-semibold text-blue-500'
                            fz='xs'
                            hidden={!Object.values(filterParams).find(Boolean)}
                            onClick={() => {
                              setFilterParams(null)
                            }}
                          >
                            Temizle
                          </UnstyledButton>
                        </div>
                      </div>
                      <Accordion
                        defaultValue={['numOfStops', 'airlines']}
                        multiple
                        classNames={{
                          control: 'p-2 text-sm',
                          label: 'p-0',
                        }}
                      >
                        <Accordion.Item value='numOfStops'>
                          <Accordion.Control>Aktarma</Accordion.Control>
                          <Accordion.Panel>
                            <Checkbox.Group
                              onChange={(value) => {
                                setFilterParams({
                                  numOfStops: value.length
                                    ? value.map(Number)
                                    : null,
                                })
                              }}
                              value={
                                filterParams.numOfStops?.length
                                  ? filterParams.numOfStops?.map(String)
                                  : []
                              }
                            >
                              <Stack gap={6}>
                                {searchQueryData?.find((result) =>
                                  isDomestic
                                    ? result.segments.length === 1
                                    : result.segments.filter(
                                        (segment) => segment.groupId === 0
                                      ).length === 1 ||
                                      result.segments.filter(
                                        (segment) => segment.groupId === 1
                                      ).length === 1
                                ) && (
                                  <Checkbox
                                    name='numOfStops'
                                    label='Aktarmasız'
                                    value={'0'}
                                  />
                                )}
                                {searchQueryData?.find((result) =>
                                  isDomestic
                                    ? result.segments.length === 2
                                    : result.segments.filter(
                                        (segment) => segment.groupId === 0
                                      ).length === 2 ||
                                      result.segments.filter(
                                        (segment) => segment.groupId === 1
                                      ).length === 2
                                ) && (
                                  <Checkbox
                                    name='numOfStops'
                                    label='1 Aktarma'
                                    value={'1'}
                                  />
                                )}
                                {searchQueryData?.find((result) =>
                                  isDomestic
                                    ? result.segments.length > 2
                                    : result.segments.filter(
                                        (segment) => segment.groupId === 0
                                      ).length > 2 ||
                                      result.segments.filter(
                                        (segment) => segment.groupId === 1
                                      ).length > 2
                                ) && (
                                  <Checkbox
                                    name='numOfStops'
                                    label='2+ Aktarma'
                                    value={'2'}
                                  />
                                )}
                              </Stack>
                            </Checkbox.Group>
                          </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value='airlines'>
                          <Accordion.Control>Hava Yolları</Accordion.Control>
                          <Accordion.Panel>
                            <Checkbox.Group
                              onChange={(value) => {
                                setFilterParams({
                                  airlines: value.length ? value : null,
                                })
                              }}
                              value={
                                filterParams?.airlines?.length
                                  ? filterParams.airlines?.map(String)
                                  : []
                              }
                            >
                              <Stack gap={6}>
                                {airlineDataObj?.map((airline) => {
                                  return (
                                    <div key={airline.Code}>
                                      <Checkbox
                                        name='airlines'
                                        label={
                                          airline.Value.find(
                                            (airlineValue) =>
                                              airlineValue.LangCode === 'tr_TR'
                                          )?.Value
                                        }
                                        value={airline.Code}
                                      />
                                    </div>
                                  )
                                })}
                              </Stack>
                            </Checkbox.Group>
                          </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value='airports'>
                          <Accordion.Control>Havaalanları</Accordion.Control>
                          <Accordion.Panel>
                            <Checkbox.Group
                              onChange={(value) => {
                                setFilterParams({
                                  airports: value.length ? value : null,
                                })
                              }}
                              value={
                                filterParams.airports?.length
                                  ? filterParams.airports?.map(String)
                                  : []
                              }
                            >
                              <Stack gap={6}>
                                {getAirportsByCodeList.data?.map((airports) => {
                                  return (
                                    <div key={airports.Code}>
                                      <Checkbox
                                        name='airports'
                                        label={
                                          airports.Value.find(
                                            (airportValue) =>
                                              airportValue.LangCode === 'tr_TR'
                                          )?.Value
                                        }
                                        value={airports.Code}
                                      />
                                    </div>
                                  )
                                })}
                              </Stack>
                            </Checkbox.Group>
                          </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value='departureHours'>
                          <Accordion.Control>Kalkış saatleri</Accordion.Control>
                          <Accordion.Panel>
                            <HourRangeSlider
                              filterParams={filterParams.departureHours}
                              onChange={(hourRange) => {
                                setFilterParams({
                                  departureHours: [
                                    hourRange.at(0)?.hourValue ?? 0,
                                    hourRange.at(-1)?.hourValue ?? 1440,
                                  ],
                                })
                              }}
                            />
                          </Accordion.Panel>
                        </Accordion.Item>
                      </Accordion>
                    </>
                  )}
                </div>
              )}
            </Transition>
          </div>
          <div className='md:col-span-4'>
            <div className='grid grid-cols-2 pb-3'>
              <Box className='justify-self-start'>
                <Button
                  size='sm'
                  leftSection={<CiFilter size={23} />}
                  // variant='outline'
                  color='green'
                  onClick={() => setFilterSectionIsOpened((prev) => !prev)}
                  hiddenFrom='md'
                >
                  Filtrele
                </Button>
              </Box>
              <div className='justify-self-end'>
                <NativeSelect
                  size='sm'
                  classNames={{
                    label: 'hidden',
                  }}
                  label='Sırala'
                  value={order}
                  onChange={({ currentTarget: { value } }) => {
                    setFilterParams({
                      order: value as SortOrderEnums,
                    })
                  }}
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
                      label: 'Gidiş Saati (En erken)',
                      value: SortOrderEnums.hourAsc,
                    },
                    {
                      label: 'Gidiş Saati (En geç)',
                      value: SortOrderEnums.hourDesc,
                    },
                    {
                      label: 'Uçuş Süresi (En kısa süreli)',
                      value: SortOrderEnums.durationAsc,
                    },
                    {
                      label: 'Uçuş Süresi (En uzun süreli)',
                      value: SortOrderEnums.durationDesc,
                    },
                    // { label: 'Varış Saati (Artan)', value: '' },
                    // { label: 'Varış Saati (Azalan)', value: '' },
                  ]}
                />
              </div>
            </div>
            {filteredData?.length ? (
              isDomestic ? (
                isReturnFlightVisible ? (
                  <div>
                    <div className='pb-3'>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <div className='flex gap-1'>
                          <span>
                            {
                              airlineDataObj
                                ?.find(
                                  (airline) =>
                                    airline.Code ===
                                    selectedFlightItemPackages?.flights.at(0)
                                      ?.segments[0].marketingAirline.code
                                )
                                ?.Value.find((val) => val.LangCode === 'tr_TR')
                                ?.Value
                            }
                          </span>
                          <span className='underline'>
                            {dayjs(
                              selectedFlightItemPackages?.flights
                                .at(0)
                                ?.segments.at(0)?.departureTime
                            ).format('ddd DD, HH:mm')}
                          </span>
                        </div>
                        <div>
                          <GoArrowRight />
                        </div>
                        <div>
                          {
                            selectedFlightItemPackages?.flights.at(0)
                              ?.segments[0].origin.code
                          }
                        </div>
                        <div>
                          <IoAirplaneSharp />
                        </div>
                        <div>
                          {
                            selectedFlightItemPackages?.flights
                              .at(0)
                              ?.segments.at(-1)?.destination.code
                          }
                        </div>
                      </div>
                      <div className='pt-2'>
                        <Button
                          className='px-4 py-2'
                          variant='outline'
                          type='button'
                          onClick={resetSelectedFlights}
                        >
                          Uçuşu değiştir
                        </Button>
                      </div>
                    </div>
                    <div>Dönüş uçuşunuzu seçiniz.</div>
                  </div>
                ) : (
                  <div>
                    <span>Gidiş uçuşunuzu seçiniz.</span>
                  </div>
                )
              ) : null
            ) : null}
            <div className='grid gap-3 pt-3 md:gap-5'>
              {!searchResultsQuery.isFetchingNextPage &&
                isDomestic &&
                filteredData?.filter((item) => {
                  const groupId = isReturnFlightVisible ? 1 : 0

                  return item.fareInfo.groupId === groupId
                })?.length === 0 && (
                  <Alert color='red'>
                    <div className='text-center text-lg'>
                      Üzgünüz, filtre seçimlerinize uygun bir uçuş bulunmuyor.
                    </div>
                    <div className='flex justify-center pt-3'>
                      <Button
                        onClick={() => {
                          setFilterParams(null)
                        }}
                      >
                        Tüm Sonuçları göster
                      </Button>
                    </div>
                  </Alert>
                )}

              {!searchResultsQuery.isFetchingNextPage &&
                !isDomestic &&
                filteredData?.length === 0 && (
                  <Alert color='red'>
                    <div className='text-center text-lg'>
                      Üzgünüz, filtre seçimlerinize uygun bir uçuş bulunmuyor.
                    </div>
                    <div className='flex justify-center pt-3'>
                      <Button
                        onClick={() => {
                          setFilterParams(null)
                        }}
                      >
                        Tüm Sonuçları göster
                      </Button>
                    </div>
                  </Alert>
                )}

              {isDomestic &&
                !searchResultsQuery.isFetchingNextPage &&
                filteredData &&
                filteredData?.filter((item) => {
                  const groupId = isReturnFlightVisible ? 1 : 0
                  return item.fareInfo.groupId === groupId
                })?.length > 0 &&
                filteredData?.filter((item) => {
                  const groupId = isReturnFlightVisible ? 1 : 0

                  if (groupId === 1 && isSameDay) {
                    const selectedFlightArrivalTime = dayjs(
                      selectedFlightItemPackages?.flights.at(0)?.segments.at(-1)
                        ?.arrivalTime
                    )

                    return (
                      dayjs(item.segments.at(0)?.departureTime).diff(
                        selectedFlightArrivalTime,
                        'hour'
                      ) > 1
                    )
                  }
                  return true
                }).length === 0 && (
                  <Alert>
                    <div>
                      Seçilen uçuş saatleri uygun değil. Gidiş uçuşunuzu
                      değiştirin.
                    </div>
                    <div className='pt-2'>
                      <Button type='button' onClick={resetSelectedFlights}>
                        Gidiş değiştir
                      </Button>
                    </div>
                  </Alert>
                )}

              {isDomestic ? (
                filteredData
                  ?.filter((item) => {
                    const groupId = isReturnFlightVisible ? 1 : 0
                    return item.fareInfo.groupId === groupId
                  })
                  ?.filter((item) => {
                    const groupId = isReturnFlightVisible ? 1 : 0
                    const { departureDate, returnDate } = searchParams
                    const isSameDay = dayjs(departureDate).isSame(
                      returnDate,
                      'd'
                    )

                    if (groupId === 1 && isSameDay) {
                      const selectedFlightArrivalTime = dayjs(
                        selectedFlightItemPackages?.flights
                          .at(0)
                          ?.segments.at(-1)?.arrivalTime
                      )

                      return (
                        dayjs(item.segments.at(0)?.departureTime).diff(
                          selectedFlightArrivalTime,
                          'hour'
                        ) > 1
                      )
                    }

                    return true
                  })
                  ?.map((result) => {
                    const segmentAirlines = result.segments.map((item) =>
                      item.marketingAirline.code === item.operatingAirline.code
                        ? item.marketingAirline.code
                        : item.operatingAirline.code
                    )

                    const airlineValues: AirlineCode[] | undefined =
                      airlineDataObj?.filter((airlineObj) =>
                        segmentAirlines.find(
                          (segment) => segment === airlineObj.Code
                        )
                      )

                    return (
                      <MemoizedFlightSearchResultsDomestic
                        airlineValues={airlineValues}
                        detailSegments={result.segments}
                        details={result.details}
                        fareInfo={result.fareInfo}
                        onSelect={() => {
                          handleFlightSelect(result)
                        }}
                        key={result.fareInfo.key}
                      />
                    )
                  })
              ) : (
                <Virtuoso
                  useWindowScroll
                  data={filteredData}
                  totalCount={filteredData?.length}
                  itemContent={(_, result) => {
                    const segmentAirlines = result.segments.map((item) =>
                      item.marketingAirline.code === item.operatingAirline.code
                        ? item.marketingAirline.code
                        : item.operatingAirline.code
                    )
                    const airlineValues: AirlineCode[] | undefined =
                      airlineDataObj?.filter((airlineObj) =>
                        segmentAirlines.find(
                          (segment) => segment === airlineObj.Code
                        )
                      )

                    return (
                      <div className='pb-3 md:pb-5'>
                        <MemoizedFlightSearchResultsInternational
                          airlineValues={airlineValues}
                          detailSegments={result.segments}
                          details={result.details}
                          fareInfo={result.fareInfo}
                          onSelect={() => {
                            handleFlightSelect(result)
                          }}
                        />
                      </div>
                    )
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </Container>
      <Drawer
        opened={packageDrawerOpened}
        onClose={() => {
          closePackageDrawer()
          // setSelectedFlightItemPackages(null)
        }}
        position='bottom'
        classNames={{
          title: 'flex-1 text-center font-normal',
        }}
        title={
          <div className='flex justify-center gap-1'>
            <span className='font-semibold'>
              {
                airlineDataObj
                  ?.find(
                    (airline) =>
                      airline.Code ==
                      selectedFlightItemPackages?.flights.at(-1)?.segments.at(0)
                        ?.marketingAirline.code
                  )
                  ?.Value.at(0)?.Value
              }
            </span>
            <span className='font-semibold'>
              {
                selectedFlightItemPackages?.flights?.at(-1)?.segments?.at(0)
                  ?.origin.code
              }
            </span>

            <span>Fiyatlarını İnceleyin</span>
          </div>
        }
      >
        <Container>
          {selectedFlightItemPackages && (
            <DrawerFlight
              data={selectedFlightItemPackages}
              onSelect={(selectedPackage) => {
                handlePackageSelect(selectedPackage)
              }}
            />
          )}
        </Container>
      </Drawer>
      <Modal
        opened={isFlightSubmitting}
        onClose={() => {}}
        withCloseButton={false}
        centered
        radius={'xl'}
      >
        <div className='flex items-center justify-center gap-4 p-7'>
          <div>
            <Loader />
          </div>
          <div className='text-lg'>Lutfen bekleyiniz</div>
        </div>
      </Modal>
    </>
  )
}

export { FlightSearchView }
