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

    const cookieTimeout =
      process.env.NODE_ENV === 'development'
        ? new Date(new Date().getTime() + 60 * 60 * 1000) // 60mins in dev env
        : new Date(new Date().getTime() + 30 * 60 * 1000) // default 30mins

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
  params: FlightSearchRequestFlightSearchPanel,
  signal: AbortSignal
): Promise<FlightSearchApiResponse> => {
  const searchToken = await getNewSearchSessionToken()
  const sessionToken = await getSessionToken()

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

  let response
  try {
    response = await request({
      url: executerestUrl,
      data: payload,
      method: 'post',
      headers: {
        appToken,
        appName: process.env.NEXT_PUBLIC_APP_NAME,
      },
      signal,
    })
    return response
  } catch (error) {
    console.log(error)
  }

  return response
}

export const flightApiRequest = ({
  signal,
}: {
  signal: AbortSignal
}): Promise<boolean> =>
  new Promise(async (resolve, reject) => {
    const localFlightData = JSON.parse(
      localStorage.getItem('flight')!
    ) as FlightApiRequestParams

    if (!appToken) await getsecuritytoken()

    const flightSearchPanel = processFlightSearchPanel(localFlightData)

    const flightApiResponse = async () =>
      await requestFlightData(flightSearchPanel, signal)

    const flightData = await flightApiResponse()

    if (
      flightData &&
      flightData.data &&
      Array.isArray(flightData.data.searchResults)
    ) {
      flightData.data.searchResults.forEach((item) => {
        ReceivedProviders.push(item.diagnostics.providerName)
      })

      collectFlightData(flightData.data.searchResults)
    }

    if (signal.aborted) return
    if (!flightData) {
      setTimeout(() => {
        resolve(flightApiRequest({ signal }))
      }, 1500)
      return
    }

    if (flightData.data.hasMoreResponse && !!timer) {
      setTimeout(() => {
        resolve(flightApiRequest({ signal }))
      }, 1500)
      return
    }

    resolve(true)
  })

let timer: NodeJS.Timeout | null

export const refetchFlightRequest = async ({
  signal,
}: {
  signal: AbortSignal
}): Promise<ClientFlightDataModel[]> => {
  timer = setTimeout(() => {
    timer = null
  }, 20000)

  await flightApiRequest({ signal })
  const generatServerResponse = await generateFlightData()
  ReceivedProviders.splice(0, ReceivedProviders.length)
  clearTimeout(timer)

  timer = null
  return generatServerResponse
  //#region flight dummy data
  // return [
  //   {
  //     flightFare: {
  //       flightDetailKeys: [
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YfaXOpevvaQA4QgwEz33YKuByI//NoFuMKq30UUdPZvn7EkEFq88gdNi/x5wdnoBy8g9m5Vbrk62ePGlKiZjZ5MyoKbYGmyn0jLqYs+Fqp8wD0/+gFw73q6dSfCArIUT6TKifP9sA2ZFh6mtWC5uDYeKAqlH9M9AMqTeYzhxDBUevGu56uSVeXZdu5foqHRUWF5ozMt2elhdSZAS7Qf8Kea3iiIkD5V2/9W8F9EwNKeGOHdyaEzAdv85NcGQXmpbnBhp8l/T5NplTjzUpCLGkSdlH0T9LJasQVo3ggeSBTemPHNeuIGPtLaEwGZCSDCJuqQU+VfppJkECjAq0VGojFFAKXGfz0vzYe/CkoOsDaWbA/d0XG+bXAXLACqAfUfUDqCzebg72QkiX3VlsqaOp9pWtuw/cqhGXu4UbgEoJ0Ga90Qjm/igq4Da3/nXixjPM69RHsw//l6AVfgOToHGVK',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6rRcPBGNGUB++WNK/Dh7+wgdlA8q6m8/GcQDloVtUANsvxewKu/Q0nZHbddeWGKiI0R4rORF0i/iD/y4TGXHDrk5PRgx6Q/OLQNkdDkJEvDs4KFEgI9xQrSP/xcjY0pAzACPzLyeyXpcAeZH3JLI/QFVrXrfUAyUGN2+2DbhHnYJ9KO4l8q6Fv+C0Pll20ucxLv79dzll7XkQZTatJ5bViFh7yeBjyFchaaNPHAuy+AhS4RVI/Dx5czYOcX0ZW8Gc/QN5vfTcHmVgMaDC0YQvujL615iDRoyBSyB08Eqy+69NCgtaHFfUT5JLe22tOgZpYZCHVelW/0OigByCBZR3R2Ymp/Hsi9Hpm7MRYzTPN8Hv9GslA/tz25UBG/lvvpHEQ=',
  //       totalPrice: {
  //         value: 2567.76,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 2098.46,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       taxes: {
  //         value: 469.3,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       discount: {
  //         value: 0,
  //         currency: null,
  //         rateValue: null,
  //       },
  //       buyFee: {
  //         code: null,
  //         price: {
  //           value: 0,
  //           currency: null,
  //           rateValue: null,
  //         },
  //       },
  //       fee: {
  //         code: '',
  //         price: {
  //           value: 0,
  //           currency: 'TRY',
  //           rateValue: null,
  //         },
  //       },
  //       passengerPrices: [
  //         {
  //           unitPrice: {
  //             value: 2567.76,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 2098.46,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitFee: {
  //             code: '',
  //             price: {
  //               value: 0,
  //               currency: 'TRY',
  //               rateValue: null,
  //             },
  //           },
  //           unitTax: {
  //             value: 469.3,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           cancelPenalty: null,
  //           changePenalty: null,
  //           passengers: [
  //             {
  //               key: '892E705CCA057E17C136156A618B29754E7C406DE2DBFC98572F8A33C45B0413',
  //               name: null,
  //               passengerType: 0,
  //               age: 0,
  //               birthday: '0001-01-01T00:00:00',
  //               gender: 0,
  //             },
  //           ],
  //           taxInfos: [
  //             {
  //               key: 'VQ',
  //               value: '119.30',
  //             },
  //             {
  //               key: 'YR',
  //               value: '350.00',
  //             },
  //             {
  //               key: '||',
  //               value: '0',
  //             },
  //           ],
  //           serviceCharges: null,
  //         },
  //       ],
  //       taxInfos: null,
  //       serviceCharges: null,
  //       providerName: 'PegasusNDC',
  //     },
  //     id: '5b775ff6-e84f-4118-9b3d-603e7465c83c',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YfaXOpevvaQA4QgwEz33YKuByI//NoFuMKq30UUdPZvn7EkEFq88gdNi/x5wdnoBy8g9m5Vbrk62ePGlKiZjZ5MyoKbYGmyn0jLqYs+Fqp8wD0/+gFw73q6dSfCArIUT6TKifP9sA2ZFh6mtWC5uDYeKAqlH9M9AMqTeYzhxDBUevGu56uSVeXZdu5foqHRUWF5ozMt2elhdSZAS7Qf8Kea3iiIkD5V2/9W8F9EwNKeGOHdyaEzAdv85NcGQXmpbnBhp8l/T5NplTjzUpCLGkSdlH0T9LJasQVo3ggeSBTemPHNeuIGPtLaEwGZCSDCJuqQU+VfppJkECjAq0VGojFFAKXGfz0vzYe/CkoOsDaWbA/d0XG+bXAXLACqAfUfUDqCzebg72QkiX3VlsqaOp9pWtuw/cqhGXu4UbgEoJ0Ga90Qjm/igq4Da3/nXixjPM69RHsw//l6AVfgOToHGVK',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '17I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qcLCiIR1xq7XEG78kj/pE58enc3EQm/kLGRJ+8ty2xnbwNb7QU1vT7QqITKiHh8HU4k7MR5uxjkeOgpbNVxtjs2T6YjhG8jUrBQTSZnz46bw==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM17_1:SH1',
  //           OfferID:
  //             'NDQ0NzAyMSo0MTk5OTE3MDA2MSo1MDc0NDQqTk9XKk4qZmFsc2UqQTIwN0pINTgqMjQ4MTgqT1cqdHJ1ZSoxODY3Ljc2KlRSWSoyMDI0LTEyLTE5KjlBRjRvblFNTUdwaXRtUG1BY3VkNTY4Qkd2R2EyWFlUVkQ2YXh5T1ZZYjJ1bnV1QjIwUXFhbHZGUGcwU29YNFBpNnREUmR1d2ZKV3Z6RHIlMkJoTkh5cFElM0QlM0Q=',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_6',
  //           SegmentRefs: 'NDQ0NzAyMQ==',
  //           PassengerList: 'SH1',
  //           StandartSeatSelection: true,
  //           AllSeatSelection: false,
  //           FreeSandwich: true,
  //           Entertainment: true,
  //           FlexibleReturnChangeRight: false,
  //         },
  //       },
  //     ],
  //     flightDetailSegments: [
  //       {
  //         key: '17I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qcLCiIR1xq7XEG78kj/pE58enc3EQm/kLGRJ+8ty2xnbwNb7QU1vT7QqITKiHh8HU4k7MR5uxjkeOgpbNVxtjs2T6YjhG8jUrBQTSZnz46bw==',
  //         groupId: 0,
  //         origin: {
  //           code: 'SAW',
  //           isDomestic: false,
  //           iata: null,
  //           type: 7,
  //           id: 0,
  //         },
  //         destination: {
  //           code: 'ADB',
  //           isDomestic: false,
  //           iata: null,
  //           type: 7,
  //           id: 0,
  //         },
  //         departureTime: '2024-12-19T19:55:00',
  //         arrivalTime: '2024-12-19T21:05:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2198',
  //         cabinClass: 0,
  //         bookingCode: 'NOW',
  //         equipment: null,
  //         isMeal: false,
  //         quota: 9,
  //         baggageAllowance: {
  //           maxWeight: {
  //             value: 20,
  //             unit: 0,
  //           },
  //           piece: {
  //             pieceCount: 0,
  //           },
  //         },
  //         freeVolatileData: {
  //           ResBookDesigID: {
  //             SeatsLeft: 9,
  //             SeatsLeftSpecified: true,
  //             Value: 'N',
  //           },
  //           ResBookDesigCode: 'NOW',
  //           Baggage: 'BaggageAllowance4',
  //           BrandName: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_6',
  //         },
  //       },
  //     ],
  //     airLines: [
  //       {
  //         value: 'Pegasus  Havayolları',
  //         code: 'PC',
  //       },
  //     ],
  //   },
  //   {
  //     flightFare: {
  //       flightDetailKeys: [
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4aUA/jG5KbPb/uzupoVOkVWz0fndGAVgW8uA8F4dF3kPZZuM1mAJTu0v+vi4GgPy5Tdf+gEkN+JF85WnYpt+A8L+loOat61ZxUcrJSLLWDokdN4gzUTMCe/Q6P78vgX5Q/nueBBB/h/zGaGz40nfwGGeuTy9LGq97/vnz4V7VgLvMk5KT7gwdI4ypfqVUOVOMp1eBENMF3yX7OZuMPRqdchydq+7AoHoft/7CFj1DUx49wbNMgrwCmQ5OXDYIhtSTyYSi1QdVu/TLcG8sooLSWndMjC5jfMVK4Up2pWYI2DB43mZEBaE0e7WaBUXx+IP3iI3CjEkpDzxojCKzYFyEyE9Q0ylR/Y/yXs6KTvKK5q7w/FHWAVB5oZVoDY4KUYTkDZ8XFvE0VDsJ//1tm5pCe6QqJTfQHVSiUg/aNiZOFkApoEe10T2LQgn/ldrpekkTzZQb/T/loorJWAVRFoNEGj',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6rsJhG0h3GmGklbK13UlIPHzdJlmX6JHD8Wsjg5OBL9iFlXHDHtzYOSg3NBpBNfstUDJhbxG/fZ+bIZ+yalHNvRESqrIT0mjOzCfCgQ1NY94CawoTW9CZvB5GDBp/dWVhmBUArjUzuiHMUUVf5VPScOZqEpArgaraEQZIAZjG141KjFIJMBJVqTfx/Ug3pKgoAMUUqGh3iSTlmsyefAlZal3lIlCNJKcFeLDUfcgv6Ld8u9sQsWdcDRIKLODXa45+xX1Mj4ZKL7om/tezsUMUcKJce8pn7iq/ZDyrD2I9BHkiyftI8A2kW3jnnn8XvmjzZEQ8MyR/mkM80UGyABV+D+KAg8AulY5xdcVgLrvHdUGjTTRKUlwZOZ7q5vPpzAWiU=',
  //       totalPrice: {
  //         value: 2598.59,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 2129.29,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       taxes: {
  //         value: 469.3,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       discount: {
  //         value: 0,
  //         currency: null,
  //         rateValue: null,
  //       },
  //       buyFee: {
  //         code: null,
  //         price: {
  //           value: 0,
  //           currency: null,
  //           rateValue: null,
  //         },
  //       },
  //       fee: {
  //         code: '',
  //         price: {
  //           value: 0,
  //           currency: 'TRY',
  //           rateValue: null,
  //         },
  //       },
  //       passengerPrices: [
  //         {
  //           unitPrice: {
  //             value: 2598.59,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 2129.29,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitFee: {
  //             code: '',
  //             price: {
  //               value: 0,
  //               currency: 'TRY',
  //               rateValue: null,
  //             },
  //           },
  //           unitTax: {
  //             value: 469.3,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           cancelPenalty: null,
  //           changePenalty: null,
  //           passengers: [
  //             {
  //               key: '892E705CCA057E17C136156A618B29754E7C406DE2DBFC98572F8A33C45B0413',
  //               name: null,
  //               passengerType: 0,
  //               age: 0,
  //               birthday: '0001-01-01T00:00:00',
  //               gender: 0,
  //             },
  //           ],
  //           taxInfos: [
  //             {
  //               key: 'VQ',
  //               value: '119.30',
  //             },
  //             {
  //               key: 'YR',
  //               value: '350.00',
  //             },
  //             {
  //               key: '||',
  //               value: '0',
  //             },
  //           ],
  //           serviceCharges: null,
  //         },
  //       ],
  //       taxInfos: null,
  //       serviceCharges: null,
  //       providerName: 'PegasusNDC',
  //     },
  //     id: '7886ca21-b1c7-49f1-874d-2a07ae466057',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4aUA/jG5KbPb/uzupoVOkVWz0fndGAVgW8uA8F4dF3kPZZuM1mAJTu0v+vi4GgPy5Tdf+gEkN+JF85WnYpt+A8L+loOat61ZxUcrJSLLWDokdN4gzUTMCe/Q6P78vgX5Q/nueBBB/h/zGaGz40nfwGGeuTy9LGq97/vnz4V7VgLvMk5KT7gwdI4ypfqVUOVOMp1eBENMF3yX7OZuMPRqdchydq+7AoHoft/7CFj1DUx49wbNMgrwCmQ5OXDYIhtSTyYSi1QdVu/TLcG8sooLSWndMjC5jfMVK4Up2pWYI2DB43mZEBaE0e7WaBUXx+IP3iI3CjEkpDzxojCKzYFyEyE9Q0ylR/Y/yXs6KTvKK5q7w/FHWAVB5oZVoDY4KUYTkDZ8XFvE0VDsJ//1tm5pCe6QqJTfQHVSiUg/aNiZOFkApoEe10T2LQgn/ldrpekkTzZQb/T/loorJWAVRFoNEGj',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '24I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oJu1o1F7CN2u0wGmdfZ1+klpTBMkFq28eIEVqObbHj6mFJuQFAei67YxMitMMU8tArAxyxCZF9ud/VmR5JQ5nPek8PgHgdVOPGtWPm1Izb8A==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM24_1:SH1',
  //           OfferID:
  //             'NDQ0NzExMCo0MjAwMDE1MTE3Mio1MDc0NzgqU09XKlMqZmFsc2UqQTIwN0pINTgqMTkwMDYqT1cqdHJ1ZSoxNTk4LjU5KlRSWSoyMDI0LTEyLTE5KkhpZUV1QiUyRnZWcW84YU9MbHgzUm5LdUVpR2pCMGEzZGtrbFFxRElNZlByMnVudXVCMjBRcWFsdkZQZzBTb1g0UEFIRHRJOEFFTFNpR2xiYzBBSVY3aXclM0QlM0Q=',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'EXTRA',
  //           Seq: 'FL_SAWADB_8',
  //           SegmentRefs: 'NDQ0NzExMA==',
  //           PassengerList: 'SH1',
  //           StandartSeatSelection: false,
  //           AllSeatSelection: true,
  //           FreeSandwich: true,
  //           Entertainment: true,
  //           FlexibleReturnChangeRight: true,
  //         },
  //       },
  //     ],
  //     flightDetailSegments: [
  //       {
  //         key: '24I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oJu1o1F7CN2u0wGmdfZ1+klpTBMkFq28eIEVqObbHj6mFJuQFAei67YxMitMMU8tArAxyxCZF9ud/VmR5JQ5nPek8PgHgdVOPGtWPm1Izb8A==',
  //         groupId: 0,
  //         origin: {
  //           code: 'SAW',
  //           isDomestic: false,
  //           iata: null,
  //           type: 7,
  //           id: 0,
  //         },
  //         destination: {
  //           code: 'ADB',
  //           isDomestic: false,
  //           iata: null,
  //           type: 7,
  //           id: 0,
  //         },
  //         departureTime: '2024-12-19T23:35:00',
  //         arrivalTime: '2024-12-20T00:45:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2206',
  //         cabinClass: 0,
  //         bookingCode: 'SOW',
  //         equipment: null,
  //         isMeal: false,
  //         quota: 9,
  //         baggageAllowance: {
  //           maxWeight: {
  //             value: 20,
  //             unit: 0,
  //           },
  //           piece: {
  //             pieceCount: 0,
  //           },
  //         },
  //         freeVolatileData: {
  //           ResBookDesigID: {
  //             SeatsLeft: 9,
  //             SeatsLeftSpecified: true,
  //             Value: 'S',
  //           },
  //           ResBookDesigCode: 'SOW',
  //           Baggage: 'BaggageAllowance4',
  //           BrandName: 'EXTRA',
  //           Seq: 'FL_SAWADB_8',
  //         },
  //       },
  //     ],
  //     airLines: [
  //       {
  //         value: 'Pegasus  Havayolları',
  //         code: 'PC',
  //       },
  //     ],
  //   },
  //   {
  //     flightFare: {
  //       flightDetailKeys: [
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4anFKdvcOjP1FWUu8qX5ONkqul7zRTbfNnCQ8cxQ5mYI/ql7rt5o/z9pfvOJcqHTv3oZGf+rgeRVmQjtp5RFEEKcGk9p8rU0DQUePrhlNXRF9Narxj6j3J76MMq2MtWKDi/0gB1t1ww7L2VCqMqTtz0ed3Ol2nt/CsNVB7NgLZol0zYtiOxTUaalIflJYy1JeZi31/980EgcgY6pUTF0iNmtFF9/VyNQIioSeOMC4yovfj3hG1fUUY/Bm8bFXkPwzYBwLQn6LgkUMABFBJCwJGhERZD8OvvW//aydGL3qEyl4glRMJx6r7MQOawEtPw836iotu21PBKjHopwbxSNt2bqrW/cPZ/GxY/XSQzmrmq8rffYTUtT46J3jztp8eYJCeTTTNAecPS12pvSprmbX+1ol3OlMgt/M0tQaxLX+099ENwaRy01BfnISiTq+1rbLXBxvfTSLKcenZI0QT7Npvq',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pKgFW+QBd0maHJfcbjm2Xc1I8GKMh21UbIszrts4WBBLQ9E7Y4bcsQZampUsPorTHeczvjZzskMKeDPIZ1HacMDsvCBM3l+cK42poo9Qd+NgkNgcKu9xcuYK319ZEXNa5GuPfiuueaL1lZIgQ73gYQ4p34JUptYTaqmVcnaURb4XHgHOoZKV41eCcyHFwXmKSmaHEEBKuuQshmvGmuldxlpIvRgdAl2RhLJ56inozK+CdX9KXnltnxKxmY1hlGu/YYaD/QJg2qMZEuqYa3tXF0pOFGyZyi8rXLgbkVcVLZv/HyW9WTGBE+vqB1itCWa+5H1cAm7MYIvP3qBjLABi4bxPWW2uSjFpV9H9z+qLp8pg==',
  //       totalPrice: {
  //         value: 2731.69,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 2262.39,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       taxes: {
  //         value: 469.3,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       discount: {
  //         value: 0,
  //         currency: null,
  //         rateValue: null,
  //       },
  //       buyFee: {
  //         code: null,
  //         price: {
  //           value: 0,
  //           currency: null,
  //           rateValue: null,
  //         },
  //       },
  //       fee: {
  //         code: '',
  //         price: {
  //           value: 0,
  //           currency: 'TRY',
  //           rateValue: null,
  //         },
  //       },
  //       passengerPrices: [
  //         {
  //           unitPrice: {
  //             value: 2731.69,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 2262.39,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitFee: {
  //             code: '',
  //             price: {
  //               value: 0,
  //               currency: 'TRY',
  //               rateValue: null,
  //             },
  //           },
  //           unitTax: {
  //             value: 469.3,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           cancelPenalty: null,
  //           changePenalty: null,
  //           passengers: [
  //             {
  //               key: '892E705CCA057E17C136156A618B29754E7C406DE2DBFC98572F8A33C45B0413',
  //               name: null,
  //               passengerType: 0,
  //               age: 0,
  //               birthday: '0001-01-01T00:00:00',
  //               gender: 0,
  //             },
  //           ],
  //           taxInfos: [
  //             {
  //               key: 'VQ',
  //               value: '119.30',
  //             },
  //             {
  //               key: 'YR',
  //               value: '350.00',
  //             },
  //             {
  //               key: '||',
  //               value: '0',
  //             },
  //           ],
  //           serviceCharges: null,
  //         },
  //       ],
  //       taxInfos: null,
  //       serviceCharges: null,
  //       providerName: 'PegasusNDC',
  //     },
  //     id: '3742a401-20dc-4b8b-ac40-936689996a41',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4anFKdvcOjP1FWUu8qX5ONkqul7zRTbfNnCQ8cxQ5mYI/ql7rt5o/z9pfvOJcqHTv3oZGf+rgeRVmQjtp5RFEEKcGk9p8rU0DQUePrhlNXRF9Narxj6j3J76MMq2MtWKDi/0gB1t1ww7L2VCqMqTtz0ed3Ol2nt/CsNVB7NgLZol0zYtiOxTUaalIflJYy1JeZi31/980EgcgY6pUTF0iNmtFF9/VyNQIioSeOMC4yovfj3hG1fUUY/Bm8bFXkPwzYBwLQn6LgkUMABFBJCwJGhERZD8OvvW//aydGL3qEyl4glRMJx6r7MQOawEtPw836iotu21PBKjHopwbxSNt2bqrW/cPZ/GxY/XSQzmrmq8rffYTUtT46J3jztp8eYJCeTTTNAecPS12pvSprmbX+1ol3OlMgt/M0tQaxLX+099ENwaRy01BfnISiTq+1rbLXBxvfTSLKcenZI0QT7Npvq',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '21I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pgr2aI42o65v77w1vIvnwTb0Q+ydsCgjPVe3Y6i4ZCxYVBCWR+G8vP86K5RbER4yW75mGMT1jGXeQWzKAhJ8VKRO3LSNonGG5KtLHPZxHYyA==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM21_1:SH1',
  //           OfferID:
  //             'NDQ0NzA4MSo0MjAwMDE1MTE2Nyo1MDc0NzgqTk9XKk4qZmFsc2UqQTIwN0pINTgqMTkwMDYqT1cqdHJ1ZSoxNzMxLjY5KlRSWSoyMDI0LTEyLTE5KmczTEJCd3hRWndtVGdWU3BEN2RMSkNPakY3MHg0c1NCbEZBTWpWNHpteU91bnV1QjIwUXFhbHZGUGcwU29YNFAxMWN3TFQ5SmtkMmRpOFc5SldEU3pRJTNEJTNE',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'EXTRA',
  //           Seq: 'FL_SAWADB_7',
  //           SegmentRefs: 'NDQ0NzA4MQ==',
  //           PassengerList: 'SH1',
  //           StandartSeatSelection: false,
  //           AllSeatSelection: true,
  //           FreeSandwich: true,
  //           Entertainment: true,
  //           FlexibleReturnChangeRight: true,
  //         },
  //       },
  //     ],
  //     flightDetailSegments: [
  //       {
  //         key: '21I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pgr2aI42o65v77w1vIvnwTb0Q+ydsCgjPVe3Y6i4ZCxYVBCWR+G8vP86K5RbER4yW75mGMT1jGXeQWzKAhJ8VKRO3LSNonGG5KtLHPZxHYyA==',
  //         groupId: 0,
  //         origin: {
  //           code: 'SAW',
  //           isDomestic: false,
  //           iata: null,
  //           type: 7,
  //           id: 0,
  //         },
  //         destination: {
  //           code: 'ADB',
  //           isDomestic: false,
  //           iata: null,
  //           type: 7,
  //           id: 0,
  //         },
  //         departureTime: '2024-12-19T21:25:00',
  //         arrivalTime: '2024-12-19T22:35:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2204',
  //         cabinClass: 0,
  //         bookingCode: 'NOW',
  //         equipment: null,
  //         isMeal: false,
  //         quota: 9,
  //         baggageAllowance: {
  //           maxWeight: {
  //             value: 20,
  //             unit: 0,
  //           },
  //           piece: {
  //             pieceCount: 0,
  //           },
  //         },
  //         freeVolatileData: {
  //           ResBookDesigID: {
  //             SeatsLeft: 9,
  //             SeatsLeftSpecified: true,
  //             Value: 'N',
  //           },
  //           ResBookDesigCode: 'NOW',
  //           Baggage: 'BaggageAllowance4',
  //           BrandName: 'EXTRA',
  //           Seq: 'FL_SAWADB_7',
  //         },
  //       },
  //     ],
  //     airLines: [
  //       {
  //         value: 'Pegasus  Havayolları',
  //         code: 'PC',
  //       },
  //     ],
  //   },
  // ]
  //#endregion
}
export const clearSearchRequest = () => {
  console.log('clearSearchRequest is called')
  if (timer) {
    clearTimeout(timer || 0)
    timer = null
  }
  // if (timer) {
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
