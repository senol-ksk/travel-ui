import { useQueryStates } from 'nuqs'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { hotelDetailSearchParams } from '@/modules/hotel/searchParams'
import { serviceRequest } from '@/network'
import { HotelDetailApiResponseData } from '@/app/hotel/types'
import { delayCodeExecution } from '@/libs/util'
// import { hotelDetailDummyData, hotelDetailRoomDummyData } from './dummy'

const useHotelDataQuery = () => {
  const [searchParams] = useQueryStates(hotelDetailSearchParams)

  const hotelDetailQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['hotel-detail', searchParams],
    queryFn: async ({ signal }) => {
      const response = await serviceRequest<HotelDetailApiResponseData>({
        axiosOptions: {
          signal,
          url: 'api/hotel/detail',
          method: 'post',

          params: {
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            ...searchParams,
            hotelSlug: searchParams.hotelSlug,
          },
        },
      })

      return response

      // return {
      //   data: hotelDetailDummyData,
      //   success: true,
      // }
    },
  })

  const searchPanel = hotelDetailQuery.data?.data?.searchPanel

  const roomsQuery = useInfiniteQuery({
    enabled: !!searchPanel,
    queryKey: [
      'hotel-rooms',
      searchParams,
      hotelDetailQuery.data?.data?.productKey,
      searchPanel?.checkInDate,
      searchPanel?.checkOutDate,
    ],
    initialPageParam: {
      page: 0,
    },
    queryFn: async ({ signal, pageParam }) => {
      await delayCodeExecution(2000) // somehow the request should wait, otherwise request will be failed
      const response = await serviceRequest<HotelDetailApiResponseData>({
        axiosOptions: {
          signal,
          url: 'api/hotel/rooms',
          method: 'post',
          data: {
            sessionToken: searchParams.sessionToken,
            searchToken: searchParams.searchToken,
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            slug: searchParams.hotelSlug,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            productKey: hotelDetailQuery.data?.data?.productKey,
            isSearch: false,
            checkInDate: searchPanel?.checkInDate,
            checkOutDate: searchPanel?.checkOutDate,
            page: pageParam.page,
            size: 5,
          },
        },
      })

      return response

      // return {
      //   data: hotelDetailRoomDummyData,
      //   success: true,
      // }
    },
    retryDelay(failureCount, error) {
      return 1000
    },
    retry: (data) => {
      return true
    },
    getNextPageParam: (lastPage, allPages, lastPageParams, allPageParams) => {
      if (lastPage?.data?.hotelDetailResponse?.isLoadProducts) {
        return {
          page: lastPageParams.page + 1,
        }
      }
      return undefined
    },
  })

  return { hotelDetailQuery, roomsQuery }
}

export { useHotelDataQuery }
