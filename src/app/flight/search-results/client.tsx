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
  RemoveScroll,
  Skeleton,
  Stack,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { useQueryStates } from 'nuqs'
import { CiFilter } from 'react-icons/ci'
import { PiSuitcaseRolling } from 'react-icons/pi'

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

import {
  filterParsers,
  flightSearchParams,
  SortOrderEnums,
} from '@/modules/flight/searchParams'
import { useFilterActions } from './filter-actions'
import { HourRangeSlider } from './components/hour-range'
import { DrawerFlight } from './components/drawer-flight'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import 'dayjs/locale/tr'
import { Virtuoso } from 'react-virtuoso'
import { SearchPrevNextButtons } from './components/search-prev-next-buttons'
import { AirlineLogo } from '@/components/airline-logo'
import { MdOutlineAirplanemodeActive } from 'react-icons/md'
import { formatCurrency } from '@/libs/util'
import { LuCircleCheckBig } from 'react-icons/lu'
import { FaArrowRightLong } from 'react-icons/fa6'
import { Select } from '@mantine/core'
import { FaCheck } from 'react-icons/fa'
import { IoIosClose } from 'react-icons/io'
import { FlightDetailsSearch } from '../../flight/search-results/components/flight-detail'
import { AirportCode } from '@/app/flight/type'
type SelectedPackageStateProps = {
  flightDetailSegment: FlightDetailSegment
  flightFareInfo: FlightFareInfo
  flightDetails: FlightDetail
}

dayjs.locale('tr')
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

const FlightSearchView = () => {
  const [detailsOpened, { toggle: toggleDetails }] = useDisclosure(false)

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
  const [searchParamsFlight, setSearchParamsFlight] =
    useQueryStates(flightSearchParams)

  const handlePrevDay = () => {
    // default go and return dates on searchParams
    const { departureDate, returnDate } = searchParams

    const today = dayjs().startOf('day') // compare with today

    if (isReturnFlightVisible && returnDate) {
      //  only returnDate can changable
      const currentReturnDateDayjs = dayjs(returnDate)
      const potantielPrevReturnDateDayjs = currentReturnDateDayjs.subtract(
        1,
        'day'
      )

      if (potantielPrevReturnDateDayjs.isBefore(today)) {
        return
      }

      // return date cannot be same or before from go date
      if (
        departureDate &&
        potantielPrevReturnDateDayjs.isSameOrBefore(dayjs(departureDate), 'day')
      ) {
        return
      }

      // all of everything is okey... just return date can update.
      setSearchParamsFlight({
        returnDate: potantielPrevReturnDateDayjs.toDate(),
      })
    } else if (departureDate) {
      const currentDepartureDateDayjs = dayjs(departureDate)
      const potentialPrevDepartureDateDayjs =
        currentDepartureDateDayjs.subtract(1, 'day')

      // go date before then today ?
      if (potentialPrevDepartureDateDayjs.isBefore(today)) {
        return
      }
      const DepartureDate = potentialPrevDepartureDateDayjs.toDate()
      const updates: { departureDate: Date; returnDate?: Date } = {
        departureDate: DepartureDate,
      }

      // if go flight and return flight are after or before the return date ,
      // return date will be updated to one day after go date
      if (
        returnDate &&
        potentialPrevDepartureDateDayjs.isSameOrAfter(dayjs(returnDate), 'day')
      ) {
        updates.returnDate = potentialPrevDepartureDateDayjs
          .add(1, 'day')
          .toDate()
      }
      setSearchParamsFlight(updates)
    }
  }
  const handlePrevReturnDay = () => {
    const { departureDate, returnDate } = searchParams
    if (!returnDate) return
    const today = dayjs().startOf('day')
    const newReturnDate = dayjs(returnDate).subtract(1, 'day')
    // Yeni dönüş tarihi bugünün öncesi olsmaz
    if (newReturnDate.isBefore(today)) return
    // Yeni dönüş tarihi, gidiş tarihinden önce olamaz!!!
    if (
      departureDate &&
      newReturnDate.isSameOrBefore(dayjs(departureDate), 'day')
    ) {
      return
    }
    setSearchParamsFlight({ returnDate: newReturnDate.toDate() })
  }

  const handleNextDay = () => {
    const { departureDate, returnDate } = searchParams

    if (isReturnFlightVisible && returnDate) {
      const nextReturnDate = dayjs(returnDate).add(1, 'day').toDate()
      setSearchParamsFlight({ returnDate: nextReturnDate })
    } else if (departureDate) {
      const nextDepartureDateAsDayjs = dayjs(departureDate).add(1, 'day')

      const DepartureDate = nextDepartureDateAsDayjs.toDate()
      const updates: { departureDate: Date; returnDate?: Date } = {
        departureDate: DepartureDate,
      }

      // if go flight and return flight are after or before the return date ,
      // return date will be updated to one day after go date
      if (
        returnDate &&
        nextDepartureDateAsDayjs.isSameOrAfter(dayjs(returnDate), 'day')
      ) {
        updates.returnDate = nextDepartureDateAsDayjs.add(1, 'day').toDate()
      }
      setSearchParamsFlight(updates)
    }
  }

  const handleNextReturnDay = () => {
    const { returnDate } = searchParams
    if (!returnDate) return
    const newReturnDate = dayjs(returnDate).add(1, 'day')
    setSearchParamsFlight({ returnDate: newReturnDate.toDate() })
  }

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
  const departure = dayjs(
    selectedFlightItemPackages?.flights.at(0)?.segments[0]?.departureTime
  )

  const arrival = dayjs(
    selectedFlightItemPackages?.flights.at(0)?.segments.at(-1)?.arrivalTime
  )

  const duration = dayjs.duration(arrival.diff(departure))

  const hours = duration.hours()
  const minutes = duration.minutes()

  const isDomestic =
    searchParamsFlight.origin?.isDomestic &&
    searchParamsFlight.destination?.isDomestic

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
    } else {
      if (tripKind && selectedFlightItemPackages?.flights.length === 1) {
        scrollIntoView()
        setIsReturnFlightVisible(true)
      } else {
        await submitFlightData.mutateAsync(
          selectedFlightKeys.current.toString()
        )
        selectedFlightKeys.current = []
      }
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
  }, [resetSelectedFlights])

  const selectedFlightKeys = useRef<string[]>([])
  const isFlightSubmitting = submitFlightData.isPending

  const [filterSectionIsOpened, setFilterSectionIsOpened] = useState(false)
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')
  const mounted = useMounted()
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
      value: SortOrderEnums.hourAsc,
    },
    {
      label: 'En Hızlı',
      value: SortOrderEnums.durationAsc,
    },
  ]

  if (!mounted)
    return (
      <Container className='grid gap-3 py-4'>
        <Skeleton h={30} radius='sm' />
        <Skeleton h={20} radius='sm' w={'90%'} />
        <Skeleton h={16} radius='sm' w={'95%'} />
      </Container>
    )

  const totalCount = searchQueryData?.length ?? 0
  const storedData = localStorage.getItem('flight-search-engine')
  const parsedData = storedData ? JSON.parse(storedData) : null
  const destinationName =
    parsedData?.Destination?.Name.split(' ')[0].split(',') ?? ''
  const originName = parsedData?.Origin?.Name?.split(' ')[0].split(',') ?? ''

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
        <div className='grid md:grid-cols-8 md:gap-5'>
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
                    className='fixed start-0 end-0 top-0 bottom-0 z-50 overflow-y-auto bg-white md:static'
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
                          <Title className='text-xl font-medium' mb={rem(10)}>
                            Filtreler
                          </Title>
                          <div>
                            <UnstyledButton
                              className='font-semibold text-blue-500'
                              fz='xs'
                              hidden={
                                !Object.values(filterParams).find(Boolean)
                              }
                              onClick={() => {
                                setFilterParams(null)
                              }}
                            >
                              Temizle
                            </UnstyledButton>
                          </div>
                        </div>
                        <Accordion
                          defaultValue={[
                            'numOfStops',
                            'airlines',
                            'airports',
                            'departureHours',
                          ]}
                          multiple
                          classNames={{
                            root: 'filter-accordion',
                            control: 'text-md font-medium',
                          }}
                        >
                          <Skeleton
                            className='flex md:hidden'
                            visible={
                              searchResultsQuery.isLoading ||
                              searchResultsQuery.isFetching ||
                              searchResultsQuery.isFetchingNextPage ||
                              searchSessionTokenQuery.isLoading
                            }
                          >
                            <div className='justify-self-end font-medium'>
                              <Select
                                checkIconPosition='left'
                                leftSection={<FaCheck />}
                                size='sm'
                                value={order}
                                onChange={(value) =>
                                  setFilterParams({
                                    order: value as SortOrderEnums,
                                  })
                                }
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
                                    value: SortOrderEnums.hourAsc,
                                  },
                                  {
                                    label: 'En Geç',
                                    value: SortOrderEnums.hourDesc,
                                  },
                                  {
                                    label: 'En Hızlı',
                                    value: SortOrderEnums.durationAsc,
                                  },
                                  {
                                    label: 'En Uuzn',
                                    value: SortOrderEnums.durationDesc,
                                  },
                                  // { label: 'Varış Saati (Artan)', value: '' },
                                  // { label: 'Varış Saati (Azalan)', value: '' },
                                ]}
                              />
                            </div>
                          </Skeleton>
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
                                <Stack gap={6} className='text-lg'>
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
                          <Accordion.Item value='departureHours'>
                            <Accordion.Control>
                              Kalkış saatleri
                            </Accordion.Control>
                            <Accordion.Panel className='px-3'>
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
                                                airlineValue.LangCode ===
                                                'tr_TR'
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
                                  filterParams?.airports?.length
                                    ? filterParams.airports?.map(String)
                                    : []
                                }
                              >
                                <Stack gap={6}>
                                  {getAirportsByCodeList.data?.map(
                                    (airports) => {
                                      return (
                                        <div key={airports.Code}>
                                          <Checkbox
                                            name='airports'
                                            label={
                                              airports.Value.find(
                                                (airportValue) =>
                                                  airportValue.LangCode ===
                                                  'tr_TR'
                                              )?.Value
                                            }
                                            value={airports.Code}
                                          />
                                        </div>
                                      )
                                    }
                                  )}
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

          <div className='md:col-span-6'>
            <div>
              <>
                {filteredData?.length ? (
                  isReturnFlightVisible ? (
                    <div>
                      <div className='not-only: @container mb-4 grid items-center rounded-lg border-2 border-blue-500 shadow'>
                        <div className='flex items-center justify-between rounded-t-lg bg-blue-100 py-3 md:p-2'>
                          <div className='flex items-center justify-between'>
                            <div className='text-md flex items-center font-bold'>
                              <LuCircleCheckBig
                                size={24}
                                className='text-blue-800'
                              />
                              <span className='md:text-md ps-2 text-sm'>
                                Gidiş Uçuşunuz
                              </span>
                              <FaArrowRightLong className='ml-2' /> {''}
                            </div>

                            <div className='flex items-center gap-1 ps-2 text-xs font-bold md:justify-end md:text-sm'>
                              <div>
                                {
                                  selectedFlightItemPackages?.flights.at(0)
                                    ?.segments[0].origin.code
                                }
                              </div>{' '}
                              <div>-</div>
                              <div>
                                {
                                  selectedFlightItemPackages?.flights
                                    .at(0)
                                    ?.segments.at(-1)?.destination.code
                                }
                                -
                              </div>
                              <div>
                                {dayjs(
                                  selectedFlightItemPackages?.flights
                                    .at(0)
                                    ?.segments.at(0)?.departureTime
                                ).format(' DD MMM, ddd')}
                              </div>
                            </div>
                          </div>
                          <div>
                            <Button
                              className='text-blue hidden border border-gray-300 bg-white px-7 py-2 text-sm font-normal md:flex'
                              size='md'
                              radius='md'
                              variant='default'
                              type='button'
                              onClick={resetSelectedFlights}
                            >
                              Değiştir
                            </Button>
                          </div>
                        </div>
                        <div>
                          <div className='grid items-center gap-6 md:grid-cols-6'>
                            <div className='relative col-span-5 grid'>
                              <div className='start-0-0 absolute top-1/2 mt-5 h-8 w-1 -translate-y-1/2 rounded-tr-md rounded-br-md bg-blue-800 md:mt-0' />
                              <div className='grid md:grid-cols-3'>
                                <div className='col-span-1 mt-2 flex items-center gap-1 px-3 text-sm md:mt-0'>
                                  <div>
                                    <AirlineLogo
                                      airlineCode={
                                        selectedFlightItemPackages?.flights
                                          .at(0)
                                          ?.segments[0]?.marketingAirline.code?.toLowerCase() ??
                                        ''
                                      }
                                    />
                                  </div>
                                  <div className='flex items-center justify-between gap-2 md:grid'>
                                    <div className='text-sm'>
                                      {
                                        airlineDataObj
                                          ?.find(
                                            (airline) =>
                                              airline.Code ===
                                              selectedFlightItemPackages?.flights.at(
                                                0
                                              )?.segments[0]?.marketingAirline
                                                .code
                                          )
                                          ?.Value.find(
                                            (val) => val.LangCode === 'tr_TR'
                                          )?.Value
                                      }
                                    </div>
                                    <div className='flex items-center gap-1 text-sm md:px-0'>
                                      <PiSuitcaseRolling />
                                      8kg El Bagajı
                                    </div>
                                  </div>
                                </div>
                                <div className='relative col-span-2 mt-5 grid'>
                                  <div className='flex items-center justify-between px-3 text-sm'>
                                    <div className='text-center'>
                                      <div className='text-lg font-medium'>
                                        {dayjs(
                                          selectedFlightItemPackages?.flights.at(
                                            0
                                          )?.segments[0]?.departureTime
                                        ).format('HH:mm')}
                                      </div>
                                      <div className='text-sm'>
                                        {
                                          selectedFlightItemPackages?.flights.at(
                                            0
                                          )?.segments[0].origin.code
                                        }
                                      </div>
                                    </div>

                                    <div className='relative mx-4 grow'>
                                      <Box
                                        bg='blue'
                                        h={2}
                                        className='rounded'
                                      />
                                      <div
                                        className='absolute end-0 -translate-y-1/2 rotate-90 text-blue-800'
                                        style={{ top: 1, paddingBottom: 1 }}
                                      >
                                        <MdOutlineAirplanemodeActive
                                          size={18}
                                        />
                                      </div>
                                    </div>

                                    <div className='text-center'>
                                      <div className='text-lg font-medium'>
                                        {dayjs(
                                          selectedFlightItemPackages?.flights
                                            .at(0)
                                            ?.segments.at(-1)?.arrivalTime
                                        ).format('HH:mm')}
                                      </div>
                                      <div className='text-sm'>
                                        {
                                          selectedFlightItemPackages?.flights
                                            .at(0)
                                            ?.segments.at(-1)?.destination.code
                                        }
                                      </div>
                                    </div>
                                  </div>

                                  <div className='md:text-md absolute start-0 end-0 top-0 flex items-center justify-center gap-1 text-xs text-black'>
                                    <div>
                                      {hours}s {minutes}d
                                    </div>
                                    <div>
                                      {(() => {
                                        const numSegments =
                                          selectedFlightItemPackages?.flights.at(
                                            0
                                          )?.segments.length ?? 0
                                        const hasTransferStop = numSegments > 1
                                        return hasTransferStop ? (
                                          <span className='text-red-600'>
                                            {numSegments - 1} Aktarma
                                          </span>
                                        ) : (
                                          <span className='md-text-md text-sm text-green-800'>
                                            Aktarmasız
                                          </span>
                                        )
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-span-1 hidden items-center justify-center text-center md:grid md:pt-6'>
                              <div className='text-xl font-semibold'>
                                {(() => {
                                  const packagePrice =
                                    selectedFlightItemPackages?.flights?.[0]?.package.find(
                                      (pckK) =>
                                        pckK.fareInfo.key ===
                                        selectedFlightKeys.current?.[0]
                                    )?.fareInfo.totalPrice.value
                                  return packagePrice !== undefined
                                    ? formatCurrency(packagePrice)
                                    : ''
                                })()}
                              </div>
                              <div className=''>
                                <Button
                                  className='border-0 bg-white px-0 text-sm font-normal text-blue-500'
                                  onClick={toggleDetails}
                                >
                                  {detailsOpened ? (
                                    <>
                                      Detayı Kapat <IoIosClose size={25} />
                                    </>
                                  ) : (
                                    'Uçuş Detayları'
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                          <hr className='mt-2 flex md:hidden' />
                          <div>
                            <div className='col-span-1 my-2 flex items-center justify-between gap-3 px-3 text-center md:hidden'>
                              <div className='text-md font-semibold'>
                                {(() => {
                                  const packagePrice =
                                    selectedFlightItemPackages?.flights?.[0]?.package.find(
                                      (pckK) =>
                                        pckK.fareInfo.key ===
                                        selectedFlightKeys.current?.[0]
                                    )?.fareInfo.totalPrice.value
                                  return packagePrice !== undefined
                                    ? formatCurrency(packagePrice)
                                    : ''
                                })()}
                              </div>
                              <div>
                                <Button
                                  className='border-0 bg-white px-0 text-xs font-normal text-blue-500'
                                  onClick={toggleDetails}
                                >
                                  {detailsOpened ? (
                                    <>
                                      Detayı Kapat <IoIosClose size={25} />
                                    </>
                                  ) : (
                                    'Uçuş Detayları'
                                  )}
                                </Button>
                              </div>
                              <div>
                                <Button
                                  className='text-blue border border-gray-300 bg-white px-5 py-2 text-sm font-normal'
                                  size='xs'
                                  radius='md'
                                  variant='default'
                                  type='button'
                                  onClick={resetSelectedFlights}
                                >
                                  Değiştir
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='rounded-lg bg-gray-100 text-start md:mr-5 md:mb-5 md:ml-5'>
                          {selectedFlightItemPackages?.flights[0].details &&
                            selectedFlightItemPackages?.flights[0].segments && (
                              <FlightDetailsSearch
                                details={
                                  selectedFlightItemPackages?.flights[0].details
                                }
                                detailSegments={
                                  selectedFlightItemPackages?.flights[0]
                                    .segments
                                }
                                airlineValues={airlineDataObj}
                                airportValues={getAirportsByCodeList.data}
                                opened={detailsOpened}
                                isDomestic={true}
                              />
                            )}
                        </div>
                      </div>
                      <div className='flex items-center justify-between py-3'>
                        <div className='text-xl font-medium md:text-2xl'>
                          Dönüş Uçuşunuzu Seçiniz
                        </div>
                        <div>
                          <div className='flex md:mb-5 md:hidden md:justify-between'>
                            <div className='ms-auto flex items-center gap-1'>
                              <Skeleton
                                visible={
                                  searchResultsQuery.isLoading ||
                                  searchResultsQuery.isFetching ||
                                  searchResultsQuery.isFetchingNextPage ||
                                  searchSessionTokenQuery.isLoading
                                }
                              >
                                <Box className='justify-self-start'>
                                  <Button
                                    onClick={() =>
                                      setFilterSectionIsOpened((prev) => !prev)
                                    }
                                    size='sm'
                                    color='black'
                                    className='flex border-gray-400 px-3 font-medium text-black md:mx-1 md:hidden'
                                    variant='outline'
                                  >
                                    Filtrele
                                  </Button>
                                </Box>
                              </Skeleton>
                            </div>
                          </div>

                          <Skeleton
                            className='hidden md:flex'
                            visible={
                              searchResultsQuery.isLoading ||
                              searchResultsQuery.isFetching ||
                              searchResultsQuery.isFetchingNextPage ||
                              searchSessionTokenQuery.isLoading
                            }
                          >
                            <div className='justify-self-end'>
                              <Select
                                checkIconPosition='left'
                                leftSection={<FaCheck />}
                                size='sm'
                                classNames={{
                                  label: 'hidden',
                                }}
                                label='Sırala'
                                value={order}
                                onChange={(value) => {
                                  setFilterParams({
                                    order: value as SortOrderEnums,
                                  })
                                }}
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
                                    value: SortOrderEnums.hourAsc,
                                  },
                                  {
                                    label: 'En Geç',
                                    value: SortOrderEnums.hourDesc,
                                  },
                                  {
                                    label: 'En Hızlı',
                                    value: SortOrderEnums.durationAsc,
                                  },
                                  {
                                    label: 'En Uuzn',
                                    value: SortOrderEnums.durationDesc,
                                  },
                                ]}
                              />
                            </div>
                          </Skeleton>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Skeleton
                      className='flex items-center justify-between py-3'
                      visible={
                        searchResultsQuery.isLoading ||
                        searchResultsQuery.isFetching ||
                        searchResultsQuery.isFetchingNextPage ||
                        searchSessionTokenQuery.isLoading
                      }
                    >
                      <span className='text-xl font-medium md:text-2xl'>
                        {!isReturnFlightVisible && filteredData?.length
                          ? 'Gidiş uçuşunuzu seçiniz'
                          : isReturnFlightVisible && filteredData?.length
                            ? 'Dönüş uçuşunuzu seçiniz.'
                            : ''}
                      </span>
                      <div>
                        <Skeleton
                          className='flex md:hidden'
                          visible={
                            searchResultsQuery.isLoading ||
                            searchResultsQuery.isFetching ||
                            searchResultsQuery.isFetchingNextPage ||
                            searchSessionTokenQuery.isLoading
                          }
                        >
                          <Box className='justify-self-start'>
                            <Button
                              onClick={() =>
                                setFilterSectionIsOpened((prev) => !prev)
                              }
                              size='sm'
                              color='black'
                              className='flex border-gray-400 px-3 font-medium text-black md:mx-1 md:hidden'
                              variant='outline'
                            >
                              Filtrele
                            </Button>
                          </Box>
                        </Skeleton>
                        <Skeleton
                          className='hidden md:flex'
                          visible={
                            searchResultsQuery.isLoading ||
                            searchResultsQuery.isFetching ||
                            searchResultsQuery.isFetchingNextPage ||
                            searchSessionTokenQuery.isLoading
                          }
                        >
                          <div className=''>
                            <Select
                              leftSection={<FaCheck />}
                              size='md'
                              checkIconPosition='left'
                              value={order}
                              onChange={(value) =>
                                setFilterParams({
                                  order: value as SortOrderEnums,
                                })
                              }
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
                                  value: SortOrderEnums.hourAsc,
                                },
                                {
                                  label: 'En Geç',
                                  value: SortOrderEnums.hourDesc,
                                },
                                {
                                  label: 'En Hızlı',
                                  value: SortOrderEnums.durationAsc,
                                },
                                {
                                  label: 'En Uzun',
                                  value: SortOrderEnums.durationDesc,
                                },
                              ]}
                            />
                          </div>
                        </Skeleton>
                      </div>
                    </Skeleton>
                  )
                ) : null}
              </>
            </div>
            <SearchPrevNextButtons
              searchSessionTokenQuery={searchSessionTokenQuery}
              searchResultsQuery={searchResultsQuery}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
              onPrevReturnDay={handlePrevReturnDay}
              onNextReturnDay={handleNextReturnDay}
              departureDate={searchParams.departureDate ?? ''}
              returnDate={searchParams.returnDate ?? ''}
              isDomestic={isDomestic ?? false}
              isReturnFlightVisible={isReturnFlightVisible}
            />
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
                        airportValues={getAirportsByCodeList.data}
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
                          airportValues={getAirportsByCodeList.data}
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
        onClose={closePackageDrawer}
        position='bottom'
        classNames={{
          title: 'flex-1 text-center font-normal',
        }}
        title={
          <div className='flex justify-center gap-1'>
            <span className='md:text-md text-sm font-semibold'>
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
              {''}-{''}
            </span>
            <span className='md:text-md text-sm font-semibold'>
              {
                selectedFlightItemPackages?.flights?.at(-1)?.segments?.at(0)
                  ?.origin.code
              }
              {''}-{''}
            </span>

            <span className='md:text-md text-sm'>Fiyatlarını İnceleyin</span>
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
          <div className='text-lg'>Lütfen bekleyiniz</div>
        </div>
      </Modal>
    </>
  )
}

export { FlightSearchView }
