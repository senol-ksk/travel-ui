'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { readLocalStorageValue } from '@mantine/hooks'

// import Cookies from 'js-cookie'

import { Flight } from '@/modules/flight'
import {
  flightApiRequest,
  FlightApiRequestParams,
} from '@/modules/flight/search.request'

let ReceivedProviders: string[] = []

const FlightSearch = () => {
  // const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const searchToken = searchParams.get('SearchToken')

  const flightParams = readLocalStorageValue<FlightApiRequestParams>({
    key: 'flight',
  })

  // const sessionToken = Cookies.get('SessionToken')
  // const searchToken = Cookies.get('SearchToken')

  const { data: flightSearchResultData, refetch } = useQuery({
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

      console.log(getFlightResults)
      return getFlightResults
    },
    enabled(query) {
      return !query.state.data || query.state.data?.data.hasMoreResponse
    },
    // enabled: false,
    refetchInterval: 1000,
    retryOnMount: false,
  })

  useEffect(() => {
    // if (searchToken) queryClient.resetQueries()
    console.log(searchToken)
  }, [searchToken])

  return (
    <div>
      <div className='border-t bg-white shadow'>
        <div className='container p-3'>
          <Flight />
        </div>
      </div>
      {/* <button onClick={() => queryClient.resetQueries()}>refetch</button> */}
    </div>
  )
}

export default FlightSearch
