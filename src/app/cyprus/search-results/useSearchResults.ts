import { cyprusSearchParams } from '@/modules/cyprus/searchParams'
import { CyprusSearchResultsApiResponse } from '@/modules/cyprus/types'
import { olRequest } from '@/network'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useQueryStates } from 'nuqs'

export const useCyprusSearchResults = () => {
  const [searchParams] = useQueryStates(cyprusSearchParams)
  const { airportCode, isFlight, isTransfer, rooms, ...restSearchParams } =
    searchParams

  const convertChildAges = rooms.flatMap((room) => ({
    ...room,
    childBirthdays: room.childBirthdays.flatMap((age) =>
      dayjs().subtract(age, 'years').format('DD-MM-YYYY')
    ),
  }))

  const searchSessionTokenQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['cyprus-search-tokens', searchParams],
    queryFn: async ({ signal }) => {
      const response = await olRequest<string>({
        signal,
        apiRoute: 'CyprusPackageService',
        apiAction: 'api/CyprusPackage/GetNewSearchSessionToken',
      })

      if (!response?.data) {
        throw new Error('Session Search token error')
      }

      return response
    },
    select: (query) => {
      return {
        searchToken: query?.data,
        sessionToken: query?.sessionToken,
      }
    },
  })

  const cyprusSearchResultsQuery = useQuery({
    enabled:
      !!searchSessionTokenQuery.data && searchSessionTokenQuery.isSuccess,

    queryKey: [
      'cyprus-search-results',
      convertChildAges,
      airportCode,
      isFlight,
      isTransfer,
      rooms,
      restSearchParams,
      searchSessionTokenQuery?.data?.searchToken,
      searchSessionTokenQuery?.data?.sessionToken,
    ],
    queryFn: async () => {
      const response = await olRequest<{
        hasMoreResponse: boolean
        searchResults: CyprusSearchResultsApiResponse[]
      } | null>({
        apiRoute: 'CyprusPackageService',
        apiAction: 'api/CyprusPackage/Search',
        data: {
          params: {
            hotelSearchModuleRequest: {
              ...restSearchParams,
              rooms: convertChildAges,
            },
            tripType: 0,
            isTransfer,
            isFlight,
            airportCode,
            searchToken: searchSessionTokenQuery.data?.searchToken,
            sessionToken: searchSessionTokenQuery.data?.sessionToken,
          },
          requestType:
            'TravelAccess.Core.Models.CyprusPackage.HotelSearchApiRequest, Business.Models.CyprusPackage, Version=1.0.7.0, Culture=neutral, PublicKeyToken=null',
          returnType:
            'Core.Models.ResultModels.RestResult`1[[TravelAccess.Core.Models.BaseRequestResponses.SearchRestClientResponse`1[[TravelAccess.Core.Models.CyprusPackage.CyprusPackageSearchResponse, Core.Models.CyprusPackage, Version=1.0.6.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null',
          sessionToken: searchSessionTokenQuery.data?.sessionToken,
          mlToken: '300e4d36-e149-4324-a09d-81c83d297f9d',
        },
      })

      return response
    },
    select: (query) => {
      return query?.data
    },
  })

  return {
    cyprusSearchResultsQuery,
    searchSessionTokenQuery,
    searchParams,
    searchToken: searchSessionTokenQuery.data?.searchToken,
    sessionToken: searchSessionTokenQuery.data?.sessionToken,
  }
}

const dummySp = {
  params: {
    hotelSearchModuleRequest: {
      rooms: [
        {
          childBirthdays: [],
          adult: 2,
          child: 0,
          infant: 0,
          student: 0,
          senior: 0,
          military: 0,
        },
      ],
      id: 372352,
      name: 'Kıbrıs',
      slug: 'kibris',
      location: [0, 0],
      northeast: null,
      southwest: null,
      type: 1,
      countryCode: 'trnc',
      checkInDate: '2025-09-04T00:00:00',
      checkOutDate: '2025-09-12T00:00:00',
      domestic: false,
      tags: null,
      earlyBooking: false,
      pageNo: 0,
      pageSize: 20,
      languageCode: 'tr_TR',
      orderBy: 9,
      hotelName: null,
      maxPrice: 0,
      minPrice: 0,
      maxStarRating: 0,
      minStarRating: 0,
      maxTripAdvisorRating: 0,
      minTripAdvisorRating: 0,
      facilities: null,
      pensionTypes: null,
      themes: null,
      destinationIds: null,
      nonRefundable: null,
      isAvailabilityResult: false,
      isSocketConnected: false,
      extentionData: {},
      provider: null,
      sessionToken:
        'A58E7E07A70BDF5E7F0D04B8EC7ACD7AB49901DA0879BDBCF5E702BCEA0DE6E7',
      apiRoute: null,
      apiAction: null,
      appName: null,
      scopeName: null,
      searchToken:
        '49C25B07E92AC2421ED5D5976F2B6A62189CFC6C435A942C344B28A36B99E55E',
      scopeCode: '00000000-0000-0000-0000-000000000000',
    },
    isTransfer: true,
    isFlight: true,
    tripType: 0,
    airportCode: 'AYT',
    sessionToken:
      'A58E7E07A70BDF5E7F0D04B8EC7ACD7AB49901DA0879BDBCF5E702BCEA0DE6E7',
    apiRoute: 'CyprusPackageService',
    apiAction: 'api/CyprusPackage/Search',
    appName: 'paraflytravel.preprod.webapp.html',
    scopeName: 'PARAFLYTRAVEL',
    searchToken:
      '49C25B07E92AC2421ED5D5976F2B6A62189CFC6C435A942C344B28A36B99E55E',
    scopeCode: 'aa2eff06-6a09-4320-bae2-a82f9504ff19',
    customerId: 0,
    customerUserId: 0,
  },
  apiAction: 'api/CyprusPackage/Search',
  apiRoute: 'CyprusPackageService',
  device: 'WEB2C325390785BE7BF49E270007A84D887',
  ipAddress: null,
  languageCode: 'tr_TR',
  mlToken: '300e4d36-e149-4324-a09d-81c83d297f9d',
  requestType:
    'TravelAccess.Core.Models.CyprusPackage.HotelSearchApiRequest, Business.Models.CyprusPackage, Version=1.0.7.0, Culture=neutral, PublicKeyToken=null',
  returnType:
    'Core.Models.ResultModels.RestResult`1[[TravelAccess.Core.Models.BaseRequestResponses.SearchRestClientResponse`1[[TravelAccess.Core.Models.CyprusPackage.CyprusPackageSearchResponse, Core.Models.CyprusPackage, Version=1.0.6.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null',
  sessionToken:
    'A58E7E07A70BDF5E7F0D04B8EC7ACD7AB49901DA0879BDBCF5E702BCEA0DE6E7',
}
