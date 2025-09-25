import { HotelRoomOptionTypes } from '@/modules/hotel/searchParams'
import {
  HotelDetailResponseHotelInfo,
  HotelDetailRoomDetail,
  HotelDetailRoomItem,
} from '../hotel/types'

export interface CyprusHotel {
  hotel: {
    id: number
    name: string
    slug: string
    zip_code: string
    address: string
    destination: string
    country_code: 'trnc'
    location: [number, number]
    phone: ''
    email: ''
    currency: ''
    meal_type: ''
    nearby: []
    nearby_info: null
    checkin_from: string
    checkout_to: string
    fax: ''
    nr_rooms: null
    stars: number
    availability_score: null
    max_free_child_age: number
    min_free_child_age: null
    images: {
      category: null
      tag: ''
      original: string
      large: null
      small: null
      mid: null
      default: boolean
      priority: number
    }[]
    themes: number[]
    facilities: number[]
    facility_scopes: null
    tripAdvisor: null
    price: ServicePriceType
    descriptions: CyprusHotelDetailDescription
    year_built: null
    nr_restaurants: null
    nr_bars: null
    nr_halls: null
    last_update: string
    video_list: null
    web_site: ''
    deleted: boolean
    destination_slug: string
    old_destination_slug: null
    rating: number
    listing_rate: number
    sales_rate: number
    destination_id: number
    destination_map: [number, number]
    search_rate: number
    reviews: null
    nearby_restaurants: null
    comment_info: {
      comments: {
        startDate: string
        endDate: string
        commentDate: string
        name: string
        surname: string
        averageScore: number
        positiveCotent: string
        negativeCotent: string
        isSuggested: boolean
        reasonLabel: null
        withWhoLabel: null
        userCountryCode: string
        userCountry: string
        userCity: null
      }[]
      totalComments: number
      averageScore: number
    }
    documents: {
      no: string | null
      type: string
      description: string
    }[]
    food_drinks: null
    can_coupon_used: boolean
  }
  hotelMinPrice: ServicePriceType
  mapping: {
    value: string
    field: string | null
    provider: string
  }[]
  facilityTypes: {
    id: number
    name: string
    priority: number
    facilities: {
      id: number
      name: string
      scope_id: number
      type_id: number
      isPaid: boolean
      featured: boolean
      icon_key: null
      priority: number
    }[]
  }[]
  themes: {
    id: number
    themeName: string
    icon: string
    priority: number
  }[]
  imageCategories: []

  isFlight: boolean
  isLoadProducts: boolean
  isSucceeded: boolean
  isTransfer: boolean
}

export interface CyprusHotelDetailDescription {
  hotelInformation: string | null
  hotelAmenity: string | null
  roomAmenity: string | null
  locationInformation: string | null
  hotelIntroduction: string | null
  attractionInformation: string | null
  dining: string | null
  areaAttractions: string | null
  recreation: string | null
  policy: string | null
  spa: string | null
  whatToExpect: string | null
  businessAmenities: string | null
  beachPool: string | null
  honeymoonInformation: string | null
  specialDays: string | null
  activities: string | null
  importentInfo: string | null
}
export interface CyprusHotelDetailApiResponse {
  hotelDetailResponse: {
    hotelInfo: HotelDetailResponseHotelInfo
    hotelMinPrice: ServicePriceType
    roomDetails: { [key: string]: HotelDetailRoomDetail }
    isLoadProducts: boolean
    items: null | HotelDetailRoomItem[]
    validationInformations: {
      age: {
        ageReferenceDate: string
        infantAgeBegin: string
        childAgeBegin: number
        adultAgeBegin: number
        ageCalculationType: number
      }
    }
    availableSpecialRequests: null | object
    sessionToken: null
    traceId: null
    isSucceeded: boolean
    diagnostics: {
      sessionToken: null
      providerId: ID
      providerName: null
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
    appName: null
    scopeCode: string
    logSessionToken: null
    logSearchToken: null
  } | null
  searchPassenger:
    | {
        key: null
        name: null
        passengerType: number
        age: number
        birthday: string
        gender: number
      }[]
    | null
  sessionToken: string
  searchToken: string
  destinationSlug: null
  hotelSlug: null
  productKey: string | null
  isProductValid: boolean
  searchPanel: {
    id: ID
    name: string
    slug: string
    location: number[]
    northeast: null
    southwest: null
    type: number
    countryCode: string
    checkInDate: string
    checkOutDate: string
    rooms: HotelRoomOptionTypes[]
    domestic: boolean
    tags: null
    earlyBooking: boolean
    pageNo: number
    pageSize: number
    languageCode: string
    orderBy: number
    hotelName: null
    maxPrice: number
    minPrice: number
    maxStarRating: number
    minStarRating: number
    maxTripAdvisorRating: number
    minTripAdvisorRating: number
    facilities: null
    pensionTypes: null
    themes: null
    destinationIds: null
    nonRefundable: null
    isAvailabilityResult: boolean
    isSocketConnected: boolean
    extentionData: {
      [key: string]: ID
    }
    sessionToken: string
    apiRoute: null
    apiAction: null
    appName: null
    scopeName: null
    searchToken: string
    scopeCode: string
  }
  isFlight: boolean
  isTransfer: boolean
}

export interface CyprusFlight {
  flightHashData: string
  currency: string
  flightType: string
  flightSegmentList: {
    origin: string
    destination: string
    flightType: string | null
    flightList: {
      departureDate: string
      departureTime: string
      arrivalDate: string
      arrivalTime: string
      flightDetails: {
        flightNo: string
        airline: string
        flightSource: string
        departureDate: string
        departureTime: string
        arrivalDate: string
        arrivalTime: string
        origin: string
        destination: string
        voyageCode: null
        className: string
        classType: string
        seat: number
        totalPrice: ServicePriceType
        key: null
        totalTax: ServicePriceType
        totalServiceFee: ServicePriceType
        priceCode: string
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
        passengerPrices: null
        taxInfos: null
        serviceCharges: null
      }[]
    }[]
  }[]
}

export interface CyprusTransfer {
  transferHashData: string
  currency: string
  departureDate: string
  returnDate: string
  transferSegmentList: {
    transferTitle: string
    transferCode: string
    transferFrom: string
    transferTo: string
    key: null
    totalPrice: ServicePriceType
    priceCode: string
    basePrice: ServicePriceType
    taxes: ServicePriceType
    discount: ServicePriceType
    buyFee: ServiceFeePriceType
    fee: ServiceFeePriceType
    passengerPrices: null
    taxInfos: null
    serviceCharges: null
  }[]
}

export interface CyprusTransferApiResponse {
  flights: CyprusFlight | null
  transfers: CyprusTransfer | null
  hotelInfo: CyprusHotel | null
  sessionToken: string
  searchToken: string
  productKey: string | null
}

export interface CyprusSelectedRoomDetailResponse {
  selectResponse: null
  bookingResponse: null
  segmentData: {
    origin: string
    destination: string
    departureTime: string
    arrivalTime: string
    flightNumber: string
    bookingCode: string
    quota: number
    marketingAirline: {
      code: string
      name: string
    }
    operatingAirline: {
      code: string
      name: string
    }
    cabinClass: string
    baggageAllowance: {
      piece: null
      maxWeight: null
    }
    equipment: ''
    flightTime: string
    freeVolatileData: null
    isMeal: false
  }[]
  searchToken: string
  sessionToken: string
  destinationSlug: null
  hotelSlug: null
  roomGroup: {
    hotelId: number
    hotelKey: string
    hotel: {
      id: number
      name: string
      slug: string
      zip_code: string
      address: string
      destination: string
      country_code: 'trnc'
      location: [number, number]
      phone: ''
      email: ''
      currency: ''
      meal_type: ''
      nearby: []
      nearby_info: null
      checkin_from: string
      checkout_to: string
      fax: ''
      nr_rooms: null
      stars: number
      availability_score: null
      max_free_child_age: number
      min_free_child_age: null
      images: {
        category: null
        tag: ''
        original: string
        large: null
        small: null
        mid: null
        default: boolean
        priority: number
      }[]
      themes: number[]
      facilities: number[]
      facility_scopes: null
      tripAdvisor: null
      price: ServicePriceType
      descriptions: {
        hotelInformation: string
        hotelAmenity: string
        roomAmenity: ''
        locationInformation: string
        hotelIntroduction: ''
        attractionInformation: ''
        dining: null
        areaAttractions: ''
        recreation: ''
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
      year_built: null
      nr_restaurants: null
      nr_bars: null
      nr_halls: null
      last_update: string
      video_list: null
      web_site: ''
      deleted: false
      destination_slug: string
      old_destination_slug: null
      rating: number
      listing_rate: number
      sales_rate: number
      destination_id: number
      destination_map: [number, number]
      search_rate: number
      reviews: null
      nearby_restaurants: null
      comment_info: {
        comments: {
          startDate: string
          endDate: string
          commentDate: string
          name: string
          surname: string
          averageScore: number
          positiveCotent: string
          negativeCotent: string
          isSuggested: boolean
          reasonLabel: null
          withWhoLabel: null
          userCountryCode: string
          userCountry: string
          userCity: null
        }[]
        totalComments: number
        averageScore: number
      }
      documents: {
        no: string | null
        type: string
        description: string
      }[]
      food_drinks: null
      can_coupon_used: false
    }
    roomDetails: {
      [key: string]: {
        roomKey: string
        description: number
        allotment: number
        bedType: string
        roomType: string
        quantity: number
        size: number
        facilities: []
        pensionType: string
        pensionTypeId: number
        extraInformations: null
        images: []
      }
    }
    rooms: {
      totalPrice: ServicePriceType
      basePrice: ServicePriceType
      taxes: ServicePriceType
      fee: ServicePriceType
    }[]
    averageRate: ServicePriceType
    nightlyRateTotal: ServicePriceType
    discountDescription: string | null
    cancelWarrantyPrice: ServicePriceType
    useCancelWarranty: boolean
    prepaid: boolean
    accommodationTax: {
      price: ServicePriceType
      included: boolean
    }
    isSingleMaleRestriction: null
    cancellationPolicy: null
    cancellationPolicies: []
    additionalInfos: null
    nonRefundable: boolean
    checkInDate: string
    minNight: number
    checkOutDate: string
    earlyBooking: boolean
    addonInfos: null
    packageSearchType: number
    provisionTime: string
    provider: string
    priceDifferenceBackGuarantee: boolean
    canCouponUsed: boolean
    key: string
    totalPrice: ServicePriceType
    basePrice: ServicePriceType
    taxes: ServicePriceType
    discount: ServicePriceType
    buyFee: ServiceFeePriceType
    fee: ServiceFeePriceType
    passengerPrices: {
      key: string
      name: null
      passengerType: number
      age: number
      birthday: string
      gender: number
    }[]
    taxInfos: null
    serviceCharges: null
  }
  status: []
  productKey: string
  moduleName: 'CyprusPackage'
  totalPrice: number
  priceCurrency: string
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: null
  financellDiscount: ServicePriceType
}
