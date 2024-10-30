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

const getNewSearchSessionToken = async (): Promise<void> => {
  if (!cookies.get(searchToken_name)) {
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

    cookies.set(searchToken_name, response.data, {
      expires: new Date(new Date().getTime() + 30 * 60 * 1000), // 30mins
    })
  }
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

export const flightApiRequest = (): Promise<ClientFlightDataModel[] | void> =>
  new Promise(async (resolve, reject) => {
    try {
      const localFlightData = JSON.parse(
        localStorage.getItem('flight')!
      ) as FlightApiRequestParams

      await getNewSearchSessionToken()
      await getSessionToken()

      if (!appToken) await getsecuritytoken()

      const FlightSearchPanel = processFlightSearchPanel(localFlightData)

      const searchToken =
        cookies.get(searchToken_name) || 'has no search token cookie'

      if (!searchToken)
        console.warn(
          'Search token is null or empty. Recived value is',
          searchToken
        )

      const sessionToken = cookies.get(sessionToken_name)

      const payload: FlightSearchRequestPayload = {
        apiAction: 'api/Flight/Search',
        apiRoute: 'FlightService',
        appName: process.env.NEXT_PUBLIC_APP_NAME,
        sessionToken: sessionToken!,
        scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
        scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
        requestType:
          'Service.Models.RequestModels.FlightSearchRequest, Service.Models, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
        params: {
          FlightSearchPanel: { ...FlightSearchPanel, ReceivedProviders },
          searchToken,
          scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
          scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
        },
      }

      const requestFlight = (await request({
        url: executerestUrl,
        data: payload,
        method: 'post',
        headers: {
          appToken,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
        },
        signal: controller.signal,
      })) as FlightSearchApiResponse

      requestFlight.data.searchResults.forEach((item) => {
        ReceivedProviders.push(item.diagnostics.providerName)
      })

      collectFlightData(requestFlight.data.searchResults)

      if (!requestFlight.data.hasMoreResponse) {
        resolve()
        clearTimeout(timer)
        return
      }

      if (!timeisfinished) {
        setTimeout(() => {
          resolve(flightApiRequest())
        }, 2000)
      } else {
        resolve()
        clearTimeout(timer)
        return
      }
    } catch (error) {
      console.log(error)
    }
  })

export const refetchFlightRequest = async (): Promise<
  ClientFlightDataModel[]
> => {
  await flightApiRequest()
  const flightData = await generateFlightData()
  return flightData
}
export const clearSearchRequest = () => {
  controller.abort()
  clearTimeout(timer)
  timeisfinished = true
}

const controller = new AbortController()

let timeisfinished = false

const timer = setTimeout(() => {
  timeisfinished = true
}, 15000)

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
