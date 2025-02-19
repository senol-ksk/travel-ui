export interface CarDetailLocation {
  id: ID
  code: string
  countryCode: string
  name: string
  isDomestic: boolean
  providerName: string
}

export interface CarPickLocation {
  location: CarDetailLocation
  address: {
    addressName: string
    street: string
    city: string
    country: {
      iataCode: null
      id: ID
      parentRegion: null
      label: null
    }
    postalCode: string
  }
  phoneNumbers: {
    countryCode: number
    areaCode: number
    number: string
    type: number
  }[]
  times: {
    day: string
    openingTime: string
    closingTime: string
  }[]
  direction: null
  mailAddress: string
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
export interface CarInsuranceOption {
  code: string
  calculateInfo: {
    status: null
    info: null
  }
  description: string
  noOfUnits: number
  totalPrice: ServicePriceType
  unitPrice: ServicePriceType
  isSelectable: boolean
  selected: boolean
  isFree: boolean
}

export interface DetailResponseData {
  detailResponse: {
    items: {
      carDetail: {
        name: string
        pickupDate: string
        pickupId: ID
        pickupCode: string
        returnDate: string
        returnId: ID
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
        included: []
        navigationSystem: {
          isAvailable: boolean
          isIncluded: boolean
        }
        baggages: null
        carGroupName: string
        seatCount: string
        deposit: ServicePriceType
        kminCluded: string
        addKmRate: ServicePriceType
        minDriverAge: number
        licenseYear: number
        brand: null
        model: null
        deliveryType: number
      }
      carIncluded: []
      carInsurances: CarInsuranceOption[] | []
      carExtraOption: CarExtraOption[] | []
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
      buyFee: {
        code: null
        price: ServicePriceType
      }
      fee: {
        code: null
        price: ServicePriceType
      }
      passengerPrices: {
        unitPrice: ServicePriceType
        unitBasePrice: ServicePriceType
        unitFee: {
          code: null
          price: ServicePriceType
        }
        unitTax: ServicePriceType
        cancelPenalty: null
        changePenalty: null
        passengers: {
          key: string
          name: null
          passengerType: 0
          age: 0
          birthday: string
          gender: 0
        }[]
        taxInfos: null
        serviceCharges: null
      }[]
      taxInfos: null
      serviceCharges: null
    }[]
    validationInformations: {
      age: {
        ageReferenceDate: string
        infantAgeBegin: string
        childAgeBegin: number
        adultAgeBegin: number
        ageCalculationType: number
      }
    }
    availableSpecialRequests: null
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
  pickupStation: CarPickLocation
  returnStation: CarPickLocation
  searchReponse: null
  carRentalSearchPanel: {
    origin: {
      id: ID
      code: string
      countryCode: string
      name: string
      isDomestic: boolean
      providerName: string
    }[]
    destination: {
      id: ID
      code: string
      countryCode: string
      name: string
      isDomestic: boolean
      providerName: string
    }[]
    pickupDate: string
    pickupHour: null
    returnDate: string
    returnHour: null
    driverAge: number
    receivedProviders: null
    customerId: ID
    customerUserId: ID
    sessionToken: string
    apiRoute: null
    apiAction: null
    appName: string
    scopeName: null
    searchToken: null
    scopeCode: string
  }
  moduleName: 'CarRental'
  totalPrice: number
  priceCurrency: null
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: null
  financellDiscount: ServicePriceType
}
