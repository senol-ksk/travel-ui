import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRef } from 'react'
import { createSerializer, useQueryStates } from 'nuqs'
import { useTransitionRouter } from 'next-view-transitions'

import { flightSearchParams } from '@/modules/flight/searchParams'
import type { FlightSearchResultsApiResponse } from '@/app/flight/type'
import {
  getFlightSearchSessionToken,
  getsecuritytoken,
  request,
  serviceRequest,
} from '@/network'

import { delayCodeExecution } from '@/libs/util'
import { reservationParsers } from '../reservation/searchParams'

const requestedDayFormat = 'YYYY-MM-DD'

import dummyData from './search-results/intenational-dummy.json'

const useSearchResultsQueries = () => {
  const [searchParams] = useQueryStates(flightSearchParams)
  const appToken = useRef<string>(null)
  const router = useTransitionRouter()

  const generateFlightSearchPanel = () => {
    const FlightSearchPanel = {
      ActiveTripKind: searchParams.activeTripKind,
      SearchLegs: [
        {
          DepartureTime: dayjs(searchParams.departureDate).format(
            requestedDayFormat
          ),
          CabinClass: searchParams.cabinClass?.value,
          MaxConnections: 0,
          Origin: {
            code: searchParams.origin?.code,
            iata: searchParams.origin?.iata,
            type: searchParams.origin?.type,
            isDomestic: searchParams.origin?.isDomestic,
            id: searchParams?.origin?.id,
          },
          Destination: {
            code: searchParams.destination?.code,
            iata: searchParams.destination?.iata,
            type: searchParams.destination?.type,
            isDomestic: searchParams.destination?.isDomestic,
            id: searchParams?.destination?.id,
          },
        },
      ],
      PassengerCounts: searchParams.passengerCounts,
      Domestic:
        searchParams.destination?.isDomestic && searchParams.origin?.isDomestic,
      CabinClass: searchParams.cabinClass,
    }

    if (searchParams.activeTripKind === '2') {
      FlightSearchPanel.SearchLegs.push({
        DepartureTime: dayjs(searchParams.returnDate).format(
          requestedDayFormat
        ),
        CabinClass: searchParams.cabinClass?.value,
        MaxConnections: 0,
        Destination: {
          code: searchParams.origin?.code,
          iata: searchParams.origin?.iata,
          type: searchParams.origin?.type,
          isDomestic: searchParams.origin?.isDomestic,
          id: searchParams.origin?.id,
        },
        Origin: {
          code: searchParams.destination?.code,
          iata: searchParams.destination?.iata,
          type: searchParams.destination?.type,
          isDomestic: searchParams.destination?.isDomestic,
          id: searchParams.destination?.id,
        },
      })
    }

    return FlightSearchPanel
  }

  const searchSessionTokenQuery = useQuery({
    // enabled: false,
    enabled: !!searchParams,
    queryKey: ['flight-search-token', searchParams],
    queryFn: async () => {
      const response = await getFlightSearchSessionToken()

      return response
    },
  })

  const searchResultsQuery = useInfiniteQuery({
    enabled: !!searchSessionTokenQuery.data,
    initialPageParam: {
      ReceivedProviders: [''],
    },
    queryKey: [
      'flight-search-results',
      searchSessionTokenQuery.data?.searchToken,
      searchSessionTokenQuery.data?.sessionToken,
      appToken.current,
    ],
    queryFn: async ({ pageParam, signal }) => {
      if (!appToken.current) {
        appToken.current = (await getsecuritytoken()).result
      }
      await delayCodeExecution(1000)
      const response = (await request({
        signal,
        url: process.env.NEXT_PUBLIC_OL_ROUTE,
        method: 'post',
        data: {
          params: {
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            searchToken: searchSessionTokenQuery.data?.searchToken,
            FlightSearchPanel: {
              ...generateFlightSearchPanel(),
              ReceivedProviders: pageParam.ReceivedProviders.filter(
                (provider) => provider
              ),
            },
          },
          apiRoute: 'FlightService',
          apiAction: 'api/Flight/Search',
          sessionToken: searchSessionTokenQuery.data?.sessionToken,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
          scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
          scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
          requestType:
            'Service.Models.RequestModels.FlightSearchRequest, Service.Models, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
        },
        headers: {
          appToken: appToken.current,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
        },
      })) as FlightSearchResultsApiResponse
      return response
      // return dummyData as FlightSearchResultsApiResponse
    },
    // select(data) {
    //   console.log(data)
    //   return data.pages.map()
    // },
    getNextPageParam: (lastPage, pages, lastPageParams) => {
      if (lastPage.data && lastPage.data.hasMoreResponse) {
        if (lastPage?.data?.searchResults?.length) {
          lastPage.data.searchResults.forEach((searchResult) => {
            const providerName = searchResult.diagnostics.providerName

            if (!lastPageParams.ReceivedProviders.includes(providerName))
              lastPageParams.ReceivedProviders.push(providerName)
          })
        }

        return lastPageParams
      }
      return undefined
    },
  })

  if (
    !searchResultsQuery.isFetchingNextPage &&
    searchResultsQuery.hasNextPage
  ) {
    searchResultsQuery.fetchNextPage()
  }

  const submitFlightData = useMutation({
    mutationFn: async (key: string) => {
      const response = await serviceRequest<{ productKey: string }>({
        axiosOptions: {
          url: '/api/flight/postKey',
          method: 'post',
          params: {
            key,
            session: searchSessionTokenQuery.data?.sessionToken,
            search: searchSessionTokenQuery.data?.searchToken,
          },
        },
      })
      return response
    },
    onSuccess(query) {
      const serialize = createSerializer(reservationParsers)

      const reservationUrl = serialize('/reservation', {
        productKey: query?.data?.productKey,
        searchToken: searchSessionTokenQuery.data?.searchToken,
        sessionToken: searchSessionTokenQuery.data?.sessionToken,
      })

      if (query?.success && query.data?.productKey) {
        router.push(reservationUrl)
      }
    },
  })
  return {
    searchResultsQuery,
    submitFlightData,
    searchParams,
    searchSessionTokenQuery,
  }
}

export { useSearchResultsQueries }
