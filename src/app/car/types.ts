export interface StationType {
  location: {
    id: ID
    code: string
    countryCode: string
    name: string
    isDomestic: boolean
    providerName: string
  }
  address: {
    addressName: null
    street: null
    city: null
    country: {
      iataCode: null
      id: ID
      parentRegion: null
      label: null
    }
    postalCode: ''
  }
  phoneNumbers: {
    countryCode: number
    areaCode: number
    number: null
    type: number
  }[]
  times: {
    day: string
    openingTime: string
    closingTime: string
  }[]
  direction: null
  mailAddress: null
}

export interface CarSearchResult {
  code: number
  message: null
  data: Data
  token: null
  clientIP: null
  appName: null
  sessionToken: string
  userAuthenticationToken: null
  eventMessageList: string[]
}

export interface Data {
  executionTime: string
  hasMoreResponse: boolean
  message: string
  searchResults: SearchResult[]
  status: boolean
}

export interface SearchResult {
  appName: null
  diagnostics: Diagnostics
  eventMessages: []
  isSucceeded: boolean
  items: CarSearchResultItemType[] | null
  logSearchToken: null
  logSessionToken: null
  pickupStation: null | StationType
  returnStation: null | StationType
  scopeCode: string
  sessionToken: null
  traceId: string
}

export interface Diagnostics {
  sessionToken: string
  providerId: number
  providerName: string
  generatingRequestTime: string
  callingServiceTime: string
  generatingResponseTime: string
  subDiagnostics: null
  lastException: LastException | null
  serviceRequestData: string
  serviceResponseData: string
  providerInfo: ProviderInfo
  traceId: null
}

export interface LastException {
  name: string
  message: string
  stackTrace: string
  innerFaults: InnerFault[]
  properties: Properties2
}

export interface InnerFault {
  name: string
  message: string
  stackTrace: string
  innerFaults: []
  properties: Properties
}

export interface Properties {
  StatusCode: string
  TargetSite: string
  Source: string
  HResult: string
}

export interface Properties2 {
  TargetSite: string
  Source: string
  HResult: string
}

export interface ProviderInfo {
  isActive: boolean
  isProduction: boolean
}

export interface CarDetail {
  name: string
  pickupDate: string
  pickupId: string
  pickupCode: string
  returnDate: string
  returnId: string
  returnCode: string
  type: number
  category: string
  doorCount: number
  passengerCount: number
  imageUrl: string
  vendorUrl: string
  vendorName: string
  airConditioning: boolean
  automaticTransmission: boolean
  transmissionDrive: number
  fuelType: number
  included: string[]
  navigationSystem: NavigationSystem
  baggages?: ServicePriceType
  carGroupName: string
  seatCount: string
  deposit: ServicePriceType
  kminCluded: string
  addKmRate: ServicePriceType
  minDriverAge: number
  licenseYear: number
  brand?: string
  model?: string
  deliveryType: string
}

export interface CarSearchResultItemType {
  carDetail: CarDetail
  carIncluded?: []
  carInsurances?: CarInsurance[]
  carExtraOption?: CarExtraOption[]
  oneWay: ServicePriceType
  orginalTotalPrice: ServicePriceType
  carMessage: null
  servicePrice: ServicePriceType
  totalCommission: ServicePriceType
  buyServiceFee: number
  sellServiceFee: number
  key: string
  totalPrice: ServicePriceType
  basePrice: ServicePriceType
  taxes: ServicePriceType
  discount: ServicePriceType
  buyFee: ServicePriceType
  fee: ServicePriceType
  passengerPrices: PassengerPrice[]
  taxInfos: null
  serviceCharges: null
  pickupStation: null | StationType
  returnStation: null | StationType
}

export interface NavigationSystem {
  isAvailable: boolean
  isIncluded: boolean
}

export interface CarInsurance {
  code: string
  calculateInfo: null
  description: string
  noOfUnits: number
  totalPrice: ServicePriceType
  unitPrice: ServicePriceType
  isSelectable: boolean
  selected: boolean
  isFree: boolean
}

export interface CarExtraOption {
  code: string
  calculateInfo: null
  name: string
  totalPrice: ServicePriceType
  maxDay: number
  unitPrice: ServicePriceType
  isSelectable: boolean
  selected: boolean
  isFree: boolean
}

export interface PassengerPrice {
  unitPrice: ServicePriceType
  unitBasePrice: ServicePriceType
  unitFee: ServicePriceType
  unitTax: ServicePriceType
  cancelPenalty: null
  changePenalty: null
  passengers: Passenger[]
  taxInfos: null
  serviceCharges: null
}

export interface Passenger {
  key: string
  name: string | null
  passengerType: number
  age: number
  birthday: string
  gender: number
}

export interface CarSearchRequest {
  params: Params
  sessionToken: string
  apiRoute: 'CarRentalService'
  apiAction: 'api/CarRental/Search'
  requestType: 'Service.Models.RequestModels.CarRentalSearchRequestModel, Service.Models, Version=1.2.8.0, Culture=neutral, PublicKeyToken=null'
  returnType: 'Service.Models.ResultModels.RestResult`1[[TravelAccess.Core.Models.CarRental.CarRentalSearchResponse, Core.Models.CarRental, Version=1.0.23.0, Culture=neutral, PublicKeyToken=null]], Service.Models, Version=1.2.8.0, Culture=neutral, PublicKeyToken=null'
  device: string
  languageCode: string
  ipAddress: string
  mlToken: string
}

export interface Params {
  carRentalSearchPanel: CarRentalSearchPanel
  sessionToken: string
  apiRoute: 'CarRentalService'
  apiAction: 'api/CarRental/Search'
  searchToken: string
  appName: string
  scopeName: string
  scopeCode: string
  customerId: number
  customerUserId: number
}

export interface CarRentalSearchPanel {
  origin: Origin[]
  destination: Destination[]
  pickupDate: string
  pickupHour: string
  returnDate: string
  returnHour: string
  driverAge: number
  receivedProviders: null | string[]
  customerId: number
  customerUserId: number
  sessionToken: string
  apiRoute: null
  apiAction: null
  appName: null
  scopeName: null
  searchToken: string
  scopeCode: string
}

export interface Origin {
  id: number
  code: string
  countryCode: string
  name: string
  isDomestic: boolean
  providerName: string
}

export interface Destination {
  id: number
  code: string
  countryCode: string
  name: string
  isDomestic: boolean
  providerName: string
}
