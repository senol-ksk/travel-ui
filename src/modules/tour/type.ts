export interface TourSearchApiParamsResponse {
  params: {
    sessionToken: string
    apiRoute: 'TourService'
    apiAction: 'api/tour/Search'
    appName: string
    scopeName: string
    scopeCode: string
    tourSearchRequest: {
      startDate: string
      endDate: string
      keyword: ''
      location: {
        id: ID
        parentRegion: null | ID
        label: string
      }
      tourDestinationModels: {
        locationId: ID
        groupId: null
        value: null
        isDomestic: boolean
        type: number
        providerName: string
      }[]
      searchName: null
      receivedProviders: string[]
      sessionToken: string
      apiRoute: 'TourService'
      apiAction: 'api/tour/Search'
      appName: string
      scopeName: string
      searchToken: string
      scopeCode: string
    }
    customerId: ID
    customerUserId: ID
    channel: number
    searchToken: string
  }
  sessionToken: string
  apiRoute: 'TourService'
  apiAction: 'api/tour/Search'
  requestType: 'Service.Models.RequestModels.TourSearchRequestModel, Service.Models, Version=1.3.0.0, Culture=neutral, PublicKeyToken=null'
  returnType: 'Service.Models.ResultModels.RestResult`1[[TravelAccess.Core.Models.Tour.TourSearchResponse, Core.Models.Tour, Version=1.0.19.0, Culture=neutral, PublicKeyToken=null]], Service.Models, Version=1.3.0.0, Culture=neutral, PublicKeyToken=null'
  device: string
  languageCode: string
  ipAddress: string
  mlToken: string
}

export interface TourSearchResultLocationInfo {
  code: null
  title: string
}

export interface TourSearchApiResponsePassengerPrice {
  startAge: number
  endAge: number
  price: ServicePriceType
}

export interface TourSearchResultSearchItem {
  title: string
  hotelInformations: null
  description: string
  countries: []
  cities: TourSearchResultLocationInfo[]
  group: TourSearchResultLocationInfo
  region: TourSearchResultLocationInfo
  imageUrl: string
  startDate: string
  endDate: string
  tourTime: number
  priceInformations: {
    priceForDouble: ServicePriceType
    priceForSingle: ServicePriceType
    additionalBedPrices: null
    childrenPrices: TourSearchApiResponsePassengerPrice[]
  }
  quota: number
  discountDescription: string
  extraServices: null
  detail: null
  tlPrice: ServicePriceType
  calculatedId: null
  slug: string
  slugId: ID
  isDomestic: boolean
  commission: number
  key: string
  totalPrice: ServicePriceType
  basePrice: ServicePriceType
  taxes: ServicePriceType
  discount: ServicePriceType
  buyFee: ServiceFeePriceType
  fee: ServiceFeePriceType
  passengerPrices: null
  taxInfos: null
  serviceCharges: null
}

export interface TourSearchResultApiResponse {
  code: number
  message: null
  data: {
    status: boolean
    message: string
    executionTime: string
    hasMoreResponse: boolean
    searchResults: [
      {
        items: TourSearchResultSearchItem[] | []
        sessionToken: null
        traceId: string
        isSucceeded: boolean
        eventMessages: []
        appName: null
        scopeCode: string
        logSessionToken: null
        logSearchToken: null
        diagnostics: {
          providerName: string
          sessionToken: string
          providerId: ID
          generatingRequestTime: string
          callingServiceTime: string
          generatingResponseTime: string
          subDiagnostics: null
          lastException: null
          serviceRequestData: null
          serviceResponseData: null
          providerInfo: {
            isActive: true
            isProduction: true
          }
          traceId: null
        }
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
