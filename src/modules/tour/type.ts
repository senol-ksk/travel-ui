import { z } from 'zod'

export interface TourSearchApiParamsResponse {
  params: {
    sessionToken: string
    apiRoute: 'TourService'
    apiAction: 'api/tour/Search'
    appName: string
    scopeName: string
    scopeCode: string
    departurePoints: string[]
    transportType: string[]
    tourSearchRequest: {
      startDate: string
      endDate: string
      keyword: ''
      location: {
        id: ID
        parentRegion: null | ID
        label: string
      }
      tourDestinationModels: {
        locationId: ID
        groupId: null
        value: null
        isDomestic: boolean
        type: number
        providerName: string
      }[]
      searchName: null
      receivedProviders: string[]
      sessionToken: string
      apiRoute: 'TourService'
      apiAction: 'api/tour/Search'
      appName: string
      scopeName: string
      searchToken: string
      scopeCode: string
    }
    customerId: ID
    customerUserId: ID
    channel: number
    searchToken: string
  }
  sessionToken: string
  apiRoute: 'TourService'
  apiAction: 'api/tour/Search'
  requestType: 'Service.Models.RequestModels.TourSearchRequestModel, Service.Models, Version=1.3.0.0, Culture=neutral, PublicKeyToken=null'
  returnType: 'Service.Models.ResultModels.RestResult`1[[TravelAccess.Core.Models.Tour.TourSearchResponse, Core.Models.Tour, Version=1.0.19.0, Culture=neutral, PublicKeyToken=null]], Service.Models, Version=1.3.0.0, Culture=neutral, PublicKeyToken=null'
  device: string
  languageCode: string
  ipAddress: string
  mlToken: string
}

export interface TourLocationInfo {
  code: string
  title: string
}

export interface TourSearchApiResponsePassengerPrice {
  startAge: number
  endAge: number
  price: ServicePriceType
}

export interface TourSearchResultSearchItem {
  title: string
  hotelInformations: null
  description: string
  countries: []
  cities: TourLocationInfo[]
  group: TourLocationInfo
  region: TourLocationInfo
  departurePoints: TourLocationInfo[]
  imageUrl: string
  startDate: string
  endDate: string
  tourTime: number
  priceInformations: {
    priceForDouble: ServicePriceType
    priceForSingle: ServicePriceType
    additionalBedPrices: null
    childrenPrices: TourSearchApiResponsePassengerPrice[]
  }
  quota: number
  discountDescription: string
  extraServices: null
  detail: null
  tlPrice: ServicePriceType
  calculatedId: null
  slug: string
  slugId: ID
  isDomestic: boolean
  commission: number
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
  transportType: number
}
export interface TourSearchResultRelatedItems {
  relatedItems: TourSearchResultSearchItem[]
}
export interface TourSearchResultGroupedItem
  extends TourSearchResultSearchItem,
    TourSearchResultRelatedItems {}

export interface TourSearchResultApiResponse {
  code: number
  message: null
  data: {
    status: boolean
    message: string
    executionTime: string
    hasMoreResponse: boolean
    searchResults: [
      {
        items: TourSearchResultSearchItem[] | [] | null
        sessionToken: null
        traceId: string
        isSucceeded: boolean
        eventMessages: []
        appName: null
        scopeCode: string
        logSessionToken: null
        logSearchToken: null
        diagnostics: {
          providerName: string
          sessionToken: string
          providerId: ID
          generatingRequestTime: string
          callingServiceTime: string
          generatingResponseTime: string
          subDiagnostics: null
          lastException: null
          serviceRequestData: null
          serviceResponseData: null
          providerInfo: {
            isActive: true
            isProduction: true
          }
          traceId: null
        }
      },
    ]
  }
  token: null
  clientIP: null
  appName: null
  sessionToken: string
  userAuthenticationToken: null
  eventMessageList: []
}

export interface TourExtraService {
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
}

export interface TourDetailProgram {
  title: string
  description: string
}
export interface TourDetailApiResponse {
  package: {
    title: string
    description: string
    countries: []
    cities:
      | {
          code: null
          title: string
        }[]
      | []
    group: TourLocationInfo
    region: TourLocationInfo
    imageUrl: string
    startDate: string
    endDate: string
    tourTime: number
    transportType: number
    hotelInformations:
      | null
      | {
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
    extraServices: TourExtraService[]
    detail: {
      images: string[]
      countryInformation: {
        name: string
        description: string
        imageUrl: string
      } | null
      extraTours: []
      tourProgram: TourDetailProgram[]
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
        items:
          | {
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
          | []
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
    slugId: ID
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
    } | null
    extraTours: []
    tourProgram: TourDetailProgram[]
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
      items:
        | {
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
        | []
      owner: {
        type: number
        ownerKey: string
        identifier: string
      }
      subGroups: []
    }
  }
  adultCount: null | number
  childs: null | number
  sessionToken: string
  searchToken: string
  tourExtraServiceToDetailReturnPath: null
  location: {
    id: ID
    parentRegion: null
    label: string
  }
  moduleName: string
  totalPrice: number
  priceCurrency: null
  loyaltyMultiple: number
  couponDiscountList: null
  extraCharges: null
  financellDiscount: ServicePriceType
}

export const passengerUpdateSchema = z.object({
  adultCount: z.string(),
  childAge: z.array(z.string().optional()).optional(),
})

export type PassengerFormTypes = z.infer<typeof passengerUpdateSchema>

export type TourExtraServiceData = {
  amount: number
  basePrice: ServicePriceType
  buyFee: ServiceFeePriceType
  commissionTlPrice: ServicePriceType
  discount: ServicePriceType
  extraServiceCodes: null
  extraServiceType: number
  extraServiceValues: null
  fee: ServiceFeePriceType
  isMandatory: boolean
  isPackage: boolean
  key: string
  mandatoryDescription: string
  name: string
  passengerPrices: null
  serviceCharges: null
  taxes: ServicePriceType
  taxInfos: null
  totalPrice: ServicePriceType
  totalPriceTl: ServicePriceType
  unitPrice: ServicePriceType
  unitPriceFor: number
  unitPriceTl: ServicePriceType
}

export type TourExtraServicesApiResponse = {
  adultCount: string
  calculatedId: string
  childAges: null | number[]
  extraServices: TourExtraServiceData[]
  package: {
    title: string
    description: string
    countries: [
      {
        code: '23'
        title: 'Macaristan'
      },
    ]
    cities: [
      {
        code: '774'
        title: 'Budapeşte'
      },
    ]
    group: {
      code: '4'
      title: 'Orta Avrupa Turları'
    }
    region: {
      code: '513'
      title: 'Pegasus ile Budapeşte Turu 3 Gece'
    }
    imageUrl: string
    startDate: string
    endDate: '2025-05-11T00:00:00'
    tourTime: number
    hotelInformations: [
      {
        name: '3* HOTEL'
        rating: 3.0
      },
    ]
    priceInformations: {
      priceForDouble: {
        value: 449.0
        currency: 'EUR'
        rateValue: null
      }
      priceForSingle: {
        value: 599.0
        currency: 'EUR'
        rateValue: null
      }
      additionalBedPrices: null
      childrenPrices: [
        {
          startAge: 0
          endAge: 2
          price: {
            value: 200.0
            currency: 'EUR'
            rateValue: null
          }
        },
        {
          startAge: 2
          endAge: 12
          price: {
            value: 449.0
            currency: 'EUR'
            rateValue: null
          }
        },
      ]
    }
    quota: 6
    discountDescription: null
    extraServices: [
      {
        name: 'Paket Hizmeti 1. Oda (2 Yetiþkin 0 Çocuk 0 Bebek)'
        unitPrice: {
          value: 498.0
          currency: 'EUR'
          rateValue: null
        }
        unitPriceTl: {
          value: 18426.0
          currency: 'TRY'
          rateValue: null
        }
        totalPriceTl: {
          value: 18426.0
          currency: 'TRY'
          rateValue: null
        }
        isPackage: true
        unitPriceFor: 0
        isMandatory: false
        mandatoryDescription: 'Paket Hizmeti 1. Oda (2 Yetiþkin 0 Çocuk 0 Bebek)'
        amount: 1
        extraServiceType: 0
        extraServiceCodes: null
        extraServiceValues: null
        commissionTlPrice: {
          value: 14740.8
          currency: 'TRY'
          rateValue: null
        }
        key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0uj8ZzF5QN6VgbcJZXUxx4p8='
        totalPrice: {
          value: 498.0
          currency: 'EUR'
          rateValue: null
        }
        basePrice: {
          value: 0.0
          currency: null
          rateValue: null
        }
        taxes: {
          value: 0.0
          currency: null
          rateValue: null
        }
        discount: {
          value: 0.0
          currency: null
          rateValue: null
        }
        buyFee: {
          code: '%10.0'
          price: {
            value: 1675.09
            currency: 'TRY'
            rateValue: null
          }
        }
        fee: {
          code: '%10.0'
          price: {
            value: 1675.09
            currency: 'TRY'
            rateValue: null
          }
        }
        passengerPrices: null
        taxInfos: null
        serviceCharges: null
      },
      {
        name: 'HAVA ALANI VERGISI'
        unitPrice: {
          value: 200.0
          currency: 'EUR'
          rateValue: null
        }
        unitPriceTl: {
          value: 7400.0
          currency: 'TRY'
          rateValue: null
        }
        totalPriceTl: {
          value: 14800.01
          currency: 'TRY'
          rateValue: null
        }
        isPackage: false
        unitPriceFor: 0
        isMandatory: true
        mandatoryDescription: 'HAVA ALANI VERGISI'
        amount: 2
        extraServiceType: 2
        extraServiceCodes: ''
        extraServiceValues: ''
        commissionTlPrice: {
          value: 0.0
          currency: 'TRY'
          rateValue: null
        }
        key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0umUn/Ixf+OPyZvN+6mafpvh28N5vKxMC9opBv2orJ+57'
        totalPrice: {
          value: 400.0
          currency: 'EUR'
          rateValue: null
        }
        basePrice: {
          value: 0.0
          currency: null
          rateValue: null
        }
        taxes: {
          value: 0.0
          currency: null
          rateValue: null
        }
        discount: {
          value: 0.0
          currency: null
          rateValue: null
        }
        buyFee: {
          code: '%10.0'
          price: {
            value: 1345.45
            currency: 'TRY'
            rateValue: null
          }
        }
        fee: {
          code: '%10.0'
          price: {
            value: 1345.46
            currency: 'TRY'
            rateValue: null
          }
        }
        passengerPrices: null
        taxInfos: null
        serviceCharges: null
      },
      {
        name: 'SEYAHAT GÜVENCE PAKETİ'
        unitPrice: {
          value: 30.0
          currency: 'EUR'
          rateValue: null
        }
        unitPriceTl: {
          value: 0.0
          currency: 'TRY'
          rateValue: null
        }
        totalPriceTl: {
          value: 0.0
          currency: 'TRY'
          rateValue: null
        }
        isPackage: false
        unitPriceFor: 0
        isMandatory: false
        mandatoryDescription: 'SEYAHAT GÜVENCE PAKETİ'
        amount: 0
        extraServiceType: 84
        extraServiceCodes: ''
        extraServiceValues: ''
        commissionTlPrice: {
          value: 0.0
          currency: 'TRY'
          rateValue: null
        }
        key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0umUn/Ixf+OPyZvN+6mafpvhlsngy1hoXyetYW4+RnZ5d'
        totalPrice: {
          value: 0.0
          currency: 'EUR'
          rateValue: null
        }
        basePrice: {
          value: 0.0
          currency: null
          rateValue: null
        }
        taxes: {
          value: 0.0
          currency: null
          rateValue: null
        }
        discount: {
          value: 0.0
          currency: null
          rateValue: null
        }
        buyFee: {
          code: '%10.0'
          price: {
            value: 0.0
            currency: 'TRY'
            rateValue: null
          }
        }
        fee: {
          code: '%10.0'
          price: {
            value: 0.0
            currency: 'TRY'
            rateValue: null
          }
        }
        passengerPrices: null
        taxInfos: null
        serviceCharges: null
      },
      {
        name: 'VIZE HIZMETI'
        unitPrice: {
          value: 200.0
          currency: 'EUR'
          rateValue: null
        }
        unitPriceTl: {
          value: 0.0
          currency: 'TRY'
          rateValue: null
        }
        totalPriceTl: {
          value: 0.0
          currency: 'TRY'
          rateValue: null
        }
        isPackage: false
        unitPriceFor: 0
        isMandatory: false
        mandatoryDescription: 'VIZE HIZMETI'
        amount: 0
        extraServiceType: 1
        extraServiceCodes: ''
        extraServiceValues: ''
        commissionTlPrice: {
          value: 0.0
          currency: 'TRY'
          rateValue: null
        }
        key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0umUn/Ixf+OPyZvN+6mafpvhvD5hOLy326jgrEj5CmEeE'
        totalPrice: {
          value: 0.0
          currency: 'EUR'
          rateValue: null
        }
        basePrice: {
          value: 0.0
          currency: null
          rateValue: null
        }
        taxes: {
          value: 0.0
          currency: null
          rateValue: null
        }
        discount: {
          value: 0.0
          currency: null
          rateValue: null
        }
        buyFee: {
          code: '%10.0'
          price: {
            value: 0.0
            currency: 'TRY'
            rateValue: null
          }
        }
        fee: {
          code: '%10.0'
          price: {
            value: 0.0
            currency: 'TRY'
            rateValue: null
          }
        }
        passengerPrices: null
        taxInfos: null
        serviceCharges: null
      },
      {
        name: 'ZORUNLU SEYAHAT SİGORTASI'
        unitPrice: {
          value: 0.0
          currency: 'EUR'
          rateValue: null
        }
        unitPriceTl: {
          value: 0.0
          currency: 'TRY'
          rateValue: null
        }
        totalPriceTl: {
          value: 0.0
          currency: 'TRY'
          rateValue: null
        }
        isPackage: false
        unitPriceFor: 0
        isMandatory: true
        mandatoryDescription: 'ZORUNLU SEYAHAT SİGORTASI'
        amount: 2
        extraServiceType: 83
        extraServiceCodes: ''
        extraServiceValues: ''
        commissionTlPrice: {
          value: 0.0
          currency: 'TRY'
          rateValue: null
        }
        key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0umUn/Ixf+OPyZvN+6mafpvgpM5o3qXMuruLKDa0sfgLN'
        totalPrice: {
          value: 0.0
          currency: 'EUR'
          rateValue: null
        }
        basePrice: {
          value: 0.0
          currency: null
          rateValue: null
        }
        taxes: {
          value: 0.0
          currency: null
          rateValue: null
        }
        discount: {
          value: 0.0
          currency: null
          rateValue: null
        }
        buyFee: {
          code: '%10.0'
          price: {
            value: 0.0
            currency: 'TRY'
            rateValue: null
          }
        }
        fee: {
          code: '%10.0'
          price: {
            value: 0.0
            currency: 'TRY'
            rateValue: null
          }
        }
        passengerPrices: null
        taxInfos: null
        serviceCharges: null
      },
    ]
    detail: {
      images: [
        'https://www.prontotour.com/images/Tour/Orj/orta_avrupa_turlari_pegasus_il_4_513_0001.jpg',
        'https://www.youtube.com/embed/LDbbmxv3IJc?rel=0',
        'https://www.youtube.com/embed/mYx9ED1mUoo?si=up6bMXdshGPfpETn?rel=0',
        'https://www.prontotour.com/images/Tour/Orj/orta_avrupa_turlari_pegasus_il_4_513_0002.jpg',
        'https://www.prontotour.com/images/Tour/Orj/orta_avrupa_turlari_pegasus_il_4_513_0005.jpg',
        'https://www.prontotour.com/images/Tour/Orj/orta_avrupa_turlari_pegasus_il_4_513_0007.jpg',
        'https://www.prontotour.com/images/Tour/Orj/orta_avrupa_turlari_pegasus_il_4_513_0008.jpg',
        'https://www.prontotour.com/images/Tour/Orj/orta_avrupa_turlari_pegasus_il_4_513_0011.jpg',
        'https://www.prontotour.com/images/Tour/Orj/orta_avrupa_turlari_pegasus_il_4_513_0012.jpg',
        'https://www.prontotour.com/images/Tour/Orj/orta_avrupa_turlari_pegasus_il_4_513_0013.jpg',
        'https://www.prontotour.com/images/Tour/Orj/orta_avrupa_turlari_pegasus_il_4_513_0014.jpg',
        'https://www.prontotour.com/images/Tour/Orj/orta_avrupa_turlari_pegasus_il_4_513_0015.png',
        'https://www.prontotour.com/images/Tour/Orj/orta_avrupa_turlari_pegasus_il_4_513_0016.png',
        'https://www.prontotour.com/images/Tour/Orj/orta_avrupa_turlari_pegasus_il_4_513_0017.png',
      ]
      countryInformation: {
        name: 'Macaristan'
        description: '\n\t\n\t\t\n\t\t\tResmi Adı:\n\t\t\tMacaristan Cumhuriyeti \n\t\t\n\t\t\n\t\t\tBaşkenti:\n\t\t\tBudapeşte\n\t\t\n\t\t\n\t\t\tSaat Farkı:\n\t\t\tT&uuml;rkiye&#39;den 1 saat geri\n\t\t\n\t\t\n\t\t\tDini:\n\t\t\t%67 Roman Katolik,%33 Diğer\n\t\t\n\t\t\n\t\t\tPara Birimi:\n\t\t\tForint\n\t\t\n\t\t\n\t\t\tSınırları:\n\t\t\tAvusturya,Slovenya,Slovakya,Romanya,Ukrayna,Sırbıstan-Karadağ\n\t\t\n\t\n\n'
        imageUrl: 'https://www.prontotour.com/ptour/images/OtherImages/Ulke_Resim/budapeste6.jpg'
      }
      extraTours: []
      tourProgram: [
        {
          title: 'SABİHA GOKCEN - BUDAPEŞTE'
          description: '<p style="text-align:justify">Sabiha G&ouml;k&ccedil;en Havalimanı Dış Hatlar Terminali&#39;nde en ge&ccedil; 11:00&#39;de hazır bulunmanızı &ouml;neririz. Bilet ve g&uuml;mr&uuml;k işlemlerinden sonra Pegasus Havayolları PC331 no&#39;lu tarifeli seferi ile saat 14:10&#39;da Budapeşte&rsquo;ye hareket ve yerel saat ile 14:15&#39;de varış. Havalimanına inişimizi takiben rehberimizle buluşma ve şehir turu. Kahramanlar Meydanı, Octagon Meydanı, Tarihi Buz Pateni Salonu, Vajdahunyad Şatosu, Andrassy Caddesi, Parlamento ve Opera turumuzda panoramik olarak g&ouml;r&uuml;lecek başlıca yerlerdir. Sonrasında otelimize transfer, yerleşme ve serbest zaman. Akşam dileyen misafirlerimiz rehberimiz tarafından <strong>ekstra olarak d&uuml;zenlenecek yemekli Macar Folkloru Gecesi turuna katılabilirler (60&nbsp;Euro).</strong> &Ccedil;igan m&uuml;ziği eşliğinde folklorik dansların ve zaman zaman sizlerin de katılacağı şovların yapıldığı Macar restoranında geleneksel yemekler ve şarap ile eğlence dolu bir Macar gecesi yaşıyoruz. Geceleme otelimizde.</p>\n'
        },
        {
          title: 'BUDAPEŞTE (ESZTERGOM-STUROVO-SZENTENDRE)'
          description: '<p style="text-align:justify">Sabah kahvaltı sonrası t&uuml;m g&uuml;n serbest zaman. Dileyen misafirlerimiz rehberimiz tarafından <strong>ekstra olarak d&uuml;zenlenecek Esztergom &amp; Sturovo (Slovakya)&nbsp;&amp; Szentendre Gezisi&#39;ne katılabilirler (50 Euro).</strong> Macaristan&rsquo;ın ilk başkenti ve Roma Kilisesi&#39;nin merkezi olan Estergom&rsquo;da Macaristan&rsquo;ın en b&uuml;y&uuml;k kilisesi ve başpiskoposluk merkezi olan Estergom Bazilikası ziyaret edilecektir. Bazilika&rsquo;nın bulunduğu tepeden bakınca batı-doğu istikametinde akan Tuna nehri ve nehrin hemen karşısında yer alan Slovakya toprakları g&ouml;r&uuml;lmektedir. Estergom şehrinin karşı kıyısındaki Slovakya topraklarındaki Sturovo şehrini ziyaret edip Visegrad&#39;dan &uuml;zerinden Szentendre&#39;ye hareket. Sanat&ccedil;ılar kasabası olarakta bilinen; dar, dolamba&ccedil;lı sokakları ve mimarisi ile tipik Akdeniz kasabası havasını yansıtır. G&uuml;n&uuml;m&uuml;zde Szentendre, Tuna Bandı olarak adlandırılan yazlık b&ouml;lgenin başlangıcı olarak Budapeşte&#39;lilerin yazlık evlerinin olduğu kesimdir. &Ccedil;ok sayıda kilisenin bulunduğu kentte sokak kahvelerinde oturmak yada otantik dar sokaklarında y&uuml;r&uuml;y&uuml;ş yapmak &ccedil;ok keyiflidir. Macaristan&#39;ın en &ccedil;ok turist &ccedil;eken yerlerinden olan Szentendre bu nedenle alışveriş cenneti haline gelmiştir. Elişi &ouml;rt&uuml;ler, porselen - cam eşyalar, şarap, oyuncak bebekler, folklorik kost&uuml;mler ve ahşap hediyelikler satan onlarca d&uuml;kkan vardır. Turumuzun sonunda otelimize transfer. Akşam dileyen misafirlerimiz rehberimiz tarafından <strong>ekstra olarak d&uuml;zenlenecek Tuna Nehri&#39;nde Tekne Turu&#39;na katılabilirler (30 Euro).&nbsp;</strong>Kıyılarında Budapeşte&rsquo;nin en &ouml;nemli tarihi binalarının bulunduğu ve şehrin simgesi sayılan Tuna Nehri&#39;nde 1 saatlik tekne gezisi sırasında ikram edilen i&ccedil;kilerinizin tadına bakarken en g&uuml;zel fotograflarınızı &ccedil;ekebilirsiniz. Geceleme otelimizde.</p>\n'
        },
        {
          title: 'BUDAPEŞTE (VİYANA)'
          description: '<p style="text-align:justify">Sabah kahvaltı sonrası t&uuml;m g&uuml;n serbest zaman. Dileyen misafirlerimiz rehberimiz tarafndan d&uuml;zenlenecek ekstra <strong>Viyana turuna katılabilirler(110&nbsp;Euro)</strong>. Viyana&#39;ya varışımızı takiben ger&ccedil;ekleştirilecek panoramik şehir turu esnasında esnasında Opera Binası, Sanat Tarihi M&uuml;zesi, Belediye Binası, Parlemento Binası, &Uuml;niversite, Votiv Kilisesi, Maria Teresa Meydanı, Hofburg Sarayı g&ouml;r&uuml;lecek yerler arasındadır. Sonrasında verilecek serbest zamanın bitiminde Budapeşte&#39;ye hareket. Varışın ardından otelimize transfer. Geceleme otelimizde.</p>\n'
        },
        {
          title: 'BUDAPEŞTE - SABİHA GÖKÇEN'
          description: '<p style="text-align:justify">Sabah kahvaltı sonrası transfer saatine kadar serbest zaman. Dileyen misafirlerimiz rehberimiz tarafından <strong>ekstra olarak d&uuml;zenlenecek Adım Adım Budapeşte turuna katılabilirler (25 Euro).</strong> Turumuza kale b&ouml;lgesi ile başlıyoruz. Lordlar Sokağı, Viyana Kapısı, Balık&ccedil;ılar Burcu, V&ouml;r&ouml;smartin Meydanı, Vaci Caddesi keşfedeceğimiz yerlerdir. Tur sonrası havalimanına transfer. Bilet ve g&uuml;mr&uuml;k işlemlerinden sonra Pegasus Havayolları PC332 nolu tarifeli seferi ile saat 15:45&#39;de&nbsp;İstanbul&rsquo;a hareket, 19:50&#39;de varış ve turumuzun sonu.</p>\n'
        },
      ]
      departureInformation: '2024\n'
      includedInformation: '<ul>\n\t<li>Pegasus Havayolları&nbsp;tarifeli seferi ile İstanbul - Budapeşte&nbsp;- İstanbul u&ccedil;ak biletleri</li>\n\t<li>Havalimanı ve g&uuml;venlik vergileri, Sabiha G&ouml;k&ccedil;en Havalimanı yer hizmetleri</li>\n\t<li>&Ouml;zel&nbsp;otob&uuml;slerimiz ile Havalimanı &ndash; Otel &ndash; Havalimanı transferleri</li>\n\t<li>Se&ccedil;ilen kategori otelde&nbsp;3 gece oda +&nbsp; kahvaltı konaklama</li>\n\t<li>Panoramik Budapeşte şehir turu (M&uuml;ze girişlerini i&ccedil;ermez)</li>\n\t<li>T&uuml;m Tur boyunca <strong>PRONTOTOUR</strong> Profesyonel T&uuml;rk&ccedil;e tur liderliği hizmeti</li>\n\t<li>Zorunlu Seyahat Sigortası&nbsp; (Mesleki sorumluluk sigortasıdır)</li>\n\t<li>KDV Dahildir.</li>\n</ul>\n'
      notIncludedInformation: '<ul>\n\t<li>Macar Schengen vize &uuml;creti ve vize hizmet bedeli<strong>&nbsp;</strong><a href="http://www.prontotour.com/Others/Visa.aspx?Title=0&amp;Name=&amp;LastName=&amp;Birthdate=&amp;Country=23">(Vize alımı i&ccedil;in gerekli evrakları belirten ek listeyi l&uuml;tfen isteyiniz.) </a></li>\n\t<li>Ekstra turlar&nbsp; (ekstra tur g&uuml;nleri değişebilir)</li>\n\t<li>M&uuml;ze ve &ouml;ren yerleri giriş &uuml;cretleri</li>\n\t<li>Ekstra tur fiyatları m&uuml;nferit paketlerde farklı uygulanmaktadır.</li>\n\t<li>Transfer aracı programda dahil olan hizmetlerin dışında ekstra turlar i&ccedil;in tahsis edilmiştir. Otel-şehir merkezi i&ccedil;in transfer olarak kullanılamamaktadır.&nbsp;</li>\n\t<li>Şof&ouml;r bahşişleri kişi başı 5 Euro rehberimiz tarafından toplanacaktır. (Zorunludur)</li>\n\t<li>Yurt dışı &ccedil;ıkış harcı (İlgili bankalara veya havalimanındaki maliye veznesine yatırabilirsiniz)</li>\n\t<li><span style="color:#333333; font-family:arial,sans-serif; font-size:9pt">SEYAHAT G&Uuml;VENCE PAKETİ (Vize reddi ile karşılaşan misafirlerin veya hastalık sorunu nedeni ile tura katılması m&uuml;mk&uuml;n olmayacak misafirlere tur bedeli kadar &ouml;deme yapılmasını sağlamaktadır.( Seyahat iptali nedeniyle tazminat başvurularında uygulanacak sigortalı katılım payı(muafiyet) %15 oranındadır.Teminat detayları sigorta şartnamesinde yer almaktadır.. Bununla birlikte </span><span style="font-family:arial,sans-serif; font-size:9pt">bagaj kaybından, hasarından ve bagaj hırsızlığından<span style="color:#333333">, ferdi kaza teminatına kadar bir&ccedil;ok ek teminatı barındırmaktadır.)</span></span></li>\n\t<li>Seyahat g&uuml;vence paketi &uuml;creti tur bedeliniz ile orantılı olarak değişmektedir.</li>\n</ul>\n\n<p><strong><span style="color:rgb(255, 102, 0); font-size:18pt">GENEL UYARILAR &amp; NOTLAR</span></strong><br />\n&nbsp;</p>\n\n<ul>\n\t<li>Ekstra turlar minimum 20 kişinin katılımı ile ger&ccedil;ekleşmektedir. 20 Kişinin altında katılım durumunda tur fiyatlarında değişiklik s&ouml;z konusu olabilir. Yeterli katılımcı olmadığı takdirde oluşabilecek fiyat farkları sayılar elde edildikten sonra, tur &ouml;ncesi rehberimiz tarafından bilgilendirilir.</li>\n\t<li>Rehberimiz, turlarımızın i&ccedil;eriğine bağlı kalarak, katılımcı sayısına, m&uuml;ze ve &ouml;ren yerinin kapalı olma durumuna g&ouml;re şehir turu ve/veya ekstra turların g&uuml;nlerinde değişiklik yapabilir. Bu durum u&ccedil;uş saatlerinde oluşabilecek değişiklikler karşısında da ge&ccedil;erlidir.</li>\n\t<li>Panoramik şehir turları m&uuml;ze ve &ouml;ren yerleri girişleri i&ccedil;ermemekte olup, şehir hakkında genel bilgi vermek ama&ccedil;lıdır.</li>\n\t<li>Triple odalarda (3 kişilik oda: dbl yatak + ekstra yatak) 3. yatak ek yatak veya sofa bed olup, standart yataklardan daha k&uuml;&ccedil;&uuml;kt&uuml;r.</li>\n\t<li>Triple odalar (3 kişilik) m&uuml;saitliğe bağlı olarak verilmektedir. M&uuml;saitlik olduğu takdirde 3 kişilik oda rezervasyonu yapılır. Triple odalar ek yatak sebebi ile daha k&uuml;&ccedil;&uuml;kt&uuml;r.</li>\n\t<li>&Ccedil;ocuk indirimi 2 yetişkin ile aynı odada konaklama yapıldığı takdirde ge&ccedil;erlidir.</li>\n\t<li>Otellerde genellikle check-in saati 14:00 (bazı &uuml;lkelerde 15:00&rsquo;dır), check-out saati 10:00&rsquo;dur. (bazı &uuml;lkelerde 09:00&rsquo;dur)</li>\n\t<li>Programlarımız i&ccedil;in otellerden grup rezervasyonları yapılmaktadır. Grup kahvaltılarının i&ccedil;eriği m&uuml;nferit kahvaltıların i&ccedil;eriğinden farklı olabilir.&nbsp; Gidilen &uuml;lkelerdeki otellerde alınacak olan kahvaltıların i&ccedil;eriği T&uuml;rk kahvaltısı değildir. Grup kahvaltıları genelde continental kahvaltı olarak ayrı salonda verilmektedir.&nbsp; Continental kahvaltı temel olarak &ccedil;ay ya da kahve, marmelat ve kruvasandan oluşup, &uuml;lkeye g&ouml;re değişiklikler g&ouml;stermektedir.</li>\n\t<li>U&ccedil;aksız olarak tura dahil olan misafirlerimizin, grup ile aynı u&ccedil;uşları kullanmadıkları takdirde havalimanı-otel-havalimanı transferlerini kullanamayacakları gibi şehir turuna katılamama durumu da s&ouml;z konusu olabilir. Farklı u&ccedil;uş kullandıkları takdirde grubun oteline ulaşımları kendi sorumluluklarındadır. Bu durum &ouml;nceden Prontotour&rsquo;a bildirilmelidir.</li>\n\t<li>T&uuml;rkiye &ccedil;ıkışlı u&ccedil;akların genelinde valiz ağırlığı 20 Kg.&rsquo;dır. Bu ağırlık u&ccedil;ak firması ve gidilecek &uuml;lkeye g&ouml;re değişiklik g&ouml;sterebilir. Gidilecek &uuml;lkede i&ccedil; hat u&ccedil;uşları bulunuyorsa, bu i&ccedil; hat u&ccedil;uşlarda valiz ağırlığı 15 Kg&rsquo;a d&uuml;şebilmektedir. Fazla bagaj ağırlık / fiyat kuralları havayolları tarafından belirlenmekte olup, Prontotour&rsquo;un sorumluluğunda değildir.</li>\n\t<li>Kayıt esnasında pasaportta ge&ccedil;en isim, doğum tarihi, pasaport numarasının sisteme girilmesi gerekmektedir. U&ccedil;ak biletleri bu bilgilere g&ouml;re kesilmektedir. Hatalı bilgilerden oluşacak u&ccedil;ak bileti iptal veya değişikliklerinin ceza bedeli misafirlere yansıtılır.</li>\n\t<li>Prontotour, misafirlerimiz ile konsolosluk arasında aracı kurum olup, herhangi bir vize alım garantisi vermez. Konsolosluğun vize vermemesi veya red vermesi Prontotour&rsquo;un sorumluluğunda değildir.</li>\n\t<li>Programlarımızdaki vize durumları T&uuml;rkiye Cumhuriyeti pasaportları bazında verilmektedir. Başka &uuml;lke pasaportuna sahip misafirlerimiz vize durumlarını bağlı bulundukları &uuml;lkelerin konsolosluklardan kontrol edebilir.</li>\n\t<li>Pasaportların seyahat tarihinin bitimi baz alınarak minimum 6 ay ge&ccedil;erliliği olması gerekmektedir. 6 aydan az s&uuml;reyle seyahat eden misafirlerimiz, &uuml;lke pasaport polisleri tarafından &uuml;lkeye alınmama durumu ile karşılaşabilir. Bu gibi durumlarda sorumluluk pasaport sahibine aittir.</li>\n\t<li>Cep telefonlarınızı yurtdışında kullanabilmek i&ccedil;in T&uuml;rkiye&rsquo;den ayrılmadan &ouml;nce, telefonunuzun yurtdışına a&ccedil;ık olup olmadığını gsm operat&ouml;r&uuml;n&uuml;zden kontrol etmeniz tavsiye edilir.</li>\n\t<li>Fuar, kongre, konser gibi &ouml;zel ve yoğun zamanlarda merkeze uzak oteller kullanılabilir.</li>\n\t<li>Bazı programlarımız birka&ccedil; alternatifli oteller bazında sunulmaktadır. Birden fazla otel se&ccedil;eneği olan programlarımızın rehber ve transfer aracı aynı olabilir.</li>\n\t<li>Promosyon ibaresi bulunan turlarımızda otellerimizin konumu ve verilen hizmetin i&ccedil;eriği standart paketlerimize g&ouml;re farklılık g&ouml;sterebilir. Promosyon turlarımızda misafir tarafından iptal ve değişiklik yapılamaz. L&uuml;tfen satın aldığınız turun satış s&ouml;zleşmesini dikkatle okuyunuz.</li>\n\t<li>U&ccedil;ak biletlerini milleri ile upgrade etmek isteyen misafirlerimiz, biletleri kesildikten sonra havayolunun(&uuml;yeliğinizin bulunduğu havayolunu kontrol ediniz) m&uuml;saitliğine bağlı olarak upgrade işlemlerini ger&ccedil;ekleştirebilir. Programın grup biletlerinin upgrade edilebilir sınıftan olup olmadığını kontrol ediniz. Programlarımızdaki her u&ccedil;uş i&ccedil;in mil garantisi verilmez.</li>\n\t<li>Programlarda belirtilen u&ccedil;uş saatleri havayolları tarafından bildirilen saatlerdir. &Ouml;zel seferlerle d&uuml;zenlenen turlarımızda u&ccedil;ak saatleri 48 saat &ouml;ncesine kadar değişiklik g&ouml;sterebilir. Prontotour havayolu ile misafir arasında aracı konumundadır. Havayolundan kaynaklı gecikme, iptal, havaalanı ve havayolu değişikliği, kapasite &uuml;zerinde satış yapılması, hizmet aksamaları vb. gibi durumlardan Prontotour hi&ccedil;bir şekilde sorumlu tutulamaz.</li>\n\t<li>Programlarda verilen yol mesafeleri harita bazlıdır. Trafik, hava şartları, gidilen &uuml;lkenin coğrafi konumu, yol &ccedil;alışmaları ve şartları gibi durumlarda yolculuk s&uuml;releri uzayabilir.</li>\n\t<li>Bazı havayollarında yeme-i&ccedil;me ve online check-in hizmetleri ekstra &uuml;crete tabi olabilir.</li>\n</ul>\n'
      flightInformation: [
        '\t\t\tPegasus PC 331',
        '\t\t\tIstanbul (SAW) - Budapeşte',
        '\t\t\t14:10 - 14:15',
        '\t\t\tPegasus PC 332',
        '\t\t\tBudapeşte - Istanbul(SAW)',
        '\t\t\t15:45 - 19:50',
      ]
      hotelRooms: [
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0ugRNSI0l0nNxUen+E2SErS0='
          adultCount: 1
          childCount: 0
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0uj+cLk3uPE0nu7h2hpNZeI0='
          adultCount: 1
          childCount: 1
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0uh2eKpcRdw8EdKny9Dp2Of4='
          adultCount: 1
          childCount: 2
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0ulck0vCjAt8YMtk/D1oVb40='
          adultCount: 2
          childCount: 0
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0uqZaNmcWNV2gNb4B55tCtjA='
          adultCount: 2
          childCount: 1
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0uiydXPlbaavv8F/1WfYG/cA='
          adultCount: 2
          childCount: 2
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0ujzMDDUVgozOBiUd9mkOp/Q='
          adultCount: 3
          childCount: 0
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0ukiwDkOyZ72CKvCpJ6W02/A='
          adultCount: 3
          childCount: 1
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0ugjSm2rg7m/EgxP6k73hIwQ='
          adultCount: 3
          childCount: 2
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0um/RIDHC12t/scn1rdtZ5jI='
          adultCount: 4
          childCount: 0
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0uvXjSarqp1mve5Eg8EuID/8='
          adultCount: 4
          childCount: 1
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0ukdjULCO9BCmQ5vHFij8KUg='
          adultCount: 4
          childCount: 2
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0ukg/Li9gOkOx4lTI0Ow5lp8='
          adultCount: 5
          childCount: 0
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0unXqamMGiilx4jz5MPw+A9E='
          adultCount: 5
          childCount: 1
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0utVreHtpVPiLvPEAWJ2dxzQ='
          adultCount: 5
          childCount: 2
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0uhF4t5H1ORDfsZDX0LIn/3U='
          adultCount: 6
          childCount: 0
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0urPaaAVqcPOD8xbJEQ7ZtZc='
          adultCount: 6
          childCount: 1
          additionalBedCount: 0
        },
        {
          key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0uhHIxDld0PDwVOrZe+prAvM='
          adultCount: 6
          childCount: 2
          additionalBedCount: 0
        },
      ]
      additionalSSRData: {
        items: [
          {
            uniqueIdentifier: 'ac70d1e2-69e2-4356-9414-ce599c5b8b89'
            code: 'VisaReason'
            included: true
            description: 'Reason to not get visa'
            selected: true
            required: true
            indexNo: 0
            data: null
            filters: [
              {
                key: '-'
                value: '0|-'
                indexNo: 0
              },
              {
                key: 'Vizem var'
                value: '3|HaveAlready'
                indexNo: 0
              },
              {
                key: 'Yeşil pasaportum var'
                value: '1|HaveGreenPassport'
                indexNo: 0
              },
              {
                key: 'Kendim temin edeceğim'
                value: '2|WillGetMyself'
                indexNo: 0
              },
            ]
          },
          {
            uniqueIdentifier: '4a70a262-19ba-4e1c-b388-60c6f49b95ad'
            code: 'BedType'
            included: true
            description: 'Bed Type  (T)win Bed (F)rench Bed'
            selected: true
            required: true
            indexNo: 1
            data: null
            filters: [
              {
                key: 'Ayrı Yataklar'
                value: 'T|TwinBed'
                indexNo: 0
              },
              {
                key: 'Tek Büyük Yatak'
                value: 'F|FrenchBed'
                indexNo: 0
              },
            ]
          },
        ]
        owner: {
          type: 2
          ownerKey: 'ProntoTour'
          identifier: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0ulPdW3x1z7YEuROIJ+ocKlfWt+3rEw14Y+sbLxTgTiGl'
        }
        subGroups: []
      }
    }
    tlPrice: ServicePriceType
    calculatedId: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0ulPdW3x1z7YEuROIJ+ocKlfWt+3rEw14Y+sbLxTgTiGl'
    slug: 'pegasus-ile-budapeste-turu-3-gece-11235432'
    slugId: '11235432'
    isDomestic: boolean
    commission: 80.0
    key: 'fl3Pyolba8cvhSHLImVwpkq8wbEXAyp5WuTH7tDwC8jZtJsa/0+jhJh75EZDnD/mcEXvubj2r0JwSD5F+3X0ulPdW3x1z7YEuROIJ+ocKlfWt+3rEw14Y+sbLxTgTiGl'
    totalPrice: {
      value: 33226.0
      currency: 'TRY'
      rateValue: null
    }
    basePrice: {
      value: 33226.0
      currency: 'TRY'
      rateValue: null
    }
    taxes: {
      value: 0.0
      currency: null
      rateValue: null
    }
    discount: {
      value: 0.0
      currency: null
      rateValue: null
    }
    buyFee: {
      code: '%10.0'
      price: {
        value: 3020.55
        currency: 'TRY'
        rateValue: null
      }
    }
    fee: {
      code: '%10.0'
      price: {
        value: 3020.55
        currency: 'TRY'
        rateValue: null
      }
    }
    passengerPrices: [
      {
        unitPrice: {
          value: 0.0
          currency: null
          rateValue: null
        }
        unitBasePrice: {
          value: 0.0
          currency: null
          rateValue: null
        }
        unitFee: {
          code: null
          price: {
            value: 0.0
            currency: null
            rateValue: null
          }
        }
        unitTax: {
          value: 0.0
          currency: null
          rateValue: null
        }
        cancelPenalty: null
        changePenalty: null
        passengers: [
          {
            key: 'Adult_0'
            name: null
            passengerType: 0
            age: 0
            birthday: '0001-01-01T00:00:00'
            gender: 0
          },
          {
            key: 'Adult_1'
            name: null
            passengerType: 0
            age: 0
            birthday: '0001-01-01T00:00:00'
            gender: 0
          },
        ]
        taxInfos: null
        serviceCharges: null
      },
    ]
    taxInfos: null
    serviceCharges: null
  }
}
