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
import { cleanObj } from '@/libs/util'

let appToken: GetSecurityTokenResponse | undefined | null

const apiActionSearchResponseReadyData = '/api/Hotel/SearchResponseReadyData'
const apiActionSearchResponse = '/api/Hotel/SearchResponse'
let enableHotelSearchRequestQuery = false

export const useSearchResultParams = () => {
  const [searchParams] = useQueryStates(hotelSearchParamParser)
  const [filterParams] = useQueryStates(hotelFilterSearchParams)

  const { start: startRequestTimeout, clear: clearRequestTimeout } = useTimeout(
    () => {
      enableHotelSearchRequestQuery = true
      hotelSearchRequestQuery.refetch()
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

  const hotelSearchResponseReadyData = useQuery({
    enabled: !!searchRequestParams,
    queryKey: ['hotel-search-ready-data', searchRequestParams],
    queryFn: async ({ signal }) => {
      enableHotelSearchRequestQuery = false
      if (!appToken) {
        appToken = await getsecuritytoken()
      }

      const response = (await request({
        method: 'post',
        url: process.env.NEXT_PUBLIC_OL_ROUTE,
        data: {
          apiAction: apiActionSearchResponseReadyData,
          params: {
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            searchToken:
              searchRequestParams?.hotelSearchModuleRequest.searchToken,
            hotelSearchModuleRequest: {
              ...searchRequestParams?.hotelSearchModuleRequest,
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

      if (!response.data?.searchResults[0].items.length) {
        startRequestTimeout()
        hotelSocket.connect()
      } else {
        enableHotelSearchRequestQuery = true
      }

      return response?.data
    },
  })

  const hotelSearchRequestQuery = useInfiniteQuery({
    enabled: enableHotelSearchRequestQuery,
    queryKey: ['hotel-search-results', searchRequestParams, cleanFilterParams],
    initialPageParam: {
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
          apiAction: apiActionSearchResponse,
          params: {
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            searchToken:
              searchRequestParams?.hotelSearchModuleRequest.searchToken,
            hotelSearchModuleRequest: {
              ...searchRequestParams?.hotelSearchModuleRequest,
              pageNo: pageParam.pageNo,
              minPrice:
                cleanFilterParams?.priceRange &&
                cleanFilterParams?.priceRange?.length > 0
                  ? cleanFilterParams?.priceRange[0]
                  : searchRequestParams?.hotelSearchModuleRequest.minPrice,
              maxPrice:
                cleanFilterParams?.priceRange &&
                cleanFilterParams?.priceRange?.length > 0
                  ? cleanFilterParams?.priceRange[1]
                  : searchRequestParams?.hotelSearchModuleRequest.maxPrice,
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

      return response?.data
    },
    getNextPageParam: (lastPage, allPages, { pageNo }) => {
      if (lastPage?.searchResults[0].hasMorePage) {
        // clearRequestTimeout()

        return {
          pageNo: pageNo > -1 ? pageNo + 1 : 0,
        }
      }

      if (
        !lastPage?.searchResults ||
        !lastPage?.searchResults.at(0)?.items.length
      ) {
        return {
          pageNo: 0,
        }
      }

      return
    },
  })

  const socketOnAvailability = ({ status }: { status: number }) => {
    console.log('socketOnAvailability is triggered')
    // enableHotelSearchRequestQuery = true

    hotelSocket.disconnect()
    clearRequestTimeout()
  }

  useEffect(() => {
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    hotelSearchResponseReadyData,
    hotelSearchRequestQuery,
    searchParams,
    searchParamsQuery,
  }
}
