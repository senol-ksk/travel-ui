import { useEffect, useRef } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'
import { useIsFirstRender, useTimeout } from '@mantine/hooks'

import { getsecuritytoken, request, serviceRequest } from '@/network'
import { HotelSearchRequestParams } from '@/types/hotel'
import { GetSecurityTokenResponse } from '@/types/global'
import { HotelSearchResultApiResponse } from '@/app/hotel/types'
import {
  hotelFilterSearchParams,
  hotelSearchParamParser,
} from '@/modules/hotel/searchParams'
import { hotelSocket } from './socket'

let appToken: GetSecurityTokenResponse | undefined | null

// removes nullish values from object
function cleanObj<T>(obj: T): T {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName]
    }
  }
  return obj
}

const apiActionSearchResponseReadyData = '/api/Hotel/SearchResponseReadyData'
const apiActionSearchResponse = '/api/Hotel/SearchResponse'

export const useSearchResultParams = () => {
  const [searchParams] = useQueryStates(hotelSearchParamParser)
  const [filterParams] = useQueryStates(hotelFilterSearchParams)
  const timeoutIsTriggered = useRef(false)

  const { start: startRequestTimeout, clear: clearRequestTimeout } = useTimeout(
    () => {
      timeoutIsTriggered.current = true

      if (
        !hotelSearchRequestQuery.isFetching &&
        !hotelSearchRequestQuery.isFetchingNextPage
      ) {
        hotelSearchRequestQuery.fetchNextPage()
      }
    },
    20000
  )

  const searchParamsQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['hotel-search-params', searchParams],
    queryFn: async ({ signal }) => {
      const response = await serviceRequest<HotelSearchRequestParams>({
        axiosOptions: {
          url: 'api/hotel/searchResults',
          params: searchParams,
          signal,
        },
      })

      return response?.data
    },
  })
  const searchRequestParams = searchParamsQuery.data?.hotelSearchApiRequest
  const cleanFilterParams = cleanObj(filterParams)

  const hotelSearchRequestQueryKey = [
    'hotel-search-results',
    searchRequestParams,
    searchParams,
    cleanFilterParams,
  ]

  const hotelSearchRequestQuery = useInfiniteQuery({
    enabled: !!searchRequestParams,
    queryKey: hotelSearchRequestQueryKey,
    initialPageParam: {
      pageNo: searchRequestParams?.hotelSearchModuleRequest.pageNo || 0,
      apiAction: apiActionSearchResponseReadyData,
    },
    queryFn: async ({ signal, pageParam }) => {
      if (!appToken) {
        appToken = await getsecuritytoken()
      }

      const response = (await request({
        method: 'post',
        url: process.env.NEXT_PUBLIC_OL_ROUTE,
        data: {
          apiAction: pageParam.apiAction,
          params: {
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            searchToken:
              searchRequestParams?.hotelSearchModuleRequest.searchToken,
            hotelSearchModuleRequest: {
              ...searchRequestParams?.hotelSearchModuleRequest,
              pageNo: pageParam.pageNo,
              ...cleanFilterParams,
            },
          },
          apiRoute: 'HotelService',
          sessionToken:
            searchRequestParams?.hotelSearchModuleRequest.sessionToken,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
          scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
          scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
          RequestType:
            'TravelAccess.Business.Models.Hotel.HotelSearchApiRequest, Business.Models.Hotel, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
          Device: 'Web',
          LanguageCode: 'tr_TR',
        },
        signal,
        headers: {
          appToken: appToken.result,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
        },
      })) as HotelSearchResultApiResponse

      if (
        response?.data?.searchResults &&
        response.data.searchResults.at(0)?.items.length === 0
      ) {
        if (!timeoutIsTriggered.current) {
          startRequestTimeout()
          timeoutIsTriggered.current = true
        }
        hotelSocket.connect()
      }

      return response?.data
    },
    getNextPageParam: (lastPage, allPages, { pageNo }) => {
      const apiAction = apiActionSearchResponse
      if (lastPage?.searchResults[0].hasMorePage) {
        if (timeoutIsTriggered.current) {
          clearRequestTimeout()
        }

        return {
          pageNo: pageNo > -1 ? pageNo + 1 : 0,
          apiAction: apiActionSearchResponse,
        }
      }

      if (
        !lastPage?.searchResults ||
        !lastPage?.searchResults.at(0)?.items.length
      ) {
        return {
          pageNo: 0,
          apiAction: apiActionSearchResponse,
        }
      }

      return
    },
  })

  useEffect(() => {
    const socketOnAvailability = ({ status }: { status: number }) => {
      if (
        !hotelSearchRequestQuery.isFetching &&
        !hotelSearchRequestQuery.isFetchingNextPage
      ) {
        hotelSearchRequestQuery.fetchNextPage()
      }

      hotelSocket.disconnect()
      clearRequestTimeout()
    }

    const socketOnConnect = () => {
      if (searchParamsQuery.data?.hotelSearchApiRequest.searchToken) {
        hotelSocket.emit('Auth', {
          searchtoken:
            searchParamsQuery.data?.hotelSearchApiRequest.searchToken,
        })
      }
      hotelSocket.once('AvailabilityStatus', socketOnAvailability)
    }

    hotelSocket.once('connect', socketOnConnect)
    return () => {
      hotelSocket.disconnect()
      hotelSocket.off('AvailabilityStatus')
      clearRequestTimeout()
      timeoutIsTriggered.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    hotelSearchRequestQuery,
    searchParams,
    searchParamsQuery,
  }
}
