import { useEffect, useRef } from 'react'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'
import { useLocalStorage, useTimeout } from '@mantine/hooks'

import { getsecuritytoken, request, serviceRequest } from '@/network'
import { HotelSearchRequestParams } from '@/types/hotel'
import { GetSecurityTokenResponse } from '@/types/global'
import {
  HotelCampaignsResponse,
  HotelSearchResultApiResponse,
} from '@/app/hotel/types'
import {
  hotelFilterSearchParams,
  HotelSearchEngineSchemaType,
  hotelSearchParamParser,
} from '@/modules/hotel/searchParams'
import { hotelSocket } from './socket'
import { cleanObj } from '@/libs/util'
import dayjs from 'dayjs'

let appToken: GetSecurityTokenResponse | undefined | null

// const apiActionSearchResponseReadyData = '/api/Hotel/SearchResponseReadyData'
const apiActionSearchResponse = '/api/Hotel/SearchResponse'
const apiGetHotels = '/api/Hotel/GetHotels'

type SlugParams = {
  slug?: string
}

export const useSearchResultParams = ({ slug }: SlugParams) => {
  const searchQueryStatus = useRef<'initial' | 'loading' | 'ended'>('initial')

  const [searchParams, setSearchParams] = useQueryStates(hotelSearchParamParser)
  const [filterParams] = useQueryStates(hotelFilterSearchParams)
  const [localParams, setLocalParams] =
    useLocalStorage<HotelSearchEngineSchemaType>({
      key: 'hotel-search-engine',
    })

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
    queryKey: ['hotel-search-params', searchParams, slug],
    queryFn: async ({ signal }) => {
      let response
      const rooms = searchParams.rooms
        ? searchParams?.rooms
            .flatMap((room) =>
              room.child
                ? room.adult + '-' + room.childAges.join('-')
                : room.adult
            )
            .toString()
        : searchParams.rooms

      if (slug) {
        response = await serviceRequest<HotelSearchRequestParams>({
          axiosOptions: {
            url: 'api/hotel/searchResults',
            params: { ...searchParams, rooms, slug },
            signal,
          },
        })
      } else {
        response = await serviceRequest<HotelSearchRequestParams>({
          axiosOptions: {
            url: 'api/hotel/searchResults',
            params: { ...searchParams, rooms },
            signal,
          },
        })
      }

      if (response?.data) {
        setLocalParams({
          checkinDate: dayjs(
            response.data.hotelSearchApiRequest.hotelSearchModuleRequest
              .checkInDate
          ).toDate(),
          checkoutDate: dayjs(
            response.data.hotelSearchApiRequest.hotelSearchModuleRequest
              .checkOutDate
          ).toDate(),
          destination: {
            id: response.data.hotelSearchApiRequest.hotelSearchModuleRequest.id,
            name: response.data.hotelSearchApiRequest.hotelSearchModuleRequest
              .name,
            slug: response.data.hotelSearchApiRequest.hotelSearchModuleRequest
              .slug,
            type: response.data.hotelSearchApiRequest.hotelSearchModuleRequest
              .type,
          },
          rooms:
            response.data.hotelSearchApiRequest.hotelSearchModuleRequest.rooms,
        })

        setSearchParams({
          checkinDate: dayjs(
            response.data.hotelSearchApiRequest.hotelSearchModuleRequest
              .checkInDate
          ).toDate(),
          checkoutDate: dayjs(
            response.data.hotelSearchApiRequest.hotelSearchModuleRequest
              .checkOutDate
          ).toDate(),
          destination:
            response.data.hotelSearchApiRequest.hotelSearchModuleRequest.name,
          slug: response.data.hotelSearchApiRequest.hotelSearchModuleRequest
            .slug,
          type: response.data.hotelSearchApiRequest.hotelSearchModuleRequest
            .type,
          rooms:
            response.data.hotelSearchApiRequest.hotelSearchModuleRequest.rooms,
        })
      }

      return response?.data
    },
  })
  const searchRequestParams = searchParamsQuery.data?.hotelSearchApiRequest
  const cleanFilterParams = cleanObj(filterParams)

  const hotelSearchRequestQuery = useInfiniteQuery({
    enabled: !!searchRequestParams,
    queryKey: [
      'hotel-search-results',
      searchRequestParams,
      cleanFilterParams,
      slug,
    ],
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
          // apiAction: slug ? apiGetHotels : apiActionSearchResponse,
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
    hotelSocket.emit('Auth', {
      searchtoken: searchRequestParams?.searchToken,
    })
  }

  if (
    hotelSearchRequestQuery.data?.pages.length &&
    hotelSearchRequestQuery.data?.pages.at(-1)?.searchResults[0].items.length
  ) {
    searchQueryStatus.current = 'ended'
  }

  const hotelCampaignsQuery = useQuery({
    enabled: !!searchRequestParams?.hotelSearchModuleRequest.countryCode,
    queryKey: [
      'hotel-search-campaigns',
      searchRequestParams?.hotelSearchModuleRequest.countryCode,
    ],
    queryFn: async () => {
      const response = await request({
        url: `${process.env.NEXT_PUBLIC_SERVICE_PATH}/hotel/GetCampaigns`,
        method: 'get',
        params: {
          countryCode:
            searchRequestParams?.hotelSearchModuleRequest.countryCode,
        },
      })

      return response as HotelCampaignsResponse[]
    },
  })

  const socketOnAvailability = ({ status }: { status: number }) => {
    clearRequestTimeout()
    searchQueryStatus.current = 'ended'

    hotelSearchRequestQuery.fetchNextPage()
    hotelSocket.disconnect()
  }

  useEffect(() => {
    hotelSocket.once('AvailabilityStatus', socketOnAvailability)

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
    searchParamsQuery,
    searchQueryStatus,
    hotelCampaignsQuery,
  }
}
