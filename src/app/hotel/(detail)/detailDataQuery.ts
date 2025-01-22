import { useQueryStates } from 'nuqs'
import {
  useInfiniteQuery,
  useMutation,
  UseMutationResult,
  useQuery,
} from '@tanstack/react-query'

import { hotelDetailSearchParams } from '@/modules/hotel/searchParams'
import { serviceRequest, ServiceResponse } from '@/network'
import {
  HotelDetailApiResponseData,
  HotelDetailInstallmentData,
  HotelDetailRoomStatusResponseData,
} from '@/app/hotel/types'
import { delayCodeExecution } from '@/libs/util'
import { useRef } from 'react'
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
  const roomRefetchCount = useRef(5)

  const roomsQuery = useInfiniteQuery({
    enabled: !!searchPanel,
    queryKey: [
      'hotel-rooms',
      searchParams,
      hotelDetailQuery.data?.data?.productKey,
      searchPanel?.checkInDate,
      searchPanel?.checkOutDate,
      roomRefetchCount.current,
    ],
    initialPageParam: {
      page: 0,
    },
    queryFn: async ({ signal, pageParam }) => {
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

      if (!response?.data && roomRefetchCount.current >= 0) {
        await delayCodeExecution(1000)
        return null
      }

      return response
    },
    refetchInterval: (query) => {
      if (roomRefetchCount.current === 0) {
        return 0
      }
      if (
        !query.state.data?.pages.at(0)?.success &&
        roomRefetchCount.current >= 0
      ) {
        return 1000
      }

      return 0
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

  const selectedRoomMutaion: UseMutationResult<
    ServiceResponse<HotelDetailRoomStatusResponseData> | undefined,
    Error,
    {
      productKey: string
      cancelWarranty: boolean
    },
    unknown
  > = useMutation({
    mutationKey: ['hotel-detail-selected-room'],
    mutationFn: async ({
      productKey,
      cancelWarranty,
    }: {
      productKey: string
      cancelWarranty: boolean
    }) => {
      const response = serviceRequest<HotelDetailRoomStatusResponseData>({
        axiosOptions: {
          url: 'api/hotel/checkRoomState',
          method: 'post',
          data: {
            productKey,
            cancelWarranty,
            searchToken: searchPanel?.searchToken,
            sessionToken: searchPanel?.sessionToken,
          },
        },
      })

      return response
    },
  })

  const roomInstallmentQuery = useMutation({
    mutationKey: ['hotel-detail-room-installment'],
    mutationFn: async ({ countryCode }: { countryCode: string }) => {
      const response = await serviceRequest<HotelDetailInstallmentData>({
        axiosOptions: {
          url: 'api/hotel/getInstallment',
          data: {
            countryCode,
          },
          params: { countryCode },
        },
      })

      return response
    },
  })

  return {
    hotelDetailQuery,
    roomsQuery,
    selectedRoomMutaion,
    searchParams,
    roomInstallmentQuery,
  }
}

export { useHotelDataQuery }
