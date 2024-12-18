import { getsecuritytoken, request } from '@/network'
import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from '@tanstack/react-query'

import { GetSecurityTokenResponse } from '@/types/global'
import { useState } from 'react'
import type { CarSearchRequest, CarSearchResult } from '@/app/car/types'
import { useTimeout } from '@mantine/hooks'

type UseCarSearch = (
  params: CarSearchRequest
) => UseInfiniteQueryResult<InfiniteData<CarSearchResult>>

let appToken: GetSecurityTokenResponse | undefined | null
const receivedProviders: string[] = []
let prevSearchToken: string = ''

export const useCarSearchResults: UseCarSearch = (params) => {
  const [timeoutEnded, setTimeoutEnded] = useState(false)
  const { start: startTimeout, clear: clearTimeout } = useTimeout(
    () => {
      receivedProviders.splice(0, receivedProviders.length)
      appToken = null
      setTimeoutEnded(true)
    },
    30000,
    { autoInvoke: true }
  )

  return useInfiniteQuery({
    queryKey: ['car-search-result', params],
    queryFn: async ({ pageParam, signal }) => {
      if (!appToken || prevSearchToken !== params.params.searchToken) {
        prevSearchToken = params.params.searchToken
        receivedProviders.splice(0, receivedProviders.length)

        clearTimeout()
        startTimeout()
        setTimeoutEnded(false)
        appToken = await getsecuritytoken()
      }

      const response = (await request({
        url: `${process.env.NEXT_PUBLIC_OL_ROUTE}`,
        method: 'post',
        data: { ...pageParam },
        headers: {
          appToken: appToken.result,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
        },
        signal,
      })) as CarSearchResult

      return response
      // return dummyresponse
    },
    initialPageParam: params,
    getNextPageParam: (lastPage, page, lastPageParam, allPageParam) => {
      if (lastPage.data.searchResults.length) {
        lastPage.data.searchResults.forEach((searchResult) => {
          receivedProviders.push(searchResult.diagnostics.providerName)
        })
      }

      if (!lastPage.data.hasMoreResponse || timeoutEnded) {
        appToken = null
        prevSearchToken = ''
        clearTimeout()
        return undefined
      }

      return {
        ...lastPageParam,
        params: {
          ...lastPageParam.params,
          carRentalSearchPanel: {
            ...lastPageParam.params.carRentalSearchPanel,
            receivedProviders: [...new Set(receivedProviders)],
          },
        },
      }
    },
  })
}
