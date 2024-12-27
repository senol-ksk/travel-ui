export interface BusSearchResponse {
  code: 1
  message: null
  data: {
    status: boolean
    message: string
    hasMoreResponse: boolean
    executionTime: string
    searchResults: [
      {
        items: BusSearchResultItem[]
        sessionToken: null
        traceId: string
        isSucceeded: boolean
        diagnostics: {
          providerId: ID
          providerName: string
        }
        eventMessages: []
        appName: null
        scopeCode: string
        logSessionToken: null
        logSearchToken: null
      },
    ]
  }
  token: null
  clientIP: null
  appName: null
  sessionToken: string
  userAuthenticationToken: null
  eventMessageList: []
}

export interface BusSearchResultBusProps {
  kind: string
  trackingNo: string
  lineNo: number
  origin: null
  destination: string
  departureDate: string
  arrivalDate: string
  duration: string
  originalPrice: ServicePriceType
  internetPrice: ServicePriceType
  busName: null
  policy: null
  features: null
  description: string
  available: boolean
}

export interface BusSearchResultItem {
  id: ID
  companyId: ID
  company: string
  busType: string
  totalSeats: number
  availableSeats: number
  bus: BusSearchResultBusProps
  totalCommission: ServicePriceType
  buyServiceFee: number
  sellServiceFee: number
  features: []
  origin: string
  originId: ID
  destination: string
  destinationId: ID
  isActive: boolean
  cancellationOffset: number
  hasBusShuttle: boolean
  isHesCodeRequired: boolean
  disableSingleSeatSelection: boolean
  changeOffset: number
  selectedSeats: null
  routeInfos: null
  key: string
  totalPrice: ServicePriceType
  basePrice: ServicePriceType
  taxes: ServicePriceType
  discount: ServicePriceType
  buyFee: ServiceFeePriceType
  fee: ServiceFeePriceType
  passengerPrices: null | ServicePriceType
  taxInfos: null | ServicePriceType
  serviceCharges: null | ServicePriceType
}
