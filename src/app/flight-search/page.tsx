'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

import clsx from 'clsx'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { readLocalStorageValue } from '@mantine/hooks'

import type { FlightApiRequestParams } from '@/modules/flight/types'

import { Flight } from '@/modules/flight'
import { flightApiRequest } from '@/modules/flight/search.request'
import {
  collectFlightData,
  generateFlightData,
} from '@/modules/flight/search-results/generate'

import { SearchResultCard } from '@/app/flight-search/search-result'
import { Loader } from '@mantine/core'

let ReceivedProviders: string[] = []

const FlightSearch = () => {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const searchToken = searchParams.get('SearchToken')

  const flightParams = readLocalStorageValue<FlightApiRequestParams>({
    key: 'flight',
  })

  const {
    data: flightSearchApiData,
    isLoading: isServiceRequestLoading,
    isSuccess: isServiceRequestSuccess,
    isFetching: isServiceRequestFetching,
    isRefetching: isServiceRequestReFetching,
  } = useQuery({
    queryKey: ['flight-results', searchToken, flightParams],
    queryFn: async () => {
      const getFlightResults = await flightApiRequest({
        ...flightParams,
        ReceivedProviders,
        SearchToken: searchToken!,
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

  const {
    data: flightClientData,
    isLoading: isClientDataLoading,
    isFetching: isClientDataFetching,
    isPaused: isClientDataPasused,
    isSuccess: isClientDataSuccess,
  } = useQuery({
    queryKey: ['flighClientData'],
    queryFn: async () => {
      const flightData = await generateFlightData()
      ReceivedProviders = []

      return flightData
    },
    enabled:
      !!flightSearchApiData &&
      flightSearchApiData?.status &&
      !flightSearchApiData.hasMoreResponse,
    refetchOnMount: true,
  })

  return (
    <Suspense fallback={<Loader />}>
      <div>
        <div className='border-t bg-white shadow'>
          <div className='container p-3'>
            <Flight />
          </div>
        </div>

        {!flightSearchApiData ||
        !flightClientData ||
        isClientDataFetching ||
        isClientDataPasused ||
        isClientDataLoading ||
        isServiceRequestFetching ||
        isServiceRequestLoading ? (
          <div className='flex flex-col items-center p-7'>
            <Loader size={60} />
          </div>
        ) : null}

        <div
          className={clsx('container grid gap-3 py-5', {
            'grid-cols-2': flightClientData?.filter(
              (item) => item?.flightDetailSegments[0]?.groupId === 1
            ).length,
            hidden:
              !flightSearchApiData ||
              !flightClientData ||
              isClientDataFetching ||
              isClientDataPasused ||
              isClientDataLoading ||
              isServiceRequestFetching ||
              isServiceRequestLoading,
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
            {flightClientData
              ?.sort(
                (a, b) =>
                  a!.flightFare.totalPrice.value -
                  b!.flightFare.totalPrice.value
              )
              .filter((item) => item?.flightDetailSegments[0].groupId === 0)
              .map((flight) => {
                return <SearchResultCard key={flight.id} {...flight} />
              })}
          </div>

          {flightClientData
            ?.sort(
              (a, b) =>
                a!.flightFare.totalPrice.value - b!.flightFare.totalPrice.value
            )
            .filter((item) => item?.flightDetailSegments[0].groupId === 1) && (
            <div className='col-span-1 flex flex-col gap-3'>
              <div>Dönüş Uçuşları</div>
              {flightClientData
                ?.sort(
                  (a, b) =>
                    a!.flightFare.totalPrice.value -
                    b!.flightFare.totalPrice.value
                )
                .filter((item) => item?.flightDetailSegments[0].groupId === 1)
                .map((flight) => {
                  return <SearchResultCard key={flight.id} {...flight} />
                })}
            </div>
          )}
        </div>
      </div>
    </Suspense>
  )
}

export default FlightSearch
