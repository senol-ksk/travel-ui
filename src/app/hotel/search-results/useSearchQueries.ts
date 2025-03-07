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

export const useSearchResultParams = () => {
  const searchQueryStatus = useRef<'initial' | 'loading' | 'ended'>('initial')

  const [searchParams] = useQueryStates(hotelSearchParamParser)
  const [filterParams] = useQueryStates(hotelFilterSearchParams)

  const { start: startRequestTimeout, clear: clearRequestTimeout } = useTimeout(
    () => {
      hotelSocket.disconnect()
      hotelSearchRequestQuery.fetchNextPage()
      searchQueryStatus.current = 'ended'
    },
    30000
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

  const hotelSearchRequestQuery = useInfiniteQuery({
    enabled: !!searchRequestParams,
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

  if (
    hotelSearchRequestQuery.data?.pages.length &&
    !hotelSearchRequestQuery.data?.pages.at(-1)?.searchResults[0].items
      .length &&
    searchQueryStatus.current === 'initial'
  ) {
    searchQueryStatus.current = 'loading'
    startRequestTimeout()
    hotelSocket.connect()
  }

  if (
    hotelSearchRequestQuery.data?.pages.length &&
    hotelSearchRequestQuery.data?.pages.at(-1)?.searchResults[0].items.length
  ) {
    searchQueryStatus.current = 'ended'
  }

  const socketOnAvailability = ({ status }: { status: number }) => {
    clearRequestTimeout()
    searchQueryStatus.current = 'ended'

    hotelSearchRequestQuery.fetchNextPage()
    hotelSocket.disconnect()
  }

  const socketOnConnect = () => {
    if (searchParamsQuery.data?.hotelSearchApiRequest.searchToken) {
      hotelSocket.emit('Auth', {
        searchtoken: searchParamsQuery.data?.hotelSearchApiRequest.searchToken,
      })
    }
    hotelSocket.once('AvailabilityStatus', socketOnAvailability)
  }

  useEffect(() => {
    hotelSocket.once('connect', socketOnConnect)

    return () => {
      hotelSocket.disconnect()
      hotelSocket.off('AvailabilityStatus')
      clearRequestTimeout()
      searchQueryStatus.current = 'initial'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return {
    hotelSearchRequestQuery,
    searchParams,
    searchParamsQuery,
    searchQueryStatus,
  }
}
