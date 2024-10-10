'use client'

import { useState } from 'react'
import clsx from 'clsx'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Drawer, List } from '@mantine/core'
import { readLocalStorageValue, useDisclosure } from '@mantine/hooks'
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

let ReceivedProviders: string[] = []

const FlightSearch = () => {
  const queryClient = useQueryClient()
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedFlightData, setSelectedFlightData] = useState<
    ClientFlightDataModel | ClientFlightDataModel[] | null
  >(null)

  const flightParams = readLocalStorageValue<FlightApiRequestParams>({
    key: 'flight',
  })

  const flightService = useQuery({
    queryKey: ['flight-results', flightParams],
    queryFn: async () => {
      const getFlightResults = await flightApiRequest({
        ...flightParams,
        ReceivedProviders,
      })

      if (queryClient.getQueryData(['flighClientData'])) {
        queryClient.invalidateQueries({
          queryKey: ['flighClientData'],
          exact: true,
        })
      }

      if (getFlightResults.data.searchResults.length > 0) {
        getFlightResults.data.searchResults.forEach((item) => {
          if (!ReceivedProviders.includes(item.diagnostics.providerName))
            ReceivedProviders?.push(item.diagnostics.providerName)
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
  const seqKeys_origin: string[] = []
  const seqKeys_destination: string[] = []

  const {
    data: flightClientData,
    isLoading: isClientDataLoading,
    isFetching: isClientDataFetching,
    isPaused: isClientDataPasused,
  } = useQuery({
    queryKey: ['flighClientData'],
    queryFn: async () => {
      const flightData = await generateFlightData()
      ReceivedProviders = []

      // console.log(flightData)
      return flightData
    },
    enabled:
      !!flightService?.data &&
      flightService.data.status &&
      !flightService.data.hasMoreResponse,
  })

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
            <div className='md:col-span-3'>
              <div
                className={clsx('grid gap-3', {
                  'grid-cols-2': flightClientData?.filter(
                    (item) => item?.flightDetailSegments[0]?.groupId === 1
                  ).length,
                  hidden:
                    !flightService.data ||
                    !flightClientData ||
                    isClientDataFetching ||
                    isClientDataPasused ||
                    isClientDataLoading ||
                    flightService.isFetching ||
                    flightService.isLoading,
                })}
              >
                <div
                  className={clsx('flex flex-col gap-3', {
                    'col-span-1': flightClientData?.filter(
                      (item) => item?.flightDetailSegments[0].groupId === 1
                    ).length,
                  })}
                >
                  <div>Gidiş Uçuşları</div>
                  {flightClientData &&
                    flightClientData
                      ?.sort(
                        (a, b) =>
                          a!.flightFare.totalPrice.value -
                          b!.flightFare.totalPrice.value
                      )
                      .filter(
                        (item) => item?.flightDetailSegments[0].groupId === 0
                      )
                      .map((flight) => {
                        if (
                          seqKeys_origin.includes(
                            flight.flightDetails.at(0)?.freeVolatileData.Seq!
                          )
                        )
                          return null
                        seqKeys_origin.push(
                          flight.flightDetails.at(0)?.freeVolatileData?.Seq!
                        )
                        return (
                          <SearchResultCard
                            key={flight.id}
                            flight={flight}
                            onSelect={(data) => {
                              open()
                              const withPackages = flightClientData.filter(
                                (item) =>
                                  item.flightDetailSegments.at(0)
                                    ?.freeVolatileData.Seq ===
                                  data.flightDetailSegments.at(0)
                                    ?.freeVolatileData.Seq
                              )
                              setSelectedFlightData(withPackages)
                            }}
                          />
                        )
                      })}
                </div>

                {flightClientData &&
                flightClientData?.filter(
                  (item) => item?.flightDetailSegments[0].groupId === 1
                ).length > 0 ? (
                  <div className='col-span-1 flex flex-col gap-3'>
                    <div>Dönüş Uçuşları</div>
                    {flightClientData
                      ?.sort(
                        (a, b) =>
                          a!.flightFare.totalPrice.value -
                          b!.flightFare.totalPrice.value
                      )
                      .filter(
                        (item) => item?.flightDetailSegments[0].groupId === 1
                      )
                      .map((flight) => {
                        if (
                          seqKeys_destination.includes(
                            flight.flightDetails.at(0)?.freeVolatileData.Seq!
                          )
                        )
                          return null
                        seqKeys_destination.push(
                          flight.flightDetails.at(0)?.freeVolatileData?.Seq!
                        )

                        return (
                          <SearchResultCard
                            key={flight.id}
                            flight={flight}
                            onSelect={(data) => {
                              open()
                              const withPackages = flightClientData.filter(
                                (item) =>
                                  item.flightDetailSegments.at(0)
                                    ?.freeVolatileData.Seq ===
                                  data.flightDetailSegments.at(0)
                                    ?.freeVolatileData.Seq
                              )
                              setSelectedFlightData(withPackages)
                            }}
                          />
                        )
                      })}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div>no data</div>
        )}
      </div>
      <Drawer
        opened={opened}
        onClose={() => {
          close()
          setSelectedFlightData(null)
        }}
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
                  <div key={selectedFlight.id}>
                    <div className='flex flex-col gap-3 rounded border p-2 md:p-3'>
                      <div>
                        <div className='text-lg font-semibold'>
                          {formatCurrency(
                            selectedFlight.flightFare.totalPrice.value
                          )}
                        </div>
                      </div>
                      <div>
                        <div className='pb-2 font-semibold capitalize'>
                          {selectedFlight.flightDetailSegments
                            .at(0)
                            ?.freeVolatileData.BrandName.toLocaleLowerCase()}
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
