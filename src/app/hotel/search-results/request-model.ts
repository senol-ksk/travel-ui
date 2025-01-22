import { useCallback, useEffect, useRef, useState } from 'react'
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { getsecuritytoken, request, serviceRequest } from '@/network'
import { HotelSearchRequestParams } from '@/types/hotel'
import { GetSecurityTokenResponse } from '@/types/global'
import { HotelSearchResultApiResponse } from '@/app/hotel/types'
import { hotelSearchParamParser } from '@/modules/hotel/searchParams'
import { hotelSocket } from './socket'

let appToken: GetSecurityTokenResponse | undefined | null

export const useSearchResultParams = () => {
  const [searchParams] = useQueryStates(hotelSearchParamParser)

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
      apiAction: '/api/Hotel/SearchResponseReadyData',
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
            searchToken: searchRequestParams?.searchToken,
            hotelSearchModuleRequest: {
              ...searchRequestParams?.hotelSearchModuleRequest,
              ...pageParam,
            },
          },
          apiRoute: 'HotelService',
          apiAction: pageParam.apiAction,
          sessionToken: searchRequestParams?.sessionToken,
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
        response.data.searchResults &&
        response.data.searchResults.at(0)?.items.length === 0
      ) {
        hotelSocket.connect()
      }

      return response?.data
    },
    getNextPageParam: (lastPage, allPages, { pageNo }) => {
      if (lastPage.searchResults[0].hasMorePage && lastPage.hasMoreResponse) {
        return {
          apiAction: '/api/Hotel/SearchResponse',
          pageNo: pageNo > -1 ? pageNo + 1 : 0,
        }
      }

      if (
        lastPage.hasMoreResponse &&
        !lastPage.searchResults.at(0)?.items.length
      ) {
        return {
          apiAction: '/api/Hotel/SearchResponse',
          pageNo: 0,
        }
      }

      return
    },
  })
  const socketOnAvailablity = ({ status }: { status: number }) => {
    console.log(status)
    console.log('socketOnAvailablity')
    if (status === 2) {
      hotelSearchRequestQuery.fetchNextPage()
      hotelSocket.disconnect()
    }
  }

  const socketOnConnect = () => {
    console.log('socket connected')

    if (searchParamsQuery.data?.hotelSearchApiRequest.searchToken) {
      hotelSocket.emit('Auth', {
        searchtoken: searchParamsQuery.data?.hotelSearchApiRequest.searchToken,
      })
      hotelSocket.on('AvailabilityStatus', socketOnAvailablity)
    }
  }
  const socketOnDisConnect = () => {
    console.log('disconnected')
  }
  hotelSocket.on('connect', socketOnConnect)
  hotelSocket.on('disconnect', socketOnDisConnect)

  useEffect(() => {
    return () => {
      hotelSocket.disconnect()
    }
  }, [])

  return {
    hotelSearchRequestQuery,
    searchParams,
    searchParamsQuery,
  }
}
