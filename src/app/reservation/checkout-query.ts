import type { ProductPassengerApiResponseModel } from '@/@types/passengerViewModel'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import cookies from 'js-cookie'

import { serviceRequest } from '@/network'

type CheckoutQueryFnType =
  () => UseQueryResult<ProductPassengerApiResponseModel>

export const useCheckoutQuery: CheckoutQueryFnType = () => {
  const searchToken = cookies.get('searchToken')
  const sessionToken = cookies.get('sessionToken')

  return useQuery({
    queryKey: ['checkout', searchToken, sessionToken],
    queryFn: async () => {
      const response = await serviceRequest<ProductPassengerApiResponseModel>({
        axiosOptions: {
          url: `/Product/ProductPassengerViewWebApi`,
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
    enabled: !!searchToken,
  })
}
