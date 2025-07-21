export type OperationResultWithBookingCodeResponse<T> = {
  hotelCancelWarrantyPriceStatus: {
    selectingCancelWarranty: boolean
    hasHotelWarranty: boolean
    cancelWarrantyPrice: number
    hotelWarrantyDiscountSelected: boolean
    totalPrice: number
    dayCount: number
    couponActive: boolean
  } | null
  operationViewData: { operationResultViewData: OperationResultViewData }
  summaryResponse: {
    summaryResponse: T
  }
}
export type OperationResultViewData = {
  modules: [number]
  passengers: {
    type: number
    gender: number
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
    marketingAirlineCode: ''
    isRoundedTrip: boolean
    module: number
    groupOrderIndex: number
    localPassengerSequenceNo: number
    localRelatedPassengerSequenceNo: number
    discount: ServicePriceType
    productItemId: ID
  }[]
  billingInformation: {
    billingName: string
    isCompany: boolean
    address: string
    taxNo: null | string
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
    sellingCurrency: string
  }
  ssrList: null
  passengerCargoAddress: null
  bookingDateTime: string
  fromSession: boolean
  authorizeKey: null
  shoppingFileId: ID
  taxAmount: number
  shippingAmount: number
  operationResultPromotionUsageList: null
}
export type CarBookingDetailApiResponse = {
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
        imageUrl: null
        vendorUrl: null
        vendorName: null
        airConditioning: boolean
        automaticTransmission: boolean
        transmissionDrive: number
        fuelType: number
        included: []
        navigationSystem: {
          isAvailable: boolean
          isIncluded: boolean
        }
        baggages: {
          big: null
          small: null
        }
        carGroupName: string
        seatCount: null
        deposit: ServicePriceType
        kminCluded: null
        addKmRate: ServicePriceType
        minDriverAge: number
        licenseYear: number
        brand: null
        model: null
        deliveryType: string
      }
      carIncluded: []
      carInsurances: []
      carExtraOption: []
      oneWay: ServicePriceType
      orginalTotalPrice: ServicePriceType
      carMessage: {
        showDetail: boolean
        message: null
        showExtras: boolean
      }
      servicePrice: ServicePriceType
      totalCommission: ServicePriceType
      buyServiceFee: number
      sellServiceFee: number
      key: string
      totalPrice: ServicePriceType
      basePrice: ServicePriceType
      taxes: ServicePriceType
      discount: ServicePriceType
      buyFee: ServiceFeePriceType
      fee: ServiceFeePriceType
      passengerPrices: [
        {
          unitPrice: ServicePriceType
          unitBasePrice: ServicePriceType
          unitFee: ServiceFeePriceType
          unitTax: ServicePriceType
          cancelPenalty: null
          changePenalty: null
          passengers: null
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
    availableSpecialRequests: object
    sessionToken: string
    traceId: string
    isSucceeded: boolean
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
    appName: string
    scopeCode: string
    logSessionToken: string
    logSearchToken: string
  }
  pickupStation: null
  returnStation: null
  searchReponse: null
  carRentalSearchPanel: {
    origin: {
      id: ID
      code: null
      countryCode: null
      name: string
      isDomestic: boolean
      providerName: null
    }[]
    destination: {
      id: ID
      code: null
      countryCode: null
      name: string
      isDomestic: boolean
      providerName: null
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
    scopeName: string
    searchToken: string
    scopeCode: string
  }
  moduleName: 'CarRental'
  totalPrice: number
  priceCurrency: 'TRY'
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: {
    [key: string]: ServicePriceType
  }
  financellDiscount: ServicePriceType
}
export type HotelBookingDetailApiResponse = {
  searchToken: string
  sessionToken: string
  destinationSlug: null
  hotelSlug: null
  roomGroup: {
    hotelId: ID
    hotelKey: string
    hotel: {
      id: ID
      name: string
      slug: null
      zip_code: null
      address: null | string
      destination: null | string
      country_code: null
      location: null
      phone: null
      email: null
      currency: null
      meal_type: null
      nearby: null
      nearby_info: null
      checkin_from: null
      checkout_to: null
      fax: null
      nr_rooms: null
      stars: null
      availability_score: null
      max_free_child_age: null
      min_free_child_age: null
      images: null | { original: string }[]
      themes: null
      facilities: null
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
      web_site: null
      deleted: boolean
      destination_slug: null
      old_destination_slug: null
      rating: number
      listing_rate: number
      sales_rate: number
      destination_id: number
      destination_map: null
      search_rate: number
      reviews: null
      nearby_restaurants: null
      comment_info: null
      documents: null
      food_drinks: null
      can_coupon_used: boolean
    }
    roomDetails: {
      [key: string]: {
        roomKey: ''
        description: ''
        allotment: number
        bedType: ''
        roomType: string
        quantity: 2
        size: 0.0
        facilities: {
          id: 24855
          name: 'Lcd TV'
          scope_id: 0
          type_id: 0
          isPaid: boolean
          featured: boolean
          icon_key: null
          priority: 0
        }[]
        pensionType: string
        pensionTypeId: number
        extraInformations: string[]
        images: null
      }
    }
    rooms: {
      passengerKeys: null
      nightlyRates: null
      addonInfos: null
      freeChildAges: null
      freeNights: 0
      discountInformations: null
      key: ''
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
    prepaid: null
    accommodationTax: null
    isSingleMaleRestriction: null
    cancellationPolicy: string
    cancellationPolicies: {
      penaltyPrice: ServicePriceType
      optionDate: string
      description: string
    }[]
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
      unitPrice: ServicePriceType
      unitBasePrice: ServicePriceType
      unitFee: ServiceFeePriceType
      unitTax: ServicePriceType
      cancelPenalty: null
      changePenalty: null
      passengers: {
        key: null
        name: null
        passengerType: number
        age: number
        birthday: string
        gender: number
      }[]
      taxInfos: {
        key: string
        value: string
      }[]
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
    serviceCharges: null
  }
  status: null
  productKey: string
  moduleName: string
  totalPrice: number
  priceCurrency: string
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: {
    [key: string]: ServicePriceType
  }
  financellDiscount: ServicePriceType
}
export enum ActiveFlightTripKind {
  ONEWAY,
  ROUNDTRIP,
}

export type FlightRefundApiResponse = [
  {
    operationResultViewData: {
      modules: [1]
      passengers: {
        type: number
        gender: number
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
        discount: ServicePriceType
        productItemId: ID
      }[]
      billingInformation: null
      paymentInformation: {
        basketTotal: number
        basketDiscountTotal: number
        collectingTotal: number
        financellTotal: null
        mlTotal: number
        rateOfInterest: number
        installmentCount: number
        bankName: string
        encryptedCardHolder: string | null
        encryptedCardNumber: string | null
        sellingCurrency: 'TRY'
      }
      ssrList: null
      passengerCargoAddress: null
      bookingDateTime: string
      fromSession: boolean
      authorizeKey: string
      shoppingFileId: ID
      taxAmount: number
      shippingAmount: number
      operationResultPromotionUsageList: null
    }
  },
  {
    summaryResponse: {
      flightList: {
        flightFareInfo: {
          flightDetailKeys: string[]
          groupId: null | 0 | 1
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
              key: null
              name: null
              passengerType: number
              age: number
              birthday: string
              gender: number
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
              desciption: null | string
            }[]
          }[]
          taxInfos: null
          serviceCharges: {
            code: string
            canApplyAmount: boolean
            confirmPassenger: boolean
            price: ServicePriceType
            desciption: null | string
          }[]
        }
        flightDetail: {
          key: string
          groupId: 0 | 1 | null
          flightSegmentKeys: string[]
          travelTime: string
          direction: number
          isDomestic: boolean
          isOWCCombinable: boolean
          isPromotional: boolean
          reservable: boolean
          freeVolatileData: object
        }
        flightSegments: {
          key: string
          groupId: 0 | 1 | null
          origin: {
            code: '' | string
            isDomestic: boolean
            iata: []
            type: number
            id: ID
          }
          destination: {
            code: '' | string
            isDomestic: boolean
            iata: []
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
          equipment: string | null
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
        }[]
        flightPackageInfos: []
      }[]
      flightFareInfo: {
        flightDetailKeys: string[]
        groupId: 0 | 1 | null
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
            key: null
            name: null
            passengerType: number
            age: number
            birthday: string
            gender: number
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
            desciption: null | string
          }[]
        }[]
        taxInfos: null
        serviceCharges: {
          code: string
          canApplyAmount: boolean
          confirmPassenger: boolean
          price: ServicePriceType
          desciption: null | string
        }[]
      }
      flightPackageInfos: []
      isReservable: boolean
      hasOwc: boolean
      activeFlightTripKind: ActiveFlightTripKind
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
      productKey: string
      moduleName: 'Flight'
      totalPrice: number
      priceCurrency: 'TRY'
      loyaltyMultiple: number
      couponDiscountList: null
      extraCharges: {
        [key: string]: ServicePriceType
      }
      financellDiscount: ServicePriceType
    }
  },
]

export type TourBookingDetailApiResponse = {
  package: {
    title: string
    description: string
    countries: null
    cities: []
    group: {
      code: null
      title: null
    }
    region: null
    imageUrl: ''
    startDate: string
    endDate: string
    tourTime: number
    hotelInformations: {
      name: string
      rating: number
    }[]
    priceInformations: null
    quota: number
    discountDescription: ''
    extraServices: null
    detail: {
      images: null
      countryInformation: null
      extraTours: null
      tourProgram: null
      departureInformation: null
      includedInformation: null
      notIncludedInformation: null
      flightInformation: []
      hotelRooms: null
      additionalSSRData: null
    }
    tlPrice: ServicePriceType
    calculatedId: ''
    slug: ''
    slugId: ''
    isDomestic: boolean
    commission: number
    key: ''
    totalPrice: ServicePriceType
    basePrice: ServicePriceType
    taxes: ServicePriceType
    discount: ServicePriceType
    buyFee: ServiceFeePriceType
    fee: ServiceFeePriceType
    passengerPrices: null
    taxInfos: null
    serviceCharges: {
      code: string
      canApplyAmount: boolean
      confirmPassenger: boolean
      price: ServicePriceType
      desciption: null
    }[]
  }
  detail: {
    images: null
    countryInformation: null
    extraTours: null
    tourProgram: null
    departureInformation: null
    includedInformation: null
    notIncludedInformation: null
    flightInformation: []
    hotelRooms: null
    additionalSSRData: null
  }
  adultCount: null
  childs: null
  sessionToken: string
  searchToken: string
  tourExtraServiceToDetailReturnPath: null
  location: null
  moduleName: 'Tour'
  totalPrice: number
  priceCurrency: string
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: {
    [key: string]: ServicePriceType
  }
  financellDiscount: ServicePriceType
}

export type FlightBookDetailApiResponse = {
  flightList: {
    flightFareInfo: {
      flightDetailKeys: string[]
      groupId: 0 | 1 | null
      key: '719233'
      totalPrice: {
        value: 3131
        currency: 'TRY'
        rateValue: null
      }
      basePrice: {
        value: 2381.7
        currency: 'TRY'
        rateValue: null
      }
      taxes: {
        value: 549.3
        currency: 'TRY'
        rateValue: null
      }
      discount: {
        value: 150
        currency: 'TRY'
        rateValue: null
      }
      buyFee: {
        code: 'TRY'
        price: {
          value: 200
          currency: 'TRY'
          rateValue: null
        }
      }
      fee: {
        code: 'TRY'
        price: {
          value: 200
          currency: 'TRY'
          rateValue: null
        }
      }
      passengerPrices: [
        {
          unitPrice: {
            value: 3131
            currency: 'TRY'
            rateValue: null
          }
          unitBasePrice: {
            value: 2381.7
            currency: 'TRY'
            rateValue: null
          }
          unitFee: {
            code: 'TRY'
            price: {
              value: 200
              currency: 'TRY'
              rateValue: null
            }
          }
          unitTax: {
            value: 549.3
            currency: 'TRY'
            rateValue: null
          }
          cancelPenalty: null
          changePenalty: null
          passengers: [
            {
              key: null
              name: null
              passengerType: 0
              age: 0
              birthday: '0001-01-01T00:00:00'
              gender: 0
            },
          ]
          taxInfos: [
            {
              key: 'YR'
              value: '400.00'
            },
            {
              key: 'VQ'
              value: '149.30'
            },
          ]
          serviceCharges: [
            {
              code: 'Fee'
              canApplyAmount: boolean
              confirmPassenger: boolean
              price: {
                value: 200
                currency: 'TRY'
                rateValue: null
              }
              desciption: null
            },
          ]
        },
      ]
      taxInfos: null
      serviceCharges: [
        {
          code: 'Fee'
          canApplyAmount: boolean
          confirmPassenger: boolean
          price: {
            value: 200
            currency: 'TRY'
            rateValue: null
          }
          desciption: null
        },
      ]
    }
    flightDetail: {
      key: string
      groupId: 0 | 1 | null
      flightSegmentKeys: string[]
      travelTime: string
      direction: number
      isDomestic: boolean
      isOWCCombinable: boolean
      isPromotional: boolean
      reservable: boolean
      freeVolatileData: object
    }
    flightSegments: {
      key: string
      groupId: 0 | 1 | null
      origin: {
        code: string
        isDomestic: boolean
        iata: []
        type: number
        id: ID
      }
      destination: {
        code: string
        isDomestic: boolean
        iata: []
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
      equipment: ''
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
    }[]
    flightPackageInfos: []
  }[]
  flightFareInfo: {
    flightDetailKeys: string[]
    groupId: 0 | 1 | null
    key: string
    totalPrice: ServicePriceType
    basePrice: ServicePriceType
    taxes: ServicePriceType
    discount: ServicePriceType
    buyFee: ServiceFeePriceType
    fee: ServiceFeePriceType
    passengerPrices: [
      {
        unitPrice: ServicePriceType
        unitBasePrice: ServicePriceType
        unitFee: ServiceFeePriceType
        unitTax: ServicePriceType
        cancelPenalty: null
        changePenalty: null
        passengers: {
          key: null
          name: null
          passengerType: number
          age: number
          birthday: string
          gender: number
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
  productKey: string
  moduleName: 'Flight'
  totalPrice: number
  priceCurrency: string
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: {
    [key: string]: ServicePriceType
  }
  financellDiscount: ServicePriceType
}

export type TransferBookDetailApiResponse = {
  selectResponse: {
    requestId: null
    selectedVehicleCount: number
    extraServiceIds: null
    extraServiceInfo: null
    pickupPointName: string
    pickupPointType: number
    pickupLocationName: string
    pickupDate: string
    pickupInfo: string
    pickupDescription: string
    dropPointName: string
    dropPointType: number
    dropLocationName: string
    dropInfo: string
    dropDescription: string
    adultPassengerCount: number
    childrenPassengerCount: number
    babyPassengerCount: number
    transferVehicle: {
      productKey: null
      id: ID
      partnerId: ID
      vehicleType: number
      vehicleName: null
      vehicleTitle: string
      transferInfo: null | {
        vehiclePhotoUrl: string
      }
      extraServices: null
      status: null
      transferData: {
        bookDetail: {
          brmFactor: null
          markupDetail: null
          priceWithoutMarkup: null
          priceWithMarkup: null
          suggestedVehicleCount: number
          sortPrice: null
          extraServices: null
          buyServiceFee: 0
          sellServiceFee: 0
          sellBaseFareAddOn: 0
        }
        selectedTransferDetail: null
      }
    }
    sessionToken: null
    traceId: null
    isSucceeded: boolean
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
  bookingResponse: null
  searchToken: string
  sessionToken: string
  moduleName: 'Transfer'
  totalPrice: number
  priceCurrency: 'TRY'
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: {
    [key: string]: ServicePriceType
  }
  financellDiscount: ServicePriceType
}

export type BusBookDetailApiResponse = {
  searchPanel: null
  busJourney: {
    id: ID
    companyId: ID
    company: string
    busType: null
    totalSeats: number
    availableSeats: number
    bus: {
      kind: null
      trackingNo: null
      lineNo: number
      origin: null
      destination: null
      departureDate: string
      arrivalDate: string
      duration: string
      originalPrice: ServicePriceType
      internetPrice: ServicePriceType
      busName: null
      policy: null
      features: null
      description: null
      available: null
    }
    totalCommission: ServicePriceType
    buyServiceFee: number
    sellServiceFee: number
    features: null
    origin: string
    originId: ID
    destination: string
    destinationId: ID
    isActive: boolean
    cancellationOffset: number
    hasBusShuttle: boolean
    isHesCodeRequired: boolean
    disableSingleSeatSelection: boolean
    changeOffset: number
    selectedSeats: {
      no: number
      status: number
      sideStatus: number
      type: number
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
      isSelectable: boolean
    }[]
    routeInfos: null
    key: null
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
    passengerPrices: null
    taxInfos: null
    serviceCharges: null
  }
  searchToken: string
  sessionToken: string
  moduleName: 'Bus'
  totalPrice: number
  priceCurrency: 'TRY'
  loyaltyMultiple: number
  couponDiscountList: null
  financellDiscount: ServicePriceType
}
