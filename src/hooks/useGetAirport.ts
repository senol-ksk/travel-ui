import { AirportCodeServiceResponse } from '@/app/flight/type'
import { request } from '@/network'
import { useQuery } from '@tanstack/react-query'

const useGetAirportByCodeList = (codes: string[]) => {
  return useQuery({
    enabled: codes.filter((code) => code.length).length > 0,
    queryKey: ['airport-list', codes],
    queryFn: async () => {
      const response = (await request({
        url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/flight/getairportbycodelist`,
        params: {
          l: 'tr_TR',
          cl: codes.toString(),
        },
      })) as AirportCodeServiceResponse

      return response
    },
    select(data) {
      return data.Result
    },
  })
}

export { useGetAirportByCodeList }
