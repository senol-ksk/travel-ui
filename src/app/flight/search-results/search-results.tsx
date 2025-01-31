'use client'

import { useSearchResultsQueries } from '../search-queries'
import { FlightSearchResultsOneWayDomestic } from './domestic-flight'
import { Button, Drawer, Skeleton } from '@mantine/core'
import { FlightDetail, FlightDetailSegment, FlightFareInfo } from '../type'
import { useRef, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { formatCurrency } from '@/libs/util'
import clsx from 'clsx'
import { FlightSearchResultsInternational } from './international-flight'
import dayjs from 'dayjs'

type SelectedPackageStateProps = {
  flightDetailSegment: FlightDetailSegment
  flightFareInfo: FlightFareInfo
}

const FlightSearchView = () => {
  const { searchResultsQuery, submitFlightData, searchParams } =
    useSearchResultsQueries()
  const [isNextFlightVisible, setIsNextFlightVisible] = useState(false)
  const [selectedFlightItemPackages, setSelectedFlightItemPackages] = useState<
    SelectedPackageStateProps[] | undefined | null
  >()
  const [
    pacakgeDrawerOpened,
    { open: openPackageDrawer, close: closePackageDrawer },
  ] = useDisclosure(false)
  const selectedFlightKeys = useRef<string[]>([])

  const searchResponseDataPages = searchResultsQuery.data?.pages
    .map((page) => {
      return page.data?.searchResults
    })
    .flat()
    ?.filter(
      (item) =>
        item?.flightFareInfos && Object.keys(item.flightFareInfos).length
    )
  const flightFareInfos = searchResponseDataPages
    ?.map(
      (item) => item?.flightFareInfos && Object.values(item?.flightFareInfos)
    )
    .filter(Boolean)
    .flat()
    .sort((a, b) => (a?.totalPrice?.value ?? 0) - (b?.totalPrice?.value || 0))
  const flightDetails = searchResponseDataPages
    ?.filter(
      (item) => item?.flightDetails && Object.keys(item?.flightDetails).length
    )
    .flatMap(
      (item) => item?.flightDetails && Object.values(item?.flightDetails)
    )
    .filter(Boolean)
  const flightDetailsSorted = flightFareInfos?.flatMap((flightFare) =>
    flightDetails?.filter((flightDetail) =>
      flightFare?.flightDetailKeys.includes(flightDetail?.key ?? '')
    )
  )

  const flightDetailSegments = searchResponseDataPages
    ?.filter(
      (item) =>
        item?.flightDetailSegments &&
        Object.keys(item?.flightDetailSegments).length
    )
    .flatMap(
      (item) =>
        item?.flightDetailSegments && Object.values(item?.flightDetailSegments)
    )
    .filter(Boolean)

  const flightDetailSegmentsSorted = flightDetailsSorted?.flatMap(
    (flightDetail) =>
      flightDetailSegments?.filter((flightDetailSegment) =>
        flightDetail?.flightSegmentKeys.includes(flightDetailSegment?.key ?? '')
      )
  )

  const flightDetailSegmentsWithoutSameFlights = flightDetailSegmentsSorted
    ?.filter(
      (obj, i, objArr) =>
        objArr.findIndex(
          (obj2) => obj2?.freeVolatileData.Seq === obj?.freeVolatileData.Seq
        ) === i
    )
    .filter(Boolean)

  const isDomestic = flightDetails?.every(
    (detailSegmeng) => detailSegmeng?.isDomestic
  )
  const clientData = flightFareInfos

  const handleFlightSelect = async (data: SelectedPackageStateProps[]) => {
    if (data?.length) {
      setSelectedFlightItemPackages(data)
      openPackageDrawer()
    }
  }

  const handlePackageSelect = async (data: SelectedPackageStateProps) => {
    selectedFlightKeys.current.push(data.flightFareInfo.key)

    if (
      flightFareInfos?.some((fareItem) => fareItem?.groupId) &&
      !isNextFlightVisible
    ) {
      setIsNextFlightVisible(true)
    } else {
      await submitFlightData.mutateAsync(selectedFlightKeys.current.join(','))
      selectedFlightKeys.current = []
      setIsNextFlightVisible(false)
    }
    closePackageDrawer()
    setSelectedFlightItemPackages(null)
  }

  return (
    <>
      {searchResultsQuery.isLoading || searchResultsQuery.isFetching ? (
        <div className='relative'>
          <div className='absolute start-0 end-0 top-0 bottom-0 h-[8px]'>
            <Skeleton h={6} />
          </div>
        </div>
      ) : null}
      <div className='grid px-3 py-5 md:grid-cols-4 md:gap-3 md:py-9 lg:container'>
        <div className='md:col-span-1'>
          Filter section
          <div className='rounded-md border border-gray-300 p-3'>
            <div className='pb-3'>Aktarma</div>
            {/* <Stack>
              <Checkbox label='Aktarmasız' />
              <Checkbox label='1 Aktarma' />
            </Stack> */}
          </div>
        </div>
        <div className='md:col-span-3'>
          {isNextFlightVisible ? 'Dönüş seçiniz' : 'gidiş seçiniz'}

          <div className='grid gap-3'>
            {clientData?.map((flightFareInfo) => {
              const details = flightDetails?.filter(
                (item) =>
                  item?.key &&
                  flightFareInfo?.flightDetailKeys.includes(item?.key)
              ) as FlightDetail[]

              const intenationalFlightDetailsData =
                flightFareInfo?.flightDetailKeys.flatMap((detailKey) => {
                  return flightDetails?.filter(
                    (flightDetail) => flightDetail?.key === detailKey
                  )
                }) as FlightDetail[]

              const internationalFlightSegments = intenationalFlightDetailsData
                .flatMap((item3) =>
                  item3.flightSegmentKeys.flatMap((item) =>
                    flightDetailSegmentsWithoutSameFlights?.filter(
                      (item2) => item2?.key === item
                    )
                  )
                )
                .filter(
                  (item, i, itemArr) =>
                    itemArr.findIndex(
                      (item2) => item?.flightNumber === item2?.flightNumber
                    ) === i
                ) as FlightDetailSegment[]

              const internationalFlightSegmentsProps =
                intenationalFlightDetailsData.flatMap((item3) =>
                  item3.flightSegmentKeys.flatMap((item) =>
                    flightDetailSegmentsSorted?.filter(
                      (item2) => item2?.key === item
                    )
                  )
                ) as FlightDetailSegment[]

              if (!flightFareInfo) return null
              const detailSegments = flightDetailSegments
                ?.filter(
                  (obj, i, arr) =>
                    arr.findIndex(
                      (obj2) => obj?.flightNumber === obj2?.flightNumber
                    ) === i
                )
                ?.filter((item) => {
                  return details.filter((detail) => {
                    return item && detail.flightSegmentKeys.includes(item?.key)
                  }).length
                })
              if (!isDomestic && internationalFlightSegments.length > 0) {
                return (
                  <div key={flightFareInfo.key}>
                    <FlightSearchResultsInternational
                      detailSegments={internationalFlightSegmentsProps}
                      details={intenationalFlightDetailsData}
                      fareInfo={flightFareInfo}
                      onSelect={() => {}}
                    />
                  </div>
                )
              }

              if (!detailSegments?.length) return null

              // this will be passed to the component
              const detailSegmentsAll = flightDetailSegments?.filter((item) => {
                return details.filter((detail) => {
                  return item && detail.flightSegmentKeys.includes(item?.key)
                }).length
              }) as FlightDetailSegment[]

              if (isDomestic) {
                if (flightFareInfo.groupId === 0 && !isNextFlightVisible) {
                  // oneway domestic
                  return (
                    <div key={flightFareInfo?.key}>
                      <FlightSearchResultsOneWayDomestic
                        details={details}
                        detailSegments={detailSegmentsAll}
                        fareInfo={flightFareInfo}
                        onSelect={() => {
                          const packages = flightDetailSegments
                            ?.filter(
                              (segmentItem) =>
                                segmentItem?.flightNumber ===
                                detailSegmentsAll.at(0)?.flightNumber
                            )
                            ?.map((detailSegment) => {
                              return {
                                flightDetailSegment: detailSegment,
                                flightFareInfo: flightFareInfos?.find(
                                  (fareItem) =>
                                    flightDetails?.find(
                                      (detailItem) =>
                                        fareItem?.flightDetailKeys.includes(
                                          detailItem?.key ?? ''
                                        ) &&
                                        detailItem?.flightSegmentKeys.includes(
                                          detailSegment?.key ?? ''
                                        )
                                    )
                                ),
                              }
                            }) as SelectedPackageStateProps[]

                          handleFlightSelect(packages)
                        }}
                      />
                    </div>
                  )
                } else if (
                  flightFareInfo.groupId === 1 &&
                  isNextFlightVisible
                ) {
                  return (
                    <div key={flightFareInfo?.key}>
                      <FlightSearchResultsOneWayDomestic
                        details={details}
                        detailSegments={detailSegmentsAll}
                        fareInfo={flightFareInfo}
                        onSelect={() => {
                          const packages = flightDetailSegments
                            ?.filter(
                              (segmentItem) =>
                                segmentItem?.flightNumber ===
                                detailSegmentsAll.at(0)?.flightNumber
                            )
                            ?.map((detailSegment) => {
                              return {
                                flightDetailSegment: detailSegment,
                                flightFareInfo: flightFareInfos?.find(
                                  (fareItem) =>
                                    flightDetails?.find(
                                      (detailItem) =>
                                        fareItem?.flightDetailKeys.includes(
                                          detailItem?.key ?? ''
                                        ) &&
                                        detailItem?.flightSegmentKeys.includes(
                                          detailSegment?.key ?? ''
                                        )
                                    )
                                ),
                              }
                            }) as SelectedPackageStateProps[]

                          handleFlightSelect(packages)
                        }}
                      />
                    </div>
                  )
                }
              }

              return null
            })}
          </div>
        </div>
      </div>
      <Drawer
        opened={pacakgeDrawerOpened}
        onClose={closePackageDrawer}
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
        <div className='grid grid-flow-col grid-rows-3 gap-3 sm:grid-rows-1'>
          {selectedFlightItemPackages?.map((selectedPackage) => {
            return (
              <div
                key={selectedPackage.flightDetailSegment.key}
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
                          selectedPackage.flightDetailSegment.freeVolatileData
                            .BrandName
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
      </Drawer>
    </>
  )
}

export { FlightSearchView }
