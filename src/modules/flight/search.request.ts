import dayjs from 'dayjs'
import md5 from 'md5'

import cookies from 'js-cookie'

import { request } from '@/network'
import type {
  FlightApiRequestParams,
  FlightSearchApiResponse,
  FlightSearchRequestFlightSearchPanel,
  FlightSearchRequestPayload,
  GetNewSearchSessionTokenResponse,
  GetSecurityTokenResponse,
} from '@/modules/flight/types'

const executerestUrl =
  'https://lidyaolserviceg.lidyateknoloji.com/v1.1/api/ol/executerest'
const authToken = md5(
  'WEB1D7CAEF28F75490DA6D3B874A6FBC926' +
    'A6A3F7B63F14EEB6EAFA8178ECA96497856206D1635211C7440C7751E534B551'
).toLocaleUpperCase()
const sessionToken_name = 'SessionToken'

const getSessionTokenUrl =
  'https://lidyaolserviceg.lidyateknoloji.com/v1.1/api/ol/GetSessionToken'

const requestedDayFormat = 'YYYY-MM-DD'
let appToken: string | null

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

const getsecuritytoken = async (): Promise<GetSecurityTokenResponse> => {
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

export const getNewSearchSessionToken =
  async (): Promise<GetNewSearchSessionTokenResponse> => {
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
        },
        apiRoute: 'FlightService',
        apiAction: 'api/Flight/GetNewSearchSessionToken',
        appName: 'fulltrip.prod.webapp.html',
        scopeName: 'FULLTRIP',
        scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7',
      },
    })

    // setTokens({
    //   searchToken: response.data,
    //   sessionToken: response.sessionToken,
    // })
    // cookies.set(searchToken_name, response.data)
    return response
  }

const getSessionToken = async (): Promise<string | undefined> => {
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
): Promise<FlightSearchApiResponse> => {
  const FlightSearchPanel = processFlightSearchPanel(params)

  if (!appToken) await getsecuritytoken()

  const sessionToken = cookies.get(sessionToken_name)

  const payload: FlightSearchRequestPayload = {
    apiAction: 'api/Flight/Search',
    apiRoute: 'FlightService',
    appName: 'fulltrip.prod.webapp.html',
    sessionToken: sessionToken!,
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

export const getAirlineByCodeList = async (
  codeList: string[]
): Promise<{
  Result: {
    Id: string | number
    Code: string
    Value: {
      LangCode: string
      Value: string
    }[]
    CountryCode: string
    Country: null | string
    City: null | string
  }[]
}> => {
  const defaultObject = {
    l: 'tr',
    cl: codeList.toString(),
    apiAction: 'd/v1.1/api/flight/getairlinebycodelist',
  }

  const airlines = await request({
    method: 'get',
    url: 'https://apisf-preprod.lidyatechnology.com/d/v1.1/api/flight/getairlinebycodelist',
    params: defaultObject,
    headers: {
      'x-api-key': 'MqhX1CPpc38m10JjWaC9x3p2oirBAcMR9ANpdVMm',
      'Content-Type': 'application/json',
    },
  })

  return airlines
}
