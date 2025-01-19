export interface HotelSearchResultHotelInfo {
  id: ID
  name: string
  slug: string
  zip_code: string | null
  address: string
  destination: string
  country_code: string
  location: number[]
  phone: string | null
  email: string | null
  currency: string
  meal_type: string
  nearby: string[] | [] | null
  checkin_from: string
  checkout_to: string
  fax: string | null
  nr_rooms: null | number
  stars: number
  availability_score: null
  max_free_child_age: null | number
  min_free_child_age: null | number
  images: {
    category: number
    tag: string
    original: null
    large: string
    small: null | string
    mid: null | string
    default: boolean
    priority: number
  }[]
  themes: number[] | []
  facilities: number[] | []
  facility_scopes: null
  tripAdvisor: null
  price: ServicePriceType
  descriptions: null
  year_built: null | number | string
  nr_restaurants: null | number
  nr_bars: null | number
  nr_halls: null | number
  last_update: string
  video_list: null | string[]
  web_site: '' | string | null
  deleted: boolean
  destination_slug: string | null
  old_destination_slug: null
  rating: number
  listing_rate: number
  sales_rate: number
  destination_id: ID
  destination_map: number[]
  search_rate: number
  reviews: null
  nearby_restaurants: null
  nearby_info: null | string
  comment_info: null | {
    comments: null | string
    totalComments: number
    averageScore: number
  }
  documents: null
  food_drinks: null
}

export interface HotelSearchResultItemType {
  hotelId: ID
  hotelKey: string
  hotel: null
  roomDetails: null
  rooms: {
    passengerKeys: string[]
    nightlyRates: []
    addonInfos: []
    freeChildAges:
      | null
      | {
          ageFrom: number
          ageTo: number
          whichChild: number
        }[]
    freeNights: 0
    discountInformations:
      | {
          rate: number
          title: string
          description: null
        }[]
      | null
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
  cancellationPolicies: null
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
  passengerPrices: null
  taxInfos: null
  serviceCharges: null
}

export interface HotelSearchResultApiResponse {
  data: {
    status: boolean
    message: null
    hasMoreResponse: boolean
    executionTime: string
    searchResults: [
      {
        requestKey: null
        hasMorePage: boolean
        hotelInfos: HotelSearchResultHotelInfo[]
        roomDetails: null | {
          [key: string]: {
            roomKey: string
            description: null
            allotment: number
            bedType: string
            roomType: null
            quantity: number
            size: number
            facilities: null
            pensionType: string
            pensionTypeId: number
            extraInformations: null
            images: null
          }
        }
        passengers: null
        facilityType:
          | null
          | {
              id: ID
              name: string
              priority: number
              facilities: null
            }[]
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
        pensionTypes:
          | null
          | {
              id: ID
              type: string
              sorting: null
            }[]
        themes: {
          id: ID
          themeName: string
          icon: null | string
          priority: number
        }[]
        destinationsInfo: {
          id: ID
          parentId: ID
          name: string
          count: number
          subDestinationInfos: null
        }[]
        totalHotelFilterFound: number
        totalHotelFound: number
        maxPrice: ServicePriceType
        minPrice: ServicePriceType
        items: [] | HotelSearchResultItemType[]
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
      },
    ]
  }
  message: null
  code: number
  token: null
  clientIP: null
  appName: null
  sessionToken: string
  userAuthenticationToken: null
  eventMessageList: []
}

export interface HotelDetailRoom {
  passengerKeys: string[]
  nightlyRates: {
    totalPrice: ServicePriceType
    basePrice: ServicePriceType
    taxes: ServicePriceType
    fee: ServicePriceType
  }[]
  addonInfos: []
  freeChildAges: {
    ageFrom: number
    ageTo: number
    whichChild: number
  }[]
  freeNights: number
  discountInformations: {
    rate: number
    title: string
    description: null | string
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

export interface HotelDetailRoomItem {
  hotelId: ID
  hotelKey: string
  hotel: null
  roomDetails: null
  rooms: HotelDetailRoom[]
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
      name: null | string
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

export interface HotelDetailRoomDetail {
  roomKey: string
  description: string
  allotment: number
  bedType: string | null
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
    icon_key: null | string
    priority: number
  }[]
  pensionType: string
  pensionTypeId: ID
  extraInformations: null
  images: {
    url: string
    thumbnailUrl: string
    title: '' | null
    isDefault: boolean
    width: number
  }[]
}

export interface HotelDetailApiResponseData {
  hotelDetailResponse: {
    hotelInfo: {
      hotel: {
        id: ID
        name: string
        slug: string
        zip_code: string
        address: string
        destination: string
        country_code: string
        location: number[]
        phone: string | null
        email: string | null
        currency: string
        meal_type: string
        nearby: string[]
        nearby_info: {
          place_id: null
          type: string
          location: null
          name: string
          icon: null
          direction_mode: string
          distance: string
          duration: null
        }[]
        checkin_from: string
        checkout_to: string
        fax: null
        nr_rooms: number
        stars: number
        availability_score: null
        max_free_child_age: number
        min_free_child_age: null
        images: {
          category: number
          tag: string
          original: string
          large: null | string
          small: null | string
          mid: null | string
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
          roomAmenity: string
          locationInformation: string
          hotelIntroduction: string
          attractionInformation: string
          dining: string | null
          areaAttractions: string | null
          recreation: string | null
          policy: null
          spa: null
          whatToExpect: null
          businessAmenities: null
          beachPool: string
          honeymoonInformation: string | null
          specialDays: null
          activities: string | null
        }
        year_built: null
        nr_restaurants: number
        nr_bars: number
        nr_halls: null | number
        last_update: string
        video_list: string[]
        web_site: string
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
        comment_info: null
        documents: {
          no: string
          type: string
          description: string
        }[]
        food_drinks: {
          area: string
          area_type: string
          service: string
          description: string
          start_time: string
          end_time: string
          season: string
          is_paid: boolean
          priority: number
        }[]
      }
      mapping: {
        value: string
        field: null | string
        provider: string
      }[]
      facilityTypes: {
        id: ID
        name: string
        priority: number
        facilities:
          | {
              id: ID
              name: string
              scope_id: number
              type_id: number
              isPaid: boolean
              featured: boolean
              icon_key: null | string
              priority: number
            }[]
          | []
      }[]
      themes: {
        id: ID
        themeName: string
        icon: string | null
        priority: number
      }[]
      imageCategories: {
        id: ID
        name: string
        priority: number
      }[]
      tripAdvisor: null
    }
    hotelMinPrice: ServicePriceType
    roomDetails: null | { [key: string]: HotelDetailRoomDetail }
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
    rooms: {
      childAges: number[] | []
      adult: number
      child: number
      infant: number
      student: number
      senior: number
      military: number
    }[]
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
}
