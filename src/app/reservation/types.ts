import { z } from 'zod'
import { GenderEnumIndex } from '@/types/passengerViewModel'

import type {
  AgeCalculationType,
  PassengerTypesEnum,
  PassengerTypesIndexEnum,
} from '@/types/passengerViewModel'

export type PassengerValidationType = {
  declaredAge: z.ZodReadonly<z.ZodString>
  checkinDate: z.ZodReadonly<z.ZodString>
  moduleName: z.ZodReadonly<z.ZodString>
  birthDate_day: z.ZodString
  birthDate_month: z.ZodString
  birthDate_year: z.ZodString
  birthDate: z.ZodString
  citizenNo: z.ZodOptional<z.ZodString>
  firstName: z.ZodString
  gender: z.ZodString
  calculationYearType: z.ZodReadonly<z.ZodNativeEnum<typeof AgeCalculationType>>
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

export type PaymentResponseType = {
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
export type PartialPaymentResponseType = {
  pan: string
  cv2: string
  Ecom_Payment_Card_ExpDate_Year: string
  Ecom_Payment_Card_ExpDate_Month: string
  clientid: string
  amount: string
  oid: string
  okUrl: string
  callbackUrl: string
  failUrl: string
  rnd: string
  storetype: string
  refreshtime: string
  taksit: string
  islemtipi: string
  TranType: string
  Currency: string
  lang: string
  hashAlgorithm: string
  NATIONALIDNO: string
  TRANID: string
  CUSTOMERPHONE: string
  CUSTOMEREMAIL: string
  action: string
  hash: string
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
      moduleName:
        | 'Flight'
        | 'Hotel'
        | 'Bus'
        | 'Transfer'
        | 'CarRental'
        | 'Tour'
        | 'CyprusPackage'
    }
  }
  hotelCancelWarranty: {
    selectingCancelWarranty: boolean
    hasHotelWarranty: boolean
    cancelWarrantyPrice: number
    hotelWarrantyDiscountSelected: boolean
    totalPrice: number
    dayCount: number
    couponActive: boolean
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
        freeVolatileData: {
          ResBookDesigID: {
            SeatsLeft: number
            SeatsLeftSpecified: boolean
            Value: string
          }
          ResBookDesigCode: string
          Baggage: string
          BrandName: string
          Seq: string
        }
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
        category: number
        tag: string | null
        original: string
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

export interface TransferSummaryResponse {
  selectResponse: {
    requestId: string
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
          priceWithoutMarkup: {
            amount: number
            transferCurrencyType: number
          }
          priceWithMarkup: {
            amount: number
            transferCurrencyType: number
          }
          suggestedVehicleCount: number
          sortPrice: number
          extraServices: {
            id: string
            code: string
            title: string
            description: string
            priceWithoutMarkup: {
              amount: number
              transferCurrencyType: number
            }
            priceWithMarkup: {
              amount: number
              transferCurrencyType: number
            }
          }[]
          buyServiceFee: number
          sellServiceFee: number
          sellBaseFareAddOn: number
        }
        selectedTransferDetail: null
      }
    }
    sessionToken: string
    traceId: null
    isSucceeded: boolean
    diagnostics: {
      sessionToken: null
      providerId: ID
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
  bookingResponse: {
    transactionStatus: number
    token: string
    serviceBookingResponse: {
      isEnabled: boolean
      totalPrice: {
        amount: number
        transferCurrencyType: number
      }
    }
    checkoutResponse: {
      carts: {
        cart_id: ID
        cart_code: string
        cart_object: string
        cart_object_id: ID
        cart_mpno: string
        cart_mail: string
        cart_name: string
        cart_sys_prc: string
        cart_sys_cid: number
        cart_usr_prc: string
        cart_usr_cid: number
        cart_end_prc: string
        cart_end_cid: number
        cart_title: string
        cart_infoa: string
        cart_infob: string
        cart_infoc: string
        cart_infod: string
        cart_infoe: string
        cart_pay_case: string
        cart_paya: null
        cart_payb: null
        cart_payc: null
        cart_payd: null
        cart_paye: null
        cart_case: 'done'
        cart_done_date: string
        cart_paid_date: string
        cart_cncl_date: null
        cart_rfnd_date: null
        cart_status: string
      }[]
      bookResponse: {
        vbook_id: 66918
        vbook_code: '308619066'
        vbook_type: 'D'
        vbook_fr: 'Istanbul Havalimanı'
        vbook_fr_a: 'istanbul havalimani'
        vbook_fr_b: 'Alınış Yeri İletmek istediğiniz notlar var ise bu alana girebilirsiniz.'
        vbook_fr_type: '2'
        vbook_fr_type_r: 'Havalimanı'
        vbook_to: 'Kadiköy Park Suites'
        vbook_to_a: 'istanbul havalimani'
        vbook_to_b: 'Bırakılış Yeri  İletmek istediğiniz notlar var ise bu alana girebilirsiniz.'
        vbook_to_type: '3'
        vbook_to_type_r: 'Otel'
        vbook_date: '2025-04-27 12:00:00'
        vbook_name: 'SENOL DENEME'
        vbook_mpno: '+905324234234'
        vbook_mail: 'SENOLK@LIDYATEKNOLOJI.COM'
        vbook_driver_x_: null
        vbook_pax_adt: 1
        vbook_pax_kid: 0
        vbook_pax_bby: 0
        vbook_note_ur: null
        vbook_vehicle_type: 'MINC'
        vbook_vehicle_type_r: 'Mini'
        vbook_info_max_pax: '5'
        vbook_info_max_suitcase: '5 Bavul'
        vbook_info_hour_freeCancel: '24'
        vbook_info_hour_freeChange: '24'
        vbook_info_t_: []
        vbook_feed_: {
          prf: '0'
          lng: 'tr'
        }
        vbook_hash: '109c6d3100f19a13b91de94b166dac36a45be782'
      }[]
      cart_orid: string
      sessionToken: null
      traceId: null
      isSucceeded: boolean
      diagnostics: {
        sessionToken: null
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
    bookingKey: string
    bookingDate: string
    campaignCode: null
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
    appName: string
    scopeCode: string
    logSessionToken: null
    logSearchToken: null
  }
  searchToken: string
  sessionToken: string
  moduleName: string
  totalPrice: number
  priceCurrency: string
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: object
  financellDiscount: ServicePriceType
}

export interface CarSummaryResponse {
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
        baggages: {
          big: object
          small: object
        }
        carGroupName: string
        seatCount: string
        deposit: ServicePriceType
        kminCluded: string
        addKmRate: ServicePriceType
        minDriverAge: number
        licenseYear: number
        brand: null
        model: null
        deliveryType: string
      }
      carIncluded: []
      carInsurances: {
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
      }[]
      carExtraOption: {
        code: string
        calculateInfo: null
        name: string
        totalPrice: ServicePriceType
        maxDay: number
        unitPrice: ServicePriceType
        isSelectable: boolean
        selected: boolean
        isFree: boolean
      }[]
      oneWay: ServicePriceType
      orginalTotalPrice: ServicePriceType
      carMessage: null | string
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
    isSucceeded: boolean
    diagnostics: {
      providerId: ID
      providerName: string
      providerInfo: null
      traceId: null
    }
  }
  pickupStation: {
    location: {
      id: ID
      code: string
      countryCode: string
      name: string
      isDomestic: boolean
      providerName: string
    }
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
  returnStation: {
    location: {
      id: ID
      code: string
      countryCode: string
      name: string
      isDomestic: boolean
      providerName: string
    }
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
  searchReponse: {
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
      baggages: {
        big: object
        small: object
      }
      carGroupName: string
      seatCount: string
      deposit: ServicePriceType
      kminCluded: string
      addKmRate: ServicePriceType
      minDriverAge: number
      licenseYear: number
      brand: null
      model: null
      deliveryType: string
    }
    carIncluded: []
    carInsurances: []
    carExtraOption: {
      code: string
      calculateInfo: null
      name: string
      totalPrice: ServicePriceType
      maxDay: number
      unitPrice: ServicePriceType
      isSelectable: boolean
      selected: boolean
      isFree: boolean
    }[]
    oneWay: ServicePriceType
    orginalTotalPrice: ServicePriceType
    carMessage: null | string
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
  }[]
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
    sessionToken: string
  }
  moduleName: 'CarRental'
  totalPrice: number
  priceCurrency: string
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: null
  financellDiscount: ServicePriceType
}

export interface TourSummaryResponse {
  package: {
    title: string
    description: string
    countries: []
    cities: {
      code: null
      title: string
    }[]
    group: {
      code: null
      title: string
    }
    region: {
      code: null
      title: string
    }
    imageUrl: string
    startDate: string
    endDate: string
    tourTime: number
    hotelInformations: {
      name: string
      rating: number
    }[]
    priceInformations: {
      priceForDouble: ServicePriceType
      priceForSingle: ServicePriceType
      additionalBedPrices: null
      childrenPrices: {
        startAge: number
        endAge: number
        price: ServicePriceType
      }[]
    }
    quota: number
    discountDescription: string
    extraServices: {
      name: string
      unitPrice: ServicePriceType
      unitPriceTl: ServicePriceType
      totalPriceTl: ServicePriceType
      isPackage: boolean
      unitPriceFor: number
      isMandatory: boolean
      mandatoryDescription: string
      amount: number
      extraServiceType: number
      extraServiceCodes: string
      extraServiceValues: string
      commissionTlPrice: ServicePriceType
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
    detail: {
      images: string[]
      countryInformation: {
        name: string
        description: string
        imageUrl: string
      }
      extraTours: []
      tourProgram: {
        title: string
        description: string
      }[]
      departureInformation: string
      includedInformation: string
      notIncludedInformation: string
      flightInformation: string[]
      hotelRooms: {
        key: string
        adultCount: number
        childCount: number
        additionalBedCount: number
      }[]
      additionalSSRData: {
        items: {
          uniqueIdentifier: string
          code: string
          included: boolean
          description: string
          selected: boolean
          required: boolean
          indexNo: number
          data: null
          filters: {
            key: string
            value: string
            indexNo: number
          }[]
        }[]
        owner: {
          type: number
          ownerKey: string
          identifier: string
        }
        subGroups: []
      }
    }
    tlPrice: ServicePriceType
    calculatedId: null
    slug: string
    slugId: string
    isDomestic: boolean
    commission: number
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
  detail: {
    images: string[]
    countryInformation: {
      name: string
      description: string
      imageUrl: string
    }
    extraTours: []
    tourProgram: {
      title: string
      description: string
    }[]
    departureInformation: string
    includedInformation: string
    notIncludedInformation: string
    flightInformation: string[]
    hotelRooms: {
      key: string
      adultCount: number
      childCount: number
      additionalBedCount: number
    }[]
    additionalSSRData: {
      items: {
        uniqueIdentifier: string
        code: string
        included: boolean
        description: string
        selected: boolean
        required: boolean
        indexNo: number
        data: null
        filters: {
          key: string
          value: string
          indexNo: number
        }[]
      }[]
      owner: {
        type: number
        ownerKey: string
        identifier: string
      }
      subGroups: []
    }
  }
  adultCount: string
  childs: null | number[]
  sessionToken: null
  searchToken: null
  tourExtraServiceToDetailReturnPath: null
  location: null
  moduleName: 'Tour'
  totalPrice: number
  priceCurrency: string
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: null
  financellDiscount: ServicePriceType
}

export interface TransferSummaryResponseViewDataResponser {
  selectResponse: {
    requestId: ID
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
      productKey: string
      id: ID
      partnerId: ID
      vehicleName: string
      vehicleType: number
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
          priceWithoutMarkup: {
            amount: number
            transferCurrencyType: number
          }
          priceWithMarkup: {
            amount: number
            transferCurrencyType: number
          }
          suggestedVehicleCount: number
          sortPrice: number
          extraServices: {
            id: string
            code: string
            title: string
            description: string
            priceWithoutMarkup: {
              amount: number
              transferCurrencyType: number
            }
            priceWithMarkup: {
              amount: number
              transferCurrencyType: number
            }
          }[]
          buyServiceFee: number
          sellServiceFee: number
          sellBaseFareAddOn: number
        }
        selectedTransferDetail: null
      }
    }
    sessionToken: string
    traceId: null
    isSucceeded: boolean
    diagnostics: {
      sessionToken: null
      providerId: ID
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
  extraCharges: object
  financellDiscount: ServicePriceType
}

export interface ParafParaPaymentResponse {
  cardNumber: string
  bonus: number
  advance: number
  multiplier: number
  remainingFund: number
  mileCode: string
  calculatedBonus: {
    multiplier: number
    award: number
    bonus: number
    advance: number
    remaining: number
  }
  total: number
  tax: number
  moduleName: string
  calculatedInstalmentList: {
    installmentInfoList: {
      totalAmount: number
      amountPerInstallment: number
      installmentCount: number
      bankName: string
      cardProgramName: string
      interestRate: number
      binList: string
    }[]
    installmentType: number
  }
}

export interface CyprusPackageSummaryResponse {
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
      id: number
      partnerId: number
      vehicleType: number
      vehicleName: string
      vehicleTitle: null
      transferInfo: null
      extraServices: null
      status: null
      transferData: null
    }
    sessionToken: null
    traceId: null
    isSucceeded: string
    diagnostics: {
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
    }
  }[]
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
    equipment: string | null
    flightTime: string
    freeVolatileData: null
    isMeal: boolean
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
        no: ''
        type: string
        description: string
      }[]
      food_drinks: null
      can_coupon_used: boolean
    }
    roomDetails: {
      [key: string]: {
        roomKey: string
        description: ''
        allotment: number
        bedType: ''
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
      passengerKeys: null
      nightlyRates: {
        totalPrice: ServicePriceType
        basePrice: ServicePriceType
        taxes: ServicePriceType
        fee: ServicePriceType
      }[]
      addonInfos: null
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
      unitPrice: {
        value: 0
        currency: null
        rateValue: null
      }
      unitBasePrice: {
        value: 0
        currency: null
        rateValue: null
      }
      unitFee: {
        code: null
        price: {
          value: 0
          currency: null
          rateValue: null
        }
      }
      unitTax: {
        value: 0
        currency: null
        rateValue: null
      }
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
  moduleName: 'CyprusPackage'
  providerName: null
  providerId: number
  priceCurrency: string
  totalPrice: number
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: null
  financellDiscount: ServicePriceType
}
