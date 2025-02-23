'use client'
import { useMemo, useRef, useState } from 'react'
import {
  useDisclosure,
  useMediaQuery,
  useMounted,
  useScrollIntoView,
} from '@mantine/hooks'
import {
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
} from '@mantine/core'

import { CiFilter } from 'react-icons/ci'
// import { GoSortDesc } from 'react-icons/go'

import { useSearchResultsQueries } from '@/app/flight/search-queries'
import {
  AirlineCode,
  ClientDataType,
  FlightDetailSegment,
  FlightFareInfo,
} from '@/app/flight/type'
import { MemoizedFlightSearchResultsDomestic } from '@/app/flight/search-results/domestic-flight'
import { MemoizedFlightSearchResultsInternational } from '@/app/flight/search-results/international-flight'
import { formatCurrency } from '@/libs/util'
import { SortOrderEnums } from '@/modules/flight/searchParams'
import { useFilterActions } from './filter-actions'

type SelectedPackageStateProps = {
  flightDetailSegment: FlightDetailSegment
  flightFareInfo: FlightFareInfo
}

const FlightSearchView = () => {
  const {
    searchResultsQuery,
    searchSessionTokenQuery,
    submitFlightData,
    getAirlineByCodeList,
  } = useSearchResultsQueries()
  const searchQueryData = useMemo(
    () => searchResultsQuery?.data,
    [searchResultsQuery?.data]
  )
  const { filterParams, setFilterParams, filteredData } =
    useFilterActions(searchQueryData)

  const [isReturnFlightVisible, setIsReturnFlightVisible] = useState(false)
  const [selectedFlightItemPackages, setSelectedFlightItemPackages] = useState<
    SelectedPackageStateProps[] | undefined | null
  >()
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
      !!filteredData?.filter((results) => results.fareInfo.groupId > 0).length,
    [isDomestic, filteredData]
  )

  // this is for flight select. first this should be called, then `handlePackageSelect`
  const handleFlightSelect = (flight: ClientDataType) => {
    const packages = flight.package.map((pack) => ({
      flightDetailSegment: pack.segments.at(0),
      flightFareInfo: pack.fareInfo,
    })) as SelectedPackageStateProps[]

    setSelectedFlightItemPackages(packages)

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

    if (tripKind && !isReturnFlightVisible) {
      scrollIntoView()
      setIsReturnFlightVisible(true)
    } else {
      await submitFlightData.mutateAsync(selectedFlightKeys.current.toString())
      selectedFlightKeys.current = []
    }
  }
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

      <Container ref={targetRef} className='pt-5'>
        <div className='grid md:grid-cols-4 md:gap-3'>
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
                      <div className='flex justify-end md:hidden'>
                        <CloseButton
                          size={'lg'}
                          onClick={() => setFilterSectionIsOpened(false)}
                        />
                      </div>
                      <Title order={2} fz={'h4'} mb={rem(20)}>
                        Filtreler
                      </Title>
                      <div>
                        <Title order={6} fz='h5' mb={rem(10)}>
                          Aktarma
                        </Title>
                        <Checkbox.Group
                          onChange={(value) => {
                            setFilterParams({
                              numOfStops: value.length
                                ? value.map(Number)
                                : null,
                            })
                          }}
                          defaultValue={filterParams.numOfStops?.map(String)}
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
                            ) && <Checkbox label='Aktarmasız' value={'0'} />}
                            {searchQueryData?.find((result) =>
                              isDomestic
                                ? result.segments.length === 2
                                : result.segments.filter(
                                    (segment) => segment.groupId === 0
                                  ).length === 2 ||
                                  result.segments.filter(
                                    (segment) => segment.groupId === 1
                                  ).length === 2
                            ) && <Checkbox label='1 Aktarma' value={'1'} />}
                            {searchQueryData?.find((result) =>
                              isDomestic
                                ? result.segments.length > 2
                                : result.segments.filter(
                                    (segment) => segment.groupId === 0
                                  ).length > 2 ||
                                  result.segments.filter(
                                    (segment) => segment.groupId === 1
                                  ).length > 2
                            ) && <Checkbox label='2+ Aktarma' value={'2'} />}
                          </Stack>
                        </Checkbox.Group>
                      </div>
                    </>
                  )}
                </div>
              )}
            </Transition>
          </div>
          <div className='md:col-span-3'>
            <div className='grid grid-cols-2 pb-3'>
              <Box className='justify-self-start'>
                <Button
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
                  maw={150}
                  classNames={{
                    label: 'hidden',
                  }}
                  label='Sırala'
                  defaultValue={filterParams.order}
                  // leftSection={<GoSortDesc size={20} />}
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
                    <span>Dönüş uçuşunuzu seçiniz.</span>
                  </div>
                ) : (
                  <div>
                    <span>Gidiş uçuşunuzu seçiniz.</span>
                  </div>
                )
              ) : null
            ) : null}
            <div
              className='grid gap-3 pt-3 md:gap-5'
              style={{
                contentVisibility: 'auto',
              }}
            >
              {isDomestic
                ? filteredData
                    ?.filter((item) => {
                      const groupId = isReturnFlightVisible ? 1 : 0
                      return item.fareInfo.groupId === groupId
                    })
                    ?.map((result) => {
                      const segmentAirlines = result.segments.map((item) =>
                        item.marketingAirline.code ===
                        item.operatingAirline.code
                          ? item.marketingAirline.code
                          : item.operatingAirline.code
                      )

                      const airlineValues: AirlineCode[] | undefined =
                        getAirlineByCodeList?.data?.filter((airlineObj) =>
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
                : filteredData?.map((result) => {
                    const segmentAirlines = result.segments.map((item) =>
                      item.marketingAirline.code === item.operatingAirline.code
                        ? item.marketingAirline.code
                        : item.operatingAirline.code
                    )

                    const airlineValues: AirlineCode[] | undefined =
                      getAirlineByCodeList?.data?.filter((airlineObj) =>
                        segmentAirlines.find(
                          (segment) => segment === airlineObj.Code
                        )
                      )

                    return (
                      <MemoizedFlightSearchResultsInternational
                        airlineValues={airlineValues}
                        key={result.fareInfo.key}
                        detailSegments={result.segments}
                        details={result.details}
                        fareInfo={result.fareInfo}
                        onSelect={() => {
                          handleFlightSelect(result)
                        }}
                      />
                    )
                  })}
            </div>
          </div>
        </div>
      </Container>
      <Drawer
        opened={packageDrawerOpened}
        onClose={() => {
          closePackageDrawer()
          setSelectedFlightItemPackages(null)
        }}
        position='bottom'
        title={
          <div>
            <span className='font-semibold'>
              {
                selectedFlightItemPackages?.at(0)?.flightDetailSegment.origin
                  .code
              }
            </span>{' '}
            Fiyatlarini İnceleyin
          </div>
        }
      >
        <Container>
          <div className='grid grid-flow-col grid-rows-3 gap-3 sm:grid-rows-1'>
            {selectedFlightItemPackages &&
              selectedFlightItemPackages.length &&
              selectedFlightItemPackages?.map((selectedPackage) => {
                return (
                  <div
                    key={selectedPackage.flightFareInfo.key}
                    className='flex flex-col rounded border p-2 md:p-3'
                  >
                    <div className='flex h-full flex-col gap-3'>
                      <div className='text-lg font-semibold'>
                        {formatCurrency(
                          selectedPackage.flightFareInfo.totalPrice.value
                        )}
                      </div>
                      <div>
                        <div className='pb-2 font-semibold capitalize'>
                          {(() => {
                            switch (
                              selectedPackage.flightDetailSegment
                                .freeVolatileData.BrandName
                            ) {
                              case 'SUPER_ECO':
                                return 'Light'
                              case 'ECO':
                                return 'Süper Eko'
                              case 'ADVANTAGE':
                                return 'Avantaj'
                              case 'EXTRA':
                                return 'Comfort Flex'
                              default:
                                return selectedPackage.flightDetailSegment
                                  .freeVolatileData.BrandName
                            }
                          })()}
                        </div>
                      </div>
                      <div className='mt-auto'>
                        <Button
                          type='button'
                          onClick={() => {
                            handlePackageSelect(selectedPackage)
                          }}
                        >
                          Seç
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
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
