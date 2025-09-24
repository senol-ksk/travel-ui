import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useRef } from 'react'
import { createSerializer, useQueryStates } from 'nuqs'
import { useTransitionRouter } from 'next-view-transitions'

import { flightSearchParams } from '@/modules/flight/searchParams'
import type {
  AirlineCodeServiceResponse,
  AirportCode,
  AirportCodeServiceResponse,
  ClientDataType,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
  FlightSearchResultsApiResponse,
} from '@/app/flight/type'
import {
  getFlightSearchSessionToken,
  getsecuritytoken,
  request,
  serviceRequest,
} from '@/network'

import { delayCodeExecution } from '@/libs/util'
import { reservationParsers } from '@/app/reservation/searchParams'

const requestedDayFormat = 'YYYY-MM-DD'

import { removeDuplicateFlights } from './search-results/filter-actions'
import { useTimeout } from '@mantine/hooks'

const useSearchResultsQueries = () => {
  const airPortFlatList: Array<AirportCode> = useRef([]).current
  const [searchParams] = useQueryStates(flightSearchParams)

  const appToken = useRef<string>(null)
  const router = useTransitionRouter()

  const generateFlightSearchPanel = () => {
    const FlightSearchPanel = {
      ActiveTripKind: searchParams.activeTripKind,
      SearchLegs: [
        {
          DepartureTime: dayjs(searchParams.departureDate).format(
            requestedDayFormat
          ),
          CabinClass: searchParams.cabinClass?.value,
          MaxConnections: 0,
          Origin: {
            code: searchParams.origin?.code,
            iata: searchParams.origin?.iata,
            type: searchParams.origin?.type,
            isDomestic: searchParams.origin?.isDomestic,
            id: searchParams?.origin?.id,
          },
          Destination: {
            code: searchParams.destination?.code,
            iata: searchParams.destination?.iata,
            type: searchParams.destination?.type,
            isDomestic: searchParams.destination?.isDomestic,
            id: searchParams?.destination?.id,
          },
        },
      ],
      PassengerCounts: searchParams.passengerCounts,
      Domestic:
        searchParams.destination?.isDomestic && searchParams.origin?.isDomestic,
      CabinClass: searchParams.cabinClass,
    }

    if (searchParams.activeTripKind === '2') {
      FlightSearchPanel.SearchLegs.push({
        DepartureTime: dayjs(searchParams.returnDate).format(
          requestedDayFormat
        ),
        CabinClass: searchParams.cabinClass?.value,
        MaxConnections: 0,
        Destination: {
          code: searchParams.origin?.code,
          iata: searchParams.origin?.iata,
          type: searchParams.origin?.type,
          isDomestic: searchParams.origin?.isDomestic,
          id: searchParams.origin?.id,
        },
        Origin: {
          code: searchParams.destination?.code,
          iata: searchParams.destination?.iata,
          type: searchParams.destination?.type,
          isDomestic: searchParams.destination?.isDomestic,
          id: searchParams.destination?.id,
        },
      })
    }

    return FlightSearchPanel
  }

  const searchSessionTokenQuery = useQuery({
    // enabled: false,
    enabled: !!searchParams,
    queryKey: ['flight-search-token', searchParams],
    queryFn: async () => {
      const response = await getFlightSearchSessionToken()

      return response
    },
    staleTime: 30000,
  })

  const searchQueryKey = [
    'flight-search-results',
    searchSessionTokenQuery.data?.searchToken,
    searchSessionTokenQuery.data?.sessionToken,
    appToken.current,
  ]

  const searchResultsQuery = useInfiniteQuery({
    queryKey: searchQueryKey,
    enabled: !!searchSessionTokenQuery.data,
    initialPageParam: {
      ReceivedProviders: [''],
    },
    queryFn: async ({ pageParam, signal }) => {
      if (!appToken.current) {
        appToken.current = (await getsecuritytoken()).result
      }
      await delayCodeExecution(1000)

      const response = (await request({
        signal,
        url: process.env.NEXT_PUBLIC_OL_ROUTE,
        method: 'post',
        data: {
          params: {
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            searchToken: searchSessionTokenQuery.data?.searchToken,
            FlightSearchPanel: {
              ...generateFlightSearchPanel(),
              ReceivedProviders: pageParam.ReceivedProviders.filter(
                (provider) => provider
              ),
            },
          },
          apiRoute: 'FlightService',
          apiAction: 'api/Flight/Search',
          sessionToken: searchSessionTokenQuery.data?.sessionToken,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
          scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
          scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
          requestType:
            'Service.Models.RequestModels.FlightSearchRequest, Service.Models, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
        },
        headers: {
          appToken: appToken.current,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
        },
      })) as FlightSearchResultsApiResponse
      return response
      // return responseDummy as FlightSearchResultsApiResponse
    },
    select(data) {
      const pages = data.pages

      const flightFareInfos = pages
        .flatMap((page) =>
          page.data?.searchResults?.length
            ? page.data?.searchResults.filter((result) =>
                result.flightFareInfos &&
                Object.keys(result.flightFareInfos).length
                  ? Object.values(result.flightFareInfos)
                  : null
              )
            : null
        )
        .flatMap((item) =>
          item?.flightFareInfos && Object.keys(item?.flightFareInfos).length
            ? Object.values(item?.flightFareInfos)
            : null
        )
        .filter(Boolean) as FlightFareInfo[]

      const flightDetails = pages
        .flatMap((page) =>
          page.data?.searchResults?.length
            ? page.data?.searchResults.filter((result) =>
                result.flightDetails && Object.keys(result.flightDetails).length
                  ? Object.values(result.flightDetails)
                  : null
              )
            : null
        )
        .flatMap((item) =>
          item?.flightDetails && Object.keys(item?.flightDetails).length
            ? Object.values(item?.flightDetails)
            : null
        )
        .filter(Boolean) as FlightDetail[]

      const flightDetailSegments = pages
        .flatMap((page) =>
          page.data?.searchResults?.length
            ? page.data?.searchResults.filter((result) =>
                result.flightDetailSegments &&
                Object.keys(result.flightDetailSegments).length
                  ? Object.values(result.flightDetailSegments)
                  : null
              )
            : null
        )
        .flatMap((item) =>
          item?.flightDetailSegments &&
          Object.keys(item?.flightDetailSegments).length
            ? Object.values(item?.flightDetailSegments)
            : null
        )
        .filter(Boolean) as FlightDetailSegment[]

      const clientData = flightFareInfos
        .sort((a, b) => a?.totalPrice?.value - b?.totalPrice.value)
        .map((fareInfo) => {
          const details = flightDetails
            .filter(
              (detail) =>
                fareInfo.flightDetailKeys.filter(
                  (detailKey) => detailKey === detail.key
                ).length > 0
            )
            .sort((a, b) => a.groupId - b.groupId)
          const segments = details.flatMap((detail) =>
            detail.flightSegmentKeys.flatMap((segmentKey) =>
              flightDetailSegments.filter(
                (segment) => segmentKey === segment.key
              )
            )
          )
          const packageObject = {
            freeVolatileData: segments.at(0)?.freeVolatileData,
            details,
            fareInfo,
          }

          return {
            fareInfo,
            details,
            segments,
            packageObject,
          }
        })
        .map((clientObj, clientObjIndex, clientObjArr) => {
          const seqIds = clientObj.segments.flatMap(
            (client) => client.freeVolatileData.Seq
          )
          const flightNumbersArr = clientObj.segments.flatMap(
            (item) => item.flightNumber
          )

          const packages = clientObjArr.filter((client) => {
            const currentSeqNos = client.segments.map((segment) => {
              return segment.freeVolatileData.Seq
            })

            const flightNumbers = client.segments.filter((item) =>
              flightNumbersArr.includes(item.flightNumber)
            ).length

            return (
              JSON.stringify(currentSeqNos) === JSON.stringify(seqIds) &&
              flightNumbers
            )
          })

          // Find the corresponding search result to get providerName ~thanks ai
          const searchResult = pages
            .flatMap((page) => page.data?.searchResults || [])
            .find(
              (result) =>
                result.flightFareInfos &&
                Object.values(result.flightFareInfos).some(
                  (fare) => fare.key === clientObj.fareInfo.key
                )
            )

          return {
            fareInfo: clientObj.fareInfo,
            details: clientObj.details,
            segments: clientObj.segments,
            package: packages,
            providerName: searchResult?.diagnostics?.providerName,
          }
        }) as ClientDataType[]

      const cleanData = removeDuplicateFlights(clientData) as ClientDataType[]

      return cleanData
    },
    getNextPageParam: (lastPage, pages, lastPageParams) => {
      if (lastPage?.data?.hasMoreResponse) {
        if (lastPage?.data?.searchResults?.length) {
          lastPage.data.searchResults.forEach((searchResult) => {
            const providerName = searchResult.diagnostics.providerName

            if (!lastPageParams.ReceivedProviders.includes(providerName))
              lastPageParams.ReceivedProviders.push(providerName)
          })
        }

        return lastPageParams
      }

      return undefined
    },
  })

  const submitFlightData = useMutation({
    mutationFn: async (key: string) => {
      const response = await serviceRequest<{ productKey: string }>({
        axiosOptions: {
          url: '/api/flight/postKey',
          method: 'post',
          data: {
            key,
            sessionToken: searchSessionTokenQuery.data?.sessionToken,
            searchToken: searchSessionTokenQuery.data?.searchToken,
          },
        },
      })
      return response
    },
    onSuccess(query) {
      const serialize = createSerializer(reservationParsers)

      const reservationUrl = serialize('/reservation', {
        productKey: query?.data?.productKey,
        searchToken: searchSessionTokenQuery.data?.searchToken,
        sessionToken: searchSessionTokenQuery.data?.sessionToken,
      })

      if (query?.success && query.data?.productKey) {
        router.push(reservationUrl)
      }
    },
  })

  const airlineQueryParamsCodeArr = () => {
    return [
      ...new Set(
        searchResultsQuery?.data
          ?.flatMap((item) =>
            item.segments.map((item2) => item2.marketingAirline.code)
          )
          .sort()
      ),
    ].sort()
  }

  const airportQueryParamsCodeArr = () => {
    const airports = searchResultsQuery?.data
      ?.flatMap((item) =>
        item.segments.flatMap((segment) => [
          segment.origin.code,
          segment.destination.code,
        ])
      )
      .flat()

    return [...new Set(airports)].sort()
  }

  const getAirportsByCodeList = useQuery({
    enabled: !!searchResultsQuery.data?.length,
    queryKey: ['airports-code-list', airportQueryParamsCodeArr().sort()],
    queryFn: async () => {
      const response = (await request({
        url: `${process.env.NEXT_PUBLIC_API_DESTINATION_ROUTE}/v1.1/api/flight/getairportbycodelist`,
        params: {
          l: 'tr_TR',
          cl: airportQueryParamsCodeArr().toString(),
        },
      })) as AirportCodeServiceResponse

      return response
    },
    select(query) {
      query.Result.forEach((item) => {
        const airportListHasValue = airPortFlatList.find(
          (airPorts) => airPorts.Code === item.Code
        )
        if (!airportListHasValue) {
          airPortFlatList.push(item)
        }
      })
      return query.Result
    },
  })

  const getAirlineByCodeList = useQuery({
    enabled: !!searchResultsQuery.data?.length,
    queryKey: ['airline-code-list', airlineQueryParamsCodeArr().sort()],
    queryFn: async () => {
      const response = (await request({
        url: `${process.env.NEXT_PUBLIC_API_DESTINATION_ROUTE}/v1.1/api/flight/getairlinebycodelist`,
        params: {
          l: 'tr_TR',
          cl: airlineQueryParamsCodeArr().toString(),
        },
      })) as AirlineCodeServiceResponse

      return response
    },
    select(query) {
      return query.Result
    },
  })

  return {
    searchResultsQuery,
    submitFlightData,
    searchSessionTokenQuery,
    getAirlineByCodeList,
    getAirportsByCodeList,
    airPortFlatList,
  }
}

export { useSearchResultsQueries }
