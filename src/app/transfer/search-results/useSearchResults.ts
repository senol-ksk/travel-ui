import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useQueryStates } from 'nuqs'

import { transferSearchParams } from '@/modules/transfer/searchParams.client'
import { getsecuritytoken, request } from '@/network'
import { TransferSearchResultsResponse } from '@/app/transfer/types'

let appToken: null | string = ''

export const useTransferSearchResults = () => {
  const [searchParams] = useQueryStates(transferSearchParams)

  return useInfiniteQuery({
    enabled: !!searchParams,
    queryKey: ['searchResults', searchParams],
    queryFn: async ({ pageParam, signal }) => {
      if (!appToken) {
        appToken = (await getsecuritytoken()).result
      }
      const transferServiceResponse = (await request({
        signal,
        url: process.env.NEXT_PUBLIC_OL_ROUTE,
        method: 'post',
        headers: {
          appToken,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
        },
        data: {
          ...pageParam,
        },
      })) as TransferSearchResultsResponse

      return transferServiceResponse.data
    },
    initialPageParam: {
      params: {
        appName: process.env.NEXT_PUBLIC_APP_NAME,
        scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
        scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
        searchToken: searchParams.searchToken,
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
        TransferSearchPanel: { ReceivedProviders: [] },
      },
      apiRoute: 'TransferService',
      apiAction: 'api/Transfer/Search',
      sessionToken: searchParams.sessionToken,
      appName: process.env.NEXT_PUBLIC_APP_NAME,
      scopeName: process.env.SCOPE_NAME,
      scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
      requestType:
        'TravelAccess.Core.Models.Transfer.Requests.TransferSearchRequest, Core.Models.Transfer, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
    },
    getNextPageParam: (lastPage, page, lastPageParam) => {
      if (lastPage.hasMoreResponse) {
        lastPageParam.params.TransferSearchPanel.ReceivedProviders = []

        lastPage.searchResults.forEach((result) => {
          const hasValue =
            lastPageParam.params.TransferSearchPanel.ReceivedProviders.find(
              (provider) => provider === result.diagnostics.providerName
            )

          if (!hasValue) {
            lastPageParam.params.TransferSearchPanel?.ReceivedProviders.push(
              // @ts-expect-error - providerName is not defined in the type
              result.diagnostics.providerName
            )
          }
        })

        return { ...lastPageParam }
      }

      appToken = null
      return undefined
    },
  })
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
