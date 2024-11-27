import type { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import cookies from 'js-cookie'

import { serviceRequest, ServiceResponse } from '@/network'

type CheckoutQueryFnType = (
  id: ID
) => UseQueryResult<
  ServiceResponse<ProductPassengerApiResponseModel | undefined>
>

export const useCheckoutQuery: CheckoutQueryFnType = (id) => {
  const searchToken = cookies.get('searchToken')
  const sessionToken = cookies.get('sessionToken')

  return useQuery({
    queryKey: ['checkout', searchToken, sessionToken, id],
    queryFn: async () => {
      const response = await serviceRequest<ProductPassengerApiResponseModel>({
        axiosOptions: {
          url: `api/product/reservationData`,
          withCredentials: true,
          method: 'get',
          params: {
            searchToken,
            sessionToken,
          },
          headers: {
            'Access-Control-Allow-Credentials': true,
          },
        },
      })

      return response
    },
    enabled: !!id,
  })
}
