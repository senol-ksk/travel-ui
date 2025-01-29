export interface FlightSearchResult {
  routes: {
    [key: string]: {
      groupId: ID
      origin: string
      destination: string
      departureDate: string
    }
  }
  flightFareInfos: { [key: FlightFareInfo['key']]: FlightFareInfo } | null
  flightDetailSegments: { [key: string]: FlightDetailSegment } | null
  flightDetails: { [key: string]: FlightDetail } | null

  flightPackageInfos: object
  sessionToken: null
  traceId: string
  isSucceeded: boolean
  diagnostics: {
    sessionToken: string
    providerId: ID
    providerName: string
    generatingRequestTime: string
    callingServiceTime: string
    generatingResponseTime: string
    subDiagnostics: null
    lastException: null
    serviceRequestData: null
    serviceResponseData: null
    providerInfo: {
      isActive: boolean
      isProduction: boolean
    }
    traceId: null
  }
  eventMessages: []
  appName: null
  scopeCode: string
  logSessionToken: null
  logSearchToken: null
}

export interface FlightFareInfo {
  flightDetailKeys: string[]
  groupId: ID
  key: string
  totalPrice: ServicePriceType
  basePrice: ServicePriceType
  taxes: ServicePriceType
  discount: ServicePriceType
  buyFee: ServiceFeePriceType
  fee: ServiceFeePriceType
  passengerPrices: {
    unitPrice: ServicePriceType
    unitBasePrice: ServicePriceType
    unitFee: ServiceFeePriceType
    unitTax: ServicePriceType
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
      value: string
    }[]
    serviceCharges: null
  }[]
  taxInfos: null
  serviceCharges: null
}

export interface FlightDetailSegment {
  key: string
  groupId: number
  origin: {
    code: string
    isDomestic: boolean
    iata: null
    type: number
    id: ID
  }
  destination: {
    code: string
    isDomestic: boolean
    iata: null
    type: number
    id: ID
  }
  departureTime: string
  arrivalTime: string
  flightTime: string
  operatingAirline: {
    code: string
    value: null
    countryCode: null
  }
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

export interface FlightDetail {
  key: string
  groupId: number
  flightSegmentKeys: string[]
  travelTime: string
  direction: number
  isDomestic: boolean
  isOWCCombinable: boolean
  isPromotional: boolean
  reservable: boolean
  freeVolatileData: {
    OfferID: string
    Owner: string
    ResponseID: string
    BrandName: string
    uniquecounter: number
    PaxJourneyRefID: string
    direction: number
    bundleservicelist: []
    bundleservicecodelist: []
    Seq: string
    offerpaxid: string[]
    totalpriceamountt: number
    totalpriceamountc: string
    StandartSeatSelection: boolean
    AllSeatSelection: boolean
    FreeSandwich: boolean
    Entertainment: boolean
    FlexibleReturnChangeRight: boolean
  }
}

export interface FlightSearchResultsApiResponse {
  code: number
  message: null
  data: {
    status: boolean
    message: null
    hasMoreResponse: boolean
    executionTime: string
    searchResults: FlightSearchResult[] | [] | null
  } | null
  token: null
  clientIP: null
  appName: null
  sessionToken: '3A4EAE760ADF8C53995A7E330C0FC879875A86676B6275C6A7812E342E3694F7'
  userAuthenticationToken: null
  eventMessageList: []
}
