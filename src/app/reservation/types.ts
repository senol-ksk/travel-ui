import { z } from 'zod'
import { GenderEnumIndex } from '@/types/passengerViewModel'

import type {
  GenderEnums,
  PassengerTypesEnum,
  PassengerTypesIndexEnum,
} from '@/types/passengerViewModel'

export type PassengerValidationType = {
  birthDate_day: z.ZodString
  birthDate_month: z.ZodString
  birthDate_year: z.ZodString
  birthDate: z.ZodString
  citizenNo: z.ZodOptional<z.ZodString>
  firstName: z.ZodString
  gender: z.ZodString
  // gender: z.ZodNativeEnum<typeof GenderEnums>
  lastName: z.ZodString
  passengerId: z.ZodUnion<[z.ZodString, z.ZodNumber]>
  model_PassengerId: z.ZodUnion<[z.ZodString, z.ZodNumber]>
  nationality_Check: z.ZodOptional<z.ZodBoolean>
  passengerKey: z.ZodString
  passportCountry: z.ZodOptional<z.ZodString>
  passportNo: z.ZodOptional<z.ZodString>
  passportValidityDate: z.ZodNullable<z.ZodOptional<z.ZodString>>
  passportValidity_1: z.ZodOptional<z.ZodString>
  passportValidity_2: z.ZodOptional<z.ZodString>
  passportValidity_3: z.ZodOptional<z.ZodString>
  registeredPassengerId: z.ZodUnion<[z.ZodString, z.ZodNumber]>
  type: z.ZodReadonly<z.ZodNativeEnum<typeof PassengerTypesEnum>>
  hesCode: z.ZodString
  moduleName: z.ZodOptional<z.ZodString>
}

export enum ResponseStatus {
  Success,
  Warning,
  Fatal,
  Error,
  BadRequest,
  NotFound,
  Unauthorized,
  Forbidden,
}

export type PaymentResponeType = {
  okUrl: string
  callbackUrl: string
  failUrl: string
  mode: string
  secure3dsecuritylevel: string
  apiversion: string
  terminalprovuserid: string
  terminaluserid: string
  terminalmerchantid: string
  txntype: string
  txnamount: string
  txncurrencycode: string
  txninstallmentcount: string
  orderid: string
  terminalid: string
  successurl: string
  errorurl: string
  customeremailaddress: string
  customeripaddress: string
  secure3dhash: string
  cardnumber: string
  cardexpiredatemonth: string
  cardexpiredateyear: string
  cardcvv2: string
  action: string
}

type FlightGroupID = 1 | 0

export type OperationResultType = {
  passenger: {
    modules: number[]
    passengers: {
      type: PassengerTypesIndexEnum
      gender: GenderEnumIndex
      fullName: string
      birthday: string
      identityNumber: string
      bookingCode: string
      campaignCode: null | string
      eTicketNumber: string
      firstName: string
      lastName: string
      mobilePhoneNumber: string
      email: string
      marketingAirlineCode: string
      isRoundedTrip: boolean
      module: number
      groupOrderIndex: number
      localPassengerSequenceNo: number
      localRelatedPassengerSequenceNo: null
      discount: {
        value: number
        currency: null
        rateValue: null
      }
      productItemId: ID
    }[]
    billingInformation: {
      billingName: string
      isCompany: boolean
      address: string
      taxNo: string
    }[]
    paymentInformation: {
      basketTotal: number
      basketDiscountTotal: number
      collectingTotal: number
      financellTotal: number
      mlTotal: null | number
      rateOfInterest: number
      installmentCount: number
      bankName: string
      encryptedCardHolder: string
      encryptedCardNumber: string
      sellingCurrency: 'TRY'
    }
    ssrList: []
    passengerCargoAddress: []
    bookingDateTime: string
    fromSession: boolean
    authorizeKey: null
    shoppingFileId: ID
    taxAmount: number
    shippingAmount: number
    operationResultPromotionUsageList: null
  }
  product: {
    summaryResponse: {
      moduleName: 'Flight' | 'Hotel' | 'Bus'
    }
  }
}

export interface FlightSummaryResponse {
  flightList: {
    flightFareInfo: {
      flightDetailKeys: string[]
      groupId: FlightGroupID
      key: string
      totalPrice: ServicePriceType
      basePrice: ServicePriceType
      taxes: ServicePriceType
      discount: ServicePriceType
      buyFee: {
        code: 'TRY'
        price: ServicePriceType
      }
      fee: {
        code: 'TRY'
        price: ServicePriceType
      }
      passengerPrices: {
        unitPrice: ServicePriceType
        unitBasePrice: ServicePriceType
        unitFee: {
          code: 'TRY'
          price: ServicePriceType
        }
        unitTax: ServicePriceType
        cancelPenalty: null
        changePenalty: null
        passengers: [
          {
            key: null
            name: null
            passengerType: 0
            age: 0
            birthday: string
            gender: 0
          },
        ]
        taxInfos: [
          {
            key: string
            value: string
          },
          {
            key: string
            value: string
          },
        ]
        serviceCharges: [
          {
            code: string
            canApplyAmount: boolean
            confirmPassenger: boolean
            price: ServicePriceType
            desciption: null
          },
        ]
      }[]
      taxInfos: null
      serviceCharges: {
        code: string
        canApplyAmount: boolean
        confirmPassenger: boolean
        price: ServicePriceType
        desciption: null
      }[]
    }
    flightDetail: {
      key: string
      groupId: FlightGroupID
      flightSegmentKeys: string[]
      travelTime: string
      direction: 1 | 0
      isDomestic: boolean
      isOWCCombinable: boolean
      isPromotional: boolean
      reservable: boolean
      freeVolatileData: object
    }
    flightSegments: [
      {
        key: string
        groupId: FlightGroupID
        origin: {
          code: string
          isDomestic: boolean
          iata: string[]
          type: number
          id: ID
        }
        destination: {
          code: string
          isDomestic: boolean
          iata: string[]
          type: number
          id: ID
        }
        departureTime: string
        arrivalTime: string
        flightTime: string
        operatingAirline: {
          code: string
          value: string
          countryCode: string
        }
        marketingAirline: {
          code: string
          value: string
          countryCode: string
        }
        flightNumber: string
        cabinClass: number
        bookingCode: string
        equipment: string
        isMeal: boolean
        quota: number
        baggageAllowance: {
          maxWeight: {
            value: number
            unit: number
          }
          piece: {
            pieceCount: number
          }
        }
        freeVolatileData: object
      },
    ]
    flightPackageInfos: []
  }[]
  flightFareInfo: {
    flightDetailKeys: string[]
    groupId: FlightGroupID
    key: string
    totalPrice: ServicePriceType
    basePrice: ServicePriceType
    taxes: ServicePriceType
    discount: ServicePriceType
    buyFee: {
      code: 'TRY'
      price: ServicePriceType
    }
    fee: {
      code: 'TRY'
      price: ServicePriceType
    }
    passengerPrices: [
      {
        unitPrice: ServicePriceType
        unitBasePrice: ServicePriceType
        unitFee: {
          code: 'TRY'
          price: ServicePriceType
        }
        unitTax: ServicePriceType
        cancelPenalty: null
        changePenalty: null
        passengers: {
          key: null
          name: null
          passengerType: 0
          age: 0
          birthday: '0001-01-01T00:00:00'
          gender: 0
        }[]
        taxInfos: {
          key: string
          value: string
        }[]
        serviceCharges: {
          code: string
          canApplyAmount: boolean
          confirmPassenger: boolean
          price: ServicePriceType
          desciption: null
        }[]
      },
    ]
    taxInfos: null
    serviceCharges: {
      code: string
      canApplyAmount: boolean
      confirmPassenger: boolean
      price: ServicePriceType
      desciption: null
    }[]
  }
  flightPackageInfos: []
  isReservable: boolean
  hasOwc: boolean
  activeFlightTripKind: number
  sessionToken: string
  airportList: {
    [key: string]: {
      id: ID
      code: string
      value: {
        langCode: string
        value: string
      }[]
      countryCode: string
      country: string
      city: string
    }
  }
  airlineList: {
    [key: string]: string
  }
  applyCancelationInsurance: boolean
  buyInsurancePrice: number
  sellInsurancePrice: number
  showOnlyInsurancePrice: number
  totalPrice: number
  priceCurrency: 'TRY'
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: {
    [key: string]: ServicePriceType
  }
  financellDiscount: ServicePriceType
  moduleName: string
}

export interface HotelSummaryResponse {
  searchToken: string
  sessionToken: string
  destinationSlug: string
  hotelSlug: null
  roomGroup: {
    hotelId: ID
    hotelKey: string
    hotel: {
      id: ID
      name: string
      slug: string
      zip_code: string
      address: string
      destination: string
      country_code: string
      location: number[]
      phone: string
      email: string
      currency: string
      meal_type: string
      nearby: string[]
      nearby_info: null
      checkin_from: string
      checkout_to: string
      fax: null
      nr_rooms: number
      stars: number
      availability_score: null
      max_free_child_age: 0
      min_free_child_age: null
      images: {
        category: 51
        tag: ''
        original: 'https://cdng.jollytur.com/files/cms/media/hotel/d98de462-ca8d-444d-9933-33c3c5185d0e.jpg'
        large: null
        small: null
        mid: null
        default: boolean
        priority: 0
      }[]
      themes: number[]
      facilities: number[]
      facility_scopes: null
      tripAdvisor: null
      price: ServicePriceType
      descriptions: {
        hotelInformation: string
        hotelAmenity: string
        roomAmenity: string
        locationInformation: string
        hotelIntroduction: string
        attractionInformation: string
        dining: null
        areaAttractions: null
        recreation: null
        policy: null
        spa: null
        whatToExpect: null
        businessAmenities: null
        beachPool: string
        honeymoonInformation: null
        specialDays: null
        activities: null
        importentInfo: null
      }
      year_built: null | number
      nr_restaurants: number
      nr_bars: number
      nr_halls: null
      last_update: string
      video_list: null
      web_site: null
      deleted: boolean
      destination_slug: string
      old_destination_slug: null
      rating: number
      listing_rate: number
      sales_rate: number
      destination_id: ID
      destination_map: number[]
      search_rate: number
      reviews: null
      nearby_restaurants: null
      comment_info: {
        comments: {
          startDate: '2023-07-14T21:00:00Z'
          endDate: '2023-07-15T21:00:00Z'
          commentDate: '2024-02-13T21:00:00Z'
          name: 'Abdullah '
          surname: 'T***'
          averageScore: 8
          positiveCotent: 'Fiyatından dolayı 1 gün konakladık '
          negativeCotent: ''
          isSuggested: boolean
          reasonLabel: 'İş Seyahati'
          withWhoLabel: '2 Erkek'
          userCountryCode: null
          userCountry: null
          userCity: null
        }[]
        totalComments: number
        averageScore: number
      }
      documents: {
        no: '2022-7-0574'
        type: ''
        description: 'Basit Konaklama Belgesi'
      }[]
      food_drinks: null
    }
    roomDetails: {
      [key: string]: {
        roomKey: string
        description: string
        allotment: number
        bedType: string
        roomType: string
        quantity: number
        size: number
        facilities: {
          id: ID
          name: string
          scope_id: ID
          type_id: ID
          isPaid: boolean
          featured: boolean
          icon_key: null
          priority: number
        }[]
        pensionType: string
        pensionTypeId: number
        extraInformations: null
        images: []
      }
    }
    rooms: {
      passengerKeys: string[]
      nightlyRates: {
        totalPrice: ServicePriceType
        basePrice: ServicePriceType
        taxes: ServicePriceType
        fee: ServicePriceType
      }[]
      addonInfos: []
      freeChildAges: null
      freeNights: number
      discountInformations: null
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
    }[]
    averageRate: ServicePriceType
    nightlyRateTotal: ServicePriceType
    discountDescription: null
    cancelWarrantyPrice: ServicePriceType
    useCancelWarranty: boolean
    prepaid: boolean
    accommodationTax: {
      price: ServicePriceType
      included: boolean
    }
    isSingleMaleRestriction: boolean
    cancellationPolicy: null
    cancellationPolicies: {
      penaltyPrice: ServicePriceType
      optionDate: string
      description: string
    }[]
    additionalInfos: []
    nonRefundable: boolean
    checkInDate: string
    minNight: number
    checkOutDate: string
    earlyBooking: boolean
    addonInfos: []
    packageSearchType: number
    provisionTime: string
    provider: string
    priceDifferenceBackGuarantee: boolean
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
  status: []
  productKey: string
  moduleName: string
  totalPrice: number
  priceCurrency: string
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: null
  financellDiscount: ServicePriceType
}

export interface BusSummaryResponse {
  searchPanel: {
    origin: ID
    destination: ID
    date: string
    receivedProviders: []
    scopeName: string
    searchToken: string
    customerId: ID
    customerUserId: ID
    packageSearchType: number
    tags: []
    domestic: boolean
    sessionToken: string
    traceId: string
    returnDiagnostics: number
    appName: string
    scopeCode: string
    logSessionToken: null
    logSearchToken: null
  }
  busJourney: {
    id: ID
    companyId: ID
    company: string
    busType: string
    totalSeats: number
    availableSeats: number
    bus: {
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
      description: ''
      available: boolean
    }
    totalCommission: ServicePriceType
    buyServiceFee: number
    sellServiceFee: number
    features: []
    origin: string
    originId: ID
    destination: string
    destinationId: ID
    isActive: boolean
    cancellationOffset: string
    hasBusShuttle: boolean
    isHesCodeRequired: boolean
    disableSingleSeatSelection: boolean
    changeOffset: number
    selectedSeats: {
      no: number
      status: number
      sideStatus: number
      type: null
      paxId: number
      paxType: number
      gender: number
      age: number
      discount: ServicePriceType
      totalPrice: ServicePriceType
      servicePrice: ServicePriceType
      basePrice: ServicePriceType
      taxes: ServicePriceType
      totalCommission: ServicePriceType
      buyServiceFee: number
      sellServiceFee: number
    }[]
    routeInfos: {
      destination: string
      priority: number
      departureDate: string
      arrivalDate: string
      locationPointId: ID
      locationPoint: string
    }[]
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
  searchToken: string
  sessionToken: string
  moduleName: 'Bus'
  totalPrice: number
  priceCurrency: string
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: null
  financellDiscount: ServicePriceType
}
