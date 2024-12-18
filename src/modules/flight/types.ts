import type { DatesRangeValue } from '@mantine/dates'

import type { LocationResult } from '@/components/search-engine/locations/type'

export type GroupId = 0 | 1 | null
export type OLPriceModel = {
  value: number
  currency: string
  rateValue: null | number
}
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

export type FlightDetailSegment = {
  [key: string]: {
    key: string
    groupId: GroupId
    origin: {
      code: string
      isDomestic: boolean
      iata: null
      type: number | string
      id: number | string
    }
    destination: {
      code: string
      isDomestic: boolean
      iata: null
      type: number | string
      id: number | string
    }
    departureTime: string
    arrivalTime: string
    flightTime: string
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
    flightNumber: string
    cabinClass: number
    bookingCode: string
    equipment: null
    isMeal: boolean
    quota: number
    baggageAllowance: {
      maxWeight: {
        value: number
        unit: number
      }
      piece: {
        pieceCount: number
      }
    }
    freeVolatileData: {
      OfferID: string
      Owner: string
      ResponseID: string
      BrandName: string
      uniquecounter: number
      paxsegrefid: string
      direction: number
      bundleservicelist: []
      bundleservicecodelist: []
      Seq: string
    }
  }
}

export type FlightDetails = {
  [key: string]: {
    key: string
    groupId: GroupId
    flightSegmentKeys: string[]
    travelTime: string
    direction: number
    isDomestic: boolean
    isOWCCombinable: boolean
    isPromotional: boolean
    reservable: boolean
    freeVolatileData: {
      data: string
      OfferID: string
      Owner: string
      ResponseID: string
      brandname: string
      Seq: string
      SegmentRefs: string
      PassengerList: string
      StandartSeatSelection: boolean
      AllSeatSelection: boolean
      FreeSandwich: boolean
      Entertainment: boolean
      FlexibleReturnChangeRight: boolean
    }
  }
}

export type FlightFareInfos = {
  [key: string | number]: {
    flightDetailKeys: string[]
    groupId: GroupId
    key: string
    totalPrice: OLPriceModel
    basePrice: OLPriceModel
    taxes: OLPriceModel
    discount: OLPriceModel
    buyFee: {
      code: null
      price: OLPriceModel
    }
    fee: {
      code: string
      price: OLPriceModel
    }
    passengerPrices: [
      {
        unitPrice: OLPriceModel
        unitBasePrice: OLPriceModel
        unitFee: {
          code: string
          price: OLPriceModel
        }
        unitTax: OLPriceModel
        cancelPenalty: null
        changePenalty: null
        passengers: {
          key: string
          name: null
          passengerType: number
          age: number
          birthday: string
          gender: number
        }[]
        taxInfos: {
          key: string
          value: string | number
        }[]
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
      flightPackageInfos: null
    }[]
  }
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

export type ClientFlightDataModel = {
  id: number | string
  flightFare: FlightFareInfos[0]
  flightDetails: FlightDetails[string][]
  flightDetailSegments: FlightDetailSegment[string][]
  airLines: { value: string; code: string }[]
  // airportList: []
  // departureAirportList: []
  // returnAirportList: []
  // transferPoints: []
  // groupId: GroupId
}
