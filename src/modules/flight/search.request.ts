import cookies from 'js-cookie'

import type { LocationResult } from '@/components/search-engine/locations/locations'
import { request } from '@/network'
import type { DatesRangeValue } from '@mantine/dates'

import dayjs from 'dayjs'

import md5 from 'md5'

const executerestUrl =
  'https://lidyaolserviceg.lidyateknoloji.com/v1.1/api/ol/executerest'
const authToken = md5(
  'WEB1D7CAEF28F75490DA6D3B874A6FBC926' +
    'A6A3F7B63F14EEB6EAFA8178ECA96497856206D1635211C7440C7751E534B551'
).toLocaleUpperCase()
const sessionToken_name = 'SessionToken'
const searchToken_name = 'SearchToken'

const getSessionTokenUrl =
  'https://lidyaolserviceg.lidyateknoloji.com/v1.1/api/ol/GetSessionToken'

const requestedDayFormat = 'YYYY-MM-DD'
let appToken: string | null

type FlightLocationLeg = {
  code: string
  iata: string[]
  type: number
  isDomestic: boolean
  id: string | number
}

export type FlightSearchRequestFlightSearchPanel = {
  ActiveTripKind: number
  SearchLegs: {
    DepartureTime: string
    CabinClass: number
    MaxConnections: number
    Origin: FlightLocationLeg
    Destination: FlightLocationLeg
  }[]

  PassengerCounts: { Adult: number; Child: number; Infant: number }
  Domestic: boolean
  CabinClass: {
    value: number
    title: 'Ekonomi' | 'Business' | 'First Class' | string
  }
  ReceivedProviders?: string[] | []
}

export type FlightSearchRequestPayload = {
  params: {
    appName: 'fulltrip.prod.webapp.html'
    scopeName: 'FULLTRIP'
    scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7'
    searchToken: string
    FlightSearchPanel: FlightSearchRequestFlightSearchPanel
  }
  apiRoute: 'FlightService'
  apiAction: 'api/Flight/Search'
  sessionToken: string
  appName: 'fulltrip.prod.webapp.html'
  scopeName: 'FULLTRIP'
  scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7'
  // Device: 'Web'
  // LanguageCode: 'tr_TR'
  requestType: 'Service.Models.RequestModels.FlightSearchRequest, Service.Models, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null'
}

export type FlightApiRequestParams = {
  Destination: LocationResult
  Origin: LocationResult
  Dates: DatesRangeValue
  ActiveTripKind: FlightSearchRequestFlightSearchPanel['ActiveTripKind']
  PassengerCounts: FlightSearchRequestFlightSearchPanel['PassengerCounts']
  CabinClass: FlightSearchRequestFlightSearchPanel['CabinClass']
  ReceivedProviders?: FlightSearchRequestFlightSearchPanel['ReceivedProviders']
  SearchToken: string
}

const processFlightSearchPanel = (
  params: FlightApiRequestParams
): FlightSearchRequestFlightSearchPanel => {
  const recievedData = params
  const {
    ActiveTripKind,
    CabinClass,
    PassengerCounts,
    Dates,
    Destination,
    Origin,
    ReceivedProviders,
  } = recievedData
  const SearchLegs: FlightSearchRequestFlightSearchPanel['SearchLegs'] = [
    {
      CabinClass: CabinClass.value,
      DepartureTime: dayjs(Dates.at(0)).format(requestedDayFormat),
      MaxConnections: 0,
      Destination: {
        code: Destination.Code,
        iata: Destination.Iata,
        id: Destination.Id,
        isDomestic: Destination.IsDomestic,
        type: Destination.Type,
      },
      Origin: {
        code: Origin.Code,
        iata: Origin.Iata,
        id: Origin.Id,
        isDomestic: Origin.IsDomestic,
        type: Origin.Type,
      },
    },
  ]

  if (ActiveTripKind === 2) {
    SearchLegs.push({
      Destination: {
        code: Origin.Code,
        iata: Origin.Iata,
        id: Origin.Id,
        isDomestic: Origin.IsDomestic,
        type: Origin.Type,
      },
      Origin: {
        code: Destination.Code,
        iata: Destination.Iata,
        id: Destination.Id,
        isDomestic: Destination.IsDomestic,
        type: Destination.Type,
      },
      DepartureTime: dayjs(Dates.at(1)).format(requestedDayFormat),
      CabinClass: 0,
      MaxConnections: 0,
    })
  }

  const searchObj = {
    ActiveTripKind,
    PassengerCounts,
    CabinClass,
    Domestic: params.Destination.IsDomestic && params.Origin.IsDomestic,
    SearchLegs,
    ReceivedProviders,
  }

  // localStorage.setItem('flight', JSON.stringify(searchObj))

  return searchObj
}

const getsecuritytoken = async (): Promise<{
  succeeded: boolean
  result: string
  errors: []
  messageEvents: []
}> => {
  const getToken = await request({
    url: 'https://lidyaolserviceg.lidyateknoloji.com/v1.1/api/device/getsecuritytoken',
    method: 'post',
    data: {
      authToken,
      envName: 'fulltrip.prod.webapp.html',
    },
  })

  appToken = getToken.result

  return getToken
}

export const getNewSearchSessionToken = async (): Promise<{
  code: number
  message: null
  data: string
  token: null
  clientIP: null
  appName: null
  sessionToken: string
  userAuthenticationToken: null
  eventMessageList: []
}> => {
  if (!appToken) await getsecuritytoken()

  const response = await request({
    url: executerestUrl,
    method: 'post',
    headers: {
      appToken: appToken,
      appName: 'fulltrip.prod.webapp.html',
    },
    data: {
      params: {
        appName: 'fulltrip.prod.webapp.html',
        scopeName: 'FULLTRIP',
        scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7',
        // searchToken: '',
      },
      apiRoute: 'FlightService',
      apiAction: 'api/Flight/GetNewSearchSessionToken',
      // sessionToken: cookies.get(sessionToken_name) || '',
      appName: 'fulltrip.prod.webapp.html',
      scopeName: 'FULLTRIP',
      scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7',
      // Device: 'Web',
      // LanguageCode: 'tr_TR',
    },
  })

  // setTokens({
  //   searchToken: response.data,
  //   sessionToken: response.sessionToken,
  // })
  // cookies.set(searchToken_name, response.data)
  return response
}

const getSessionToken = async () => {
  if (
    cookies.get(sessionToken_name) &&
    cookies.get(sessionToken_name) !== 'global'
  ) {
    return cookies.get(sessionToken_name)
  }

  const response = await request({
    url: getSessionTokenUrl,
    method: 'post',
    headers: {
      appToken: appToken,
      appName: 'fulltrip.prod.webapp.html',
    },
  })

  cookies.set(sessionToken_name, response)

  return response
}

export const flightApiRequest = async (
  params: FlightApiRequestParams
): Promise<{
  code: number
  message: null
  data: {
    status: boolean
    message: null
    hasMoreResponse: boolean
    executionTime: '00:00:00.0065683'
    searchResults: { diagnostics: { providerName: string } }[]
  }
  token: null
  clientIP: null
  appName: null
  sessionToken: string
  userAuthenticationToken: null
  eventMessageList: []
}> => {
  const FlightSearchPanel = processFlightSearchPanel(params)

  if (!appToken) await getsecuritytoken()

  // const sessionToken = cookies.get(sessionToken_name)
  // const searchToken = cookies.get(searchToken_name)

  // if (!(sessionToken || searchToken)) {
  //   console.error('SessionToken or SearchToken are not correct', {
  //     sessionToken: sessionToken,
  //     searchToken: searchToken,
  //   })
  // }

  const payload: FlightSearchRequestPayload = {
    apiAction: 'api/Flight/Search',
    apiRoute: 'FlightService',
    appName: 'fulltrip.prod.webapp.html',
    sessionToken: params.SearchToken,
    scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7',
    scopeName: 'FULLTRIP',
    requestType:
      'Service.Models.RequestModels.FlightSearchRequest, Service.Models, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
    params: {
      FlightSearchPanel,
      searchToken: params.SearchToken,
      scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7',
      appName: 'fulltrip.prod.webapp.html',
      scopeName: 'FULLTRIP',
    },
    // Device: 'Web',
    // LanguageCode: 'tr_TR',
  }

  const requestFlight = await request({
    url: executerestUrl,
    data: payload,
    method: 'post',
    headers: {
      appToken: appToken,
      appName: 'fulltrip.prod.webapp.html',
    },
  })

  return requestFlight
}

export const createSearch = async (
  params: Omit<FlightApiRequestParams, 'SearchToken'>
): Promise<{ status: boolean; searchToken: string }> => {
  const searchToken = await getNewSearchSessionToken()
  await getSessionToken()

  const flightServiceResponse = await flightApiRequest({
    ...params,
    SearchToken: searchToken.data,
  })

  return {
    status:
      flightServiceResponse.code === 1 && flightServiceResponse.data.status,
    searchToken: searchToken.data,
  }
}
