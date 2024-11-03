import dayjs from 'dayjs'
import md5 from 'md5'

import cookies from 'js-cookie'

import { request } from '@/network'
import type {
  ClientFlightDataModel,
  FlightApiRequestParams,
  FlightSearchApiResponse,
  FlightSearchRequestFlightSearchPanel,
  FlightSearchRequestPayload,
  GetAirlineByCodeListResponse,
  GetSecurityTokenResponse,
} from '@/modules/flight/types'
import {
  collectFlightData,
  generateFlightData,
} from './search-results/generate'

const executerestUrl = process.env.NEXT_PUBLIC_OL_ROUTE
const authToken = md5(
  process.env.NEXT_PUBLIC_DEVICE_ID + process.env.NEXT_PUBLIC_SECURE_STRING
).toLocaleUpperCase()
const sessionToken_name = 'sessionToken'
const searchToken_name = 'searchToken'

const getSessionTokenUrl = process.env.NEXT_PUBLIC_GET_SESSION_TOKEN

const requestedDayFormat = 'YYYY-MM-DD'
let appToken: string | null

const processFlightSearchPanel = (
  params: Omit<FlightApiRequestParams, 'SearchToken'>
): FlightSearchRequestFlightSearchPanel => {
  const recievedData = params
  const {
    ActiveTripKind,
    CabinClass,
    PassengerCounts,
    Dates,
    Destination,
    Origin,
    ReceivedProviders = [],
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
    url: process.env.NEXT_PUBLIC_SECURITY_ROUTE,
    method: 'post',
    data: {
      authToken,
      envName: process.env.NEXT_PUBLIC_APP_NAME,
    },
  })

  appToken = getToken.result

  return getToken
}

export const getNewSearchSessionToken = async (): Promise<
  string | undefined
> => {
  const searchToken = cookies.get(searchToken_name)
  if (!searchToken) {
    if (!appToken) await getsecuritytoken()

    const response = await request({
      url: executerestUrl,
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
        },
        apiRoute: 'FlightService',
        apiAction: 'api/Flight/GetNewSearchSessionToken',
        appName: process.env.NEXT_PUBLIC_APP_NAME,
        scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
        scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
      },
    })

    const cookieTimeout = new Date(new Date().getTime() + 30 * 60 * 1000) // 30mins
    cookies.set(searchToken_name, response.data, {
      expires: cookieTimeout,
    })
    cookies.set('searchtoken_timeout', cookieTimeout.toISOString(), {
      expires: cookieTimeout,
    })

    return response.data
  }

  return cookies.get(searchToken_name)
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
      appToken,
      appName: process.env.NEXT_PUBLIC_APP_NAME,
    },
  })

  cookies.set(sessionToken_name, response)

  return response
}
const ReceivedProviders: string[] = []

const requestFlightData = async (
  params: FlightSearchRequestFlightSearchPanel
): Promise<FlightSearchApiResponse> => {
  const searchToken = await getNewSearchSessionToken()
  const sessionToken = await getSessionToken()

  // const searchToken = cookies.get(searchToken_name)!
  // const sessionToken = cookies.get(sessionToken_name)!

  const payload = {
    apiAction: 'api/Flight/Search',
    apiRoute: 'FlightService',
    appName: process.env.NEXT_PUBLIC_APP_NAME,
    sessionToken: sessionToken,
    scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
    scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
    requestType:
      'Service.Models.RequestModels.FlightSearchRequest, Service.Models, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
    params: {
      FlightSearchPanel: { ...params, ReceivedProviders },
      searchToken,
      scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
      appName: process.env.NEXT_PUBLIC_APP_NAME,
      scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
    },
  }
  const response = await request({
    url: executerestUrl,
    data: payload,
    method: 'post',
    headers: {
      appToken,
      appName: process.env.NEXT_PUBLIC_APP_NAME,
    },
  })
  return response
}

export const flightApiRequest = (): Promise<boolean> =>
  new Promise(async (resolve, reject) => {
    const localFlightData = JSON.parse(
      localStorage.getItem('flight')!
    ) as FlightApiRequestParams

    if (!appToken) await getsecuritytoken()

    const flightSearchPanel = processFlightSearchPanel(localFlightData)

    const flightApiResponse = async () =>
      await requestFlightData(flightSearchPanel)

    const flightData = await flightApiResponse()

    flightData.data.searchResults.forEach((item) => {
      ReceivedProviders.push(item.diagnostics.providerName)
    })

    collectFlightData(flightData.data.searchResults)
    if (flightData.data.hasMoreResponse && timer) {
      setTimeout(() => {
        resolve(flightApiRequest())
      }, 1500)
      return
    }

    resolve(true)
  })

let timer: NodeJS.Timeout | null

export const refetchFlightRequest = async (): Promise<
  ClientFlightDataModel[]
> => {
  timer = setTimeout(() => {
    timer = null
  }, 20000)

  await flightApiRequest()
  const generatServerResponse = await generateFlightData()
  ReceivedProviders.splice(0, ReceivedProviders.length)
  clearTimeout(timer)
  timer = null
  return generatServerResponse
}
export const clearSearchRequest = () => {
  // if (timer) {
  //   clearTimeout(timer)
  //   timer = null
  // }
}

export const getAirlineByCodeList = async (
  codeList: string[]
): Promise<GetAirlineByCodeListResponse> => {
  const defaultObject = {
    l: 'tr',
    cl: codeList.toString(),
    apiAction: 'd/v1.1/api/flight/getairlinebycodelist',
  }

  const airlines = await request({
    method: 'get',
    url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/flight/getairlinebycodelist`,
    params: defaultObject,
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_API_GW_KEY,
      'Content-Type': 'application/json',
    },
  })

  return airlines
}
