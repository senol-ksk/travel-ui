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

export const transferExtrasDummyResponeData: TransferExtraApiResponseData = {
  selectResponse: {
    requestId: null,
    selectedVehicleCount: 0,
    extraServiceIds: null,
    extraServiceInfo: null,
    pickupPointName: 'Istanbul Havalimanı',
    pickupPointType: 2,
    pickupLocationName: 'İstanbul',
    pickupDate: '2025-01-26T12:00:00',
    pickupInfo: null,
    pickupDescription: null,
    dropPointName: 'Kadiköy Suite',
    dropPointType: 3,
    dropLocationName: 'İstanbul',
    dropInfo: null,
    dropDescription: null,
    adultPassengerCount: 1,
    childrenPassengerCount: 0,
    babyPassengerCount: 0,
    transferVehicle: {
      productKey:
        '6QQl4e1l5fnzuYBwmVyHNttmRen63FaA7IffcqBqGpvBeORS/VHg2SqkG22ca2ZyecgNfmJ9w7JRuVxE1GxwZ11ts5vZJmx0gW2Hx7N3hsY=',
      id: 1,
      partnerId: 132,
      vehicleType: 5,
      vehicleName: 'Eko Mini Vito, Caravelle vb.',
      vehicleTitle: 'Eko Mini - Mercedes Vito, VW Caravelle vb.',
      transferInfo: {
        transferMax: {
          pax: '5',
          suitcase: '5 Bavul',
        },
        transferHour: {
          booking: '24',
          freeCancel: '24',
          freeChange: '24',
        },
        vehiclePhotoUrl:
          'https://partner.paxdrive.com/asset/1/paxdrive-images/mini.png',
      },
      extraServices: [],
      status: 'a',
      transferData: {
        bookDetail: {
          brmFactor: '1',
          markupDetail: {
            markupPercentAmount: '0',
            markupPrice: null,
          },
          priceWithoutMarkup: {
            amount: 2890.0,
            transferCurrencyType: 1,
          },
          priceWithMarkup: {
            amount: 3323.5,
            transferCurrencyType: 1,
          },
          suggestedVehicleCount: 1,
          sortPrice: 3323.5,
          extraServices: [
            {
              id: '1578822650',
              code: 'GREET',
              title: 'Standart Karşılama Hizmeti',
              description: 'Havalimanı Karşılama Hizmeti',
              priceWithoutMarkup: {
                amount: 218.176,
                transferCurrencyType: 1,
              },
              priceWithMarkup: {
                amount: 218.176,
                transferCurrencyType: 1,
              },
            },
            {
              id: '1578840643',
              code: 'BSEAT1',
              title: 'Bebek Koltuğu',
              description: 'Bebek Koltuğu',
              priceWithoutMarkup: {
                amount: 0.0,
                transferCurrencyType: 1,
              },
              priceWithMarkup: {
                amount: 0.0,
                transferCurrencyType: 1,
              },
            },
          ],
          buyServiceFee: 0.0,
          sellServiceFee: 0.0,
          sellBaseFareAddOn: 433.5,
        },
        selectedTransferDetail: null,
      },
    },
    sessionToken:
      'BE15FFA848C97E148EB0FDCCEC3201020EE162F85F2A119B51C1F7407DCE8999',
    traceId: null,
    isSucceeded: false,
    diagnostics: {
      sessionToken: null,
      providerId: 0,
      providerName: 'PaxDrive',
      generatingRequestTime: '00:00:00',
      callingServiceTime: '00:00:00',
      generatingResponseTime: '00:00:00',
      subDiagnostics: null,
      lastException: null,
      serviceRequestData: null,
      serviceResponseData: null,
      providerInfo: null,
      traceId: null,
    },
    eventMessages: [],
    appName: 'fulltrip.preprod.webapp.html',
    scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7',
    logSessionToken: null,
    logSearchToken: null,
  },
  bookingResponse: null,
  searchToken:
    'EAB4803C60A8C963DC5A8C5954E1D2F43416F7BEF3795B97F40CDAE1107E5042',
  sessionToken:
    'BE15FFA848C97E148EB0FDCCEC3201020EE162F85F2A119B51C1F7407DCE8999',
  moduleName: 'Transfer',
  totalPrice: 3323.5,
  priceCurrency: 'TRY',
  loyaltyMultiple: 100,
  couponDiscountList: null,
  extraCharges: null,
  financellDiscount: {
    value: 0.0,
    currency: null,
    rateValue: null,
  },
}
