import { CabinTypes } from '@/types/flight'

export type FlightPaymentResultType = {
  data: {
    dataViewResponsers: [
      {
        summaryResponse: {
          flightList: [
            {
              flightFareInfo: {
                flightDetailKeys: ['61418']
                groupId: 0
                key: '53852'
                totalPrice: {
                  value: 1112.56
                  currency: 'TRY'
                  rateValue: null
                }
                basePrice: {
                  value: 643.26
                  currency: 'TRY'
                  rateValue: null
                }
                taxes: {
                  value: 469.3
                  currency: 'TRY'
                  rateValue: null
                }
                discount: {
                  value: 0
                  currency: 'TRY'
                  rateValue: null
                }
                buyFee: {
                  code: 'TRY'
                  price: {
                    value: 0
                    currency: 'TRY'
                    rateValue: null
                  }
                }
                fee: {
                  code: 'TRY'
                  price: {
                    value: 0
                    currency: 'TRY'
                    rateValue: null
                  }
                }
                passengerPrices: [
                  {
                    unitPrice: {
                      value: 1112.56
                      currency: 'TRY'
                      rateValue: null
                    }
                    unitBasePrice: {
                      value: 643.26
                      currency: 'TRY'
                      rateValue: null
                    }
                    unitFee: {
                      code: 'TRY'
                      price: {
                        value: 0
                        currency: 'TRY'
                        rateValue: null
                      }
                    }
                    unitTax: {
                      value: 469.3
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
                        value: '350.0000'
                      },
                      {
                        key: 'VQ'
                        value: '119.3000'
                      },
                    ]
                    serviceCharges: [
                      {
                        code: 'Fee'
                        canApplyAmount: false
                        confirmPassenger: false
                        price: {
                          value: 0
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
                    canApplyAmount: false
                    confirmPassenger: false
                    price: {
                      value: 0
                      currency: 'TRY'
                      rateValue: null
                    }
                    desciption: null
                  },
                ]
              }
              flightDetail: {
                key: '53852'
                groupId: 0
                flightSegmentKeys: ['61418']
                travelTime: '00:00:00'
                direction: 1
                isDomestic: true
                isOWCCombinable: false
                isPromotional: false
                reservable: false
                // freeVolatileData: {}
              }
              flightSegments: [
                {
                  key: '61418'
                  groupId: 0
                  origin: {
                    code: string
                    isDomestic: boolean
                    iata: []
                    type: 7
                    id: ID
                  }
                  destination: {
                    code: 'OGU'
                    isDomestic: true
                    iata: ['OGU']
                    type: 1
                    id: 309
                  }
                  departureTime: '2024-12-13T06:20:00'
                  arrivalTime: '2024-12-13T07:55:00'
                  flightTime: '01:35:00'
                  operatingAirline: {
                    code: 'PC'
                    value: 'Pegasus  Havayolları'
                    countryCode: 'TR'
                  }
                  marketingAirline: {
                    code: 'PC'
                    value: 'Pegasus  Havayolları'
                    countryCode: 'TR'
                  }
                  flightNumber: CabinTypes
                  cabinClass: 0
                  bookingCode: '1UYMV3'
                  equipment: ''
                  isMeal: false
                  quota: 9
                  baggageAllowance: {
                    maxWeight: {
                      value: 15
                      unit: 0
                    }
                    piece: {
                      pieceCount: 0
                    }
                  }
                  // freeVolatileData: {}
                },
              ]
              flightPackageInfos: []
            },
          ]
          flightFareInfo: {
            flightDetailKeys: ['57444']
            groupId: 0
            key: '53852'
            totalPrice: {
              value: 1112.56
              currency: 'TRY'
              rateValue: null
            }
            basePrice: {
              value: 643.26
              currency: 'TRY'
              rateValue: null
            }
            taxes: {
              value: 469.3
              currency: 'TRY'
              rateValue: null
            }
            discount: {
              value: 0
              currency: 'TRY'
              rateValue: null
            }
            buyFee: {
              code: 'TRY'
              price: {
                value: 0
                currency: 'TRY'
                rateValue: null
              }
            }
            fee: {
              code: 'TRY'
              price: {
                value: 0
                currency: 'TRY'
                rateValue: null
              }
            }
            passengerPrices: [
              {
                unitPrice: {
                  value: 1112.56
                  currency: 'TRY'
                  rateValue: null
                }
                unitBasePrice: {
                  value: 643.26
                  currency: 'TRY'
                  rateValue: null
                }
                unitFee: {
                  code: 'TRY'
                  price: {
                    value: 0
                    currency: 'TRY'
                    rateValue: null
                  }
                }
                unitTax: {
                  value: 469.3
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
                    value: '350.0000'
                  },
                  {
                    key: 'VQ'
                    value: '119.3000'
                  },
                ]
                serviceCharges: [
                  {
                    code: 'Fee'
                    canApplyAmount: false
                    confirmPassenger: false
                    price: {
                      value: 0
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
                canApplyAmount: false
                confirmPassenger: false
                price: {
                  value: 0
                  currency: 'TRY'
                  rateValue: null
                }
                desciption: null
              },
            ]
          }
          flightPackageInfos: []
          isReservable: false
          hasOwc: false
          activeFlightTripKind: 1
          sessionToken: 'B677693245E6E70AE24F818F1E6C3FD8EC097FAE55723BF57C05E865542675D3'
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
          applyCancelationInsurance: true
          buyInsurancePrice: 0
          sellInsurancePrice: 0
          showOnlyInsurancePrice: 0
          moduleName: 'Flight'
          totalPrice: 1112.56
          priceCurrency: 'TRY'
          loyaltyMultiple: 0
          couponDiscountList: null
          extraCharges: {
            CIP: {
              value: 0
              currency: 'TRY'
              rateValue: null
            }
          }
          financellDiscount: {
            value: 0
            currency: null
            rateValue: null
          }
        }
      },
      {
        operationResultViewData: {
          modules: [1]
          passengers: [
            {
              type: 0
              gender: 0
              fullName: 'SENOL  KESKIN'
              birthday: '2000-02-20T00:00:00'
              identityNumber: '29*******80'
              bookingCode: '1UYMV3'
              campaignCode: null
              eTicketNumber: '6242444089573'
              firstName: 'SENOL'
              lastName: 'KESKIN'
              mobilePhoneNumber: '+90532*****23'
              email: 'SENOLK@LIDYATEKNOLOJI.COM'
              marketingAirlineCode: 'PC'
              isRoundedTrip: false
              module: 1
              groupOrderIndex: 1
              localPassengerSequenceNo: 1
              localRelatedPassengerSequenceNo: null
              discount: {
                value: 0
                currency: null
                rateValue: null
              }
              productItemId: 57444
            },
          ]
          billingInformation: [
            {
              billingName: 'senol keskin'
              isCompany: false
              address: 'Kadikoy Kadikoy Istanbul'
              taxNo: '29*******80'
            },
          ]
          paymentInformation: {
            basketTotal: 1112.56
            basketDiscountTotal: 0
            collectingTotal: 1112.56
            financellTotal: 0
            mlTotal: null
            rateOfInterest: 1
            installmentCount: 1
            bankName: 'AKBANK'
            encryptedCardHolder: 't*** t***'
            encryptedCardNumber: '435509******5232'
            sellingCurrency: 'TRY'
          }
          ssrList: []
          passengerCargoAddress: []
          bookingDateTime: '2024-11-18T08:13:55.41445'
          fromSession: false
          authorizeKey: null
          shoppingFileId: 52710
          taxAmount: 469.3
          shippingAmount: 0
          operationResultPromotionUsageList: null
        }
      },
      {
        summaryResponse: {
          flightList: [
            {
              flightFareInfo: {
                flightDetailKeys: ['61418']
                groupId: 0
                key: '53852'
                totalPrice: {
                  value: 1112.56
                  currency: 'TRY'
                  rateValue: null
                }
                basePrice: {
                  value: 643.26
                  currency: 'TRY'
                  rateValue: null
                }
                taxes: {
                  value: 469.3
                  currency: 'TRY'
                  rateValue: null
                }
                discount: {
                  value: 0
                  currency: 'TRY'
                  rateValue: null
                }
                buyFee: {
                  code: 'TRY'
                  price: {
                    value: 0
                    currency: 'TRY'
                    rateValue: null
                  }
                }
                fee: {
                  code: 'TRY'
                  price: {
                    value: 0
                    currency: 'TRY'
                    rateValue: null
                  }
                }
                passengerPrices: [
                  {
                    unitPrice: {
                      value: 1112.56
                      currency: 'TRY'
                      rateValue: null
                    }
                    unitBasePrice: {
                      value: 643.26
                      currency: 'TRY'
                      rateValue: null
                    }
                    unitFee: {
                      code: 'TRY'
                      price: {
                        value: 0
                        currency: 'TRY'
                        rateValue: null
                      }
                    }
                    unitTax: {
                      value: 469.3
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
                        value: '350.0000'
                      },
                      {
                        key: 'VQ'
                        value: '119.3000'
                      },
                    ]
                    serviceCharges: [
                      {
                        code: 'Fee'
                        canApplyAmount: false
                        confirmPassenger: false
                        price: {
                          value: 0
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
                    canApplyAmount: false
                    confirmPassenger: false
                    price: {
                      value: 0
                      currency: 'TRY'
                      rateValue: null
                    }
                    desciption: null
                  },
                ]
              }
              flightDetail: {
                key: '53852'
                groupId: 0
                flightSegmentKeys: ['61418']
                travelTime: '00:00:00'
                direction: 1
                isDomestic: true
                isOWCCombinable: false
                isPromotional: false
                reservable: false
                // freeVolatileData: {}
              }
              flightSegments: [
                {
                  key: '61418'
                  groupId: 0
                  origin: {
                    code: 'SAW'
                    isDomestic: true
                    iata: []
                    type: 7
                    id: 90073
                  }
                  destination: {
                    code: 'OGU'
                    isDomestic: true
                    iata: ['OGU']
                    type: 1
                    id: 309
                  }
                  departureTime: '2024-12-13T06:20:00'
                  arrivalTime: '2024-12-13T07:55:00'
                  flightTime: '01:35:00'
                  operatingAirline: {
                    code: 'PC'
                    value: 'Pegasus  Havayolları'
                    countryCode: 'TR'
                  }
                  marketingAirline: {
                    code: 'PC'
                    value: 'Pegasus  Havayolları'
                    countryCode: 'TR'
                  }
                  flightNumber: '2860'
                  cabinClass: 0
                  bookingCode: '1UYMV3'
                  equipment: ''
                  isMeal: false
                  quota: 9
                  baggageAllowance: {
                    maxWeight: {
                      value: 15
                      unit: 0
                    }
                    piece: {
                      pieceCount: 0
                    }
                  }
                  // freeVolatileData: {}
                },
              ]
              flightPackageInfos: []
            },
          ]
          flightFareInfo: {
            flightDetailKeys: ['57444']
            groupId: 0
            key: '53852'
            totalPrice: {
              value: 1112.56
              currency: 'TRY'
              rateValue: null
            }
            basePrice: {
              value: 643.26
              currency: 'TRY'
              rateValue: null
            }
            taxes: {
              value: 469.3
              currency: 'TRY'
              rateValue: null
            }
            discount: {
              value: 0
              currency: 'TRY'
              rateValue: null
            }
            buyFee: {
              code: 'TRY'
              price: {
                value: 0
                currency: 'TRY'
                rateValue: null
              }
            }
            fee: {
              code: 'TRY'
              price: {
                value: 0
                currency: 'TRY'
                rateValue: null
              }
            }
            passengerPrices: [
              {
                unitPrice: {
                  value: 1112.56
                  currency: 'TRY'
                  rateValue: null
                }
                unitBasePrice: {
                  value: 643.26
                  currency: 'TRY'
                  rateValue: null
                }
                unitFee: {
                  code: 'TRY'
                  price: {
                    value: 0
                    currency: 'TRY'
                    rateValue: null
                  }
                }
                unitTax: {
                  value: 469.3
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
                    value: '350.0000'
                  },
                  {
                    key: 'VQ'
                    value: '119.3000'
                  },
                ]
                serviceCharges: [
                  {
                    code: 'Fee'
                    canApplyAmount: false
                    confirmPassenger: false
                    price: {
                      value: 0
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
                canApplyAmount: false
                confirmPassenger: false
                price: {
                  value: 0
                  currency: 'TRY'
                  rateValue: null
                }
                desciption: null
              },
            ]
          }
          flightPackageInfos: []
          isReservable: false
          hasOwc: false
          activeFlightTripKind: 1
          sessionToken: 'B677693245E6E70AE24F818F1E6C3FD8EC097FAE55723BF57C05E865542675D3'
          airportList: {
            SAW: {
              id: 90073
              code: 'SAW'
              value: [
                {
                  langCode: 'tr_TR'
                  value: 'Sabiha Gökçen Uluslararası Havalimanı'
                },
              ]
              countryCode: 'tr'
              country: 'Türkiye'
              city: 'İstanbul'
            }
            OGU: {
              id: 90099
              code: 'OGU'
              value: [
                {
                  langCode: 'tr_TR'
                  value: 'Ordu-Giresun Havalimanı'
                },
              ]
              countryCode: 'tr'
              country: 'Türkiye'
              city: 'Ordu'
            }
          }
          airlineList: {
            PC: 'Pegasus  Havayolları'
          }
          applyCancelationInsurance: true
          buyInsurancePrice: 0
          sellInsurancePrice: 0
          showOnlyInsurancePrice: 0
          moduleName: 'Flight'
          totalPrice: 1112.56
          priceCurrency: 'TRY'
          loyaltyMultiple: 0
          couponDiscountList: null
          extraCharges: {
            CIP: {
              value: 0
              currency: 'TRY'
              rateValue: null
            }
          }
          financellDiscount: {
            value: 0
            currency: null
            rateValue: null
          }
        }
      },
    ]
    totalPrice: 0
    totalPriceCurrency: 0
  }
  success: true
  statusCode: 0
  message: null
  errors: null
  validModelState: null
}
