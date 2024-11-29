import { CabinTypes } from '@/types/flight'
import {
  GenderEnumIndex,
  PassengerTypesIndexEnum,
} from '@/types/passengerViewModel'

type FlightGroupID = 1 | 0

export type FlightSummaryResponse = {
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

export type OperationSuccessResultType = {
  passenger: {
    modules: [1]
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
      moduleName: string
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
    }
  }
}
