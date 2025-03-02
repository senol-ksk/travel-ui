import { getsecuritytoken, request } from '@/network'
import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
  keepPreviousData,
} from '@tanstack/react-query'

import { GetSecurityTokenResponse } from '@/types/global'
import { useEffect, useRef, useState } from 'react'
import type { CarSearchRequest, CarSearchResult } from '@/app/car/types'
import { useTimeout } from '@mantine/hooks'
import { delayCodeExecution } from '@/libs/util'

type UseCarSearch = (
  params: CarSearchRequest
) => UseInfiniteQueryResult<InfiniteData<CarSearchResult>>

let appToken: GetSecurityTokenResponse | undefined | null

export const useCarSearchResults: UseCarSearch = (params) => {
  return useInfiniteQuery({
    // placeholderData: keepPreviousData,
    queryKey: ['car-search-result', params],
    queryFn: async ({ pageParam, signal }) => {
      if (!appToken) {
        appToken = await getsecuritytoken()
      }

      await delayCodeExecution(2000)

      const {
        params: { carRentalSearchPanel },
        ...restParams
      } = params
      const response = (await request({
        url: `${process.env.NEXT_PUBLIC_OL_ROUTE}`,
        method: 'post',
        data: {
          ...restParams,
          params: {
            ...params.params,
            carRentalSearchPanel: {
              ...carRentalSearchPanel,
              receivedProviders: pageParam.receivedProviders.filter(Boolean),
            },
          },
        },
        headers: {
          appToken: appToken.result,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
        },
        signal,
      })) as CarSearchResult

      return response
      // return dummyResponse as CarSearchResult
    },
    initialPageParam: {
      receivedProviders: [''],
      requestCount: 0,
    },
    getNextPageParam: (lastPage, page, lastPageParam) => {
      if (!lastPage.data.hasMoreResponse || lastPageParam.requestCount === 1) {
        return undefined
      }

      const receivedProviders: string[] = lastPageParam.receivedProviders
      if (lastPage?.data?.searchResults.length) {
        lastPage.data.searchResults.forEach((searchResult) => {
          receivedProviders.push(searchResult.diagnostics.providerName)
        })
      }

      return {
        receivedProviders: [...new Set(receivedProviders.filter(Boolean))],
        requestCount: lastPageParam.requestCount + 1,
      }
    },
  })
}
