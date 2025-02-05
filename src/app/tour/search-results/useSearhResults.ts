import { useQueryStates } from 'nuqs'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import { tourSearchResultParamParser } from '@/modules/tour/searchResultParams'
import { getsecuritytoken, request, serviceRequest } from '@/network'
import {
  TourSearchApiParamsResponse,
  TourSearchResultApiResponse,
} from '@/modules/tour/type'
import { GetSecurityTokenResponse } from '@/types/global'
import { delayCodeExecution } from '@/libs/util'

let appToken: GetSecurityTokenResponse | undefined | null

export const useTourSearchResultsQuery = () => {
  const [searchParams] = useQueryStates(tourSearchResultParamParser)

  const searchParamsQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['tour-search-params', searchParams],
    queryFn: async ({ signal }) => {
      const response = await serviceRequest<TourSearchApiParamsResponse>({
        axiosOptions: {
          signal,
          url: 'api/tour/searchParams',
          method: 'post',
          params: searchParams,
        },
      })

      return response
    },
  })

  const searchResultsQuery = useInfiniteQuery({
    enabled: !!searchParamsQuery.data?.data,
    queryKey: ['tour-search-results', searchParams],
    queryFn: async ({ signal, pageParam }) => {
      if (!appToken) {
        appToken = await getsecuritytoken()
      }

      await delayCodeExecution(1000)
      const response = (await request({
        signal,
        url: process.env.NEXT_PUBLIC_OL_ROUTE,
        method: 'post',
        data: { ...pageParam },
        headers: {
          appToken: appToken.result,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
        },
      })) as TourSearchResultApiResponse

      return response
    },
    initialPageParam: searchParamsQuery.data?.data,
    getNextPageParam: (lastPage, page, lastPageParam, allPageParams) => {
      if (lastPage?.data?.hasMoreResponse) {
        if (lastPage.data.searchResults.length) {
          lastPage.data.searchResults.forEach((searchResult) => {
            const providerName = searchResult.diagnostics.providerName
            if (
              !lastPageParam?.params.tourSearchRequest.receivedProviders.includes(
                providerName
              )
            ) {
              lastPageParam?.params.tourSearchRequest.receivedProviders.push(
                providerName
              )
            }
          })
        }

        return lastPageParam
      }

      return undefined
    },
  })

  return { searchResultsQuery, searchParamsQuery }
}
