import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useQueryStates } from 'nuqs'

import { transferSearchParams } from '@/modules/transfer/searchParams.client'
import { getBusSearchSessionToken, request } from '@/network'
import { TransferSearchResultsResponse } from '@/app/transfer/types'
import { delayCodeExecution } from '@/libs/util'

export const useTransferSearchResults = () => {
  const [searchParams] = useQueryStates(transferSearchParams)

  const searchSessionTokenQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['transfer-session-search-tokens'],
    queryFn: async () => {
      const response = await getBusSearchSessionToken()
      return response
    },
  })

  const searchToken = searchSessionTokenQuery.data?.searchToken
  const sessionToken = searchSessionTokenQuery.data?.sessionToken
  const appToken = searchSessionTokenQuery.data?.appToken

  const searchResultsQuery = useInfiniteQuery({
    enabled: !!(appToken && searchToken && sessionToken),
    queryKey: [
      'searchResults',
      { searchParams, appToken, searchToken, sessionToken },
    ],
    queryFn: async ({ pageParam, signal }) => {
      await delayCodeExecution(1000)
      const transferServiceResponse = (await request({
        signal,
        url: process.env.NEXT_PUBLIC_OL_ROUTE,
        method: 'post',
        headers: {
          appToken,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
        },
        data: {
          params: {
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            searchToken,
            PickupPointId: searchParams.originId,
            DropPointId: searchParams.destinationId,
            TransferDate:
              dayjs(searchParams.date).format('YYYY-MM-DD') +
              ' ' +
              searchParams.time,
            AdultPassengerCount: searchParams.adultPassengerCount,
            ChildrenPassengerCount: searchParams.childrenPassengerCount,
            BabyPassengerCount: searchParams.babyPassengerCount,
            TransferType: 'D',
            TransferSearchPanel: {
              ReceivedProviders: pageParam.ReceivedProviders.filter(Boolean),
            },
          },
          apiRoute: 'TransferService',
          apiAction: 'api/Transfer/Search',
          sessionToken,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
          scopeName: process.env.SCOPE_NAME,
          scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
          requestType:
            'TravelAccess.Core.Models.Transfer.Requests.TransferSearchRequest, Core.Models.Transfer, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
        },
      })) as TransferSearchResultsResponse

      return transferServiceResponse.data
    },
    initialPageParam: {
      ReceivedProviders: [''],
    },
    getNextPageParam: (lastPage, page, lastPageParam) => {
      if (lastPage.hasMoreResponse) {
        lastPage.searchResults.forEach((result) => {
          const hasValue = lastPageParam.ReceivedProviders.find(
            (provider) => provider === result.diagnostics.providerName
          )

          if (!hasValue) {
            lastPageParam.ReceivedProviders.push(
              result.diagnostics.providerName
            )
          }
        })

        return { ...lastPageParam }
      }

      return undefined
    },
  })

  return { searchResultsQuery, sessionToken, searchToken, searchParams }
}

interface TransferApiSearchParams {
  params: {
    appName: string
    scopeName: string
    scopeCode: string
    searchToken: string
    PickupPointId: string
    DropPointId: string
    TransferDate: string
    AdultPassengerCount: number
    ChildrenPassengerCount: number
    BabyPassengerCount: number
    TransferType: 'D'
    TransferSearchPanel: null | { ReceivedProviders: string[] }
  }
  apiRoute: string
  apiAction: 'api/Transfer/Search'
  sessionToken: string
  appName: string
  scopeName: string
  scopeCode: string
  requestType: 'TravelAccess.Core.Models.Transfer.Requests.TransferSearchRequest, Core.Models.Transfer, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
}
