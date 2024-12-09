import { getsecuritytoken, request } from '@/network'
import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
  type InfiniteData,
} from '@tanstack/react-query'

import { CarSearchRequest } from './request-model'
import { GetSecurityTokenResponse } from '@/types/global'

type UseCarSearch = (
  params: CarSearchRequest
) => UseInfiniteQueryResult<InfiniteData<CarSearchResult>>

let appToken: GetSecurityTokenResponse | undefined | null
const receivedProviders: string[] = []

export const clearCarSearch = () => {
  receivedProviders.splice(0, receivedProviders.length)
  appToken = null
}

export const useCarSearchResults: UseCarSearch = (params) => {
  return useInfiniteQuery({
    queryKey: ['car-search-result', params, appToken],
    queryFn: async ({ pageParam, signal }) => {
      if (!appToken) {
        appToken = await getsecuritytoken()
      }

      const response = (await request({
        url: `${process.env.NEXT_PUBLIC_OL_ROUTE}`,
        method: 'post',
        data: { ...pageParam },
        headers: {
          appToken: appToken.result,
          appName: process.env.NEXT_PUBLIC_APP_NAME,
        },
        signal,
      })) as CarSearchResult

      return response
    },
    initialPageParam: params,
    getNextPageParam: (lastPage, page, lastPageParam, allPageParam) => {
      lastPage.data.searchResults.forEach((searchResult) => {
        receivedProviders.push(searchResult.diagnostics.providerName)
      })

      if (!lastPage.data.hasMoreResponse) {
        return undefined
      }

      return {
        ...lastPageParam,
        params: {
          ...lastPageParam.params,
          carRentalSearchPanel: {
            ...lastPageParam.params.carRentalSearchPanel,
            receivedProviders: [...new Set(receivedProviders)],
          },
        },
      }
    },
  })
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
  items: Item[] | null
  logSearchToken: null
  logSessionToken: null
  pickupStation: null
  returnStation: null
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

export interface Item {
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
