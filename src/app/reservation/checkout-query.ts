import type { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { serviceRequest, ServiceResponse } from '@/network'
import { reservationParsers } from '@/app/reservation/searchParams'

type CheckoutQueryFnType = () => UseQueryResult<
  ServiceResponse<ProductPassengerApiResponseModel | undefined>
>

export const useCheckoutQuery: CheckoutQueryFnType = () => {
  const [{ searchToken, sessionToken, productKey }] =
    useQueryStates(reservationParsers)

  return useQuery({
    queryKey: ['checkout', [searchToken, sessionToken, productKey]],
    queryFn: async ({ signal }) => {
      const response = await serviceRequest<ProductPassengerApiResponseModel>({
        axiosOptions: {
          signal,
          url: `api/product/reservationData`,
          withCredentials: true,
          method: 'get',
          params: {
            searchToken,
            sessionToken,
            productKey,
          },
          headers: {
            'Access-Control-Allow-Credentials': '*',
          },
        },
      })

      return response
    },
  })
}
