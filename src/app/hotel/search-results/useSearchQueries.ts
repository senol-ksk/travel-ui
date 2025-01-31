import { useEffect, useRef } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'
import { useTimeout } from '@mantine/hooks'

import { getsecuritytoken, request, serviceRequest } from '@/network'
import { HotelSearchRequestParams } from '@/types/hotel'
import { GetSecurityTokenResponse } from '@/types/global'
import { HotelSearchResultApiResponse } from '@/app/hotel/types'
import { hotelSearchParamParser } from '@/modules/hotel/searchParams'
import { hotelSocket } from './socket'

let appToken: GetSecurityTokenResponse | undefined | null

const apiActionSearchResponseReadyData = '/api/Hotel/SearchResponseReadyData'
const apiActionSearchResponse = '/api/Hotel/SearchResponse'

export const useSearchResultParams = () => {
  const [searchParams] = useQueryStates(hotelSearchParamParser)
  const timeoutIsTriggered = useRef(false)
  const { start: startRequestTimeout, clear: clearRequestTimeout } = useTimeout(
    () => {
      timeoutIsTriggered.current = true
      console.log(
        'timeout is triggered, timeoutIsTriggered.current',
        timeoutIsTriggered.current
      )
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
  const hotelSearchRequestQueryKey = [
    'hotel-search-results',
    searchRequestParams,
  ]

  const hotelSearchRequestQuery = useInfiniteQuery({
    enabled: !!searchRequestParams,
    queryKey: hotelSearchRequestQueryKey,
    initialPageParam: {
      apiAction: apiActionSearchResponseReadyData,
      pageNo: searchRequestParams?.hotelSearchModuleRequest.pageNo || 0,
    },
    queryFn: async ({ signal, pageParam }) => {
      if (!appToken) {
        appToken = await getsecuritytoken()
      }

      const response = (await request({
        method: 'post',
        url: process.env.NEXT_PUBLIC_OL_ROUTE,
        data: {
          params: {
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            searchToken:
              searchRequestParams?.hotelSearchModuleRequest.searchToken,
            hotelSearchModuleRequest: {
              ...searchRequestParams?.hotelSearchModuleRequest,
              pageNo: pageParam.pageNo,
            },
          },
          apiRoute: 'HotelService',
          apiAction: pageParam.apiAction,
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
          console.log('timeout is started')
          startRequestTimeout()
          timeoutIsTriggered.current = true
        }
        hotelSocket.connect()
      }

      return response?.data
    },
    getNextPageParam: (lastPage, allPages, { pageNo }) => {
      if (lastPage?.searchResults[0].hasMorePage) {
        if (timeoutIsTriggered.current) {
          console.log('timeout is stoped')
          clearRequestTimeout()
        }
        return {
          apiAction: apiActionSearchResponse,
          pageNo: pageNo > -1 ? pageNo + 1 : 0,
        }
      }

      if (
        !lastPage?.searchResults ||
        !lastPage?.searchResults.at(0)?.items.length
      ) {
        return {
          apiAction: apiActionSearchResponse,
          pageNo: 0,
        }
      }

      return
    },
  })

  useEffect(() => {
    const socketOnAvailablity = ({ status }: { status: number }) => {
      console.log('socketOnAvailablity')

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
      console.log('socket connected')

      if (searchParamsQuery.data?.hotelSearchApiRequest.searchToken) {
        hotelSocket.emit('Auth', {
          searchtoken:
            searchParamsQuery.data?.hotelSearchApiRequest.searchToken,
        })
      }
      hotelSocket.once('AvailabilityStatus', socketOnAvailablity)
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
