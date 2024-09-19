'use client'

import { useSearchParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'
import { readLocalStorageValue } from '@mantine/hooks'

import type { FlightApiRequestParams } from '@/modules/flight/types'

import { Flight } from '@/modules/flight'
import { flightApiRequest } from '@/modules/flight/search.request'
import {
  collectFlightData,
  generateFlightData,
} from '@/modules/flight/search-results/generate'

let ReceivedProviders: string[] = []

const FlightSearch = () => {
  const searchParams = useSearchParams()
  const searchToken = searchParams.get('SearchToken')

  const flightParams = readLocalStorageValue<FlightApiRequestParams>({
    key: 'flight',
  })

  const { data: flightSearchApiData } = useQuery({
    queryKey: ['flight-results', { searchToken, flightParams }],
    queryFn: async () => {
      const getFlightResults = await flightApiRequest({
        ...flightParams,
        ReceivedProviders,
        SearchToken: searchToken!,
      })

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
    // enabled: false,
    refetchInterval: 1000,
    retryOnMount: false,
  })
  const { data: flightClientData } = useQuery({
    queryKey: ['flighClientData', searchToken],
    queryFn: async () => {
      const flightData = await generateFlightData(0)
      return flightData
    },
    enabled: !!flightSearchApiData?.hasMoreResponse,
  })

  return (
    <div>
      <div className='border-t bg-white shadow'>
        <div className='container p-3'>
          <Flight />
        </div>
      </div>

      {flightClientData?.map((flight, count) => {
        return (
          <div key={flight.id}>
            <textarea defaultValue={JSON.stringify(flight)} />
          </div>
        )
      })}
    </div>
  )
}

export default FlightSearch
