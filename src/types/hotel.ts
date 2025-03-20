interface HotelInfo {
  id: ID
  name: string
  slug: string
  zip_code: string
  address: string
  destination: string
  country_code: string
  location: [number, number]
  phone: string | null
  email: string | null
  currency: string | null
  meal_type: string | null
  nearby: string[] | null
  checkin_from: string
  checkout_to: string
  fax: string | null
  nr_rooms: null | number
  stars: number
  availability_score: null
  max_free_child_age: null | number
  min_free_child_age: null | number
  images: {
    category: number | null
    tag: string
    original: null | string
    large: string
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
  descriptions: null
  year_built: null
  nr_restaurants: null | number
  nr_bars: null | number
  nr_halls: null
  last_update: string
  video_list: null | []
  web_site: null | string
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
  comment_info: null | {
    comments: null | string
    totalComments: number
    averageScore: number
  }
  documents: null
}

interface Facilities {
  id: ID
  name: string
  scope_id: number
  type_id: ID
  isPaid: boolean
  featured: boolean
  icon_key: null
  priority: number
}

interface Themes {
  id: ID
  themeName: string
  icon: null
  priority: 0
}

interface DestinationsInfo {
  id: ID
  parentId: ID
  name: string
  count: number
  subDestinationInfos: null
}

interface Rooms {
  childAges: number[]
  adult: number
  child: number
  infant: number
  student: number
  senior: number
  military: number
}

export interface HotelSearchRequestParams {
  hotelSearchResponse: {
    requestKey: null
    hasMorePage: false
    hotelInfos: HotelInfo[]
    roomDetails: null
    passengers: null
    facilityType: null
    facilities: Facilities[]
    pensionTypes: null
    themes: Themes[]
    destinationsInfo: DestinationsInfo[]
    totalHotelFilterFound: number
    totalHotelFound: number
    maxPrice: ServicePriceType
    minPrice: ServicePriceType
    items: []
    sessionToken: null
    traceId: null
    isSucceeded: false
    diagnostics: {
      sessionToken: null
      providerId: 0
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
  }
  hotelSearchApiRequest: {
    hotelSearchModuleRequest: {
      id: ID
      name: string
      slug: string
      location: [number, number]
      northeast: null
      southwest: null
      type: number
      countryCode: string
      checkInDate: string
      checkOutDate: string
      rooms: Rooms[]
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
      isAvailabilityResult: false
      isSocketConnected: false
      extentionData: { [key: string]: string }
      sessionToken: string
      apiRoute: null
      apiAction: null
      appName: null
      scopeName: null
      searchToken: string
      scopeCode: string
    }
    sessionToken: string
    apiRoute: null
    apiAction: null
    appName: string
    scopeName: string
    searchToken: string
    scopeCode: string
    customerId: number
    customerUserId: number
  }
}
