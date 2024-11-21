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
  //#region flight dummy data
  // return [
  //   {
  //     flightFare: {
  //       flightDetailKeys: [
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4ZZ4tHolOOMmK8ZbCJ/wQHvlID2LH048gkwZ1FM0UzzV23wUR1W7503v0fy7y806DkbY59kxhbOZ0vkX3qFt45rPnoS/J5Z+e3n648LDHSgm8sEzQZVaua5bCZra/y1i+DKd9dSbOVWsYlRe8zgjEb7myHP0KXzPnAl30uCvJ434GFMhZ2SQbdgm4bOCKyTKaqwHiaLdl/BYZJOFapLaNIJqhPYt9s0e2UdU9xmMSfx8SjVrgX5h64H9EpfIjRYB/tWT93m/F0jn7nIgASQ0BU2LA2Nd/md7LOc/HAsvUxGId3yKUh5EmK97zGUtbblGoruiPWjWq7lCqWPeScBK/+c7LuwvQOwr0KLCAcrjWhMQvcbTRJVgo+nvoBTdtsThGsNxfn8S6BCEfDL7f5/K3kOKc64A8mm9siVWKdG0q7CWcbBnJmQC1983ra6DybkV1M=',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oPkzuOzlMhr8OQL+tIrsOI08VAhx7gOnEn8XkQQ0/UbO51C8qYrtx416J4JfycyQOz30ydvbyLQAWdZ2VCyJ+BBekA7slc/5DaW8RZvgKxP4PqQDTfAAcwmiFok0SkTTsE3C2i4GtCFnGkTS7u86NgBuwTr0zbqNRIsbV1U/rxCFejJWDK5ru6fS8cALhncESe9w/35LxHqRNY5iZA3kmfIjzwneam0l+XzNiUbGsIzQocOiqzl9V2hA7ppidUU4OhfVvPD3NhhYoSrnFvV9OnUOVmoxL+V4Kh9P+m7mXg1YU3KlVzcoouYaDoS5uM3LX0jKdSOYaCCD5HusKgM5VJZQb98hcnlEfOEtuXJhHMAg==',
  //       totalPrice: {
  //         value: 800,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 330.7,
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
  //             value: 800,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 330.7,
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
  //     id: 'f4c8a548-8431-4b08-82fb-162edf65fa5c',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4ZZ4tHolOOMmK8ZbCJ/wQHvlID2LH048gkwZ1FM0UzzV23wUR1W7503v0fy7y806DkbY59kxhbOZ0vkX3qFt45rPnoS/J5Z+e3n648LDHSgm8sEzQZVaua5bCZra/y1i+DKd9dSbOVWsYlRe8zgjEb7myHP0KXzPnAl30uCvJ434GFMhZ2SQbdgm4bOCKyTKaqwHiaLdl/BYZJOFapLaNIJqhPYt9s0e2UdU9xmMSfx8SjVrgX5h64H9EpfIjRYB/tWT93m/F0jn7nIgASQ0BU2LA2Nd/md7LOc/HAsvUxGId3yKUh5EmK97zGUtbblGoruiPWjWq7lCqWPeScBK/+c7LuwvQOwr0KLCAcrjWhMQvcbTRJVgo+nvoBTdtsThGsNxfn8S6BCEfDL7f5/K3kOKc64A8mm9siVWKdG0q7CWcbBnJmQC1983ra6DybkV1M=',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '4I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oti9SOa/x2ydW/ZGDA35rEtjEFSGyIojVfidTIif2GmflYE/oyVJZa8qtHwQ0zvEeRwWgXBQsOQiDHtf0RYBpH',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM4_1:SH1',
  //           OfferID:
  //             'NDQ0Njc1MSo0MTk5OTY4OTM3OSotMSpUT1cqVCpmYWxzZSpBMjA3Skg1OCotMSpPVyp0cnVlKjgwMC4wKlRSWSoyMDI0LTEyLTE5KjB6JTJGdTdjY0NWa2tJUEo3a1hvSGRMS0lnN3lXbjhEWGwwdmFPaVUlMkJvY3dsRUUyUlRQMzVZOHFZRU0weGFGR2Q3S1VEbFc4WUNOaVFqUHVBd1Rkc3pCUSUzRCUzRA==',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ECO',
  //           Seq: 'FL_SAWADB_2',
  //           SegmentRefs: 'NDQ0Njc1MQ==',
  //           PassengerList: 'SH1',
  //           StandartSeatSelection: false,
  //           AllSeatSelection: false,
  //           FreeSandwich: false,
  //           Entertainment: false,
  //           FlexibleReturnChangeRight: false,
  //         },
  //       },
  //     ],
  //     flightDetailSegments: [
  //       {
  //         key: '4I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oti9SOa/x2ydW/ZGDA35rEtjEFSGyIojVfidTIif2GmflYE/oyVJZa8qtHwQ0zvEeRwWgXBQsOQiDHtf0RYBpH',
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
  //         departureTime: '2024-12-19T07:40:00',
  //         arrivalTime: '2024-12-19T08:50:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2184',
  //         cabinClass: 0,
  //         bookingCode: 'TOW',
  //         equipment: null,
  //         isMeal: false,
  //         quota: 9,
  //         baggageAllowance: {
  //           maxWeight: {
  //             value: 15,
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
  //             Value: 'T',
  //           },
  //           ResBookDesigCode: 'TOW',
  //           Baggage: 'BaggageAllowance1',
  //           BrandName: 'ECO',
  //           Seq: 'FL_SAWADB_2',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4ZRu+EChGJsJqcyICffnNHcVVPiQM2N8QzX+qffNyvrAp0npy8YGfNNpRvBjIKdFWXmJ2yN4Z2lA3CpqqkEeX0Ft1Z/tknbv8LU47F3nBBkeca8VYn2gxcqKtxI6DRB3080+q54gNSXV0STDNOmBp2aZDzccXyIGI2EO2xVy6/YIMl6RuRjNERmWCXyraygEWgYtDNCK8MDct7XZGTLM/ug+cBhSWwHtvmYIiWnnvkZu8++M96uj8wEGzJ/5O0Sin1To8XI4nGVZAavF8Bz5TtecdNuehMf5GN5PucQUvrOVdTG4wkULs8a0sSFvRgHLiqM4tRcrgnR91eatJi3dUciHm0t9stSiCpwnlj6VmB3Jj/PTrg2UaXhIq0IIYjfI00a7YDaYNBQoIBfM7WwO3gyxcVNTD/H+8EDz+vXTF3RKufEo+DAoMtUNiNkXHvadTM=',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pxAUwrr4P6KR9K6eEBPj+yeEZDxKcE7mzRMnr0Kd0Zs7hHW/cY1afa39bZOSNsc4EcLzDhhN+SmjbcPgAl9179NpPtcaasuabMUC4VstKB87D8YeNomYuTM+/ElEz6hhlhMjIXAJc8XawoQEYXx3TI75bfr244EU6hHcyE4NUDULPfh+CbZYmcKBal8f5b3v2+dzX00COFkgBuGSJX0calahY3FU6xNOvpEytxy7kXkbERABgUBkLlAQmsCuv4A4ARj2Jz1fMPt6llyN1cVSapRN6gWxQ8Kv/QQ3khB6sx+dy/5DPURNFaIv3Yh0aU9LzCgO3X8J2sRgHUauuqwasvCJAyq93sFMBSDpGN55EmYg==',
  //       totalPrice: {
  //         value: 866.3,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 397,
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
  //             value: 866.3,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 397,
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
  //     id: '00e7b7ce-dd28-41cc-a93f-a45319c7ca6e',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4ZRu+EChGJsJqcyICffnNHcVVPiQM2N8QzX+qffNyvrAp0npy8YGfNNpRvBjIKdFWXmJ2yN4Z2lA3CpqqkEeX0Ft1Z/tknbv8LU47F3nBBkeca8VYn2gxcqKtxI6DRB3080+q54gNSXV0STDNOmBp2aZDzccXyIGI2EO2xVy6/YIMl6RuRjNERmWCXyraygEWgYtDNCK8MDct7XZGTLM/ug+cBhSWwHtvmYIiWnnvkZu8++M96uj8wEGzJ/5O0Sin1To8XI4nGVZAavF8Bz5TtecdNuehMf5GN5PucQUvrOVdTG4wkULs8a0sSFvRgHLiqM4tRcrgnR91eatJi3dUciHm0t9stSiCpwnlj6VmB3Jj/PTrg2UaXhIq0IIYjfI00a7YDaYNBQoIBfM7WwO3gyxcVNTD/H+8EDz+vXTF3RKufEo+DAoMtUNiNkXHvadTM=',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '7I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qUTexF7fTf5yyq4fXsJpKRJZWBQZtQE/+rNVi/aYh8t5vZDLaQ32P2pkAZPbPhtJ8GaF8Do0Y4cJIzu9hyTjO5',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM7_1:SH1',
  //           OfferID:
  //             'NDQ0NjgwOCo0MjAwMDE1MTE2MCotMSpUT1cqVCpmYWxzZSpBMjA3Skg1OCotMSpPVyp0cnVlKjg2Ni4zKlRSWSoyMDI0LTEyLTE5KjVWaHlEenRlJTJGYWclMkY5Zk96MHpvJTJCYzI4cUptN0ZMbG5IRyUyQllQeUJhWkdidEVFMlJUUDM1WThxWUVNMHhhRkdkN3NJQXJuaVFRMEdRMmdvaGNCaDlpOXclM0QlM0Q=',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ECO',
  //           Seq: 'FL_SAWADB_3',
  //           SegmentRefs: 'NDQ0NjgwOA==',
  //           PassengerList: 'SH1',
  //           StandartSeatSelection: false,
  //           AllSeatSelection: false,
  //           FreeSandwich: false,
  //           Entertainment: false,
  //           FlexibleReturnChangeRight: false,
  //         },
  //       },
  //     ],
  //     flightDetailSegments: [
  //       {
  //         key: '7I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qUTexF7fTf5yyq4fXsJpKRJZWBQZtQE/+rNVi/aYh8t5vZDLaQ32P2pkAZPbPhtJ8GaF8Do0Y4cJIzu9hyTjO5',
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
  //         departureTime: '2024-12-19T08:25:00',
  //         arrivalTime: '2024-12-19T09:35:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2186',
  //         cabinClass: 0,
  //         bookingCode: 'TOW',
  //         equipment: null,
  //         isMeal: false,
  //         quota: 9,
  //         baggageAllowance: {
  //           maxWeight: {
  //             value: 15,
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
  //             Value: 'T',
  //           },
  //           ResBookDesigCode: 'TOW',
  //           Baggage: 'BaggageAllowance1',
  //           BrandName: 'ECO',
  //           Seq: 'FL_SAWADB_3',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YzrM+l7e0KdZYrRXT6Pzmt35wEHSMKSLNpYKxJh8pG8shzC0d6TMxL6w5xeNhhfuEY9gMC0bjEmh/5WhcDjD0May5UNuw/k20xx/Ze7GmGz9gIHzACBw9q0dCRiZrD4LHbhduA0aiXfDk4wcXbhvXGwWa38zxD6P2UYby9byMFQeB1oKbIiKpejfIf1BxHGs3ZXiA1NNIwwECDZSOUpQ5k/uc1B93aFWZppDE4LThlltJi85h0pyEpdMMXzMTMSOtESxpCIddFiVpJTQ0u5uX5NKC7Z1CkbeDIBrjc42lTSTz4S7+6Jb8seaOlTX/rQHFs/q8a8SmrJfEns6qx0v6vxIhhs5ddOzo7hTCplIgY0eOJMHJKPGKUS4j8ADtU6dtH6St3XkkjhBof7B2q8d5vGD7hcnybIgvJETgj/iDmzQLotE1W+Rm9MND/4eBNCkc=',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pABQPKaFO5AKpYPyXiCQ1Fg+dJiWBSE3CpJxawc2RTViuFRfnZ0iSTwKKRLoiuzGxK+34VemML31kJ8tdxBAeV/rD0neBpEjB5CqLOY6fndsobxNsFVBJGjB1qnQ5wk7HO4kgwhWnJ4nT2S/7YtZ92G+eeiRv36RJSEWo5Kx22bP9WtXbfK6BQE3TcZoj5kn/fjzWDFGO0Zc47rDBdZhu+VX3BQD8a5ziV/gAGOaY66eM7J2dx2MCD2z+4UwXi4aUxQGzbn0eMKn0++ZQpJX5vfuNSB7h2vVzYGSytEKadUu8rb5jYmnEBpiYyCMb5xDwp/w0E1OFARqxZK19xiUOL4rfOQ8Cx0d0RHwY1owEzVA==',
  //       totalPrice: {
  //         value: 896,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 426.7,
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
  //             value: 896,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 426.7,
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
  //     id: '51215ebf-6de0-4afe-bb09-97ba175ad715',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YzrM+l7e0KdZYrRXT6Pzmt35wEHSMKSLNpYKxJh8pG8shzC0d6TMxL6w5xeNhhfuEY9gMC0bjEmh/5WhcDjD0May5UNuw/k20xx/Ze7GmGz9gIHzACBw9q0dCRiZrD4LHbhduA0aiXfDk4wcXbhvXGwWa38zxD6P2UYby9byMFQeB1oKbIiKpejfIf1BxHGs3ZXiA1NNIwwECDZSOUpQ5k/uc1B93aFWZppDE4LThlltJi85h0pyEpdMMXzMTMSOtESxpCIddFiVpJTQ0u5uX5NKC7Z1CkbeDIBrjc42lTSTz4S7+6Jb8seaOlTX/rQHFs/q8a8SmrJfEns6qx0v6vxIhhs5ddOzo7hTCplIgY0eOJMHJKPGKUS4j8ADtU6dtH6St3XkkjhBof7B2q8d5vGD7hcnybIgvJETgj/iDmzQLotE1W+Rm9MND/4eBNCkc=',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '1I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qL2NlW6yt2trMIWB7O/ljpNjB0tVEYcRoa5Vmwlc/TUIvk/XxAW8fj1lxqX++0qk0mX+t7enow+CqLR3IT63sO',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM1_1:SH1',
  //           OfferID:
  //             'NDQ0NjY4OSo0MTk5NzExMDMzNCotMSpUT1cqVCpmYWxzZSpBMjA3Skg1OCotMSpPVyp0cnVlKjg5Ni4wKlRSWSoyMDI0LTEyLTE5KnJEdjU0UUduV3VaOXBzWWhyaSUyQnc5djRQczc5RHVMTTJ4c1FaTTRUUUkweEVFMlJUUDM1WThxWUVNMHhhRkdkN2pvemd1UVJGSU1sNzBRZWJaJTJCTiUyQjVRJTNEJTNE',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ECO',
  //           Seq: 'FL_SAWADB_1',
  //           SegmentRefs: 'NDQ0NjY4OQ==',
  //           PassengerList: 'SH1',
  //           StandartSeatSelection: false,
  //           AllSeatSelection: false,
  //           FreeSandwich: false,
  //           Entertainment: false,
  //           FlexibleReturnChangeRight: false,
  //         },
  //       },
  //     ],
  //     flightDetailSegments: [
  //       {
  //         key: '1I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qL2NlW6yt2trMIWB7O/ljpNjB0tVEYcRoa5Vmwlc/TUIvk/XxAW8fj1lxqX++0qk0mX+t7enow+CqLR3IT63sO',
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
  //         departureTime: '2024-12-19T06:00:00',
  //         arrivalTime: '2024-12-19T07:10:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2182',
  //         cabinClass: 0,
  //         bookingCode: 'TOW',
  //         equipment: null,
  //         isMeal: false,
  //         quota: 9,
  //         baggageAllowance: {
  //           maxWeight: {
  //             value: 15,
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
  //             Value: 'T',
  //           },
  //           ResBookDesigCode: 'TOW',
  //           Baggage: 'BaggageAllowance1',
  //           BrandName: 'ECO',
  //           Seq: 'FL_SAWADB_1',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4Zu+ulmkgx2CXJFxWCnNkwdsfZZDyswDea1UHpDLKgh/DPk0aUzPOC1rbtZvDW27O3j3lnWoMBH/lAl6IZuA5aFpN9mJzJJa1A0D50mI3TQE5ZpQc1t2gDP5F+jKf86OqDJSlO6iAkzh/R6hcgAYLPdvQNoSIYr0qQ19K4L79PWfuoLyXfBVkwU9mlpp7+p9tSBPF2sQiA9T2732e4QuiJTOGme2+b+H1jXxqNriZ9m6+tP0tQBPvl3NXnHyrqpBhJOqvTj2lIhWt0ZSMysv+fXVVFcV9b4ntbMlsUE5W16N1QnkwRD4G32RxG0djEgKaQJ68WVha+DqyJNQYBaVbpbOGjR0UGVn5fWzpP2SvLJki+/bfGs925tTXm2Q+tZjcRZdZatZ4LZZ+wJRjbLTHupLmpuANPVK3ffXkitlFisPRRxpX+8WGt6JwQG6tyRJ6c=',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oQ0hsh7LroUmcOt2xoU3MhYRubJOlLxW0fG2thNbBMv8KQCp1TUyG4nhHf5Mot5+yTwpOb0bw5MB+0T+dan+dpXBLjyh4KnIquilf32CfSs3HvPw4NOlpgAh5d6oZEg/r5dGXqHuVYL/tLH6wqfvZePyeFFtn4lkn5WiywD345gXZxHxfyaiB+JVIVbBFZo3XRAQ+acHhvH7boePcOm04AM/bY2iPokguHf3oDdt8sEytsqSHdbs9RCNm5GKGi6Vlq8DoJUMAwwSb9w64+7xdV8IJ7eBOShuckYNHPwsFsc1K8gn61Rmj2nBAwwjZbMquBm2Lv7DymVB0np0GQurTZJEhWLXLjm5DX8BUUkVnzkw==',
  //       totalPrice: {
  //         value: 1328.57,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 859.27,
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
  //             value: 1328.57,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 859.27,
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
  //     id: 'ec2cd58b-6491-4f52-9540-a2006153e899',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4Zu+ulmkgx2CXJFxWCnNkwdsfZZDyswDea1UHpDLKgh/DPk0aUzPOC1rbtZvDW27O3j3lnWoMBH/lAl6IZuA5aFpN9mJzJJa1A0D50mI3TQE5ZpQc1t2gDP5F+jKf86OqDJSlO6iAkzh/R6hcgAYLPdvQNoSIYr0qQ19K4L79PWfuoLyXfBVkwU9mlpp7+p9tSBPF2sQiA9T2732e4QuiJTOGme2+b+H1jXxqNriZ9m6+tP0tQBPvl3NXnHyrqpBhJOqvTj2lIhWt0ZSMysv+fXVVFcV9b4ntbMlsUE5W16N1QnkwRD4G32RxG0djEgKaQJ68WVha+DqyJNQYBaVbpbOGjR0UGVn5fWzpP2SvLJki+/bfGs925tTXm2Q+tZjcRZdZatZ4LZZ+wJRjbLTHupLmpuANPVK3ffXkitlFisPRRxpX+8WGt6JwQG6tyRJ6c=',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '10I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6rJR3tvX8c72RUuduSNzWKYx+c4Tg7yBiPwBP4rgqvRw+zQcO9jxWHPns14dQmuz5SSrHVd3STEG5+VhY8mRZKS',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM10_1:SH1',
  //           OfferID:
  //             'NDQ0NjkwOSo0MjAwMDE1MTE2MyotMSpYT1cqWCpmYWxzZSpBMjA3Skg1OCotMSpPVyp0cnVlKjEzMjguNTcqVFJZKjIwMjQtMTItMTkqQ0lGZVJrOWNIT3pRRXlzaTNBMkNzJTJCNk94M2VQV1Q2bUJkeWUydzY4VkdwRUUyUlRQMzVZOHFZRU0weGFGR2Q3VEg2aW9CMjIydmZLTnN5eXVUTEZMZyUzRCUzRA==',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ECO',
  //           Seq: 'FL_SAWADB_4',
  //           SegmentRefs: 'NDQ0NjkwOQ==',
  //           PassengerList: 'SH1',
  //           StandartSeatSelection: false,
  //           AllSeatSelection: false,
  //           FreeSandwich: false,
  //           Entertainment: false,
  //           FlexibleReturnChangeRight: false,
  //         },
  //       },
  //     ],
  //     flightDetailSegments: [
  //       {
  //         key: '10I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6rJR3tvX8c72RUuduSNzWKYx+c4Tg7yBiPwBP4rgqvRw+zQcO9jxWHPns14dQmuz5SSrHVd3STEG5+VhY8mRZKS',
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
  //         departureTime: '2024-12-19T15:30:00',
  //         arrivalTime: '2024-12-19T16:40:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2190',
  //         cabinClass: 0,
  //         bookingCode: 'XOW',
  //         equipment: null,
  //         isMeal: false,
  //         quota: 9,
  //         baggageAllowance: {
  //           maxWeight: {
  //             value: 15,
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
  //             Value: 'X',
  //           },
  //           ResBookDesigCode: 'XOW',
  //           Baggage: 'BaggageAllowance1',
  //           BrandName: 'ECO',
  //           Seq: 'FL_SAWADB_4',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YAb+yIbkjZ8p0Gi1cQS5+NinSjKkT6Ezf5t2ztjZeF4nyU5hfi1ymHtYxUE7apwKdqmp4oN0rt/krXdwwOKvbUx6+Nw4xgl8WfkZFk1eTqGxn0AsoD8hw6Akh3yfTjqzneJVpxr5979+ych2ZkoTxXolVCX24dY8YYYKebafTHsaMUNCpcCOYMdbz0i1UwQzkfDCg5bb2dIaJ/0WP+YcZ8t/qw41uiNUBM0OB8B2iG1CotD95SHGyPPBSQiI9kWTDZ4lBZP2dB3Czsut9a8lnSv6NW+Wgkvsf5Oz8TH9nC74Ka8UaP/lFIZt6Rj7ZHajnPGd3kHc0+DzMg8APSZXb5VIrplsvUe0t0/KyNecHpCQkUKA2Gy35KClbBRflEaP1Hlkuw1JiZlFfPANQozc7XCHjAIu39tR1KhC68pww9cjQYdYx4hByeZE6US7Fi+AY=',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6o2xeelBl2agZVzk5u9vkPwVdNe1G5ryMmokjRko7BXrxuGZzIGqgoUXzFBwloziV0U6xX8pPXn6hbh9/+u5OaXddGQRrMWF830Yfm8d1ugqCuyb5iuSNVmNELp0YEt4X9PjFdwJujZMI7P61wT+hnPu8hfRi5pGH7Mx44o9CuDYEASdieyBOgR/WMcBPoMGSO8EmTzjovbpFzoal1F/szcTp4ZFWfzsTbA2PXC5WM6J6+tDxFvLOtPKr6g75mcBX0RE4mPRJiT/WAaGLN4SrjlkOU/pizdBIvfyydQ5nN0Db0h/6N//pVO9j2ZnW0CM872ouWZRMHX0A/FHFOuJV7mi2tZDqIg53VAQYQtT9aRBg==',
  //       totalPrice: {
  //         value: 1375.72,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 906.42,
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
  //             value: 1375.72,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 906.42,
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
  //     id: 'bab1a682-81f0-43d7-ab46-ab6de4f79d33',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YAb+yIbkjZ8p0Gi1cQS5+NinSjKkT6Ezf5t2ztjZeF4nyU5hfi1ymHtYxUE7apwKdqmp4oN0rt/krXdwwOKvbUx6+Nw4xgl8WfkZFk1eTqGxn0AsoD8hw6Akh3yfTjqzneJVpxr5979+ych2ZkoTxXolVCX24dY8YYYKebafTHsaMUNCpcCOYMdbz0i1UwQzkfDCg5bb2dIaJ/0WP+YcZ8t/qw41uiNUBM0OB8B2iG1CotD95SHGyPPBSQiI9kWTDZ4lBZP2dB3Czsut9a8lnSv6NW+Wgkvsf5Oz8TH9nC74Ka8UaP/lFIZt6Rj7ZHajnPGd3kHc0+DzMg8APSZXb5VIrplsvUe0t0/KyNecHpCQkUKA2Gy35KClbBRflEaP1Hlkuw1JiZlFfPANQozc7XCHjAIu39tR1KhC68pww9cjQYdYx4hByeZE6US7Fi+AY=',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '13I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oL1Rs/QcbyyHJPyjHh/19UuJu6nnPpemh/2MXX426u0uS33b0+YkjfKiMlky4Tx82jcIrvZwyoZecw0Cox7dTc',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM13_1:SH1',
  //           OfferID:
  //             'NDQ0Njk1OSo0MTk5OTUzNjkwOCotMSpYT1cqWCpmYWxzZSpBMjA3Skg1OCotMSpPVyp0cnVlKjEzNzUuNzIqVFJZKjIwMjQtMTItMTkqdlNFVnE3TDVPYnJYNVZNaGpMVTdEeXglMkZRJTJCQTNoYWlkUHZtajFyQ3JJajVFRTJSVFAzNVk4cVlFTTB4YUZHZDc4dXJia2x5T3ZHQVFNbkRqOGg0ZXBRJTNEJTNE',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ECO',
  //           Seq: 'FL_SAWADB_5',
  //           SegmentRefs: 'NDQ0Njk1OQ==',
  //           PassengerList: 'SH1',
  //           StandartSeatSelection: false,
  //           AllSeatSelection: false,
  //           FreeSandwich: false,
  //           Entertainment: false,
  //           FlexibleReturnChangeRight: false,
  //         },
  //       },
  //     ],
  //     flightDetailSegments: [
  //       {
  //         key: '13I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oL1Rs/QcbyyHJPyjHh/19UuJu6nnPpemh/2MXX426u0uS33b0+YkjfKiMlky4Tx82jcIrvZwyoZecw0Cox7dTc',
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
  //         departureTime: '2024-12-19T17:35:00',
  //         arrivalTime: '2024-12-19T18:45:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2194',
  //         cabinClass: 0,
  //         bookingCode: 'XOW',
  //         equipment: null,
  //         isMeal: false,
  //         quota: 9,
  //         baggageAllowance: {
  //           maxWeight: {
  //             value: 15,
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
  //             Value: 'X',
  //           },
  //           ResBookDesigCode: 'XOW',
  //           Baggage: 'BaggageAllowance1',
  //           BrandName: 'ECO',
  //           Seq: 'FL_SAWADB_5',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4ZZ4tHolOOMmK8ZbCJ/wQHvlID2LH048gkwZ1FM0UzzV23wUR1W7503v0fy7y806DkMJFQZ0kEwMLn/I29YzTio361K3iEtOtHDj8WLBlaLLPAvU3Tr8vjZn0Cqwzp0aoQSqpFDTQvk5MY6SxM7/9k42VhWVfGA1vE5IYji3sGRJNueAYQpdECDeTNQiyIDNpACXpXJsT+/W6oCpxMEAtw0b8v7UNLjUZRcz/gACPYKfgv5OY0X/d/PnM8QdUQ/D6VFXD974gWOcm+TDt3JPMvKf1+14tfmtBhaU46RAR4TrYkYb3wVyWLfezKCgPfu6dfTN1RakYoUrf4yOVgaewcOdh9cZv74QvzhlEm7fypOUTZpnfDX4A6QgW5Zu0xGcpntwRZ7A56TBILfEyAPa83pV1/LjRuukE/MbwNSP8innD6QA1yGdq3S3OJ5/z8MNYZdhDLDwidYIvA78+MaDm6s',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oPkzuOzlMhr8OQL+tIrsOIy9d2OXecLoLvQH93Fb+9NX3YURqImHPtIfKohDubVOqd3VPH9skndNINtE0DHpRlQFX1PorpH1RwEpHAXU1b/OohoIZVGp6vbVvlUc53ADIddD58Wy7I6gGZ3XpEF27JJkSyfFyiD+2SWlzxfEgnPQTa7UdbcvoPjm7BMY+cZrHwFGiGPhodB/bP6ZK3F8FrvPcefzh0uZ+mUzRV5z4Q98DLB8NVvQTOw763WevfgCzAHxu63l7cc0auFem/GHvMmVJ2kwgVHdV+RDFyocc9BrpTG1UTx7LUM9MMf77/I9PWVbo0YE/OUzkU7vx9d2u5rYKmsT1omNq07A+JBDaN4A==',
  //       totalPrice: {
  //         value: 1500,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1030.7,
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
  //             value: 1500,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1030.7,
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
  //     id: 'd4ce5e0c-9a94-4559-b70f-822754dd2643',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4ZZ4tHolOOMmK8ZbCJ/wQHvlID2LH048gkwZ1FM0UzzV23wUR1W7503v0fy7y806DkMJFQZ0kEwMLn/I29YzTio361K3iEtOtHDj8WLBlaLLPAvU3Tr8vjZn0Cqwzp0aoQSqpFDTQvk5MY6SxM7/9k42VhWVfGA1vE5IYji3sGRJNueAYQpdECDeTNQiyIDNpACXpXJsT+/W6oCpxMEAtw0b8v7UNLjUZRcz/gACPYKfgv5OY0X/d/PnM8QdUQ/D6VFXD974gWOcm+TDt3JPMvKf1+14tfmtBhaU46RAR4TrYkYb3wVyWLfezKCgPfu6dfTN1RakYoUrf4yOVgaewcOdh9cZv74QvzhlEm7fypOUTZpnfDX4A6QgW5Zu0xGcpntwRZ7A56TBILfEyAPa83pV1/LjRuukE/MbwNSP8innD6QA1yGdq3S3OJ5/z8MNYZdhDLDwidYIvA78+MaDm6s',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '5I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oti9SOa/x2ydW/ZGDA35rEtjEFSGyIojVfidTIif2GmflYE/oyVJZa8qtHwQ0zvEewZeWMA6+URs1p5rUS60rEZsc2RhcpPp+KOUbF/VjbjQ==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM5_1:SH1',
  //           OfferID:
  //             'NDQ0Njc1MSo0MTk5OTY4OTM3OSo1MDc0NDQqVE9XKlQqZmFsc2UqQTIwN0pINTgqMjQ4MTgqT1cqdHJ1ZSo4MDAuMCpUUlkqMjAyNC0xMi0xOSoweiUyRnU3Y2NDVmtrSVBKN2tYb0hkTE1rbldhTXk4QVlRTTBqT3hHVk90TEN1bnV1QjIwUXFhbHZGUGcwU29YNFBWV1VSTmZuZUZpZHExSUlWaTRuTHJnJTNEJTNE',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_2',
  //           SegmentRefs: 'NDQ0Njc1MQ==',
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
  //         key: '5I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oti9SOa/x2ydW/ZGDA35rEtjEFSGyIojVfidTIif2GmflYE/oyVJZa8qtHwQ0zvEewZeWMA6+URs1p5rUS60rEZsc2RhcpPp+KOUbF/VjbjQ==',
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
  //         departureTime: '2024-12-19T07:40:00',
  //         arrivalTime: '2024-12-19T08:50:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2184',
  //         cabinClass: 0,
  //         bookingCode: 'TOW',
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
  //             Value: 'T',
  //           },
  //           ResBookDesigCode: 'TOW',
  //           Baggage: 'BaggageAllowance4',
  //           BrandName: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_2',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4ZRu+EChGJsJqcyICffnNHcVVPiQM2N8QzX+qffNyvrAp0npy8YGfNNpRvBjIKdFWUO5ztq6R28c3627H1mNy1Yi344PHKMEGLiWSauZCKJnQePr8eKwQCwhK3Fvb4HutIlZx16eiRJ6phEMNo2ym3cNwA7QJxaDSq0oQ+zPk/9U33u6aYeKuZFqnAOSQlfylukFpfLjqwKgGZUntfn1c4um7gwj3KtpJoMZ8i8YZbhRlwnmiEaeg9Cl4HYsRu19VJTakueXyihp32AreUiPR2T02U4Ih44Z9FaaGdwL6b7HW50UhZJKLXDKe7Um/YRAANYR7IYHNEdNIebeak0Hzyd+GObSk0PdxOVwMz42Rm+YAihyaEh5U896OgV7Kz6Y7A33lITj4zG9pUl1aBUnFegrce/hZuMYa/E9RHO/LIxfEV4emvcxfdIA8xvUVCVwlCYGOtFyoJQrvX1RrJXbDFiZveTkAhKOfL8ADcA7c1/8A==',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pxAUwrr4P6KR9K6eEBPj+y+aipVZ0BKAJwO+vkpY4hPRVfjuvmqu6Om4lpBoOYRtSru5r4roQcKqhl/k5xtzpsBRHzs6UoRu/ckgbjHMGvcrYKKvLl+q4bP+uaqL8JK5+y204+W+JHzgd7q4L4MkCGNgz7B0yULsNwbMuoA925tS0HxkO9GaffCNe8qfD0w0UoWkxtvPFUxdEJp43gbVI59hpmpDoWLwFMknnQjU1nzz8NnSRkt/zd6g2MwBiLDV2CSAbszWleFYRZssxfF4cVCY20ygZebZfkjQFvVo9Tpsd/KGGzTXn2YvuCQOMzeOPORt4Eh72AoZ3EZ2Q32HVQ/COfTTAe3E7rJ49awaNYOd+T3yshNvPFh3TtMQZySHQ=',
  //       totalPrice: {
  //         value: 1566.3,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1097,
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
  //             value: 1566.3,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1097,
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
  //     id: '02b7a462-a144-4678-8c16-fe0b7ec8b674',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4ZRu+EChGJsJqcyICffnNHcVVPiQM2N8QzX+qffNyvrAp0npy8YGfNNpRvBjIKdFWUO5ztq6R28c3627H1mNy1Yi344PHKMEGLiWSauZCKJnQePr8eKwQCwhK3Fvb4HutIlZx16eiRJ6phEMNo2ym3cNwA7QJxaDSq0oQ+zPk/9U33u6aYeKuZFqnAOSQlfylukFpfLjqwKgGZUntfn1c4um7gwj3KtpJoMZ8i8YZbhRlwnmiEaeg9Cl4HYsRu19VJTakueXyihp32AreUiPR2T02U4Ih44Z9FaaGdwL6b7HW50UhZJKLXDKe7Um/YRAANYR7IYHNEdNIebeak0Hzyd+GObSk0PdxOVwMz42Rm+YAihyaEh5U896OgV7Kz6Y7A33lITj4zG9pUl1aBUnFegrce/hZuMYa/E9RHO/LIxfEV4emvcxfdIA8xvUVCVwlCYGOtFyoJQrvX1RrJXbDFiZveTkAhKOfL8ADcA7c1/8A==',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '8I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qUTexF7fTf5yyq4fXsJpKRJZWBQZtQE/+rNVi/aYh8t5vZDLaQ32P2pkAZPbPhtJ8xZko7OY9yXi0RkPsB/6rliIrT+YNHjtXVy9aCouUseQ==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM8_1:SH1',
  //           OfferID:
  //             'NDQ0NjgwOCo0MjAwMDE1MTE2MCo1MDc0NDQqVE9XKlQqZmFsc2UqQTIwN0pINTgqMjQ4MTgqT1cqdHJ1ZSo4NjYuMypUUlkqMjAyNC0xMi0xOSo1Vmh5RHp0ZSUyRmFnJTJGOWZPejB6byUyQmMlMkZZSDd3R0llRnRFSFVPejFUQjVLaTJ1bnV1QjIwUXFhbHZGUGcwU29YNFByOW9PdkRVJTJCJTJCVDZhRXhub1pVY01yZyUzRCUzRA==',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_3',
  //           SegmentRefs: 'NDQ0NjgwOA==',
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
  //         key: '8I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qUTexF7fTf5yyq4fXsJpKRJZWBQZtQE/+rNVi/aYh8t5vZDLaQ32P2pkAZPbPhtJ8xZko7OY9yXi0RkPsB/6rliIrT+YNHjtXVy9aCouUseQ==',
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
  //         departureTime: '2024-12-19T08:25:00',
  //         arrivalTime: '2024-12-19T09:35:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2186',
  //         cabinClass: 0,
  //         bookingCode: 'TOW',
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
  //             Value: 'T',
  //           },
  //           ResBookDesigCode: 'TOW',
  //           Baggage: 'BaggageAllowance4',
  //           BrandName: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_3',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YzrM+l7e0KdZYrRXT6Pzmt35wEHSMKSLNpYKxJh8pG8shzC0d6TMxL6w5xeNhhfuG0yv1XgzMmBxApLb2zON522BVsStzdGVroIaY1e6AryvhEdPYWvA51lWC/tD4vca557JG3d/a88YwFF4zOwSek/KoU9KtGUNssI0nCoTp8EbyFoiA2aLP9M8LAzVxKZOTEOk/Fw7n5GB38Zespdjnrf4V5qxrmjMeRSeBwtu1TAVZ9+YS/Dqns7jzT1xv9s9aOimKh5rr3xubAqUuIYpU3XuTtyranq08znZ//qUCeoLai5f/NXG//0HOZuEqRYXDbhLaGyCQV+TDC59syIfbvHjl2/Cj1nzEuBHWchfSp82eVQEtbsFfoo+xIepcm2ScbO6ZYRf1ZGgJoR5fcZvkwY3LFYWL0tnG62ab/6/qyRdVa4hT3lcSi9oIc+nRy4rd5dRG/0RzWalR1vx5nxi5H',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pABQPKaFO5AKpYPyXiCQ1F4RvOMuMtqc2ksqRrV6RtUvgT334IC+EI4poN2cZjwH8euxfqVvgwDUt3xMnUoWrQO7PoVcPDpi2OygLL0QL59QzSFcw7krj2uzkxsh3G0/vXbmaNqreJF6COUyrjhZgsZ7HKQHWRDLptM0ukAc9IGzzKGM6Rpz6tp5UNjLRBwME9IQdo//BaO5B3gn3iqQNSiiK93Ny0Dp0ir+aCQptQbE+yxD07uFUHR2FGe9xg1xQPeivIzxigkTy3GwyFH4kpGBodwwv5CGwUIknhWvJzZR9w8HI5awevXV6Dq092c4BdOHax8a++GJw9VOLodqT8jMXoTnMGB99HM7A9c8TtgZSPsTvGoPRi2i9ka/AUfeo=',
  //       totalPrice: {
  //         value: 1596,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1126.7,
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
  //             value: 1596,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1126.7,
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
  //     id: '9adce790-b467-4fe9-a4a0-8b01c0da7f34',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YzrM+l7e0KdZYrRXT6Pzmt35wEHSMKSLNpYKxJh8pG8shzC0d6TMxL6w5xeNhhfuG0yv1XgzMmBxApLb2zON522BVsStzdGVroIaY1e6AryvhEdPYWvA51lWC/tD4vca557JG3d/a88YwFF4zOwSek/KoU9KtGUNssI0nCoTp8EbyFoiA2aLP9M8LAzVxKZOTEOk/Fw7n5GB38Zespdjnrf4V5qxrmjMeRSeBwtu1TAVZ9+YS/Dqns7jzT1xv9s9aOimKh5rr3xubAqUuIYpU3XuTtyranq08znZ//qUCeoLai5f/NXG//0HOZuEqRYXDbhLaGyCQV+TDC59syIfbvHjl2/Cj1nzEuBHWchfSp82eVQEtbsFfoo+xIepcm2ScbO6ZYRf1ZGgJoR5fcZvkwY3LFYWL0tnG62ab/6/qyRdVa4hT3lcSi9oIc+nRy4rd5dRG/0RzWalR1vx5nxi5H',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '2I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qL2NlW6yt2trMIWB7O/ljpNjB0tVEYcRoa5Vmwlc/TUIvk/XxAW8fj1lxqX++0qk1Bz2pOP+9pqFQzJsraoRHYXEm66kY8o4I/bgcb9/gWCw==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM2_1:SH1',
  //           OfferID:
  //             'NDQ0NjY4OSo0MTk5NzExMDMzNCo1MDc0NDQqVE9XKlQqZmFsc2UqQTIwN0pINTgqMjQ4MTgqT1cqdHJ1ZSo4OTYuMCpUUlkqMjAyNC0xMi0xOSpyRHY1NFFHbld1Wjlwc1locmklMkJ3OXNEbU80dmolMkJvZkhJdkJid2JHRVVraXVudXVCMjBRcWFsdkZQZzBTb1g0UHRuYU9jQkFJS2U5WjJ1YnhBJTJCT0ltUSUzRCUzRA==',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_1',
  //           SegmentRefs: 'NDQ0NjY4OQ==',
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
  //         key: '2I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qL2NlW6yt2trMIWB7O/ljpNjB0tVEYcRoa5Vmwlc/TUIvk/XxAW8fj1lxqX++0qk1Bz2pOP+9pqFQzJsraoRHYXEm66kY8o4I/bgcb9/gWCw==',
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
  //         departureTime: '2024-12-19T06:00:00',
  //         arrivalTime: '2024-12-19T07:10:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2182',
  //         cabinClass: 0,
  //         bookingCode: 'TOW',
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
  //             Value: 'T',
  //           },
  //           ResBookDesigCode: 'TOW',
  //           Baggage: 'BaggageAllowance4',
  //           BrandName: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_1',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4aUA/jG5KbPb/uzupoVOkVWz0fndGAVgW8uA8F4dF3kPZZuM1mAJTu0v+vi4GgPy5RJOmXxNN+2n5rMkDLWACt7Hl+4HTbDtLlD5MS3RxW8AxPtTgfSpruPCrHqtChCoaB82iiX8ITK9m9RAWUthcRuuhloGQ/f8IaHlINP1jKxALPisO86IohN4XZZg4WNAE9aeIpSYCgJIMoJPR+NxYNKrt3qrSo5ega8bgA6Y/aERxz5brqy3Yv/35xSEI9nL4sQdmKg4tKlvL7SFelY0DMnramS6gCKufEG3bNlvPdLlqlX9zC7vp3s3RWAbhjJc85nOPjC7Q6+QK3LXgFe1ruwoKQvBttAfZjz9zeurWbTiqvyE097nSLyVs4BU5O1UbYcU/dTPSNbRRzHPw4qscU4xzkokKYbl1suXYoJPyE0aWQQiWslgb85OjaItvQsZZY=',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6rsJhG0h3GmGklbK13UlIPHLiDt7h0Fi0Bg9Vpm/RsAbva1Hot+cm/KDLBOncip5ScJadku6Rlqztjamu3j9YQ9eUklrunKn4hTryjQD/02VARa1ftYj3LKslycttSNMN8ki+EDDdpYYE2MX1vp9yAD49nouTTmLutrmrBfGm/rmi7QikwMZUhRWvGvNO3HI64D3FdURm0t75w1y1Wzww2fqQzB20Qu/2U3C8EHzqGEGo0iKnYtDnkfCPeF2aOwgNQ/ivmCKfKJoUAxcKHGYadk6lGdE9ey0xlTguOpGQPrs49UvwudktwWqOOqdcn2wTIYOmNnSGZjwp5pT8SuT4VuNyLOcssngOGvG5QBu/44FA==',
  //       totalPrice: {
  //         value: 1598.59,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1129.29,
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
  //             value: 1598.59,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1129.29,
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
  //     id: '328f23d6-a04c-4934-b307-223e1d9f3bc9',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4aUA/jG5KbPb/uzupoVOkVWz0fndGAVgW8uA8F4dF3kPZZuM1mAJTu0v+vi4GgPy5RJOmXxNN+2n5rMkDLWACt7Hl+4HTbDtLlD5MS3RxW8AxPtTgfSpruPCrHqtChCoaB82iiX8ITK9m9RAWUthcRuuhloGQ/f8IaHlINP1jKxALPisO86IohN4XZZg4WNAE9aeIpSYCgJIMoJPR+NxYNKrt3qrSo5ega8bgA6Y/aERxz5brqy3Yv/35xSEI9nL4sQdmKg4tKlvL7SFelY0DMnramS6gCKufEG3bNlvPdLlqlX9zC7vp3s3RWAbhjJc85nOPjC7Q6+QK3LXgFe1ruwoKQvBttAfZjz9zeurWbTiqvyE097nSLyVs4BU5O1UbYcU/dTPSNbRRzHPw4qscU4xzkokKYbl1suXYoJPyE0aWQQiWslgb85OjaItvQsZZY=',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '22I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oJu1o1F7CN2u0wGmdfZ1+klpTBMkFq28eIEVqObbHj6mFJuQFAei67YxMitMMU8tBrNgZMFyzAsXgUgKfLECyN',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM22_1:SH1',
  //           OfferID:
  //             'NDQ0NzExMCo0MjAwMDE1MTE3MiotMSpTT1cqUypmYWxzZSpBMjA3Skg1OCotMSpPVyp0cnVlKjE1OTguNTkqVFJZKjIwMjQtMTItMTkqSGllRXVCJTJGdlZxbzhhT0xseDNSbktvSHZkTlFCdm1WNDZBYWFReTUwQjFWRUUyUlRQMzVZOHFZRU0weGFGR2Q3ODdVVXNOajZTeCUyRmFKQSUyRjlEdlFHZ3clM0QlM0Q=',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ECO',
  //           Seq: 'FL_SAWADB_8',
  //           SegmentRefs: 'NDQ0NzExMA==',
  //           PassengerList: 'SH1',
  //           StandartSeatSelection: false,
  //           AllSeatSelection: false,
  //           FreeSandwich: false,
  //           Entertainment: false,
  //           FlexibleReturnChangeRight: false,
  //         },
  //       },
  //     ],
  //     flightDetailSegments: [
  //       {
  //         key: '22I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oJu1o1F7CN2u0wGmdfZ1+klpTBMkFq28eIEVqObbHj6mFJuQFAei67YxMitMMU8tBrNgZMFyzAsXgUgKfLECyN',
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
  //             value: 15,
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
  //           Baggage: 'BaggageAllowance1',
  //           BrandName: 'ECO',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4anFKdvcOjP1FWUu8qX5ONkqul7zRTbfNnCQ8cxQ5mYI/ql7rt5o/z9pfvOJcqHTv0r2PzKi6QfsCsC102WhavpZIZU9iNM1kQf5+mD4PyqSnL2Fv1SKjOuUpBvPNqkM2CsqlldQEciTdQ+lX5HOnC6035sCjgXDAdvtiKBEh/YP3d73XEZ+VCpUmorN9bUPH0wp2utoBdZf6YrXkJ43ywak0ZraFRaaNd+hYonlwPCXscYMUPYM8zHA7x5PrMM9oyNc2g2FDoonxAELfVob+ob3UHFPFdDjKpg9xKwPxH6ZuAoIUx4LIhm2gdHH3QTu2aAKbTn1bavqCjlf4nLMtj5drvL7IQD7arNMKFslvWn7eDuFNEavdGHB1ldHHqMLE+uJu1BCO+GDTDnHffouEENu9QZAQ5yL4OV3vzb6zqg/XrwUJVyGX0jzONd3N1t8QM=',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pKgFW+QBd0maHJfcbjm2XcszdqI7df9YZedt82w/HywKa3oswBbTQLIqC0hb1t8hnnbJjRNEOKATysHy3E0SN7vPzQPMZkmNfz+EU08EMZfzjeKOBCIV+sRDZzxD/+6Es6GvqxEfKZcyRCyae3uqTaPZ2IC+BudIeBPnIk5C6BuZ+xdpVVSmwECbK+2hS+RakRynRKKcAbrdhLYZ+Xvk19tastkVvzRajGEOtLmOziIc/CS255u9pnOyiTu2OyAm3i1OpfCf9I0eoAx8Fc7iCMwv1tA676D+4ObI/cpdpTO3dFeIQiA0MXW3CQ4xF7diMOgMoT8o8Jtb4DpXP3vm5T63hczOohc2crkl5NNGKzYg==',
  //       totalPrice: {
  //         value: 1731.69,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1262.39,
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
  //             value: 1731.69,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1262.39,
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
  //     id: 'e548f9b5-a34c-4b6d-81de-dd6a87e61dd1',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4anFKdvcOjP1FWUu8qX5ONkqul7zRTbfNnCQ8cxQ5mYI/ql7rt5o/z9pfvOJcqHTv0r2PzKi6QfsCsC102WhavpZIZU9iNM1kQf5+mD4PyqSnL2Fv1SKjOuUpBvPNqkM2CsqlldQEciTdQ+lX5HOnC6035sCjgXDAdvtiKBEh/YP3d73XEZ+VCpUmorN9bUPH0wp2utoBdZf6YrXkJ43ywak0ZraFRaaNd+hYonlwPCXscYMUPYM8zHA7x5PrMM9oyNc2g2FDoonxAELfVob+ob3UHFPFdDjKpg9xKwPxH6ZuAoIUx4LIhm2gdHH3QTu2aAKbTn1bavqCjlf4nLMtj5drvL7IQD7arNMKFslvWn7eDuFNEavdGHB1ldHHqMLE+uJu1BCO+GDTDnHffouEENu9QZAQ5yL4OV3vzb6zqg/XrwUJVyGX0jzONd3N1t8QM=',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '19I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pgr2aI42o65v77w1vIvnwTb0Q+ydsCgjPVe3Y6i4ZCxYVBCWR+G8vP86K5RbER4yUwBMMI9y7VQm4xwULo4pzm',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM19_1:SH1',
  //           OfferID:
  //             'NDQ0NzA4MSo0MjAwMDE1MTE2NyotMSpOT1cqTipmYWxzZSpBMjA3Skg1OCotMSpPVyp0cnVlKjE3MzEuNjkqVFJZKjIwMjQtMTItMTkqZzNMQkJ3eFFad21UZ1ZTcEQ3ZExKUHdkN1BuN2xENkdRQkUyaEFjUUh3VkVFMlJUUDM1WThxWUVNMHhhRkdkN2xxV2p1JTJGJTJGUE5YUTY5aTZFRnd4UGNBJTNEJTNE',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ECO',
  //           Seq: 'FL_SAWADB_7',
  //           SegmentRefs: 'NDQ0NzA4MQ==',
  //           PassengerList: 'SH1',
  //           StandartSeatSelection: false,
  //           AllSeatSelection: false,
  //           FreeSandwich: false,
  //           Entertainment: false,
  //           FlexibleReturnChangeRight: false,
  //         },
  //       },
  //     ],
  //     flightDetailSegments: [
  //       {
  //         key: '19I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pgr2aI42o65v77w1vIvnwTb0Q+ydsCgjPVe3Y6i4ZCxYVBCWR+G8vP86K5RbER4yUwBMMI9y7VQm4xwULo4pzm',
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
  //             value: 15,
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
  //           Baggage: 'BaggageAllowance1',
  //           BrandName: 'ECO',
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
  //   {
  //     flightFare: {
  //       flightDetailKeys: [
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4ZZ4tHolOOMmK8ZbCJ/wQHvlID2LH048gkwZ1FM0UzzV23wUR1W7503v0fy7y806DkMJFQZ0kEwMLn/I29YzTio361K3iEtOtHDj8WLBlaLLJM8IdKSFIdiZcF4rxAAoJylEgCqmQ/2Rij0U1Q0YdxGKBdCf+K8AVmabBaiBSzylwFXyMlkB0ZXb8qr6gKNIlOcHakB7A9/3ER4alsUzS2FK3AjWTd8xcSfF6l35T2B3H2ZexflC8Xe3ccMeAOo2+CX6MBr8NXKotkDZ1A0ufPCn3iPcXQ2vcEqmUg7AOyju32eyTusyLsRdaNN54AjLXq5HN4Ar7e6zoGHzVWL6aD2aPMkNDQNUEYO/UNXXDSND5uJG3QWTDME+rNcFPHzStPFHD589R5sslRVyUzu/ani8JD/SaVUogInl2ukMGu6laalhCxWXRtQXwWM3mt4HLRyNmqvcRVHesSxbgO+N+U1',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oPkzuOzlMhr8OQL+tIrsOIq5xbEr7VQLNEFAUdIkpTicu7dHziZIY8DEHJCHK7LV5yfub/Ya9k0B0CWtfwwbyzC/taf4Bcz+rCaZ8wNHpf3ntpVS5F0qPRY7as+AarQaiVMt5YGeUvhVVwMaaTpzHlFQD+bduYyZrmXu71LRvnwPggEY+uio3aND8sc1Bw81Kc2FE8dwBrUR3ptLYR+Ixct34W3+Zj4nVvBX/d6vd4xj5BX3A2ey4Eiikdmk0VOfHTAnvxGN68h0myhzPlb5Wh9WnPhxslUo9WDmBCG6U9a70fubnMBRRTWRsl5kpula2weiDd+GM1Ld2GlNGWCwRkm/jLhT2cIPwaD8FWpBrNYw==',
  //       totalPrice: {
  //         value: 1800,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1330.7,
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
  //             value: 1800,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1330.7,
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
  //     id: '85f99601-0db8-4dab-a794-88b479cc1fad',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4ZZ4tHolOOMmK8ZbCJ/wQHvlID2LH048gkwZ1FM0UzzV23wUR1W7503v0fy7y806DkMJFQZ0kEwMLn/I29YzTio361K3iEtOtHDj8WLBlaLLJM8IdKSFIdiZcF4rxAAoJylEgCqmQ/2Rij0U1Q0YdxGKBdCf+K8AVmabBaiBSzylwFXyMlkB0ZXb8qr6gKNIlOcHakB7A9/3ER4alsUzS2FK3AjWTd8xcSfF6l35T2B3H2ZexflC8Xe3ccMeAOo2+CX6MBr8NXKotkDZ1A0ufPCn3iPcXQ2vcEqmUg7AOyju32eyTusyLsRdaNN54AjLXq5HN4Ar7e6zoGHzVWL6aD2aPMkNDQNUEYO/UNXXDSND5uJG3QWTDME+rNcFPHzStPFHD589R5sslRVyUzu/ani8JD/SaVUogInl2ukMGu6laalhCxWXRtQXwWM3mt4HLRyNmqvcRVHesSxbgO+N+U1',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '6I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oti9SOa/x2ydW/ZGDA35rEtjEFSGyIojVfidTIif2GmflYE/oyVJZa8qtHwQ0zvEfaq2bNrLtfLpj+eEz4G1CWJ1aJbq2bR0oNYYdPDtKdxQ==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM6_1:SH1',
  //           OfferID:
  //             'NDQ0Njc1MSo0MTk5OTY4OTM3OSo1MDc0NzgqVE9XKlQqZmFsc2UqQTIwN0pINTgqMTkwMDYqT1cqdHJ1ZSo4MDAuMCpUUlkqMjAyNC0xMi0xOSoweiUyRnU3Y2NDVmtrSVBKN2tYb0hkTE5sbFprMXN1Sk5XZHlOQjhSUklHRmF1bnV1QjIwUXFhbHZGUGcwU29YNFBBc1I3SVBFUGtucVZ2Zk81M2xDNlBRJTNEJTNE',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'EXTRA',
  //           Seq: 'FL_SAWADB_2',
  //           SegmentRefs: 'NDQ0Njc1MQ==',
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
  //         key: '6I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oti9SOa/x2ydW/ZGDA35rEtjEFSGyIojVfidTIif2GmflYE/oyVJZa8qtHwQ0zvEfaq2bNrLtfLpj+eEz4G1CWJ1aJbq2bR0oNYYdPDtKdxQ==',
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
  //         departureTime: '2024-12-19T07:40:00',
  //         arrivalTime: '2024-12-19T08:50:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2184',
  //         cabinClass: 0,
  //         bookingCode: 'TOW',
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
  //             Value: 'T',
  //           },
  //           ResBookDesigCode: 'TOW',
  //           Baggage: 'BaggageAllowance4',
  //           BrandName: 'EXTRA',
  //           Seq: 'FL_SAWADB_2',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4ZRu+EChGJsJqcyICffnNHcVVPiQM2N8QzX+qffNyvrAp0npy8YGfNNpRvBjIKdFWUO5ztq6R28c3627H1mNy1Yi344PHKMEGLiWSauZCKJna9JPbeFEoJ9lkeRFFDvDqTOkIDYBBXqcG++Ln/4h2lPV0s/dttYx+EQidtmcCAq5lxr/qH7m65evGjBiPAVns6xh8FSz+3yu7wXiONORZV70dR8P7wrGn7oYQJvgMSlDQi8MJZQYMiI8WZoeDk7rYs9twQTRONEEAf3MpVmHfnfg7o9OsFTj0hGvN7HuJgaWAU5WMEOzl6RH4rVP380Xd+CaBBov7vLvgqmOkGiNrvnvUeQeaHPGxeig25yooaxzoM//21+BT0oUG5dUm35tj+ZPKUxTFzFMn+oGCWpgcpCRU6LauGetsb9MrnNZOjVVKxv10ekt67OCB8kB3xRh6qwCvBB+mIRqYs8ELxlJEER+Ff5jWNbSK+OGNJvv5b7eQ==',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pxAUwrr4P6KR9K6eEBPj+ypz47UkB3ns7AlQgR4tjnqwjbdr4chJgDEWDzCm3v/o3WcoPfAbNWpuOu8lek+MagcqvT6h1pLSf0yUcwr9X69nQTBzqnFQV5eLDSItNCpYqtn4Fs/xVNMdfB1vWbJ4SAGQqwfOxbIECEE6k1lD9zsPxrsqsBbYxtObHauKAjwKO7ScQm2rnJFyz+8i90iRQANhOKS7Qvdx3OE5itdcVNEKHvmLYqJSyQdJaMwswEoO9Ewrvhog3zslraU+wPnwMxefYkDKLqs+j2VCZ/qAQY+X2zhMTTv4YvS+TRO8Rux4Lr84XtkyewgRi4n952pJfSSwgC35Uv7Yo/ZFrVKqIdLAeuox0o7qMkk9fvv/7SHBk=',
  //       totalPrice: {
  //         value: 1866.3,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1397,
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
  //             value: 1866.3,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1397,
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
  //     id: 'd70d19b8-5824-44f8-be4b-be954d3a42dd',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4ZRu+EChGJsJqcyICffnNHcVVPiQM2N8QzX+qffNyvrAp0npy8YGfNNpRvBjIKdFWUO5ztq6R28c3627H1mNy1Yi344PHKMEGLiWSauZCKJna9JPbeFEoJ9lkeRFFDvDqTOkIDYBBXqcG++Ln/4h2lPV0s/dttYx+EQidtmcCAq5lxr/qH7m65evGjBiPAVns6xh8FSz+3yu7wXiONORZV70dR8P7wrGn7oYQJvgMSlDQi8MJZQYMiI8WZoeDk7rYs9twQTRONEEAf3MpVmHfnfg7o9OsFTj0hGvN7HuJgaWAU5WMEOzl6RH4rVP380Xd+CaBBov7vLvgqmOkGiNrvnvUeQeaHPGxeig25yooaxzoM//21+BT0oUG5dUm35tj+ZPKUxTFzFMn+oGCWpgcpCRU6LauGetsb9MrnNZOjVVKxv10ekt67OCB8kB3xRh6qwCvBB+mIRqYs8ELxlJEER+Ff5jWNbSK+OGNJvv5b7eQ==',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '9I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qUTexF7fTf5yyq4fXsJpKRJZWBQZtQE/+rNVi/aYh8t5vZDLaQ32P2pkAZPbPhtJ/OxXmcvbZ7TECaA9l844/5kqcgZfx5h7vQWnkMcYdHyQ==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM9_1:SH1',
  //           OfferID:
  //             'NDQ0NjgwOCo0MjAwMDE1MTE2MCo1MDc0NzgqVE9XKlQqZmFsc2UqQTIwN0pINTgqMTkwMDYqT1cqdHJ1ZSo4NjYuMypUUlkqMjAyNC0xMi0xOSo1Vmh5RHp0ZSUyRmFnJTJGOWZPejB6byUyQmM1eEIwU2tsaXpPVkJRd1ZJdEhkbWNDdW51dUIyMFFxYWx2RlBnMFNvWDRQJTJCblc0biUyQiUyRlZUR1BOWm5pNmZ5VkdndyUzRCUzRA==',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'EXTRA',
  //           Seq: 'FL_SAWADB_3',
  //           SegmentRefs: 'NDQ0NjgwOA==',
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
  //         key: '9I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qUTexF7fTf5yyq4fXsJpKRJZWBQZtQE/+rNVi/aYh8t5vZDLaQ32P2pkAZPbPhtJ/OxXmcvbZ7TECaA9l844/5kqcgZfx5h7vQWnkMcYdHyQ==',
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
  //         departureTime: '2024-12-19T08:25:00',
  //         arrivalTime: '2024-12-19T09:35:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2186',
  //         cabinClass: 0,
  //         bookingCode: 'TOW',
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
  //             Value: 'T',
  //           },
  //           ResBookDesigCode: 'TOW',
  //           Baggage: 'BaggageAllowance4',
  //           BrandName: 'EXTRA',
  //           Seq: 'FL_SAWADB_3',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YfaXOpevvaQA4QgwEz33YKuByI//NoFuMKq30UUdPZvn7EkEFq88gdNi/x5wdnoBxo/cMkH+IMC25rh5OqRLCIa+b84C286M5Z5QUX2krm6gEu7Nh9xqHAQFsUyGEU56qs6kAD0BGRmCc6qzy+/NAsAdcHIpVvVezrkxelgot6k5rRkJ7yrNtSJdqo6QXhutANqIdjzQu6LsjSFbKPxMLx/f9c1w3kpHETUoUpX/3HQKEoQVHiM+ui6I7IEahPNj6pXhuqGnh1tFvYK2+6dF7/yni7Fp9w9KuiCOeS9nQUDlN4QI0V0xGEc8DZAXTzXcd/5XtYK7PxlKLuh3YLOTkkqZUfdhCTj6coeQyuzCbitLo+qfyqR2OXxEGRn1Zgc55p2kWfDCflWAN/aEg0kZjhkNbXd3viCWFE9VLTkWFC7T7xaBJly03qIokMicAFaxM=',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6rRcPBGNGUB++WNK/Dh7+wgP0fWz6cYXsjG0oSD9e8rWvpCMI7IQ4D3XYrDPPmJUGXjZpFHZWOWmEPyMYW1LCg/8qAFIGmIgk9m6ZnOyO9D3TS5S+OysSZSKlWJfLZmVStQorEhXecxqxmwwQBzXbHypflDuXa3/YpFnPYSj1hzQxW144/7F2fR7+CDQST/baU9MoWYLlE5XJMnUcd0+5Xd6sa5DhQ1l5wySXSIHpKZDnZUcyLSJjVExyGrxjErU75S1NBH/UOES0iQ0kZPFdJwfNHC/tPgA9vAneOisji1rEiG3yP2HfGbfrSIyDsImeiP31yTQDg8URJqqIvfGqIeDynPqjQyuHrLdGxcFQvJqg==',
  //       totalPrice: {
  //         value: 1867.76,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1398.46,
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
  //             value: 1867.76,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1398.46,
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
  //     id: '3af859a7-4b9a-43d1-aab2-58d835eb9866',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YfaXOpevvaQA4QgwEz33YKuByI//NoFuMKq30UUdPZvn7EkEFq88gdNi/x5wdnoBxo/cMkH+IMC25rh5OqRLCIa+b84C286M5Z5QUX2krm6gEu7Nh9xqHAQFsUyGEU56qs6kAD0BGRmCc6qzy+/NAsAdcHIpVvVezrkxelgot6k5rRkJ7yrNtSJdqo6QXhutANqIdjzQu6LsjSFbKPxMLx/f9c1w3kpHETUoUpX/3HQKEoQVHiM+ui6I7IEahPNj6pXhuqGnh1tFvYK2+6dF7/yni7Fp9w9KuiCOeS9nQUDlN4QI0V0xGEc8DZAXTzXcd/5XtYK7PxlKLuh3YLOTkkqZUfdhCTj6coeQyuzCbitLo+qfyqR2OXxEGRn1Zgc55p2kWfDCflWAN/aEg0kZjhkNbXd3viCWFE9VLTkWFC7T7xaBJly03qIokMicAFaxM=',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '16I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qcLCiIR1xq7XEG78kj/pE58enc3EQm/kLGRJ+8ty2xnbwNb7QU1vT7QqITKiHh8HWY3SfoavkD35PuiTpedxn5',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM16_1:SH1',
  //           OfferID:
  //             'NDQ0NzAyMSo0MTk5OTE3MDA2MSotMSpOT1cqTipmYWxzZSpBMjA3Skg1OCotMSpPVyp0cnVlKjE4NjcuNzYqVFJZKjIwMjQtMTItMTkqOUFGNG9uUU1NR3BpdG1QbUFjdWQ1emFMQUwza0RJJTJCZFlZMklQbm1CNWVORUUyUlRQMzVZOHFZRU0weGFGR2Q3bm9ZdEVWbFhGZ0klMkJIbUlEZkdCS29RJTNEJTNE',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ECO',
  //           Seq: 'FL_SAWADB_6',
  //           SegmentRefs: 'NDQ0NzAyMQ==',
  //           PassengerList: 'SH1',
  //           StandartSeatSelection: false,
  //           AllSeatSelection: false,
  //           FreeSandwich: false,
  //           Entertainment: false,
  //           FlexibleReturnChangeRight: false,
  //         },
  //       },
  //     ],
  //     flightDetailSegments: [
  //       {
  //         key: '16I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qcLCiIR1xq7XEG78kj/pE58enc3EQm/kLGRJ+8ty2xnbwNb7QU1vT7QqITKiHh8HWY3SfoavkD35PuiTpedxn5',
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
  //             value: 15,
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
  //           Baggage: 'BaggageAllowance1',
  //           BrandName: 'ECO',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YzrM+l7e0KdZYrRXT6Pzmt35wEHSMKSLNpYKxJh8pG8shzC0d6TMxL6w5xeNhhfuG0yv1XgzMmBxApLb2zON522BVsStzdGVroIaY1e6AryvJGz6xZuRv77bkJfFxIwNM3hHMDnHMtvBClFllmyTyYycv5TAvx2/XR+oxD6rVDFya1TmDHogWW889VTZCDdMQ+DDNqGRW1aMRhptUs/duDhC/GvNCbDVVWd0avkM62Kl0r0RbeNI+gVtQdqAXpvkBCzg8j9faAWSvdzHJ7tjRphwrJzaQfRblwbBI1j9SuxqjaAER02lMQYrNCJeHRVc/57aSeY5q3gndX72hv9vaRXxij+ksfmDDvOLiupyGZklSf2N+NgVUhDTNWiyC94g4qpjXmKTocdQ7NcnIV615i9zVZK5m2FGo1RxnerLCZ50SjMyb7Yx5YA8WqdzhLJJXPeFO7ae/sAjlZi+Rav8Yl',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pABQPKaFO5AKpYPyXiCQ1FDKH+ToNJgAmHYT1oHPvDMPDYLgtqUW9WdB9nKH2Rwq1vp6du1AMr4y4LtkjOgQWLpVui4JRM5NABnCeGw5yz42PVYiZXAet+sPl3oy5NkbXMnRyeHQAB/g7jq1hp4PGILayws4nhbQoGt4n7/D7k2Adnk9c5jkcmn+xWgjWcHGhcimUnmqvQbAJPRsYI4FHJOxNlA6YbZ5oCxJcaU23qhswtWhx2uBNL5Zk9XNYQydbGC8tSuynj6Yx7dGHXbIViuvm6qItZVLrlMtqlqS0t3n8w00NBgICzjcxBi4UisboPytNlfwzfwBB6NaHGUHHqgGXLgAvZGK9nbzDh8i/Jmlv4ruU5jqjM7IUJq0PDoGQ=',
  //       totalPrice: {
  //         value: 1896,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1426.7,
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
  //             value: 1896,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1426.7,
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
  //     id: 'b9657a3f-3a8a-4794-8a7e-964ddd9d3184',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YzrM+l7e0KdZYrRXT6Pzmt35wEHSMKSLNpYKxJh8pG8shzC0d6TMxL6w5xeNhhfuG0yv1XgzMmBxApLb2zON522BVsStzdGVroIaY1e6AryvJGz6xZuRv77bkJfFxIwNM3hHMDnHMtvBClFllmyTyYycv5TAvx2/XR+oxD6rVDFya1TmDHogWW889VTZCDdMQ+DDNqGRW1aMRhptUs/duDhC/GvNCbDVVWd0avkM62Kl0r0RbeNI+gVtQdqAXpvkBCzg8j9faAWSvdzHJ7tjRphwrJzaQfRblwbBI1j9SuxqjaAER02lMQYrNCJeHRVc/57aSeY5q3gndX72hv9vaRXxij+ksfmDDvOLiupyGZklSf2N+NgVUhDTNWiyC94g4qpjXmKTocdQ7NcnIV615i9zVZK5m2FGo1RxnerLCZ50SjMyb7Yx5YA8WqdzhLJJXPeFO7ae/sAjlZi+Rav8Yl',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '3I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qL2NlW6yt2trMIWB7O/ljpNjB0tVEYcRoa5Vmwlc/TUIvk/XxAW8fj1lxqX++0qk2OA6CGLJUzN4NUae2+0UADZVWtFI/QSBPuuP04qoMTcQ==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM3_1:SH1',
  //           OfferID:
  //             'NDQ0NjY4OSo0MTk5NzExMDMzNCo1MDc0NzgqVE9XKlQqZmFsc2UqQTIwN0pINTgqMTkwMDYqT1cqdHJ1ZSo4OTYuMCpUUlkqMjAyNC0xMi0xOSpyRHY1NFFHbld1Wjlwc1locmklMkJ3OXUybzR6MzM0RGVJNWdpU0tYMjdlSXF1bnV1QjIwUXFhbHZGUGcwU29YNFBFMGdOVUNJcE9jYUIlMkZiVWhobkdQbXclM0QlM0Q=',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'EXTRA',
  //           Seq: 'FL_SAWADB_1',
  //           SegmentRefs: 'NDQ0NjY4OQ==',
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
  //         key: '3I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qL2NlW6yt2trMIWB7O/ljpNjB0tVEYcRoa5Vmwlc/TUIvk/XxAW8fj1lxqX++0qk2OA6CGLJUzN4NUae2+0UADZVWtFI/QSBPuuP04qoMTcQ==',
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
  //         departureTime: '2024-12-19T06:00:00',
  //         arrivalTime: '2024-12-19T07:10:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2182',
  //         cabinClass: 0,
  //         bookingCode: 'TOW',
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
  //             Value: 'T',
  //           },
  //           ResBookDesigCode: 'TOW',
  //           Baggage: 'BaggageAllowance4',
  //           BrandName: 'EXTRA',
  //           Seq: 'FL_SAWADB_1',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4Zu+ulmkgx2CXJFxWCnNkwdsfZZDyswDea1UHpDLKgh/DPk0aUzPOC1rbtZvDW27O2Pwa9EeCz9P86MSRX2Ii82Lk6zmQOyvpkU9UsA/a/6U2TxbhK94ZwgeDqYMwVnK5U/KRnCVtlfEJcpPyGdyvVYojthCVCaWd26k6LjDKjRardCzULq4GR1WRBSpR8cokTJcDaom7ViZ1Z+puSvcwHxswbbCq7YSNaZCQBtXx373Z4QpCZLfrQtrwDbNWCilxxfmOQh8rtkL/0QFt1s2bGVM0yI3wKTQpNVBpfc4Su8xw7rGdoNjyVpGssVMwjtTCHkH+UkW5nmpumgScuSRSQqA5O9ADjVJ+G+OShgiQ9nT/6P4SJdRDwSHnP2wdfySBjdOmm4iH7d1+ZZ2kCHQwnnM4qGnuGy8PiTikCPha1WEMReB2A/SBUOkZNFIJukLgGi137TpS2+Y8Bn/ccPBd2e',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oQ0hsh7LroUmcOt2xoU3MhViJoKBN5Y9S+glYqla2Ypea9uoSikWDVri7rFZH7j6JIixOSBbraeSytr+wq1IhTUQD/tEjjVgyG+jUCXq290qNwKSryuWtJJF1TK2sq6BIyr8G62GmuS5URC2Dg6zT3w/K/5rSMurx9odsVoWFrAp3Fn1bpzcIMop8hl+d5U1Ffk3qGzoZ7zYNqev3yu/l+nCDhR5jiJ2qKm6uP9IUEcFcBP3CnH/9jLjja2koks+4AnxO2tvZ0VOvGFszo/wc3WaVXRIWUjiI2H2gPAWH74vYpli2BBVB86+viLBcVuP4mERoMe6SO0g4j0/s0aIriaOtE9W3pG3H9vSWl6p8XL3LbrmpWHDR3YMIseVqQRrE=',
  //       totalPrice: {
  //         value: 2028.57,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1559.27,
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
  //             value: 2028.57,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1559.27,
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
  //     id: '07a21c30-a2f1-415d-b155-2522dd09c28e',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4Zu+ulmkgx2CXJFxWCnNkwdsfZZDyswDea1UHpDLKgh/DPk0aUzPOC1rbtZvDW27O2Pwa9EeCz9P86MSRX2Ii82Lk6zmQOyvpkU9UsA/a/6U2TxbhK94ZwgeDqYMwVnK5U/KRnCVtlfEJcpPyGdyvVYojthCVCaWd26k6LjDKjRardCzULq4GR1WRBSpR8cokTJcDaom7ViZ1Z+puSvcwHxswbbCq7YSNaZCQBtXx373Z4QpCZLfrQtrwDbNWCilxxfmOQh8rtkL/0QFt1s2bGVM0yI3wKTQpNVBpfc4Su8xw7rGdoNjyVpGssVMwjtTCHkH+UkW5nmpumgScuSRSQqA5O9ADjVJ+G+OShgiQ9nT/6P4SJdRDwSHnP2wdfySBjdOmm4iH7d1+ZZ2kCHQwnnM4qGnuGy8PiTikCPha1WEMReB2A/SBUOkZNFIJukLgGi137TpS2+Y8Bn/ccPBd2e',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '11I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6rJR3tvX8c72RUuduSNzWKYx+c4Tg7yBiPwBP4rgqvRw+zQcO9jxWHPns14dQmuz5RGdt8IkHeZfPa4P01QvTrszrrzAkvot1szrePDh6EK/Q==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM11_1:SH1',
  //           OfferID:
  //             'NDQ0NjkwOSo0MjAwMDE1MTE2Myo1MDc0NDQqWE9XKlgqZmFsc2UqQTIwN0pINTgqMjQ4MTgqT1cqdHJ1ZSoxMzI4LjU3KlRSWSoyMDI0LTEyLTE5KkNJRmVSazljSE96UUV5c2kzQTJDcyUyRnZQemk2c05qRnZGbUh6TGF5ajNYeXVudXVCMjBRcWFsdkZQZzBTb1g0UG9CbmtaaFJWVlJJUzlCeEZwJTJGNlFzUSUzRCUzRA==',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_4',
  //           SegmentRefs: 'NDQ0NjkwOQ==',
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
  //         key: '11I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6rJR3tvX8c72RUuduSNzWKYx+c4Tg7yBiPwBP4rgqvRw+zQcO9jxWHPns14dQmuz5RGdt8IkHeZfPa4P01QvTrszrrzAkvot1szrePDh6EK/Q==',
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
  //         departureTime: '2024-12-19T15:30:00',
  //         arrivalTime: '2024-12-19T16:40:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2190',
  //         cabinClass: 0,
  //         bookingCode: 'XOW',
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
  //             Value: 'X',
  //           },
  //           ResBookDesigCode: 'XOW',
  //           Baggage: 'BaggageAllowance4',
  //           BrandName: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_4',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YAb+yIbkjZ8p0Gi1cQS5+NinSjKkT6Ezf5t2ztjZeF4nyU5hfi1ymHtYxUE7apwKdYlDtt/OKz8qcNZB3juV2msMhlg3WD6wLqy8w7nCDdx4LZ3d9AyFcgctcTzgHXFD7Z3ax7cLY/Aa+jt0fLYT+XUpTRFQE9C582cOPlpA95DkCSsqf+6Bv5wVqnvo9oWnX070dCmInEzHkdxugEsutBlNKpRNhJ7Jgr1/wGchsfDVn6rLpqv86Ip0L+r6X7SyNnt/SHOfPjHTUgtEK2A/yu27yzqRJDRchZJf883hCNg5GDt2R/Je1cg2O6cKg/1CbhPOrHYRAErtdyN1gRfyIy8SakupXeCUVbRriB4C/SommlqZBq/MoMppxIzKujTSOYXRNpUN5B8iEB95OHyrn2QHNfldxfRo1KAMwOGQcH0blwghv1H4Um1gq0QT9mMZrjjfUFhZVwZsyTTmUzVPfD',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6o2xeelBl2agZVzk5u9vkPw0GhdKMPoqqz9iO+uJpBB7rR48HqK9MARuygN1L6Myw4JzOpFZYkOPfgZIxgtFBYkgZ7HzWaZZVh0Lhwsa8+i6+JZdIvOAkJgKh0O4UpKX9S3oHdzPo7x5GrdfHeMFFzPR/JdHF75SnJ0UKHWUEY0IsU3IQVE0hCjNnkjKHDkVOUXT5krICvTpEhqm3Xd4DLqYsFSW43tf4GE6J5UIE8sOSr7kDfgkEFRJmhnd7x3dyvW1sgZEyBNeotYw/IuTaYAnz2y8qHft8Ro/R/eaFJADDKrypDegZHpk2D5lWN2adC7mOhbpeoBQ7ndMcfn2rk0jbHOAYOUVZKsgLl+e5mk2tke0paMXkWM9wBGO7HJ0JA=',
  //       totalPrice: {
  //         value: 2075.72,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1606.42,
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
  //             value: 2075.72,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1606.42,
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
  //     id: 'f689aae8-536d-4984-bf63-8f1f3da5c7a2',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YAb+yIbkjZ8p0Gi1cQS5+NinSjKkT6Ezf5t2ztjZeF4nyU5hfi1ymHtYxUE7apwKdYlDtt/OKz8qcNZB3juV2msMhlg3WD6wLqy8w7nCDdx4LZ3d9AyFcgctcTzgHXFD7Z3ax7cLY/Aa+jt0fLYT+XUpTRFQE9C582cOPlpA95DkCSsqf+6Bv5wVqnvo9oWnX070dCmInEzHkdxugEsutBlNKpRNhJ7Jgr1/wGchsfDVn6rLpqv86Ip0L+r6X7SyNnt/SHOfPjHTUgtEK2A/yu27yzqRJDRchZJf883hCNg5GDt2R/Je1cg2O6cKg/1CbhPOrHYRAErtdyN1gRfyIy8SakupXeCUVbRriB4C/SommlqZBq/MoMppxIzKujTSOYXRNpUN5B8iEB95OHyrn2QHNfldxfRo1KAMwOGQcH0blwghv1H4Um1gq0QT9mMZrjjfUFhZVwZsyTTmUzVPfD',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '14I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oL1Rs/QcbyyHJPyjHh/19UuJu6nnPpemh/2MXX426u0uS33b0+YkjfKiMlky4Tx819EdtUT5EBMCkM+fCaA0dzH3oTBHzbT6zG/khJs3ve2Q==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM14_1:SH1',
  //           OfferID:
  //             'NDQ0Njk1OSo0MTk5OTUzNjkwOCo1MDc0NDQqWE9XKlgqZmFsc2UqQTIwN0pINTgqMjQ4MTgqT1cqdHJ1ZSoxMzc1LjcyKlRSWSoyMDI0LTEyLTE5KnZTRVZxN0w1T2JyWDVWTWhqTFU3RDRXOURXc2FtbTFXdDl5MTFwRCUyRmd0eXVudXVCMjBRcWFsdkZQZzBTb1g0UDc0N3AzeXBhMEVxS2VJYmpjZFVKM0ElM0QlM0Q=',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_5',
  //           SegmentRefs: 'NDQ0Njk1OQ==',
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
  //         key: '14I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oL1Rs/QcbyyHJPyjHh/19UuJu6nnPpemh/2MXX426u0uS33b0+YkjfKiMlky4Tx819EdtUT5EBMCkM+fCaA0dzH3oTBHzbT6zG/khJs3ve2Q==',
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
  //         departureTime: '2024-12-19T17:35:00',
  //         arrivalTime: '2024-12-19T18:45:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2194',
  //         cabinClass: 0,
  //         bookingCode: 'XOW',
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
  //             Value: 'X',
  //           },
  //           ResBookDesigCode: 'XOW',
  //           Baggage: 'BaggageAllowance4',
  //           BrandName: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_5',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4aUA/jG5KbPb/uzupoVOkVWz0fndGAVgW8uA8F4dF3kPZZuM1mAJTu0v+vi4GgPy5Tdf+gEkN+JF85WnYpt+A8L+loOat61ZxUcrJSLLWDokU887u+2t67Apxstl+8bcTaEoNg6JNixh7p157YQ2/oFw/peHrBP5f4EpClaCVr7KJ5ECWgGM1FPZrf1CTbnASlwPReIVG2oykcHn8Tw89nfN51ZGZSYzyHM307JSRZTVnkZzl+FHQhTzb3wnnLERCcBV8QI7AMgKubfw0DpT7IerxNsIXO323ufrZkxs8wASUWODwVczbs5BZV3BWUkABl4RxqKwA/H4g9nmVkO4FbrV+5OyccdJbukuGeHf++A/8q8+lC9HmgV0EFTekp6safhrOrMy60BY3Q6OfFsHv6af/iwT/LUCvieBMOIZ7NtQvvYWpgWwyXO0BbxDChe2W/bES8mN/i1IUn/rD6MoPrb',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6rsJhG0h3GmGklbK13UlIPHpEQlfjoNpf3ODtTtuAwE4RfYh7aXgIIyVnvRxXOV7MwXGtw2nY0NVU6A2X1o55EnbTZtrCzqkNfpdbvV33ifsJbhnc699syWTmMmP4ffHKRq6238zO+YPINYxPAPsfNqBXQg5vhvk5RbOBs+2Nkv3t7p8bF7V/mCXXBzs6QhDXX+MdPDrdg9RevxH/g0pksHS20quUHBTfmHt6ivIwBnN3ysmuhDMUXtaMtgzY929ruA6znmZLDvfTlsu9ko9VOwPtshunhm7qGAY4DIsT0IjTSykh9gu6Gu58kQAIr9tV18WkLCfCA/ToBZVcaSwJnQg79lxemoivm0z4LPnAYr4heQBNXQnacDPcXf6BiAPhI=',
  //       totalPrice: {
  //         value: 2298.59,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1829.29,
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
  //             value: 2298.59,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1829.29,
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
  //     id: '1338d516-a5fc-4e36-b430-3ab41ed87019',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4aUA/jG5KbPb/uzupoVOkVWz0fndGAVgW8uA8F4dF3kPZZuM1mAJTu0v+vi4GgPy5Tdf+gEkN+JF85WnYpt+A8L+loOat61ZxUcrJSLLWDokU887u+2t67Apxstl+8bcTaEoNg6JNixh7p157YQ2/oFw/peHrBP5f4EpClaCVr7KJ5ECWgGM1FPZrf1CTbnASlwPReIVG2oykcHn8Tw89nfN51ZGZSYzyHM307JSRZTVnkZzl+FHQhTzb3wnnLERCcBV8QI7AMgKubfw0DpT7IerxNsIXO323ufrZkxs8wASUWODwVczbs5BZV3BWUkABl4RxqKwA/H4g9nmVkO4FbrV+5OyccdJbukuGeHf++A/8q8+lC9HmgV0EFTekp6safhrOrMy60BY3Q6OfFsHv6af/iwT/LUCvieBMOIZ7NtQvvYWpgWwyXO0BbxDChe2W/bES8mN/i1IUn/rD6MoPrb',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '23I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oJu1o1F7CN2u0wGmdfZ1+klpTBMkFq28eIEVqObbHj6mFJuQFAei67YxMitMMU8tAntHqMEkPo+xgSghtLdEgl0JSFvRaPGQVtoE5W2s6gpQ==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM23_1:SH1',
  //           OfferID:
  //             'NDQ0NzExMCo0MjAwMDE1MTE3Mio1MDc0NDQqU09XKlMqZmFsc2UqQTIwN0pINTgqMjQ4MTgqT1cqdHJ1ZSoxNTk4LjU5KlRSWSoyMDI0LTEyLTE5KkhpZUV1QiUyRnZWcW84YU9MbHgzUm5Lc2tLVTRraW9wd25NRmpEZ2xjTEwxdXVudXVCMjBRcWFsdkZQZzBTb1g0UFJ6UlllMzBxQmtmNE0xc0MwcEZGNFElM0QlM0Q=',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_8',
  //           SegmentRefs: 'NDQ0NzExMA==',
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
  //         key: '23I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oJu1o1F7CN2u0wGmdfZ1+klpTBMkFq28eIEVqObbHj6mFJuQFAei67YxMitMMU8tAntHqMEkPo+xgSghtLdEgl0JSFvRaPGQVtoE5W2s6gpQ==',
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
  //           BrandName: 'ADVANTAGE',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4Zu+ulmkgx2CXJFxWCnNkwdsfZZDyswDea1UHpDLKgh/DPk0aUzPOC1rbtZvDW27O2Pwa9EeCz9P86MSRX2Ii82Lk6zmQOyvpkU9UsA/a/6UzhStqPQMBrtloKWCKVnVB6AEC0MYnmmZFczhtGhQgJBNtxVVpnPlnJaggeabXKwIcok9RjJ3tZ7cobBmNAwIZ+M9W0HwCuYZnqI2LXM4mpHhLp2RO21wpPDGULWQHZSvsj89TNDhaYZNc1h+vlRUb5lLo+uGHeLModbYW83TUFw8KwOOu1pHZiwl09mzYXd6UYgK5AgBjaLjraKjAyaCNNu5sLg1rMF+EgmboxM/Xnag32IlWkapsS39V5SNHfvxArdkvr5M7qRhsYrG664OKubw/L6SaxXqII0Wx8rDljIZvrLRdTKf4m2IXR7Axmn8UvsiubTBNdymIn3CEfdP4ASd+CpIW6YWr1i3t0Z/hw3',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oQ0hsh7LroUmcOt2xoU3MhqpRDUdxQe9CmjxelCWR4uuOYYfjoT5ZNl0+p51Ymao0MXcRwk+ZWVgx1QyH5Msb8G2+Fbnj0cfz87PTIS9D6fF3oNMNFHme+5JakfJIJOpHTorxV+gOAC/r8Hw+m7HMAzCXYFouyJS+HH2qyP8cb4F1WWa4vPT/EtU+clzzgDxJRPXBd9+4yjHzDh9SSS2jnIJCBg/XtjYlUm6/vg4dGQmKUci2jw8AkQ8nKQ1NamvAR2hFSAdKYla5LTVnSNvkpccBsADUdRyZ/uSwh9hiTGhP9mjl3CRkLb1jOHIrG6+gECwmg3lLPNHG1tKt+Vu0+YT1MMMizDt5hPC6rndgsBKcSt9kdFjLsWfGe1Fh+6ZA=',
  //       totalPrice: {
  //         value: 2328.57,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1859.27,
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
  //             value: 2328.57,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1859.27,
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
  //     id: '9823848a-7a26-4a1a-bede-54df45b4170b',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4Zu+ulmkgx2CXJFxWCnNkwdsfZZDyswDea1UHpDLKgh/DPk0aUzPOC1rbtZvDW27O2Pwa9EeCz9P86MSRX2Ii82Lk6zmQOyvpkU9UsA/a/6UzhStqPQMBrtloKWCKVnVB6AEC0MYnmmZFczhtGhQgJBNtxVVpnPlnJaggeabXKwIcok9RjJ3tZ7cobBmNAwIZ+M9W0HwCuYZnqI2LXM4mpHhLp2RO21wpPDGULWQHZSvsj89TNDhaYZNc1h+vlRUb5lLo+uGHeLModbYW83TUFw8KwOOu1pHZiwl09mzYXd6UYgK5AgBjaLjraKjAyaCNNu5sLg1rMF+EgmboxM/Xnag32IlWkapsS39V5SNHfvxArdkvr5M7qRhsYrG664OKubw/L6SaxXqII0Wx8rDljIZvrLRdTKf4m2IXR7Axmn8UvsiubTBNdymIn3CEfdP4ASd+CpIW6YWr1i3t0Z/hw3',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '12I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6rJR3tvX8c72RUuduSNzWKYx+c4Tg7yBiPwBP4rgqvRw+zQcO9jxWHPns14dQmuz5Qn/QGQKmTlRZt7DuqPFXvMKJdL9ng+XMF+aftUM2E4pw==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM12_1:SH1',
  //           OfferID:
  //             'NDQ0NjkwOSo0MjAwMDE1MTE2Myo1MDc0NzgqWE9XKlgqZmFsc2UqQTIwN0pINTgqMTkwMDYqT1cqdHJ1ZSoxMzI4LjU3KlRSWSoyMDI0LTEyLTE5KkNJRmVSazljSE96UUV5c2kzQTJDcyUyRkNrUnlqYmRWN2syJTJCS2hkVDhiTE5PdW51dUIyMFFxYWx2RlBnMFNvWDRQM3phcnJJeSUyQng3bkRQU1hYTiUyRllFVEElM0QlM0Q=',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'EXTRA',
  //           Seq: 'FL_SAWADB_4',
  //           SegmentRefs: 'NDQ0NjkwOQ==',
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
  //         key: '12I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6rJR3tvX8c72RUuduSNzWKYx+c4Tg7yBiPwBP4rgqvRw+zQcO9jxWHPns14dQmuz5Qn/QGQKmTlRZt7DuqPFXvMKJdL9ng+XMF+aftUM2E4pw==',
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
  //         departureTime: '2024-12-19T15:30:00',
  //         arrivalTime: '2024-12-19T16:40:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2190',
  //         cabinClass: 0,
  //         bookingCode: 'XOW',
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
  //             Value: 'X',
  //           },
  //           ResBookDesigCode: 'XOW',
  //           Baggage: 'BaggageAllowance4',
  //           BrandName: 'EXTRA',
  //           Seq: 'FL_SAWADB_4',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YAb+yIbkjZ8p0Gi1cQS5+NinSjKkT6Ezf5t2ztjZeF4nyU5hfi1ymHtYxUE7apwKdYlDtt/OKz8qcNZB3juV2msMhlg3WD6wLqy8w7nCDdx61Zkdp0iKugOMtentifMZTrTONyPaveUkkP7UJBEdLVcENwPLe4VFb+0YjQk6dHGjzIIhT7+VfZIf79NKub9xTN2CGE86ntGMny8ZR85ucUuHiCJ6pl56r/qhsVChr3Z/jMNjKLm7C2C/p479R5W/4+ax9FzgRkzwzLMgVhdnVKnk7PpbrgKuwhJ5OZUum2sAZS3oFMuA3C9hbYfpEbus7iNRaiZh+Wy60rd5WBd/gY4xeWmqi84e8QgR47Zxc9u6klBuxuHd5NaVOBTrkm7mDm+519EPrmPuVBZhhNxwVcYlVMVzDxUQu1WQ0z8EM2WoCdd62RrBzEBtuLegDlIFVHrHg8+xZ3HTKFmvLhJLBO',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6o2xeelBl2agZVzk5u9vkPw8F3SEVxzIkwTL4a6ggXlIxFMdrB7vQaWjnoNAr8RlHdogr8VQHAsrs0E/c7TvaJm03SlK1RfuOUGCW66wjSZMCmieMsQRMHWcjRP1YMeU7BqteNNsPFtfqeDQXJ82/ozfTGxJcV5+G6cKOkgjGQKyUURhRrD4GE4jBHlPTqgLDuXvGw6VBBnt/PAworLhxqTipsxhuCqt/5u5r/Gq0YkZYBxkYcvdaGx9otuzyFo+daCkwd6dbMIVE/mXmbjtrfQLfoIHG+nZRDIYmOiuFXEGkVQVBa7tJvCraf4upwFbDe4doSL6v8xXI8vxOpfaxW1MCds6i5wMNXsZXrSzdT+LUeYx/2EQOZGQhHPPpg1RJ0=',
  //       totalPrice: {
  //         value: 2375.72,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1906.42,
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
  //             value: 2375.72,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1906.42,
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
  //     id: 'd84820e0-038b-4d4a-bec5-328958e02e63',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YAb+yIbkjZ8p0Gi1cQS5+NinSjKkT6Ezf5t2ztjZeF4nyU5hfi1ymHtYxUE7apwKdYlDtt/OKz8qcNZB3juV2msMhlg3WD6wLqy8w7nCDdx61Zkdp0iKugOMtentifMZTrTONyPaveUkkP7UJBEdLVcENwPLe4VFb+0YjQk6dHGjzIIhT7+VfZIf79NKub9xTN2CGE86ntGMny8ZR85ucUuHiCJ6pl56r/qhsVChr3Z/jMNjKLm7C2C/p479R5W/4+ax9FzgRkzwzLMgVhdnVKnk7PpbrgKuwhJ5OZUum2sAZS3oFMuA3C9hbYfpEbus7iNRaiZh+Wy60rd5WBd/gY4xeWmqi84e8QgR47Zxc9u6klBuxuHd5NaVOBTrkm7mDm+519EPrmPuVBZhhNxwVcYlVMVzDxUQu1WQ0z8EM2WoCdd62RrBzEBtuLegDlIFVHrHg8+xZ3HTKFmvLhJLBO',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '15I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oL1Rs/QcbyyHJPyjHh/19UuJu6nnPpemh/2MXX426u0uS33b0+YkjfKiMlky4Tx80H/QWmgJEN9UQRcY+QWuUSSgFUY1WlfPqiPEH9iF6j7Q==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM15_1:SH1',
  //           OfferID:
  //             'NDQ0Njk1OSo0MTk5OTUzNjkwOCo1MDc0NzgqWE9XKlgqZmFsc2UqQTIwN0pINTgqMTkwMDYqT1cqdHJ1ZSoxMzc1LjcyKlRSWSoyMDI0LTEyLTE5KnZTRVZxN0w1T2JyWDVWTWhqTFU3RDdlYVFEeHNqcUVkdWQxd2NiQmR6Tkd1bnV1QjIwUXFhbHZGUGcwU29YNFBrZXdaQXB2U016TnhWT2o5MkRqVyUyQmclM0QlM0Q=',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'EXTRA',
  //           Seq: 'FL_SAWADB_5',
  //           SegmentRefs: 'NDQ0Njk1OQ==',
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
  //         key: '15I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6oL1Rs/QcbyyHJPyjHh/19UuJu6nnPpemh/2MXX426u0uS33b0+YkjfKiMlky4Tx80H/QWmgJEN9UQRcY+QWuUSSgFUY1WlfPqiPEH9iF6j7Q==',
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
  //         departureTime: '2024-12-19T17:35:00',
  //         arrivalTime: '2024-12-19T18:45:00',
  //         flightTime: '01:10:00',
  //         operatingAirline: null,
  //         marketingAirline: {
  //           code: 'PC',
  //           value: null,
  //           countryCode: null,
  //         },
  //         flightNumber: '2194',
  //         cabinClass: 0,
  //         bookingCode: 'XOW',
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
  //             Value: 'X',
  //           },
  //           ResBookDesigCode: 'XOW',
  //           Baggage: 'BaggageAllowance4',
  //           BrandName: 'EXTRA',
  //           Seq: 'FL_SAWADB_5',
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
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4anFKdvcOjP1FWUu8qX5ONkqul7zRTbfNnCQ8cxQ5mYI/ql7rt5o/z9pfvOJcqHTv3oZGf+rgeRVmQjtp5RFEEKcGk9p8rU0DQUePrhlNXRFz8KsS0mXkzQv6IjOgZgyozK3FkOciFHDqbyiD3a/8suMvEv3YXJXUnsJ13s8FlzyUX5ge22FEnWK9R3VQz2w7yHec6Cf7law4WPil2PWZTfCyBCC8KpIFUXmYqdnCWkd4lI3Crs64Uigxuss5hJn9CxKtp6WpPwfLEXRhj8rrozI3Ycpv0t+5BWq4HQ1PfzopMTc4eyuyKcrMH/juxm/HIzpVFgD6VViRxW9EGKCd5ZL/+/K5iaoGqGEDSh5g6VJ7dPMJFqP8KcxPo0Y2JdBwPXViC3v5fdV7ueFsr+Q9vGSZU0zFVlGgqq5jjC/5l0qCyXa8s51pGcMBXRvQJFMw7686sN1xzI8pX9WGvo/GRJ',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pKgFW+QBd0maHJfcbjm2XcVMzROg1f12e45z8DzLdrHzjP1WkaAkyfMEsr23OwL1yaXcEKQTLMDavODDgR4m9RteiH9iv6BU4o2Wvd+z+CDiqDa4EkZOPpqIZhS72ft/T3sav0g9yrn/O4czEhRl5fraEcL1rsQMksImHx9gzPSOYaCOqquBiNr74lt5gAj2DNLVv5Y+YFD8q1fKTllz+k0oZO3DHpiWMxSXhN8fILl8bEhE9l8KtdAlXX5XsXKSx4De8P6c7zEdH50iP/mBhC+K1QROIHfbMgETiBR/TVA0GSnTSwXymw0EGfkv7QdNf7/R/PGqSWJFqFG+C+fCmLCp/gc6mhr9clNlKbWkV70NaS6ydEGUMfyfeMmcxCu7o=',
  //       totalPrice: {
  //         value: 2431.69,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 1962.39,
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
  //             value: 2431.69,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 1962.39,
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
  //     id: 'd2c495d3-9c1b-4eea-9507-c73cd9418945',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4anFKdvcOjP1FWUu8qX5ONkqul7zRTbfNnCQ8cxQ5mYI/ql7rt5o/z9pfvOJcqHTv3oZGf+rgeRVmQjtp5RFEEKcGk9p8rU0DQUePrhlNXRFz8KsS0mXkzQv6IjOgZgyozK3FkOciFHDqbyiD3a/8suMvEv3YXJXUnsJ13s8FlzyUX5ge22FEnWK9R3VQz2w7yHec6Cf7law4WPil2PWZTfCyBCC8KpIFUXmYqdnCWkd4lI3Crs64Uigxuss5hJn9CxKtp6WpPwfLEXRhj8rrozI3Ycpv0t+5BWq4HQ1PfzopMTc4eyuyKcrMH/juxm/HIzpVFgD6VViRxW9EGKCd5ZL/+/K5iaoGqGEDSh5g6VJ7dPMJFqP8KcxPo0Y2JdBwPXViC3v5fdV7ueFsr+Q9vGSZU0zFVlGgqq5jjC/5l0qCyXa8s51pGcMBXRvQJFMw7686sN1xzI8pX9WGvo/GRJ',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '20I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pgr2aI42o65v77w1vIvnwTb0Q+ydsCgjPVe3Y6i4ZCxYVBCWR+G8vP86K5RbER4yWgDvm8x8VvgS5kGU5x8iKkrr8WzCCPQJEIV8CuxWtd6A==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM20_1:SH1',
  //           OfferID:
  //             'NDQ0NzA4MSo0MjAwMDE1MTE2Nyo1MDc0NDQqTk9XKk4qZmFsc2UqQTIwN0pINTgqMjQ4MTgqT1cqdHJ1ZSoxNzMxLjY5KlRSWSoyMDI0LTEyLTE5KmczTEJCd3hRWndtVGdWU3BEN2RMSkRyTkc4TEt2OEhLQ1M0UTQ1TFEwZSUyQnVudXVCMjBRcWFsdkZQZzBTb1g0UHlqRnBiUFRreWNUJTJCUmo5NUY4N0JDZyUzRCUzRA==',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'ADVANTAGE',
  //           Seq: 'FL_SAWADB_7',
  //           SegmentRefs: 'NDQ0NzA4MQ==',
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
  //         key: '20I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6pgr2aI42o65v77w1vIvnwTb0Q+ydsCgjPVe3Y6i4ZCxYVBCWR+G8vP86K5RbER4yWgDvm8x8VvgS5kGU5x8iKkrr8WzCCPQJEIV8CuxWtd6A==',
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
  //           BrandName: 'ADVANTAGE',
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
  //   {
  //     flightFare: {
  //       flightDetailKeys: [
  //         'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YfaXOpevvaQA4QgwEz33YKuByI//NoFuMKq30UUdPZvn7EkEFq88gdNi/x5wdnoBy8g9m5Vbrk62ePGlKiZjZ5MyoKbYGmyn0jLqYs+Fqp8yCCaFri3L9JMTEggVWLSPgFjkpabsGnK9gAtTbRUMcrM9zkVI5Kg+0hHzPuMHJqzeWLgqjQGydAZYgTuGBQGRGlOk2e/+PSpV2J9g6j7mG+srJQrGw6Ys4sTBdSr63U5TQ+Y1gRVhCvlRURjw0w6XVUgkVZ0IDdz5H7lmVPuBgpd1rIF7bOSLOw4p07x4SNM9U1sUCvcTlw2i1Fxt5yeHFxhngeCWPutevpwGYSHpyzS2zQY/fIYqnhrzSAJPjiRZXjWa8PE5koSsRJtElxCBPaAPK4MGxEgDImd0xh3B6NUDqjSEv1wtDAN1QjugRcqxJ0xwZqPLjfhNNkDdQYHLaeKMkE6Lstkqwm7K9oa6tX',
  //       ],
  //       groupId: 0,
  //       key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6rRcPBGNGUB++WNK/Dh7+wgpjkWLxIp20r9cgTGBSkkNhhPwQQmsDVPKWzN02UG0Zqtg/pQhun/HsKxmnfGFw6SNFOov4vykkL0VHKJ+ghnMQL5lFHQvCLwhwRZf9RSnKjiCs6LvaScFKTDabiuxq8KdnrvqyQB/Dl1X82KoSb9nWh9lYx1AlMh+8+vvyKA14s1L0eWNmJh7bfeIo+7MuYsnhLmqc62F/t6Ttp4uyCuPTtdAYhK7Ihgyj6yB8C+FyB749+fCURMRuG8g5JNTGd9va5f95AqWDRXxCGYcraj7EXn+3w+buV4XiQGtUyL4CSmiHFM0F9JkbKdazr7Qv9jLyQxF1Eq3S6JIMrH9VwI4V7ZsEXEeY6N4LrieBJ7MwU=',
  //       totalPrice: {
  //         value: 2867.76,
  //         currency: 'TRY',
  //         rateValue: null,
  //       },
  //       basePrice: {
  //         value: 2398.46,
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
  //             value: 2867.76,
  //             currency: 'TRY',
  //             rateValue: null,
  //           },
  //           unitBasePrice: {
  //             value: 2398.46,
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
  //     id: '953e92b7-4c9f-4a89-91ce-31f6d67b721a',
  //     flightDetails: [
  //       {
  //         key: 'I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y+fqIf/nAPQTqgxfnKf6l4YfaXOpevvaQA4QgwEz33YKuByI//NoFuMKq30UUdPZvn7EkEFq88gdNi/x5wdnoBy8g9m5Vbrk62ePGlKiZjZ5MyoKbYGmyn0jLqYs+Fqp8yCCaFri3L9JMTEggVWLSPgFjkpabsGnK9gAtTbRUMcrM9zkVI5Kg+0hHzPuMHJqzeWLgqjQGydAZYgTuGBQGRGlOk2e/+PSpV2J9g6j7mG+srJQrGw6Ys4sTBdSr63U5TQ+Y1gRVhCvlRURjw0w6XVUgkVZ0IDdz5H7lmVPuBgpd1rIF7bOSLOw4p07x4SNM9U1sUCvcTlw2i1Fxt5yeHFxhngeCWPutevpwGYSHpyzS2zQY/fIYqnhrzSAJPjiRZXjWa8PE5koSsRJtElxCBPaAPK4MGxEgDImd0xh3B6NUDqjSEv1wtDAN1QjugRcqxJ0xwZqPLjfhNNkDdQYHLaeKMkE6Lstkqwm7K9oa6tX',
  //         groupId: 0,
  //         flightSegmentKeys: [
  //           '18I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qcLCiIR1xq7XEG78kj/pE58enc3EQm/kLGRJ+8ty2xnbwNb7QU1vT7QqITKiHh8HV2JqAnYNwzXeewle6fAupBANi9gl8cNOzQ8SWdTqgESg==',
  //         ],
  //         travelTime: '01:10:00',
  //         direction: 1,
  //         isDomestic: true,
  //         isOWCCombinable: false,
  //         isPromotional: true,
  //         reservable: true,
  //         freeVolatileData: {
  //           data: 'OFFERITEM18_1:SH1',
  //           OfferID:
  //             'NDQ0NzAyMSo0MTk5OTE3MDA2MSo1MDc0NzgqTk9XKk4qZmFsc2UqQTIwN0pINTgqMTkwMDYqT1cqdHJ1ZSoxODY3Ljc2KlRSWSoyMDI0LTEyLTE5KjlBRjRvblFNTUdwaXRtUG1BY3VkNTdxQ1J2dyUyQnpaMnpFdGxZNHVUOGdWbXVudXVCMjBRcWFsdkZQZzBTb1g0UHd4RnJsNEtMNGdCenZIdk1Za3hGSVElM0QlM0Q=',
  //           Owner: 'PC',
  //           ResponseID: 'ac2e353fdf3c412299ed66c17c652260',
  //           brandname: 'EXTRA',
  //           Seq: 'FL_SAWADB_6',
  //           SegmentRefs: 'NDQ0NzAyMQ==',
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
  //         key: '18I92MZxlU/epYRbpDSKEjd377yfxtNXk2D5iTeS88EkbXft3hAyvlBPG5VXVrqVNddt07euLPK3R6NzDIb017Y79D7aeSEEbNT7mX7HQxf6qcLCiIR1xq7XEG78kj/pE58enc3EQm/kLGRJ+8ty2xnbwNb7QU1vT7QqITKiHh8HV2JqAnYNwzXeewle6fAupBANi9gl8cNOzQ8SWdTqgESg==',
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
  //           BrandName: 'EXTRA',
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
  // ]
  //#endregion
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
