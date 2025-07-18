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

export interface Seat {
  age: number
  basePrice: ServicePriceType
  buyServiceFee: number
  discount: ServicePriceType
  gender: BusGender
  no: number
  paxId: number
  paxType: number
  sellServiceFee: number
  servicePrice: ServicePriceType
  sideStatus: number
  status: BusGender | SeatStatus
  taxes: ServicePriceType
  totalCommission: ServicePriceType
  totalPrice: ServicePriceType
  type: number
}
export interface RouteInfo {
  arrivalDate: string
  departureDate: string
  destination: string
  locationPoint: string
  locationPointId: number
  priority: number
}

export interface BusSeatApiResponse {
  code: 1
  message: null
  token: null
  clientIP: null
  appName: null
  sessionToken: string
  userAuthenticationToken: null
  eventMessageList: []
  data: { seats: Seat[]; routeInfos: RouteInfo[] }
}

export enum BusGender {
  EMPTY,
  WOMAN,
  MALE,
}

export enum SeatStatus {
  AVAILABLE = 0,
  TAKENBYWOMAN = 1,
  REZERVTOWOMAN = 2,
  TAKENBYMAN = 3,
  REZERVTOMAN = 4,
  ISSALE = 5,
  CANNOTBESOLD = 6,
  SELECTEDSEATTYPE = 7,
}

export enum SeatSideStatus {
  /// Yan Koltuk Boş (Her İki Cinse Satılabilir)
  empty = 0,
  /// Sadece Bayana Satılabilir
  SaleToLady = 1,
  /// Sadece Baya Satılabilir
  SaleToMr = 2,
  /// Belirsiz satılamaz
  Uncertain3 = 3,
  Uncertain4 = 4,
  Uncertain5 = 5,
  Uncertain6 = 6,
}

export enum SeatColors {
  AVAILABLE = '--mantine-colors-white',
  NOTAVAILABLE = '--mantine-color-gray-4',
  SELECTED = '--mantine-color-green-3',
  WOMAN = '--mantine-color-orange-2',
  MALE = '--mantine-color-blue-2',
}
