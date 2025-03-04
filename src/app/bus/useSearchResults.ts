import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { busSearchParams } from '@/modules/bus/searchParams'
import {
  getBusSearchSessionToken,
  getsecuritytoken,
  request,
  serviceRequest,
} from '@/network'
import { BusSearchResponse, BusSeatApiResponse, Seat } from '@/app/bus/types'
import { delayCodeExecution } from '@/libs/util'

export const useSearchRequest = () => {
  const [searchParams] = useQueryStates(busSearchParams)

  const appTokenQuery = useQuery({
    queryKey: ['app-token'],
    queryFn: async () => {
      const response = await getsecuritytoken()

      return response.result
    },
  })

  const searchSessionTokenQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['bus-search-session-tokens', searchParams],
    queryFn: async () => {
      const response = await getBusSearchSessionToken()

      return response
    },
  })

  const appToken = appTokenQuery.data
  const searchToken = searchSessionTokenQuery.data?.searchToken
  const sessionToken = searchSessionTokenQuery.data?.sessionToken

  const searchRequestQuery = useInfiniteQuery({
    queryKey: [
      'search-request',
      { searchParams, sessionToken, searchToken },
      appToken,
    ],
    queryFn: async ({ signal, pageParam }) => {
      await delayCodeExecution(1000)
      const response = (await request({
        signal,
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
      searchToken: searchSessionTokenQuery.data?.searchToken,
      ScopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
      ScopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
      SearchToken: searchToken,
      SessionToken: sessionToken,
      AppName: process.env.NEXT_PUBLIC_APP_NAME,
      ReturnDiagnostics: 0,
      TraceId: searchToken,
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

      return undefined
    },
    // enabled: false,
    enabled: !!searchSessionTokenQuery.data,
  })

  const useBusSeatMutation = () => {
    return useMutation({
      mutationKey: ['bus-selected-item'],
      mutationFn: async (ProductKey: string) => {
        const response = (await request({
          url: process.env.NEXT_PUBLIC_OL_ROUTE,
          method: 'post',
          data: {
            params: {
              SearchToken: searchToken,
              ProductKey: ProductKey,
              SessionToken: sessionToken,
              ReturnDiagnostics: 0,
              AppName: process.env.NEXT_PUBLIC_APP_NAME,
              ScopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            },
            apiRoute: 'BusService',
            apiAction: '/api/Bus/Detail',
            sessionToken: sessionToken,
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
          },
          headers: {
            appToken,
            appName: process.env.NEXT_PUBLIC_APP_NAME,
          },
        })) as BusSeatApiResponse | null | undefined

        return response?.data
      },
    })
  }

  const useSeatControlMutation = () => {
    const [searchParams] = useQueryStates(busSearchParams)

    return useMutation({
      mutationKey: ['bus-seat-control'],
      mutationFn: async ({
        selectedSeats,
        productKey,
      }: {
        selectedSeats: Seat[]
        productKey: string
      }) => {
        const response = (await request({
          url: process.env.NEXT_PUBLIC_OL_ROUTE,
          method: 'post',
          data: {
            params: {
              selectedSeats,
              ProductKey: productKey,
              SearchToken: searchToken,
              SessionToken: sessionToken,
              ReturnDiagnostics: 0,
              AppName: process.env.NEXT_PUBLIC_APP_NAME,
              ScopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            },
            apiRoute: 'BusService',
            apiAction: '/api/bus/SeatControl',
            sessionToken: sessionToken,
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
          },
          headers: {
            appToken,
            appName: process.env.NEXT_PUBLIC_APP_NAME,
          },
        })) as { data: { isSucceeded: boolean; status: boolean } }
        return (
          response?.data && response?.data.isSucceeded && response.data.status
        )
      },
    })
  }

  const useBusSearchInitPaymentProcess = () => {
    const [searchParams] = useQueryStates(busSearchParams)

    return useMutation({
      mutationKey: ['bus-init-payment'],
      mutationFn: async (productKey: string) => {
        const response = await serviceRequest<BusPaymentSummaryInitResponse>({
          axiosOptions: {
            url: 'api/bus/reservation',
            method: 'post',
            data: {
              searchToken: searchToken,
              sessionToken: sessionToken,
              ProductKey: productKey,
              appName: process.env.NEXT_PUBLIC_APP_NAME,
              scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
              scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            },
          },
        })

        return response?.data
      },
    })
  }

  return {
    searchRequestQuery,
    useBusSeatMutation,
    useSeatControlMutation,
    useBusSearchInitPaymentProcess,
    searchToken,
    sessionToken,
    searchSessionTokenQuery,
  }
}

type BusPaymentSummaryInitResponse = {
  busJourney: {
    id: ID
    companyId: ID
    company: string
    busType: string
    totalSeats: number
    availableSeats: number
    bus: {
      kind: string
      trackingNo: string
      lineNo: number
      origin: null
      destination: string
      departureDate: string
      arrivalDate: string
      duration: string
      originalPrice: ServicePriceType
      internetPrice: ServicePriceType
      busName: null
      policy: null
      features: null
      description: ''
      available: true
    }
    totalCommission: ServicePriceType
    buyServiceFee: number
    sellServiceFee: number
    features: []
    origin: string
    originId: ID
    destination: string
    destinationId: ID
    isActive: boolean
    cancellationOffset: number
    hasBusShuttle: boolean
    isHesCodeRequired: true
    disableSingleSeatSelection: boolean
    changeOffset: number
    selectedSeats: {
      no: number
      status: number
      sideStatus: number
      type: number
      paxId: ID
      paxType: number
      gender: number
      age: number
      discount: ServicePriceType
      totalPrice: ServicePriceType
      servicePrice: ServicePriceType
      basePrice: ServicePriceType
      taxes: ServicePriceType
      totalCommission: ServicePriceType
      buyServiceFee: number
      sellServiceFee: number
    }[]
    routeInfos: {
      destination: string
      priority: number
      departureDate: string
      arrivalDate: string
      locationPointId: ID
      locationPoint: string
    }[]
    key: string
    totalPrice: ServicePriceType
    basePrice: ServicePriceType
    taxes: ServicePriceType
    discount: ServicePriceType
    buyFee: ServiceFeePriceType
    fee: ServiceFeePriceType
    passengerPrices: null
    taxInfos: null
    serviceCharges: null
  }
}
