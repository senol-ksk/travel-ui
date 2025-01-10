import { z } from 'zod'

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

export interface TourLocationInfo {
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
  cities: TourLocationInfo[]
  group: TourLocationInfo
  region: TourLocationInfo
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

export interface TourExtraService {
  name: string
  unitPrice: ServicePriceType
  unitPriceTl: ServicePriceType
  totalPriceTl: ServicePriceType
  isPackage: boolean
  unitPriceFor: number
  isMandatory: boolean
  mandatoryDescription: string
  amount: number
  extraServiceType: number
  extraServiceCodes: string
  extraServiceValues: string
  commissionTlPrice: ServicePriceType
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

export interface TourDetailProgram {
  title: string
  description: string
}
export interface TourDeatilApiResponse {
  package: {
    title: string
    description: string
    countries: []
    cities:
      | {
          code: null
          title: string
        }[]
      | []
    group: TourLocationInfo
    region: TourLocationInfo
    imageUrl: string
    startDate: string
    endDate: string
    tourTime: number
    hotelInformations: null
    priceInformations: {
      priceForDouble: ServicePriceType
      priceForSingle: ServicePriceType
      additionalBedPrices: null
      childrenPrices: {
        startAge: number
        endAge: number
        price: ServicePriceType
      }[]
    }
    quota: number
    discountDescription: string
    extraServices: TourExtraService[]
    detail: {
      images: string[]
      countryInformation: {
        name: string
        description: string
        imageUrl: string
      } | null
      extraTours: []
      tourProgram: TourDetailProgram[]
      departureInformation: string
      includedInformation: string
      notIncludedInformation: string
      flightInformation: string[]
      hotelRooms: {
        key: string
        adultCount: number
        childCount: number
        additionalBedCount: number
      }[]
      additionalSSRData: {
        items:
          | {
              uniqueIdentifier: string
              code: string
              included: boolean
              description: 'Bus Pick Up Point'
              selected: boolean
              required: boolean
              indexNo: number
              data: null
              filters: {
                key: string
                value: string
                indexNo: number
              }[]
            }[]
          | []
        owner: {
          type: number
          ownerKey: string
          identifier: string
        }
        subGroups: []
      }
    }
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
      taxInfos: null
      serviceCharges: null
    }[]
    taxInfos: null
    serviceCharges: null
  }
  detail: {
    images: string[]
    countryInformation: {
      name: string
      description: string
      imageUrl: string
    } | null
    extraTours: []
    tourProgram: TourDetailProgram[]
    departureInformation: string
    includedInformation: string
    notIncludedInformation: string
    flightInformation: string[]
    hotelRooms: {
      key: string
      adultCount: number
      childCount: number
      additionalBedCount: number
    }[]
    additionalSSRData: {
      items:
        | {
            uniqueIdentifier: string
            code: string
            included: boolean
            description: string
            selected: boolean
            required: boolean
            indexNo: number
            data: null
            filters: {
              key: string
              value: string
              indexNo: number
            }[]
          }[]
        | []
      owner: {
        type: number
        ownerKey: string
        identifier: string
      }
      subGroups: []
    }
  }
  adultCount: null | number
  childs: null | number
  sessionToken: string
  searchToken: string
  tourExtraServiceToDetailReturnPath: null
  location: {
    id: ID
    parentRegion: null
    label: string
  }
  moduleName: string
  totalPrice: number
  priceCurrency: null
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: null
  financellDiscount: ServicePriceType
}

export const passengerUpdateSchema = z.object({
  adultCount: z.string(),
  childAge: z.array(z.string().optional()).optional(),
})

export type PassengerFormTypes = z.infer<typeof passengerUpdateSchema>
