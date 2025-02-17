import type { DatesRangeValue } from '@mantine/dates'

import type { LocationResult } from '@/components/search-engine/locations/type'

export type GroupId = 0 | 1 | null

export type FlightLocationLeg = {
  code: string
  iata: string[]
  type: number
  isDomestic: boolean
  id: string | number
}

export type FlightSearchRequestFlightSearchPanel = {
  ActiveTripKind: '1' | '2'
  SearchLegs: {
    DepartureTime: string
    CabinClass: number | string
    MaxConnections: number
    Origin: FlightLocationLeg
    Destination: FlightLocationLeg
  }[]

  PassengerCounts: { Adult: number; Child: number; Infant: number }
  Domestic: boolean
  CabinClass: {
    value: number | string
    title: 'Ekonomi' | 'Business' | 'First Class' | string
  }
  ReceivedProviders?: string[] | []
}

export type FlightSearchRequestPayload = {
  params: {
    appName: string
    scopeName: string
    scopeCode: string
    searchToken: string
    FlightSearchPanel: FlightSearchRequestFlightSearchPanel
  }
  apiRoute: string
  apiAction: string
  sessionToken: string
  appName: string
  scopeName: string
  scopeCode: string
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

export type GetAirlineByCodeListResponse = {
  Result: {
    Id: string | number
    Code: string
    CountryCode: string
    Country: null | string
    City: null | string
    Value: {
      LangCode: string
      Value: string
    }[]
  }[]
}
