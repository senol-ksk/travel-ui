'use client'

import { useSearchResultsQueries } from '../search-queries'
import { FlightSearchResultsOneWayDomestic } from './one-way'
import { Button, Drawer, Skeleton } from '@mantine/core'
import { FlightDetail, FlightDetailSegment, FlightFareInfo } from '../type'
import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { formatCurrency } from '@/libs/util'

type SelectedPackageStateProps = {
  flightDetailSegment: FlightDetailSegment
  flightFareInfo: FlightFareInfo
}

const FlightSearchView = () => {
  const { searchResultsQuery, submitFlightData } = useSearchResultsQueries()
  const [selectedFlightItemPackages, setSelectedFlightItemPackages] = useState<
    SelectedPackageStateProps[] | undefined
  >()
  const [
    pacakgeDrawerOpened,
    { open: openPackageDrawer, close: closePackageDrawer },
  ] = useDisclosure(false)

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

  const handleFlightSelect = async (data: SelectedPackageStateProps[]) => {
    console.log(data)
    if (data?.length) {
      setSelectedFlightItemPackages(data)
      openPackageDrawer()
    }
  }

  const handlePackageSelect = (data: SelectedPackageStateProps) => {
    submitFlightData.mutateAsync(data.flightFareInfo.key)
    closePackageDrawer()
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
        <div className='relative grid gap-3 md:col-span-3'>
          {flightFareInfos?.map(
            (flightFareInfo, fareInfoIndex, fareInfoArray) => {
              const details = flightDetails?.filter(
                (item) =>
                  item?.key &&
                  flightFareInfo?.flightDetailKeys.includes(item?.key)
              ) as FlightDetail[]

              const detailSegments = flightDetailSegments
                ?.filter(
                  (obj1, i, arr) =>
                    arr.findIndex(
                      (obj2) => obj1?.flightNumber === obj2?.flightNumber
                    ) === i
                )
                ?.filter((item) => {
                  return (
                    details.filter((detail) => {
                      return (
                        item?.key &&
                        detail.flightSegmentKeys.includes(item?.key) &&
                        detail.groupId === item.groupId
                      )
                    }).length > 0
                  )
                }) as FlightDetailSegment[]

              const detailsWithPackages = flightDetailSegments
                ?.filter((item) => {
                  return details.filter(
                    (item2) =>
                      item2.freeVolatileData.Seq ===
                        item?.freeVolatileData.Seq &&
                      item2.groupId === item.groupId
                  ).length
                })
                .filter(
                  (obj, i, arr) =>
                    arr.filter(
                      (obj2) => obj2?.flightNumber === obj?.flightNumber
                    ).length
                )
                .map((detailSegmentItem) => ({
                  // details: details,
                  flightDetailSegment: detailSegmentItem,
                  flightFareInfo: flightFareInfos.find(
                    (fareItem) =>
                      flightDetails?.filter(
                        (detailItem) =>
                          fareItem?.flightDetailKeys.includes(
                            detailItem?.key ?? ''
                          ) &&
                          detailItem?.flightSegmentKeys.includes(
                            detailSegmentItem?.key ?? ''
                          )
                      ).length
                  ),
                })) as SelectedPackageStateProps[]

              if (!flightFareInfo) {
                return null
              }

              if (flightFareInfo?.groupId === 0 && detailSegments.length) {
                return (
                  <FlightSearchResultsOneWayDomestic
                    key={flightFareInfo?.key}
                    details={details}
                    detailSegments={detailSegments}
                    fareInfo={flightFareInfo}
                    onSelect={() => {
                      handleFlightSelect(detailsWithPackages)
                    }}
                  />
                )
              }
            }
          )}
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
