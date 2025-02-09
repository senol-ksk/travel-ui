'use client'

import { useSearchResultsQueries } from '../search-queries'
import { FlightSearchResultsOneWayDomestic } from './domestic-flight'
import { Button, Drawer, Skeleton } from '@mantine/core'
import {
  ClientDataType,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
} from '../type'
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

  // if true this means Round trip, otherwise intenational or one way flight
  const tripKind = useMemo(
    () =>
      isDomestic &&
      !!searchResults?.filter((results) => results.fareInfo.groupId > 0).length,
    [isDomestic, searchResults]
  )

  const handleFlightSelect = (flight: ClientDataType) => {
    console.log(flight)
    const packages = flight.package
      .map((freevolite) => ({
        flightDetailSegment: freevolite.segments.at(0),
        flightFareInfo: freevolite.fareInfo,
      }))
      .filter(
        (item) => item.flightDetailSegment?.groupId === 0
      ) as SelectedPackageStateProps[]

    setSelectedFlightItemPackages(packages)

    openPackageDrawer()
  }
  const selectedFlightKeys = useRef<string[]>([])

  const handlePackageSelect = async (data: SelectedPackageStateProps) => {
    console.log(tripKind)
    selectedFlightKeys.current.push(data.flightFareInfo.key)

    // flightFareInfosApiResponse?.some((fareItem) => fareItem?.groupId) &&
    if (!tripKind) {
      await submitFlightData.mutateAsync(data.flightFareInfo.key)
    }

    if (tripKind && !isNextFlightVisible) {
      setIsNextFlightVisible(true)
    } else {
      await submitFlightData.mutateAsync(selectedFlightKeys.current.join(','))
      selectedFlightKeys.current = []
      // setIsNextFlightVisible(false)
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
          {isDomestic
            ? isNextFlightVisible
              ? 'Dönüş seçiniz'
              : 'gidiş seçiniz'
            : null}
          {searchResults && searchResults.length > 0 && searchResults?.length}
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
                      return (
                        <FlightSearchResultsOneWayDomestic
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
                : searchResults
                    ?.filter((item) => item.fareInfo.groupId === 1)
                    ?.map((result) => {
                      return (
                        <FlightSearchResultsOneWayDomestic
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
              : searchResults?.map((item) => (
                  <FlightSearchResultsInternational
                    key={item.fareInfo.key}
                    detailSegments={item.segments}
                    details={item.details}
                    fareInfo={item.fareInfo}
                    onSelect={() => {
                      handleFlightSelect(item)
                    }}
                  />
                ))}
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
