import { request } from '@/network'
import { OfficialHolidayServiceResponse } from '@/types/global'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

const startDate = dayjs()
const endDate = startDate.add(1, 'year')

const useOfficialHolidayQuery = () =>
  useQuery({
    queryKey: ['official-holidays'],
    queryFn: async () => {
      const response = (await request({
        url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/c/v1.1/api/OfficialHoliday/GetOfficialHolidayListStr`,
        method: 'get',
        params: {
          l: 'tr_TR',
          s: startDate.toISOString(),
          e: endDate.toISOString(),
        },
      })) as OfficialHolidayServiceResponse

      return response
    },
  })

export { useOfficialHolidayQuery }
