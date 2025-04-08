import { serviceRequest } from '@/network'
import { useQuery } from '@tanstack/react-query'

export const useAirlineListQuery = () =>
  useQuery({
    queryKey: ['airline-list'],
    queryFn: async () => {
      const response = await serviceRequest<
        {
          code: string
          value: {
            langCode: string
            value: string
          }[]
          countryCode: string
        }[]
      >({
        axiosOptions: {
          url: 'api/getAirlineList',
        },
      })
      return response
    },
  })
