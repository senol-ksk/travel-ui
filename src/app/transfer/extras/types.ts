export interface TransferPriceMarkupType {
  amount: number
  transferCurrencyType: number | null
}

export interface ExtraServicesType {
  id: ID
  code: string
  title: string
  description: string
  priceWithoutMarkup: TransferPriceMarkupType
  priceWithMarkup: TransferPriceMarkupType
}

export interface TransferExtraApiResponseData {
  selectResponse: {
    requestId: null
    selectedVehicleCount: number
    extraServiceIds: null
    extraServiceInfo: null
    pickupPointName: string
    pickupPointType: number
    pickupLocationName: string
    pickupDate: string
    pickupInfo: null
    pickupDescription: null
    dropPointName: string
    dropPointType: number
    dropLocationName: string
    dropInfo: null
    dropDescription: null
    adultPassengerCount: number
    childrenPassengerCount: number
    babyPassengerCount: number
    transferVehicle: {
      productKey: string
      id: ID
      partnerId: ID
      vehicleType: number
      vehicleName: string
      vehicleTitle: string
      transferInfo: {
        transferMax: {
          pax: string
          suitcase: string
        }
        transferHour: {
          booking: string
          freeCancel: string
          freeChange: string
        }
        vehiclePhotoUrl: string
      }
      extraServices: []
      status: string
      transferData: {
        bookDetail: {
          brmFactor: string
          markupDetail: {
            markupPercentAmount: string
            markupPrice: null
          }
          priceWithoutMarkup: TransferPriceMarkupType
          priceWithMarkup: TransferPriceMarkupType
          suggestedVehicleCount: number
          sortPrice: number
          extraServices: ExtraServicesType[]
          buyServiceFee: number
          sellServiceFee: number
          sellBaseFareAddOn: number
        }
        selectedTransferDetail: null
      }
    }
    sessionToken: string
    traceId: null | ID
    isSucceeded: boolean
    diagnostics: {
      sessionToken: null
      providerId: number
      providerName: string
      generatingRequestTime: string
      callingServiceTime: string
      generatingResponseTime: string
      subDiagnostics: null
      lastException: null
      serviceRequestData: null
      serviceResponseData: null
      providerInfo: null
      traceId: null
    }
    eventMessages: []
    appName: string
    scopeCode: string
    logSessionToken: null
    logSearchToken: null
  }
  bookingResponse: null
  searchToken: string
  sessionToken: string
  moduleName: 'Transfer'
  totalPrice: number
  priceCurrency: string
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: null
  financellDiscount: ServicePriceType
}
