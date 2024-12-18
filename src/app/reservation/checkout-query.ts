import type { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import cookies from 'js-cookie'

import { serviceRequest, ServiceResponse } from '@/network'
import { reservationParsers } from './searchParams'
import { useQueryStates } from 'nuqs'

type CheckoutQueryFnType = () => UseQueryResult<
  ServiceResponse<ProductPassengerApiResponseModel | undefined>
>

export const useCheckoutQuery: CheckoutQueryFnType = () => {
  const [pageSearchParams] = useQueryStates(reservationParsers)

  return useQuery({
    queryKey: ['checkout', pageSearchParams],
    queryFn: async ({ signal }) => {
      const response = await serviceRequest<ProductPassengerApiResponseModel>({
        axiosOptions: {
          signal,
          url: `api/product/reservationData`,
          withCredentials: true,
          method: 'get',
          params: pageSearchParams,
          headers: {
            'Access-Control-Allow-Credentials': true,
          },
        },
      })

      return response
    },
  })
}
