export interface TransferPrice {
  amount: number
  transferCurrencyType: number
}

export interface TransferVehicle {
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
      priceWithoutMarkup: TransferPrice
      priceWithMarkup: TransferPrice
      suggestedVehicleCount: number
      sortPrice: number
      extraServices: {
        id: ID
        code: string
        title: string
        description: string
        priceWithoutMarkup: TransferPrice
        priceWithMarkup: TransferPrice
      }[]
      buyServiceFee: number
      sellServiceFee: number
      sellBaseFareAddOn: number
    }
    selectedTransferDetail: null
  }
}

export interface TransferSearchResultsResponse {
  code: number
  data: {
    status: boolean
    message: string
    hasMoreResponse: boolean
    executionTime: string
    searchResults: {
      searchId: ID
      vehicles: TransferVehicle[]
      sessionToken: string
      traceId: string
      isSucceeded: boolean
      diagnostics: {
        sessionToken: string
        providerId: ID
        providerName: string
        generatingRequestTime: string
        callingServiceTime: string
        generatingResponseTime: string
        providerInfo: {
          isActive: boolean
          isProduction: boolean
        }
      }
      eventMessages: []
      appName: string
      scopeCode: string
    }[]
  }
  sessionToken: string
}
