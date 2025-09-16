export interface CyprusSearchResultsApiResponse {
  flights: null
  transfers: null
  requestKey: null
  hasMorePage: boolean
  hotelInfos: {
    id: number
    name: string
    slug: string
    zip_code: string | null
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
    checkin_from: ''
    checkout_to: ''
    fax: ''
    nr_rooms: null
    stars: number
    availability_score: null
    max_free_child_age: null
    min_free_child_age: null
    images: {
      category: number
      tag: string
      original: null | string
      large: string
      small: null
      mid: null
      default: boolean
      priority: number
    }[]
    themes: []
    facilities: []
    facility_scopes: null
    tripAdvisor: null
    price: ServicePriceType
    descriptions: null
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
    destination_map: [number]
    search_rate: number
    reviews: null
    nearby_restaurants: null
    comment_info: null | {
      comments: null
      totalComments: number
      averageScore: number
    }
    documents: null
    food_drinks: null
    can_coupon_used: boolean
  }[]
  roomDetails: {
    [key: string]: {
      roomKey: string
      description: null
      allotment: number
      bedType: null
      roomType: string
      quantity: number
      size: number
      facilities: null
      pensionType: string
      pensionTypeId: number
      extraInformations: null
      images: null
    }
  }
  passengers: {
    [key: string]: {
      key: string
      name: null
      passengerType: number
      age: number
      birthday: string
      gender: number
    }
  }
  facilityType: null
  facilities: null
  pensionTypes: null
  themes: null
  destinationsInfo: null
  totalHotelFilterFound: 0
  totalHotelFound: number
  maxPrice: ServicePriceType
  minPrice: ServicePriceType
  items: {
    hotelId: number
    hotelKey: string
    hotel: null | {
      id: number
      name: string
      slug: string
      zip_code: string
      address: string
      destination: string
      country_code: 'trnc'
      location: [number, number]
      phone: string | null
      email: string | null
      currency: string | null
      meal_type: string | null
      nearby: []
      nearby_info: null
      checkin_from: string
      checkout_to: string
      fax: string
      nr_rooms: null
      stars: number
      availability_score: null
      max_free_child_age: number
      min_free_child_age: null
      images: {
        category: null
        tag: ''
        original: null
        large: string
        small: null
        mid: null
        default: boolean
        priority: number
      }[]
      themes: [number]
      facilities: number[]
      facility_scopes: null
      tripAdvisor: null
      price: ServicePriceType
      descriptions: null
      year_built: null
      nr_restaurants: null
      nr_bars: null
      nr_halls: null
      last_update: string
      video_list: null
      web_site: string | null
      deleted: boolean
      destination_slug: string
      old_destination_slug: null
      rating: null
      listing_rate: number
      sales_rate: number
      destination_id: number
      destination_map: [number, number]
      search_rate: number
      reviews: null
      nearby_restaurants: null
      comment_info: {
        comments: null
        totalComments: number
        averageScore: number
      }
      documents: null
      food_drinks: null
      can_coupon_used: boolean
    }
    roomDetails: null
    rooms: {
      passengerKeys: string[]
      nightlyRates: {
        totalPrice: ServicePriceType
        basePrice: ServicePriceType
        taxes: ServicePriceType
        fee: ServicePriceType
      }[]
      addonInfos: null
      freeChildAges:
        | null
        | {
            whichChild: number
            ageFrom: number
            ageTo: number
          }[]
      freeNights: 0
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
    discountDescription: ''
    cancelWarrantyPrice: ServicePriceType
    useCancelWarranty: boolean
    prepaid: boolean
    accommodationTax: {
      price: ServicePriceType
      included: boolean
    }
    isSingleMaleRestriction: null
    cancellationPolicy: null
    cancellationPolicies: null
    additionalInfos: null
    nonRefundable: boolean
    checkInDate: string
    minNight: 0
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
    passengerPrices: null
    taxInfos: null
    serviceCharges: null
  }[]
  sessionToken: null
  traceId: string
  isSucceeded: boolean
  diagnostics: {
    sessionToken: null
    providerId: number
    providerName: string
    generatingRequestTime: string
    callingServiceTime: string
    generatingResponseTime: string
    subDiagnostics: {
      sessionToken: null
      providerId: number
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
    }[]
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
}
