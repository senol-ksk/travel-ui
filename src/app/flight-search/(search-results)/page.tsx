'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import clsx from 'clsx'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Drawer, List } from '@mantine/core'
import {
  readLocalStorageValue,
  useDisclosure,
  useWindowScroll,
  useTimeout,
} from '@mantine/hooks'
import { IoIosCheckmarkCircle } from 'react-icons/io'

import type {
  ClientFlightDataModel,
  FlightApiRequestParams,
} from '@/modules/flight/types'

import { flightApiRequest } from '@/modules/flight/search.request'
import {
  collectFlightData,
  generateFlightData,
} from '@/modules/flight/search-results/generate'

import { SearchResultCard } from '@/app/flight-search/search-result'
import { Loader } from '@mantine/core'
import { formatCurrency } from '@/libs/util'

// let ReceivedProviders: string[] = []

const FlightSearch = () => {
  const queryClient = useQueryClient()
  const [, scrollTo] = useWindowScroll()
  const router = useRouter()
  const [
    pacakgeDrawerOpened,
    { open: openPackageDrawer, close: closePackageDrawer },
  ] = useDisclosure(false)

  const [roundTicketsIsVisible, setRoundTicketsIsVisible] = useState(false)
  const [selectedFlightData, setSelectedFlightData] = useState<
    ClientFlightDataModel | ClientFlightDataModel[] | null | undefined
  >(null)

  const [selectedFlightPackage, setSelectedFlightPackage] = useState<
    ClientFlightDataModel[] | null | undefined
  >()

  const flightParams = readLocalStorageValue<FlightApiRequestParams>({
    key: 'flight',
  })

  // const createSearch = useQuery(['create-searcg', ])

  const flightService = useQuery({
    queryKey: ['flight-results', flightParams],
    queryFn: async () => {
      const getFlightResults = await flightApiRequest()

      if (queryClient.getQueryData(['flighClientData'])) {
        queryClient.invalidateQueries({
          queryKey: ['flighClientData'],
          exact: true,
        })
      }

      if (getFlightResults.data.searchResults.length > 0) {
        collectFlightData(getFlightResults.data.searchResults)
      }

      return getFlightResults.data
    },
    enabled(query) {
      return !query.state.data || query.state.data.hasMoreResponse
    },
    refetchInterval: 1000,
    retryOnMount: false,
  })

  const { data: flightClientData, isFetching: isClientDataFetching } = useQuery(
    {
      queryKey: ['flighClientData'],
      queryFn: async () => {
        const flightData = await generateFlightData()
        // ReceivedProviders = []

        return flightData
      },
      enabled:
        !!flightService?.data &&
        flightService.data.status &&
        !flightService.data.hasMoreResponse,
      refetchOnMount: false,
    }
  )

  const seqKeys_origin: string[] = []
  const seqKeys_destination: string[] = []

  useEffect(() => {
    if (
      (selectedFlightPackage && selectedFlightPackage?.length > 1) ||
      (selectedFlightPackage && flightParams.ActiveTripKind === 1) ||
      (selectedFlightPackage &&
        !selectedFlightPackage.at(0)?.flightDetails.at(0)?.isDomestic)
    ) {
      router.push('/checkout')
    }
  }, [flightParams, router, selectedFlightPackage])

  const handleResultSelect = (flight: ClientFlightDataModel) => {
    openPackageDrawer()

    const withPackages = flightClientData?.filter((item) =>
      flightParams.Destination.IsDomestic && flightParams.Origin.IsDomestic
        ? item.flightDetailSegments.at(0)?.groupId ===
            flight.flightDetailSegments.at(0)?.groupId &&
          item.flightDetailSegments?.at(0)?.flightNumber ===
            flight.flightDetailSegments.at(0)?.flightNumber
        : item.flightDetailSegments.at(0)?.groupId ===
            flight.flightDetailSegments.at(0)?.groupId &&
          item.flightDetailSegments.at(0)?.freeVolatileData.Seq ===
            flight.flightDetailSegments.at(0)?.freeVolatileData.Seq
    )

    setSelectedFlightData([...new Set(withPackages)])
  }

  const handlePackageSelect = (flight: ClientFlightDataModel) => {
    closePackageDrawer()
    scrollTo({ y: 0 })
    if (selectedFlightPackage && selectedFlightPackage?.length > 0) {
      setSelectedFlightPackage([...selectedFlightPackage, flight])
    } else {
      setSelectedFlightPackage([flight])
    }
    setSelectedFlightData(null)
    setRoundTicketsIsVisible(true)
  }

  const changeDestinationFlight = () => {
    scrollTo({ y: 0 })
    setSelectedFlightPackage(null)
    setRoundTicketsIsVisible(false)
  }

  if (!flightService.data && !flightClientData)
    return (
      <div className='container pt-3 md:pt-8'>
        <div className='flex flex-col items-center p-7'>
          <Loader size={60} />
        </div>
      </div>
    )

  return (
    <>
      <div className='container pt-3 md:pt-8'>
        {flightService.isRefetching ||
        isClientDataFetching ||
        flightService.data?.hasMoreResponse ? (
          <div className='flex flex-col items-center p-7'>
            <Loader size={60} />
          </div>
        ) : flightClientData?.length ? (
          <div className='grid md:grid-cols-4 md:gap-3'>
            <div className='md:col-span-1'>Filter section</div>
            <div className='relative md:col-span-3'>
              {selectedFlightPackage ? (
                <div className='border-b pb-3'>
                  {selectedFlightPackage.map((flight) => {
                    return (
                      <div
                        key={flight.id}
                        className='text-xs font-light text-gray-600'
                      >
                        {
                          flight.airLines.find(
                            (item) =>
                              item.code ===
                              flight.flightDetailSegments.at(0)
                                ?.marketingAirline.code
                          )?.value
                        }{' '}
                        {flight?.flightDetailSegments.map((item) => {
                          return `${item.origin.code}  -> ${item.destination.code}`
                        })}
                      </div>
                    )
                  })}
                  <span
                    className='text-sm text-blue-700 underline'
                    role='button'
                    onClick={changeDestinationFlight}
                  >
                    Gidiş uçuşunu değiştir
                  </span>
                </div>
              ) : null}
              <div className='relative'>
                <div
                  className={`absolute end-0 start-0 top-0 transition-opacity ${clsx(
                    {
                      'z-10 opacity-100': !roundTicketsIsVisible,
                      'z-0 opacity-0': roundTicketsIsVisible,
                    }
                  )}`}
                >
                  <div>Gidiş uçuşunuzu seçiniz</div>
                  <div className='grid gap-3'>
                    {flightClientData &&
                      flightClientData
                        ?.sort(
                          (a, b) =>
                            a!.flightFare.totalPrice.value -
                            b!.flightFare.totalPrice.value
                        )
                        .filter((item) =>
                          flightParams.Destination.IsDomestic &&
                          flightParams.Origin.IsDomestic
                            ? item?.flightDetailSegments[0].groupId === 0
                            : item?.flightDetailSegments[0].groupId === 0
                        )
                        .map((flight) => {
                          if (
                            seqKeys_origin.includes(
                              flight.flightDetailSegments.at(0)?.flightNumber!
                            )
                          )
                            return null

                          seqKeys_origin.push(
                            flight.flightDetailSegments.at(0)?.flightNumber!
                          )

                          return (
                            <div key={flight.id}>
                              <SearchResultCard
                                flight={flight}
                                onSelect={handleResultSelect}
                              />
                            </div>
                          )
                        })}
                  </div>
                </div>

                <div
                  className={`absolute end-0 start-0 transition-all ${clsx({
                    'top-56 z-0 opacity-0': !roundTicketsIsVisible,
                    'opacity-1 top-0 z-10': roundTicketsIsVisible,
                  })}`}
                >
                  {flightClientData &&
                  flightClientData?.filter(
                    (item) => item?.flightDetailSegments[0].groupId === 1
                  ).length > 0 ? (
                    <>
                      <div>Dönüş uçuşunuzu seçiniz</div>
                      <div className='grid gap-3'>
                        {flightClientData
                          ?.sort(
                            (a, b) =>
                              a!.flightFare.totalPrice.value -
                              b!.flightFare.totalPrice.value
                          )
                          .filter(
                            (item) =>
                              item?.flightDetailSegments[0].groupId === 1
                          )
                          .map((flight) => {
                            if (
                              seqKeys_destination.includes(
                                flight.flightDetailSegments.at(0)?.flightNumber!
                              )
                            )
                              return null

                            seqKeys_destination.push(
                              flight.flightDetailSegments.at(0)?.flightNumber!
                            )

                            return (
                              <SearchResultCard
                                key={flight.id}
                                flight={flight}
                                onSelect={(data) => {
                                  handleResultSelect(data)
                                }}
                              />
                            )
                          })}
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>no data</div>
        )}
      </div>
      <Drawer
        opened={pacakgeDrawerOpened}
        onClose={closePackageDrawer}
        position='bottom'
        title={
          <div>
            <span className='font-semibold'>
              {flightParams.Destination.Name}
            </span>{' '}
            Fiyatlarini İnceleyin
          </div>
        }
      >
        <div className='grid grid-flow-col grid-rows-3 gap-3 sm:grid-rows-1'>
          {selectedFlightData && Array.isArray(selectedFlightData)
            ? selectedFlightData.map((selectedFlight) => {
                return (
                  <div
                    key={selectedFlight.id}
                    className='flex flex-col rounded border p-2 md:p-3'
                  >
                    <div className='flex h-full flex-col gap-3'>
                      <div>
                        <div className='text-lg font-semibold'>
                          {formatCurrency(
                            selectedFlight.flightFare.totalPrice.value
                          )}
                        </div>
                      </div>
                      <div>
                        <div className='pb-2 font-semibold capitalize'>
                          {(() => {
                            switch (
                              selectedFlight.flightDetailSegments.at(0)
                                ?.freeVolatileData.BrandName
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
                                return selectedFlight.flightDetailSegments
                                  .at(0)
                                  ?.freeVolatileData.BrandName.toLocaleLowerCase()
                            }
                          })()}
                        </div>
                        <List className='text-sm'>
                          {selectedFlight.flightDetailSegments.at(0)
                            ?.marketingAirline?.code === 'PC' ? (
                            <List.Item
                              icon={
                                <IoIosCheckmarkCircle className='text-green-500' />
                              }
                            >
                              1 Adet Koltuk Altına Sığacak Çanta (40x30x15)
                            </List.Item>
                          ) : null}
                          {selectedFlight.flightDetailSegments.at(0)
                            ?.baggageAllowance?.maxWeight?.value! > 0 && (
                            <List.Item
                              icon={
                                <IoIosCheckmarkCircle className='text-green-500' />
                              }
                            >
                              {
                                selectedFlight.flightDetailSegments.at(0)
                                  ?.baggageAllowance.maxWeight.value
                              }{' '}
                              kg bagaj
                            </List.Item>
                          )}

                          {selectedFlight.flightDetailSegments.at(0)
                            ?.freeVolatileData.Owner !== 'EF' &&
                          selectedFlight.flightDetailSegments.at(0)
                            ?.marketingAirline.code !== 'PC' ? (
                            <List.Item
                              icon={
                                <IoIosCheckmarkCircle className='text-green-500' />
                              }
                            >
                              Ücretli Değişiklik
                            </List.Item>
                          ) : null}
                        </List>
                      </div>
                      <div className='mt-auto'>
                        <Button
                          type='button'
                          onClick={() => handlePackageSelect(selectedFlight)}
                          fullWidth
                        >
                          Select
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            : null}
        </div>
      </Drawer>
    </>
  )
}

export default FlightSearch
