import { useEffect } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'
import { io } from 'socket.io-client'

import { getsecuritytoken, request, serviceRequest } from '@/network'
import { HotelSearchRequestParams } from '@/types/hotel'
import { GetSecurityTokenResponse } from '@/types/global'
import { HotelSearchResultApiResponse } from '@/app/hotel/types'
import { hotelSearchParamParser } from '@/modules/hotel/searchParams'

let appToken: GetSecurityTokenResponse | undefined | null

const hotelSocket = io(process.env.NEXT_PUBLIC_HOTEL_SOCKET_URL, {
  autoConnect: false,
  reconnection: false,
})

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
  const hotelSearchRequestQuery = useInfiniteQuery({
    enabled: !!searchRequestParams,
    queryKey: ['hotel-search-results', searchRequestParams],
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

      // if (response.data && !hotelSocket.connected) {
      //   hotelSocket.connect()
      // }

      return response?.data
    },
    getNextPageParam: (
      { hasMoreResponse, searchResults },
      allPages,
      { apiAction, pageNo }
    ) => {
      if (hasMoreResponse && !searchResults[0].items) {
        return {
          apiAction: '/api/Hotel/SearchResponse',
          pageNo: 0,
        }
      }

      if (searchResults[0].hasMorePage) {
        return {
          apiAction: '/api/Hotel/SearchResponse',
          pageNo: pageNo > -1 ? pageNo + 1 : 0,
        }
      }

      return undefined
    },
  })

  // useEffect(() => {
  //   const hotelSocketOnConnect = () => {
  //     console.log('socket connected')
  //     // hotelSocket.emit('Auth', {
  //     //   searchToken: searchParamsQuery.data?.hotelSearchApiRequest.searchToken,
  //     // })
  //   }
  //   hotelSocket.on('Auth', (message) => {
  //     console.log(message)
  //   })

  //   hotelSocket.on('AvailabilityStatus', (message) => {
  //     console.log(message)
  //   })

  //   hotelSocket.emit('Auth', {
  //     searchToken: searchParamsQuery.data?.hotelSearchApiRequest.searchToken,
  //   })
  //   hotelSocket.on('connect', hotelSocketOnConnect)

  //   return () => {
  //     hotelSocket.disconnect()
  //   }
  // }, [searchParamsQuery.data?.hotelSearchApiRequest.searchToken])

  return { hotelSearchRequestQuery, searchParams, searchParamsQuery }
}
