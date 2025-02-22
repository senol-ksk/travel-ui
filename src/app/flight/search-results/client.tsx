'use client'
import { useMemo, useRef, useState } from 'react'

import { useSearchResultsQueries } from '../search-queries'
import { FlightSearchResultsOneWayDomestic } from './domestic-flight'
import {
  Button,
  Container,
  Drawer,
  Loader,
  Modal,
  Skeleton,
} from '@mantine/core'
import {
  AirlineCode,
  ClientDataType,
  FlightDetailSegment,
  FlightFareInfo,
} from '../type'
import { useDisclosure, useScrollIntoView } from '@mantine/hooks'

import { MemoizedFlightSearchResultsInternational } from './international-flight'
import { formatCurrency } from '@/libs/util'

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
  const [isNextFlightVisible, setIsNextFlightVisible] = useState(false)
  const [selectedFlightItemPackages, setSelectedFlightItemPackages] = useState<
    SelectedPackageStateProps[] | undefined | null
  >()
  const [
    packageDrawerOpened,
    { open: openPackageDrawer, close: closePackageDrawer },
  ] = useDisclosure(false)
  const searchResults = useMemo(
    () => searchResultsQuery.data,
    [searchResultsQuery.data]
  )

  const isDomestic = useMemo(
    () =>
      searchResults?.every((detailSegmeng) =>
        detailSegmeng?.details.every((detail) => detail.isDomestic)
      ),
    [searchResults]
  )

  // if true this means Round trip, otherwise international or one way flight
  const tripKind = useMemo(
    () =>
      isDomestic &&
      !!searchResults?.filter((results) => results.fareInfo.groupId > 0).length,
    [isDomestic, searchResults]
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

    if (tripKind && !isNextFlightVisible) {
      scrollIntoView()
      setIsNextFlightVisible(true)
    } else {
      await submitFlightData.mutateAsync(selectedFlightKeys.current.toString())
      selectedFlightKeys.current = []
    }
  }
  const selectedFlightKeys = useRef<string[]>([])
  const isFlightSubmitting = submitFlightData.isPending

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
      <Container>
        <div className='grid py-5 md:grid-cols-4 md:gap-3 md:py-9'>
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
          <div className='md:col-span-3' ref={targetRef}>
            {searchResults?.length && `Toplam Sonuç `}

            {searchResults?.length
              ? isDomestic
                ? isNextFlightVisible
                  ? `${searchResults?.filter((item) => item.fareInfo.groupId === 1).length}`
                  : `${searchResults?.filter((item) => item.fareInfo.groupId === 0).length}`
                : `${searchResults?.length}`
              : null}
            <div
              className='grid gap-3'
              style={{
                contentVisibility: 'auto',
              }}
            >
              {isDomestic
                ? !isNextFlightVisible
                  ? searchResults
                      ?.filter((item) => item.fareInfo.groupId === 0)
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
                          <FlightSearchResultsOneWayDomestic
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
                  : searchResults
                      ?.filter((item) => item.fareInfo.groupId === 1)
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
                          <FlightSearchResultsOneWayDomestic
                            airlineValues={airlineValues}
                            detailSegments={result.segments}
                            details={result.details}
                            fareInfo={result.fareInfo}
                            onSelect={() => {
                              // openPackageDrawer()

                              handleFlightSelect(result)
                            }}
                            key={result.fareInfo.key}
                          />
                        )
                      })
                : searchResults?.map((result) => {
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
