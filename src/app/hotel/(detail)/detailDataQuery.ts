import { useRef } from 'react'
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

const useHotelDataQuery = () => {
  const [searchParams, setSearchParams] = useQueryStates(
    hotelDetailSearchParams
  )

  const hotelDetailQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['hotel-detail', searchParams],
    queryFn: async () => {
      const response = await serviceRequest<HotelDetailApiResponseData>({
        axiosOptions: {
          // signal,
          url: 'api/hotel/detail',
          method: 'post',
          data: {
            ...searchParams,
          },
        },
      })

      return response
    },
  })

  const searchPanel = hotelDetailQuery.data?.data?.searchPanel
  const roomRefetchCount = useRef(5)
  const hotelProductKey = hotelDetailQuery.data?.data?.productKey

  if (
    !(searchParams.searchToken || searchParams.sessionToken) &&
    (hotelDetailQuery.data?.data?.searchToken ||
      hotelDetailQuery.data?.data?.sessionToken)
  ) {
    setSearchParams({
      searchToken: hotelDetailQuery.data?.data?.searchToken,
      sessionToken: hotelDetailQuery.data?.data?.sessionToken,
      productKey: hotelProductKey,
    })
  }

  const roomsQuery = useInfiniteQuery({
    enabled: !!hotelDetailQuery.data?.data?.productKey,
    queryKey: [
      'hotel-rooms',
      searchParams,
      hotelDetailQuery.data?.data?.sessionToken,
      hotelDetailQuery.data?.data?.searchToken,
      searchParams.hotelSlug,
      hotelProductKey,
      roomRefetchCount.current,
    ],
    initialPageParam: {
      page: 1,
    },
    queryFn: async ({ signal, pageParam }) => {
      await delayCodeExecution(1000)

      const response = await serviceRequest<HotelDetailApiResponseData>({
        axiosOptions: {
          signal,
          url: 'api/hotel/rooms',
          method: 'post',
          data: {
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            sessionToken: hotelDetailQuery.data?.data?.sessionToken,
            searchToken: hotelDetailQuery.data?.data?.searchToken,
            slug: searchParams.hotelSlug,
            productKey: hotelProductKey,
            checkInDate: searchParams.checkInDate,
            checkOutDate: searchParams.checkOutDate,
            page: pageParam.page,
            size: 5,
            rooms: searchParams.rooms,
          },
        },
      })

      if (!response?.success) {
        throw new Error('no error')
      }

      return response
    },
    retry: 5,
    retryDelay: 1000,
    getNextPageParam: (lastPage, allPages, lastPageParams, allPageParams) => {
      if (lastPage?.data?.hotelDetailResponse?.isLoadProducts) {
        return {
          page: lastPageParams.page + 1,
        }
      }

      return undefined
    },
  })

  const selectedRoomMutation: UseMutationResult<
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
    selectedRoomMutation,
    searchParams,
    setSearchParams,
    roomInstallmentQuery,
  }
}

export { useHotelDataQuery }
