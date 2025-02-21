import { tourDetailPageParamParser } from '@/modules/tour/detailSearchParams'
import { TourDetailApiResponse } from '@/modules/tour/type'
import { serviceRequest } from '@/network'
import { useQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

const useTourDetailQuery = () => {
  const [searchParams] = useQueryStates(tourDetailPageParamParser)

  return useQuery({
    enabled: !!searchParams,
    queryKey: ['tour-detail-page', searchParams],
    queryFn: async () => {
      const response = await serviceRequest<TourDetailApiResponse>({
        axiosOptions: {
          url: 'api/tour/detail',
          method: 'post',
          params: {
            package: searchParams.productKey,
            url: searchParams.slug,
            searchToken: searchParams.searchToken,
            sessionToken: searchParams.sessionToken,
          },
        },
      })

      return response?.data || null
    },
  })
}

export { useTourDetailQuery }
