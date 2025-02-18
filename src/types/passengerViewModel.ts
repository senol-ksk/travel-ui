import {
  BusSummaryResponse,
  CarSummaryResponse,
  TransferSummaryResponseViewDataResponser,
} from '@/app/reservation/types'

export enum GenderEnumIndex {
  Male,
  Female,
}
export enum GenderEnums {
  Male = '0',
  Female = '1',
}

export enum PassengerTypesEnum {
  // The Yolcu tipi 0.Adult 1. Child 2.Infant 3.Senior 4.Soldier field is required.
  Adult = '0',
  Child = '1',
  Infant = '2',
  Senior = '3',
  Soldier = '4',
}

export enum PassengerTypesIndexEnum {
  // The Yolcu tipi 0.Adult 1. Child 2.Infant 3.Senior 4.Soldier field is required.
  Adult,
  Child,
  Infant,
  Senior,
  Soldier,
}

export interface ChildNode {
  id: null | ID
  orderId: ID
  key: string
  items: [
    {
      valueType: 'System.String, System.Private.CoreLib, Version=7.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e'
      key: 'TYPE'
      value: 'FLIGHT'
      orderId: 0
    },
  ]
  childNodes: [
    {
      childNodes: {
        id: null
        orderId: ID
        key: string
        items: {
          valueType: 'TravelAccess.Core.Models.Product.OrderPassengerModel, Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null'
          key: string
          value: {
            _passengerId: ID
            model_PassengerId: ID
            declaredAge: 0
            productType: 1
            checkinDate: '2024-11-27T07:40:00'
            calculationYearBased: boolean
            calculationYearType: 1
            passengerId: 0
            sequenceNo: 1
            type: 0
            gender: GenderEnums
            firstName: null
            lastName: null
            middleName: null
            birthDate: '0001-01-01T00:00:00'
            nationality: 'tr'
            nationality_Check: null
            citizenNo: null
            passportNo: null
            mobilePhoneNumber: null
            email: null
            isContact: boolean
            flightFrequencyNo: null
            notes: null
            passportValidityDate: null
            webUserId: 0
            passportCountry: null
            groupOrderIndex: 0
            passengerKey: string
            isRecord: boolean
            listFlightFrequencyAirline: null
            listFlightFrequencyNo: null
            registeredPassengerId: 0
            isDontValidate: boolean
            hesCode: null
          }
          orderId: ID
        }
      }[]
      id: ID
      orderId: ID
      key: string
      items: [
        {
          valueType: string
          key: string
          value: {
            _passengerId: ID
            model_PassengerId: ID
            declaredAge: 0
            productType: 1
            checkinDate: '2024-11-27T07:40:00'
            calculationYearBased: boolean
            calculationYearType: 1
            passengerId: 0
            sequenceNo: 1
            type: 0
            gender: GenderEnums
            firstName: null
            lastName: null
            middleName: null
            birthDate: '0001-01-01T00:00:00'
            nationality: 'tr'
            nationality_Check: null
            citizenNo: null
            passportNo: null
            mobilePhoneNumber: null
            email: null
            isContact: boolean
            flightFrequencyNo: null
            notes: null
            passportValidityDate: null
            webUserId: 0
            passportCountry: null
            groupOrderIndex: 0
            passengerKey: '8126560C2A454B7AFB0D3DCA1CA77D446D0170E107607B099E3969D8D213FA0F'
            isRecord: boolean
            listFlightFrequencyAirline: null
            listFlightFrequencyNo: null
            registeredPassengerId: 0
            isDontValidate: boolean
            hesCode: null
          }
          orderId: ID
        },
        {
          valueType: 'System.Boolean, System.Private.CoreLib, Version=7.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e'
          key: 'IsDomestic'
          value: boolean
          orderId: 2
        },
        {
          valueType: 'TravelAccess.Business.Models.Flight.FlightDetailWebRequest, Business.Models, Version=1.5.6.0, Culture=neutral, PublicKeyToken=null'
          key: string
          value: {
            selectedProductKeys: string
            flightDetailToSearchReturnPath: null
            searchToken: string
            sessionToken: string
            apiRoute: null
            apiAction: null
            appName: string
            scopeCode: string
            customerId: ID
            customerUserId: ID
          }
          orderId: 3
        },
      ]
    },
  ]
}

export type Airport = {
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

export type ProductPassengerApiResponseModel = {
  exceptionAction: {
    message: string
    serviceName: string
    serviceAction: string
    actionParameterModel: {
      sessionToken: string
      searchToken: string
      flightDetailToSearchReturnPath: null
      tourExtraServiceToDetailReturnPath: null
      adultCount: null
      childAges: null
      package: null
      selectedProductKey: null
      mainSelectedProductKey: null
      carRentalDetailToSearchReturnPath: null
      carRentalExtraToDetailReturnPath: null
      carRentalSummaryToExtraReturnPath: null
      extraOptions: null
      insuranceOptions: null
      hotelProductKey: null
      apiRoute: null
      apiAction: null
      appName: string
      scopeName: string
      scopeCode: string
      userAuthToken: string
      userId: ID
      ipAddress: null
      isPassengerViewDataCached: boolean
      customerId: 0
      customerUserId: 0
    }
  } | null
  viewBag: {
    AdditionalData: {
      additionalData: FlightAdditionalData | null
    } | null
    SessionToken: string
    SearchToken: string
    CallCenterFeeModel: {
      hasCallCenter: boolean
      callCenterFee: number
      totalPrice: number
    }
    HotelCancelWarrantyPriceStatusModel: {
      selectingCancelWarranty: boolean
      hasHotelWarranty: boolean
      cancelWarrantyPrice: number
      hotelWarrantyDiscountSelected: boolean
      totalPrice: number
      dayCount: number
      couponActive: boolean
    }
    ModuleName: 'Flight' | 'Hotel' | 'CARRENTAL' | 'BUS' | 'TRANSFER' | 'TOUR'
    SummaryViewDataResponser: {
      summaryResponse:
        | FlightReservationSummary
        | HotelSummaryResponse
        | CarSummaryResponse
        | BusSummaryResponse
        | TransferSummaryResponseViewDataResponser
        | TourSummaryViewData
    }
    PassengerInfoBackUrl: string
    FlightDetailToSearchReturnPath: null
    ViewIsPassengerInfo: boolean
    IsPassengerViewDataCached: boolean
    HESAddressReq: boolean
    FlightCancellationInsuranceAmount: number
    FlightCancellationInsurancePasssengerCount: number
    isPassportReq: boolean
    isHESReq: boolean
    FlightArrivalDate: string
    DateCountToArrival: 41
    InsurancePrice: 0
    Insurances: [
      {
        searchId: 0
        insurance: [
          {
            productKey: 'heScao10dfizPkn3ago3d57XrFlqp6j+suxf9p7RZk6qxATNhoxG7DZB2PHqH6KoHKy+Aq+WbxQ1l6WTs1Hd+5nI1c58Oaaz8OW8+I5NFBGxl1WGs+diOJoAgK710olo'
            price: {
              value: 19.0
              currency: 'TRY'
              rateValue: null
            }
            id: 177
            partnerId: 11
            insuranceName: 'Seyahat Destek Hizmet Paketi'
            insuranceDescripton: 'Seyahat Destek Hizmet Paketi ile yurt içi seyahatlerinizde beklenmedik sağlık sorunları durumunda tıbbi müdahalelerde geçerlidir.'
            insuranceCategoryTitle: 'Seyahat Destek Hizmet Paketi'
            insuranceGuarantee: '{\n  "Medical Park Hastaneler Grubundan Ayakta ve Yatarak Tedaviler İçin %10 indirim": "",\n  "Seyahat Sağlık Destek Hizmet paketi ile yurt içi seyahatlerinizde beklenmedik sağlık sorunları durumunda tıbbi müdahalelerde geçerlidir.": "",\n  "Sadece yurt içi seyahatlerde geçerli": "",\n  "5000₺\'ye kadar hastane masraflarını karşılayan seyahat sağlık sigortası": "",\n  "Online doktor hizmeti": "",\n  "Kayıp Bagajın Bulunup Ulaştırılması": ""\n}'
            partnerName: 'Tamamliyo'
            partnerFullName: 'Tamamliyo'
            providerName: 'Seyahat Destek Hizmet Paketi , Tamamliyo Assistance Destek Hizmetleri A.Ş. tarafında sunulmaktadır.'
            startDate: '2024-11-27T07:40:00'
            endDate: '2024-11-28T07:40:00'
          },
        ]
        sessionToken: '7E3175C8FDC0420E19D7D6B44A8E685B27EFE7F12ABEC41D9669FCF29409053B'
        traceId: '738D00E2996563489F52CB7A25F1AAC938B757BA721C61028E77EC1BA4E54B26'
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
        logSessionToken: string
        logSearchToken: string
      },
    ]
    Reservable: 1 | 0 | null | undefined
  }
  treeContainer: {
    id: null
    orderId: 1
    key: 'PRODUCT'
    items: [
      {
        valueType: 'System.String, System.Private.CoreLib, Version=7.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e'
        key: 'TYPE'
        value: 'FLIGHT'
        orderId: 0
      },
    ]
    childNodes: {
      childNodes:
        | {
            id: null
            key: string
            orderId: ID
            items: {
              value: PassengerChildNodeItemValue
            }[]
          }[]
        | []
      id: null
      orderId: number
      key: 'Adult' | 'Child' | 'Infant'
      items: [
        {
          valueType: 'TravelAccess.Core.Models.Product.OrderPassengerModel, Core.Models, Version=1.1.75.0, Culture=neutral, PublicKeyToken=null'
          key: 'Data'
          value: {
            _passengerId: ID
            birthDate: string
            calculationYearBased: boolean
            calculationYearType: number
            checkinDate: string
            citizenNo: string
            declaredAge: number
            email: string
            firstName: string
            flightFrequencyNo: string | null
            gender: number
            groupOrderIndex: number
            hesCode: string | null
            isContact: boolean
            isDontValidate: boolean
            isRecord: boolean
            lastName: string
            listFlightFrequencyAirline: string | null
            listFlightFrequencyNo: string | null
            middleName: string
            mobilePhoneNumber: string
            model_PassengerId: ID
            nationality_Check: boolean
            nationality: string
            notes: null
            passengerId: ID
            passengerKey: string
            passportCountry: string | null
            passportNo: string
            passportValidityDate: string
            productType: number
            registeredPassengerId: ID
            sequenceNo: number
            type: PassengerTypesEnum
            webUserId: ID
          }
          orderId: ID
        },
        {
          valueType: 'System.Boolean, System.Private.CoreLib, Version=7.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e'
          key: string
          value: boolean
          orderId: ID
        },
        {
          valueType: 'TravelAccess.Business.Models.Flight.FlightDetailWebRequest, Business.Models, Version=1.5.6.0, Culture=neutral, PublicKeyToken=null'
          key: 'SummaryRequest'
          value: {
            selectedProductKeys: string
            flightDetailToSearchReturnPath: null
            searchToken: string
            sessionToken: string
            apiRoute: null
            apiAction: null
            appName: string
            scopeCode: string
            customerId: number
            customerUserId: number
          }
          orderId: number
        },
      ]
    }[]
  }
  paymentIndexModel: {
    isPhoneNumberConfirmed: boolean
    phoneNumber: ''
    billingInformationList: []
    installment: {
      installmentInfoList: {
        amountPerInstallment: number
        bankName: string
        binList: string
        cardProgramName: string
        installmentCount: number
        totalAmount: number
      }[]
      installmentType: number
    }
    isDomestic: boolean
    isTotalSalaryNotEqualsZero: boolean
    showFinancell: boolean
    usedFinancellCredit: boolean
    paymentMethodList: null
    billingInfo: {
      id: ID
      name: string
      lastName: null
      type: number
      tcKimlikNo: string
      nationalityCheck: null
      countryCode: string
      city: string
      district: string
      address: null
      mobilPhoneNumber: string
      fullName: string
      email: null
    }
  }
  contactEmail: string | null
  contactGSM: string | null
  isInPromoList: boolean
  sessionToken: string
  searchToken: string
}

export interface PassengerChildNodeItemValue {
  _passengerId: ID
  birthDate: string
  calculationYearBased: boolean
  calculationYearType: number
  checkinDate: string
  citizenNo: string
  declaredAge: number
  email: string
  firstName: string
  flightFrequencyNo: string | null
  gender: number
  groupOrderIndex: number
  hesCode: string | null
  isContact: boolean
  isDontValidate: boolean
  isRecord: boolean
  lastName: string
  listFlightFrequencyAirline: string | null
  listFlightFrequencyNo: string | null
  middleName: string
  mobilePhoneNumber: string
  model_PassengerId: ID
  nationality_Check: boolean
  nationality: string
  notes: null
  passengerId: ID
  passengerKey: string
  passportCountry: string | null
  passportNo: string
  passportValidityDate: string
  productType: number
  registeredPassengerId: ID
  sequenceNo: number
  type: PassengerTypesEnum
  webUserId: ID
}

export interface FlightReservationSummary {
  flightList: {
    flightFareInfo: {
      flightDetailKeys: string[]
      groupId: 0 | 1
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
        taxInfos: {
          key: string
          value: string
        }[]
        serviceCharges: null
      }[]
      taxInfos: null
      serviceCharges: null
    }
    flightDetail: {
      key: string
      groupId: 0 | 1
      flightSegmentKeys: string[]
      travelTime: string
      direction: number
      isDomestic: boolean
      isOWCCombinable: boolean
      isPromotional: boolean
      reservable: boolean
      freeVolatileData: {
        data: string
        OfferID: string
        Owner: string
        ResponseID: string
        brandname: string
        Seq: string
        SegmentRefs: string
        PassengerList: string
        StandartSeatSelection: boolean
        AllSeatSelection: boolean
        FreeSandwich: boolean
        Entertainment: boolean
        FlexibleReturnChangeRight: boolean
      }
    }
    flightSegments: {
      key: string
      groupId: 0 | 1
      origin: {
        code: string
        isDomestic: boolean
        iata: null
        type: number
        id: ID
      }
      destination: {
        code: string
        isDomestic: boolean
        iata: null
        type: number
        id: ID
      }
      departureTime: string
      arrivalTime: string
      flightTime: string
      operatingAirline: {
        code: number
        value: null
        countryCode: null
      }
      marketingAirline: {
        code: string
        value: null
        countryCode: null
      }
      flightNumber: string
      cabinClass: number
      bookingCode: string
      equipment: null
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
    }[]
  }[]
  flightFareInfo: {
    flightDetailKeys: null
    groupId: 0 | 1 | 2
    key: null
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
      taxInfos: {
        key: string
        value: string
      }[]
      serviceCharges: null
    }[]
    taxInfos: []
    serviceCharges: []
  }
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
  productKey: null
  moduleName: 'Flight'
  totalPrice: number
  priceCurrency: string
  loyaltyMultiple: number
  couponDiscountList:
    | null
    | {
        index: number
        discountPrice: ServicePriceType
        discountInfo: {
          index: number
          type: number
        }
        isPartial: boolean
      }[]
  extraCharges: null
  financellDiscount: ServicePriceType
}

export interface FlightAdditionalData {
  items: []
  owner: {
    type: number
    ownerKey: string
    identifier: null
  }
  subGroups: FlightAdditionalDataSubGroup[]
}

export const BaggageDefaultValue = '0|TRY|0|KG|NOEXTRABAGGE1'

export interface FlightOptionalServicesDataItem {
  uniqueIdentifier: string
  code: 'XBAG' | 'FrequentFlyer'
  included: boolean
  description: null | string
  selected: boolean
  required: boolean
  indexNo: number
  data: string
  filters:
    | [
        {
          key: string
          value: {
            departureTime: string
            cabinClass: null
            permittedAirlines: null
            prohibitedAirlines: null
            permittedConnectionPoints: null
            prohibitedConnectionPoints: null
            maxConnections: number
            origin: {
              code: string
              isDomestic: boolean
              iata: null
              type: number
              id: ID
            }
            destination: {
              code: string
              isDomestic: boolean
              iata: null
              type: number
              id: ID
            }
          }
          indexNo: number
        },
        {
          key: string
          value: number
          indexNo: number
        },
        {
          key: string
          value: string
          indexNo: number
        },
        {
          key: string
          value: string
          indexNo: number
        },
      ]
    | null
}

export interface FlightOptionalServicesData {
  items: FlightOptionalServicesDataItem[]
  owner: {
    type: number
    ownerKey: string
    identifier: string
  }
  subGroups: []
}
export interface FlightAdditionalDataSubGroup {
  items: []
  owner: {
    type: number
    ownerKey: 'Flight'
    identifier: null
  }
  subGroups: FlightOptionalServicesData[]
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
      phone: null
      email: null
      currency: ''
      meal_type: ''
      nearby: string[]
      nearby_info: null
      checkin_from: string
      checkout_to: string
      fax: null
      nr_rooms: number
      stars: number
      availability_score: null
      max_free_child_age: number
      min_free_child_age: number
      images: {
        category: ID
        tag: string
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
      year_built: null
      nr_restaurants: number
      nr_bars: number
      nr_halls: null
      last_update: string
      video_list: null
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
          reasonLabel: string
          withWhoLabel: string
          userCountryCode: string
          userCountry: string
          userCity: null
        }[]
        totalComments: number
        averageScore: number
      }
      documents: {
        no: string
        type: string
        description: string
      }[]
      food_drinks: null
    }
    roomDetails: {
      [key: string]: HotelSummaryRoomDetail
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
      freeChildAges: {
        ageFrom: number
        ageTo: number
        whichChild: number
      }[]
      freeNights: number
      discountInformations: {
        rate: number
        title: string
        description: null
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
  moduleName: 'Hotel'
  totalPrice: number
  priceCurrency: string
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: null
  financellDiscount: ServicePriceType
}

export interface HotelSummaryRoomDetail {
  roomKey: string
  description: string
  allotment: number
  bedType: string
  roomType: string
  quantity: number
  size: number
  facilities: []
  pensionType: string
  pensionTypeId: ID
  extraInformations: null
  images: {
    url: string
    thumbnailUrl: string
    title: string
    isDefault: boolean
    width: number | null
  }[]
}

export interface TourSummaryViewData {
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
      rating: 0
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
    discountDescription: ''
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
      flightInformation: []
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
          description: 'Bus Pick Up Point'
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
    flightInformation: []
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
  childs: null
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
