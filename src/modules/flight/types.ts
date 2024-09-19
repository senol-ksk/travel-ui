import type { LocationResult } from '@/components/search-engine/locations/locations'
import type { DatesRangeValue } from '@mantine/dates'

export type FlightLocationLeg = {
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

export type GetSecurityTokenResponse = {
  succeeded: boolean
  result: string
  errors: []
  messageEvents: []
}

export type GetNewSearchSessionTokenResponse = {
  code: number
  message: null
  data: string
  token: null
  clientIP: null
  appName: null
  sessionToken: string
  userAuthenticationToken: null
  eventMessageList: []
}

export type FlightDetailSegment = {
  [key: string]: {
    key: string
    groupId: 0
    origin: {
      code: 'SAW'
      isDomestic: false
      iata: null
      type: 7
      id: 0
    }
    destination: {
      code: 'ADB'
      isDomestic: false
      iata: null
      type: 7
      id: 0
    }
    departureTime: '2024-10-18T08:30:00'
    arrivalTime: '2024-10-18T09:45:00'
    flightTime: '01:15:00'
    operatingAirline: {
      code: string
      value: null
      countryCode: null
    } | null
    marketingAirline: {
      code: string
      value: null
      countryCode: null
    }
    flightNumber: '3074'
    cabinClass: 0
    bookingCode: 'T'
    equipment: null
    isMeal: false
    quota: 1
    baggageAllowance: {
      maxWeight: {
        value: 15
        unit: 0
      }
      piece: {
        pieceCount: 0
      }
    }
    freeVolatileData: {
      OfferID: 'MDhlMzdmOWQ4ZmQ5NThkM2I3Mzc5YjFhMjVhMzdjM2RlY2IyYzIxZWE4NDM4NzRmZDg4MWFjMjY4MjQ3ZTg0NjUyMjM3MzA3NGI5NGJiZDVjMjU1ZTg1YWRmNDkxZGFhMzg3ZjNmYjEwNzJjZjlhMGNhMTQ2YmZiZjFlMDIwNWIwZTdhMjI3ZjViMWViMjY1ZDkzODJlMDY3ODk0MGExNTMyMDY4YWU1ZDFlMGM0MjcxY2Q3OTEyMzNiMWFmNWQxMTQ3MjRjZTdmMGI4ZDE4ZTUxMWM4NWFhMWI4N2FjMDg2NTA3ZjE5YWRjZWQwMDViNzJmNDAwMWJjNjE0ZTA0OWI3OGM2ZDViMzAwNWIwY2Q3OTlmYjA4MWJiMDUyYjY1MjFlMmJmYTg1YTc2OWE4YTliODQzOTQyOWMwMDMxZmQ5ZWQzZjllZTRhY2Q2MDRhYjFiZDNiNTFlMGQ1OGM3MTMzNDQxOWFiNjY3MjljMmRmZTJiMDEwMmNjZmViMWNiMDhjNGM4MjAzMjJhMDZmMzM3YTBiNmUxMmRiMjU4ZTE5NWIxY2NmMTgwNjZkYTk0MDQxOWZkOGM4NTU0MmZkOTZiZmFjYjAwMmMyYjExYzBmM2YzOTkzNmM4ZDY0ZGYyYTY0ZTg5YzQzZDVlNTA3NjRhODgyZmZlNWY0NzZkNTYxZTA4MTcxMmM4NTg2MzcyMTc5MDM4Y2FiMmE2Njc2NzM4Mjg1N2NiZDMyZWU5Yzk3YzI2YWUxN2Q4MmY1NTQ0MzBhMjRmNzE4ZDUxYmU1MGJmN2FiMmE5NTQ2NDY5NTliOTY0MjI2ODNhZDJmNjMyNWZiNzRiNzYzYzAwMTIzNDAyOTdlNTk0NTJhOTQ2YWRlMjk4YWVkYTMwM2FmY2JiZTc4YzE5OWU0ZWQ2MWU1MzY0MWMzNmRhNmM2NWVhMzQxN2U2NmFmZDgzMTFlMDdiODA1ZTQ0NDhjNTFjNGJiYTRmYTRjZGRlMmVkNjM5NDY2NGNjNTA1Y2ViNzZlYjUyNjA5MDc3ZjcyNGMyYjgxYmJjMjA1YTMzNjAxYmY1MTM2Y2NiM2ZiOGE1M2FhYjZhNjVlMTRiMWM0NGI2OWJmMjUwYjNlN2NiNzFmYjUwYTc3NjAyNWE0NTI1ODk1YjNlMzcwOWJjOGQ5MzE5NTgyYjFkMTQxZDYyYzU2MmQyZTY2ZDA4MjFlYTFkNTZjYWNkZDk0ZTQ0MDJmNmQxYzRkY2E3YmNmZWQxNzI4ZWNjYzgwNmM3ZmZiZDdiMWQ4ZGNmMzNiN2M3ZDQxOGU1MTRhOTM0NGFhMzczNWZmM2I5ODcyMGQ1YTdhNGU0YTM5M2Q4MDA5OTA1ZGJhZTc2ODY4ZTE5MjFiMDc4OTBlYjIzYjU+VD5FQ08+U0FXPkFEQj4yMDI0LTEwLTE4IDA4OjMwOjAwPjIwMjQtMTAtMTggMDk6NDU6MDA+VkY+MzA3ND5UPjg+RUNPTk9NWT5BMzIxLTIxOFk+TVRJek5EYzBPUT4tMT4tMQ==-'
      Owner: 'VF'
      ResponseID: 'a0797d19-9269-41aa-a3f1-fe1d5ca7f992'
      BrandName: 'BASIC'
      uniquecounter: 0
      paxsegrefid: 'VF3074-18Oct-SAWADB-MTIzNDc0OQ'
      direction: 0
      bundleservicelist: []
      bundleservicecodelist: []
      Seq: 'VF3074_'
    }
  }
}

export type FlightDetails = {
  [key: string]: {
    key: string
    groupId: 0
    flightSegmentKeys: string[]
    travelTime: '01:10:00'
    direction: 1
    isDomestic: true
    isOWCCombinable: false
    isPromotional: true
    reservable: true
    freeVolatileData: {
      data: 'OFFERITEM8_1:SH1'
      OfferID: 'NDI5MTM3NSo0MTk0ODUwOTY0NSo1MDY4NzAqU09XKlMqZmFsc2UqQTIwN0pINTgqMjQ4MTgqT1cqdHJ1ZSoxNDYyLjc4KlRSWSoyMDI0LTEwLTE2KmZjUUF5T0VMQ3I5TFY0Q05qaiUyRkhvWHFrMWRRcVZKY2klMkJ0Q1N4VDhmQzNUdDYlMkJ2UFJXa3lYWUlZdmU0SVVqRWpXa0pPOGVFQkFGWkExS2dtSVpmMkdnJTNEJTNE'
      Owner: 'PC'
      ResponseID: 'c5ad313a66a447ee8bd647c18b37aa43'
      brandname: 'ADVANTAGE'
      Seq: 'FL_SAWADB_3'
      SegmentRefs: 'NDI5MTM3NQ=='
      PassengerList: 'SH1'
      StandartSeatSelection: true
      AllSeatSelection: false
      FreeSandwich: true
      Entertainment: true
      FlexibleReturnChangeRight: false
    }
  }
}

export type FlightFareInfos = {
  [key: string | number]: {
    flightDetailKeys: string[]
    groupId: 0
    key: string
    totalPrice: {
      value: 1559.37
      currency: 'TRY'
      rateValue: null
    }
    basePrice: {
      value: 1015.38
      currency: 'TRY'
      rateValue: null
    }
    taxes: {
      value: 393.99
      currency: 'TRY'
      rateValue: null
    }
    discount: {
      value: 0
      currency: null
      rateValue: null
    }
    buyFee: {
      code: null
      price: {
        value: 0
        currency: null
        rateValue: null
      }
    }
    fee: {
      code: ''
      price: {
        value: 150
        currency: 'TRY'
        rateValue: null
      }
    }
    passengerPrices: [
      {
        unitPrice: {
          value: 1559.37
          currency: 'TRY'
          rateValue: null
        }
        unitBasePrice: {
          value: 1015.38
          currency: 'TRY'
          rateValue: null
        }
        unitFee: {
          code: ''
          price: {
            value: 150
            currency: 'TRY'
            rateValue: null
          }
        }
        unitTax: {
          value: 393.99
          currency: 'TRY'
          rateValue: null
        }
        cancelPenalty: null
        changePenalty: null
        passengers: [
          {
            key: string
            name: null
            passengerType: number
            age: number
            birthday: string
            gender: 0
          },
        ]
        taxInfos: [
          {
            key: 'YR'
            value: '275.00'
          },
          {
            key: 'VQ'
            value: '118.99'
          },
        ]
        serviceCharges: null
      },
    ]
    taxInfos: null
    serviceCharges: null
    providerName: string
  }
}

export type FlightSearchApiResponse = {
  code: number
  message: null
  data: {
    status: boolean
    message: null
    hasMoreResponse: boolean
    executionTime: string
    searchResults: {
      diagnostics: { providerName: string }
      flightDetails: FlightDetails
      flightDetailSegments: FlightDetailSegment
      flightFareInfos: FlightFareInfos
      flightPackageInfos: {}
    }[]
  }
  token: null
  clientIP: null
  appName: null
  sessionToken: string
  userAuthenticationToken: null
  eventMessageList: []
}
