export interface CyprusHotelDetailApiResponse {
  destinationSlug: null
  hotelDetailResponse: null | {
    diagnostics: {
      callingServiceTime: '00:00:00'
      generatingRequestTime: '00:00:00'
      generatingResponseTime: '00:00:00'
      lastException: null
      providerId: 0
      providerInfo: null
      providerName: null
      serviceRequestData: null
      serviceResponseData: null
      sessionToken: null
      subDiagnostics: null
      traceId: null
    }
    hotelInfo: {
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
      tripAdvisor: null
    }
    items: {
      hotelId: number
      hotelKey: string
      hotel: null
      roomDetails: null
      rooms: {
        passengerKeys: null
        nightlyRates: {
          totalPrice: ServicePriceType
          basePrice: ServicePriceType
          taxes: ServicePriceType
          fee: ServicePriceType
        }[]
        addonInfos: null
        freeChildAges: null
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
      discountDescription: string | null
      cancelWarrantyPrice: ServicePriceType
      useCancelWarranty: boolean
      prepaid: boolean
      accommodationTax: {
        price: ServicePriceType
        included: boolean
      }
      isSingleMaleRestriction: null | boolean
      cancellationPolicy: null | boolean
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
      passengerPrices: null
      taxInfos: null
      serviceCharges: null
    }[]
    roomDetails: {
      [key: string]: {
        roomKey: string
        description: string | null
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
    validationInformations: {
      age: {
        ageReferenceDate: string
        infantAgeBegin: string
        childAgeBegin: number
        adultAgeBegin: number
        ageCalculationType: 0
      }
    }
    hotelMinPrice: ServicePriceType
  }
  hotelSlug: null
  isProductValid: boolean
  productKey: null
  searchPanel: null
  searchPassenger: null
  searchToken: string
  sessionToken: string
}
