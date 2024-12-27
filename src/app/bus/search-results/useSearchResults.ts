import { useInfiniteQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { busSearchParams } from '@/modules/bus/searchParmas'
import { getsecuritytoken, request } from '@/network'
import { BusSearchResponse } from '@/app/bus/search-results/types'

let appToken: null | string = ''

interface BusSearchParams {
  Origin: ID
  Destination: ID
  Date: string
  ReceivedProviders: string[] | []
  PackageSearchType: number
  Tags: []
  Domestic: boolean
  searchToken: string
  ScopeName: string
  ScopeCode: string
  SearchToken: string
  SessionToken: string
  AppName: string
  ReturnDiagnostics: number
  TraceId: string
}

export const useSearchRequest = () => {
  const [searchParams] = useQueryStates(busSearchParams)

  return useInfiniteQuery({
    queryKey: ['search-request', searchParams],
    queryFn: async ({ signal, pageParam }) => {
      if (!appToken) {
        appToken = (await getsecuritytoken()).result
      }

      const response = (await request({
        url: process.env.NEXT_PUBLIC_OL_ROUTE,
        method: 'post',
        data: {
          params: {
            Origin: pageParam.Origin,
            Destination: pageParam.Destination,
            Date: pageParam.Date,
            ReceivedProviders: pageParam.ReceivedProviders,
            PackageSearchType: 0,
            Tags: [],
            Domestic: false,
            searchToken: pageParam.SearchToken,
            ScopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            ScopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            SearchToken: pageParam.SearchToken,
            SessionToken: pageParam.SessionToken,
            AppName: process.env.NEXT_PUBLIC_APP_NAME,
            ReturnDiagnostics: 0,
            TraceId: pageParam.searchToken,
          },
          apiRoute: 'BusService',
          apiAction: '/api/Bus/Search',
          sessionToken: pageParam.SessionToken,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
          scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
          scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
          RequestType:
            'TravelAccess.Core.Models.Bus.BusSearchRequest, TravelAccess.Core.Models.Bus, Version=1.0.4',
        },
        headers: {
          appToken,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
        },
      })) as BusSearchResponse | null | undefined

      return response?.data
    },
    initialPageParam: {
      Origin: searchParams.originId,
      Destination: searchParams.destinationId,
      Date: searchParams.date,
      ReceivedProviders: [],
      PackageSearchType: 0,
      Tags: [],
      Domestic: false,
      searchToken: searchParams.searchToken,
      ScopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
      ScopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
      SearchToken: searchParams.searchToken,
      SessionToken: searchParams.sessionToken,
      AppName: process.env.NEXT_PUBLIC_APP_NAME,
      ReturnDiagnostics: 0,
      TraceId: searchParams.searchToken,
    },
    getNextPageParam: (lastPage, page, lastPageParam, allPageParam) => {
      if (lastPage?.hasMoreResponse) {
        lastPage.searchResults.forEach((searchResult) => {
          if (
            !lastPageParam.ReceivedProviders.find(
              (provider) => searchResult.diagnostics.providerName
            )
          ) {
            lastPageParam.ReceivedProviders.push(
              // @ts-expect-error - providerName is not defined in the type
              searchResult.diagnostics.providerName
            )
          }
        })

        return {
          ...lastPageParam,
        }
      }

      appToken = null
      return undefined
    },
    enabled: !!searchParams,
  })
}
