'use client'

import { useSearchResultsQueries } from '../search-queries'
import { FlightSearchResultsOneWayDomestic } from './domestic-flight'
import { Button, Drawer, Skeleton } from '@mantine/core'
import { FlightDetail, FlightDetailSegment, FlightFareInfo } from '../type'
import { useMemo, useRef, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'

import { FlightSearchResultsInternational } from './international-flight'
import { formatCurrency } from '@/libs/util'

type SelectedPackageStateProps = {
  flightDetailSegment: FlightDetailSegment
  flightFareInfo: FlightFareInfo
}

const FlightSearchView = () => {
  const { searchResultsQuery, searchSessionTokenQuery, submitFlightData } =
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
  // console.log(selectedFlightItemPackages)
  const searchResponseDataPages = searchResultsQuery.data?.pages
    .map((page) => {
      return page.data?.searchResults
    })
    .flat()
    ?.filter(
      (item) =>
        item?.flightFareInfos && Object.keys(item.flightFareInfos).length
    )
  const flightFareInfosApiResponse = searchResponseDataPages
    ?.flatMap(
      (item) => item?.flightFareInfos && Object.values(item?.flightFareInfos)
    )
    .filter(Boolean)
    .sort((a, b) => (a && b ? a?.totalPrice?.value - b?.totalPrice?.value : 0))

  const flightDetailsApiResponse = searchResponseDataPages
    ?.filter(
      (item) => item?.flightDetails && Object.keys(item?.flightDetails).length
    )
    .flatMap(
      (item) => item?.flightDetails && Object.values(item?.flightDetails)
    )
    .filter(Boolean)

  const flightDetailSegmentsApiResponse = searchResponseDataPages
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

  const isDomestic = useMemo(
    () =>
      flightDetailsApiResponse?.every(
        (detailSegmeng) => detailSegmeng?.isDomestic
      ),
    [flightDetailsApiResponse]
  )

  const clientData = flightFareInfosApiResponse

  const internationalFlightData = useMemo(() => {
    const seqNumbers: string[][] = []
    return flightFareInfosApiResponse
      ?.map((fareInfo, fareInfoIndex, fareInfoArr) => {
        // should list with flightDetailKeys array
        const flightDetails = fareInfo?.flightDetailKeys.flatMap((detailKey) =>
          flightDetailsApiResponse?.filter(
            (flightDetail) => flightDetail?.key === detailKey
          )
        )

        const flightDetailSegment = flightDetails?.flatMap((detail) =>
          detail?.flightSegmentKeys.flatMap((segmentKey) =>
            flightDetailSegmentsApiResponse?.filter(
              (segmentData) => segmentData?.key === segmentKey
            )
          )
        )

        // const flightDetailSegment = flightDetails?.flatMap((flightDetailItem) =>
        //   flightDetailSegmentsApiResponse?.filter((detailSegment) =>
        //     flightDetailItem?.flightSegmentKeys.includes(
        //       detailSegment?.key as string
        //     )
        //   )
        // )

        const pakcages = flightDetailSegment?.map(
          (segment) => segment?.freeVolatileData
        )

        const seqAndFlightNumbers = flightDetailSegment?.flatMap(
          (item) => [item?.freeVolatileData.Seq] as string[]
        )

        if (
          seqNumbers.filter(
            (flightNumber) =>
              JSON.stringify(seqAndFlightNumbers) ===
              JSON.stringify(flightNumber)
          ).length > 0
        )
          return null

        seqNumbers.push(seqAndFlightNumbers as string[])

        console.log(seqNumbers)

        return {
          fareInfo,
          flightDetail: flightDetails,
          flightDetailSegment,
          pakcages,
        }
      })
      .filter(Boolean)
  }, [
    flightDetailSegmentsApiResponse,
    flightDetailsApiResponse,
    flightFareInfosApiResponse,
  ])

  console.log(internationalFlightData)

  const handleFlightSelect = (data: SelectedPackageStateProps[]) => {
    if (data?.length) {
      setSelectedFlightItemPackages(data)
      openPackageDrawer()
    }
  }

  const handlePackageSelect = async (data: SelectedPackageStateProps) => {
    selectedFlightKeys.current.push(data.flightFareInfo.key)

    if (
      flightFareInfosApiResponse?.some((fareItem) => fareItem?.groupId) &&
      !isNextFlightVisible
    ) {
      setIsNextFlightVisible(true)
    } else {
      await submitFlightData.mutateAsync(selectedFlightKeys.current.join(','))
      selectedFlightKeys.current = []
      setIsNextFlightVisible(false)
    }
    closePackageDrawer()
  }

  return (
    <>
      {searchResultsQuery.isLoading ||
      searchResultsQuery.isFetching ||
      searchSessionTokenQuery.isLoading ? (
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
          {internationalFlightData?.length}
          <div
            className='grid gap-3'
            style={{
              contentVisibility: 'auto',
            }}
          >
            {isDomestic
              ? clientData?.map((flightFareInfo) => {
                  if (!flightFareInfo) return null
                  const details = flightDetailsApiResponse?.filter(
                    (item) =>
                      item?.key &&
                      flightFareInfo?.flightDetailKeys.includes(item?.key)
                  ) as FlightDetail[]
                  const detailSegmentsAll =
                    flightDetailSegmentsApiResponse?.filter((item) => {
                      return details.filter((detail) => {
                        return (
                          item && detail.flightSegmentKeys.includes(item?.key)
                        )
                      }).length
                    }) as FlightDetailSegment[]

                  const detailSegments = flightDetailSegmentsApiResponse
                    ?.filter(
                      (obj, i, arr) =>
                        arr.findIndex(
                          (obj2) => obj?.flightNumber === obj2?.flightNumber
                        ) === i
                    )
                    ?.filter((item) => {
                      return details.filter((detail) => {
                        return (
                          item && detail.flightSegmentKeys.includes(item?.key)
                        )
                      }).length
                    })

                  if (!detailSegments?.length) return null

                  if (flightFareInfo.groupId === 0 && !isNextFlightVisible) {
                    // oneway domestic
                    return (
                      <div key={flightFareInfo?.key}>
                        <FlightSearchResultsOneWayDomestic
                          details={details}
                          detailSegments={detailSegmentsAll}
                          fareInfo={flightFareInfo}
                          onSelect={() => {
                            const packages = flightDetailSegmentsApiResponse
                              ?.filter(
                                (segmentItem) =>
                                  segmentItem?.flightNumber ===
                                  detailSegmentsAll.at(0)?.flightNumber
                              )
                              ?.map((detailSegment) => {
                                return {
                                  flightDetailSegment: detailSegment,
                                  flightFareInfo:
                                    flightFareInfosApiResponse?.find(
                                      (fareItem) =>
                                        flightDetailsApiResponse?.find(
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
                            const packages = flightDetailSegmentsApiResponse
                              ?.filter(
                                (segmentItem) =>
                                  segmentItem?.flightNumber ===
                                  detailSegmentsAll.at(0)?.flightNumber
                              )
                              ?.map((detailSegment) => {
                                return {
                                  flightDetailSegment: detailSegment,
                                  flightFareInfo:
                                    flightFareInfosApiResponse?.find(
                                      (fareItem) =>
                                        flightDetailsApiResponse?.find(
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
                })
              : internationalFlightData?.length &&
                internationalFlightData?.map((flightItem) => {
                  const fareInfo = flightItem?.fareInfo as FlightFareInfo
                  const details = flightItem?.flightDetail as FlightDetail[]
                  const flightDetailSegment =
                    flightItem?.flightDetailSegment as FlightDetailSegment[]

                  return (
                    <div key={fareInfo?.key}>
                      <FlightSearchResultsInternational
                        detailSegments={flightDetailSegment}
                        details={details}
                        fareInfo={fareInfo}
                        onSelect={() => {}}
                      />
                    </div>
                  )
                })}
          </div>
        </div>
      </div>
      <Drawer
        opened={pacakgeDrawerOpened}
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
