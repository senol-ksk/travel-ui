export type ModuleNames =
  | 'Flight'
  | 'Visa'
  | 'Transfer'
  | 'CarRental'
  | 'Hotel'
  | 'Tour'
  | 'Bus'

export type ReservationFlight = {
  shoppingFileId: ID
  productId: ID
  productTypeName: ModuleNames
  providerName: string
  status: 4 | 5 | 9
  bookingCode: string
  lastName: string
  sellCurrency: string
  sellingDate: string
  total: number
  firstFlightDate: string
}

export type SummaryPassengerData = {
  modules: number[]
  passengers: {
    type: number
    gender: number
    fullName: string
    birthday: string
    identityNumber: string
    bookingCode: string
    campaignCode: null
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
    mlTotal: null
    rateOfInterest: null
    installmentCount: null
    bankName: null
    encryptedCardHolder: null
    encryptedCardNumber: null
    sellingCurrency: string
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
export type SummaryResponse = {
  passenger: SummaryPassengerData
  product: {
    summaryResponse: {
      flightList: [
        {
          flightFareInfo: {
            flightDetailKeys: ['579752']
            groupId: 0
            key: '681865'
            totalPrice: {
              value: 1154.22
              currency: 'TRY'
              rateValue: null
            }
            basePrice: {
              value: 615.38
              currency: 'TRY'
              rateValue: null
            }
            taxes: {
              value: 388.84
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
                value: 150
                currency: 'TRY'
                rateValue: null
              }
            }
            fee: {
              code: 'TRY'
              price: {
                value: 150
                currency: 'TRY'
                rateValue: null
              }
            }
            passengerPrices: [
              {
                unitPrice: {
                  value: 1154.22
                  currency: 'TRY'
                  rateValue: null
                }
                unitBasePrice: {
                  value: 615.38
                  currency: 'TRY'
                  rateValue: null
                }
                unitFee: {
                  code: 'TRY'
                  price: {
                    value: 150
                    currency: 'TRY'
                    rateValue: null
                  }
                }
                unitTax: {
                  value: 388.84
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
                    value: '275.00'
                  },
                  {
                    key: 'VQ'
                    value: '113.84'
                  },
                ]
                serviceCharges: [
                  {
                    code: 'Fee'
                    canApplyAmount: false
                    confirmPassenger: false
                    price: {
                      value: 150
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
                  value: 150
                  currency: 'TRY'
                  rateValue: null
                }
                desciption: null
              },
            ]
          }
          flightDetail: {
            key: '681865'
            groupId: 0
            flightSegmentKeys: ['579752']
            travelTime: '00:00:00'
            direction: 1
            isDomestic: true
            isOWCCombinable: false
            isPromotional: false
            reservable: false
            freeVolatileData: null
          }
          flightSegments: [
            {
              key: '579752'
              groupId: 0
              origin: {
                code: 'SAW'
                isDomestic: true
                iata: []
                type: 7
                id: 90073
              }
              destination: {
                code: 'ESB'
                isDomestic: true
                iata: []
                type: 7
                id: 90050
              }
              departureTime: '2024-08-27T09:20:00'
              arrivalTime: '2024-08-27T10:25:00'
              flightTime: '01:05:00'
              operatingAirline: {
                code: 'VF'
                value: 'AJet'
                countryCode: 'TR'
              }
              marketingAirline: {
                code: 'VF'
                value: 'AJet'
                countryCode: 'TR'
              }
              flightNumber: '3000'
              cabinClass: 0
              bookingCode: '1EQDAQ'
              equipment: ''
              isMeal: false
              quota: 1
              baggageAllowance: {
                maxWeight: {
                  value: 15
                  unit: 0
                }
                piece: {
                  pieceCount: 0
                }
              }
              freeVolatileData: null
            },
          ]
          flightPackageInfos: []
        },
      ]
      flightFareInfo: {
        flightDetailKeys: ['789979']
        groupId: 0
        key: '681865'
        totalPrice: {
          value: 1154.22
          currency: 'TRY'
          rateValue: null
        }
        basePrice: {
          value: 615.38
          currency: 'TRY'
          rateValue: null
        }
        taxes: {
          value: 388.84
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
            value: 150
            currency: 'TRY'
            rateValue: null
          }
        }
        fee: {
          code: 'TRY'
          price: {
            value: 150
            currency: 'TRY'
            rateValue: null
          }
        }
        passengerPrices: [
          {
            unitPrice: {
              value: 1154.22
              currency: 'TRY'
              rateValue: null
            }
            unitBasePrice: {
              value: 615.38
              currency: 'TRY'
              rateValue: null
            }
            unitFee: {
              code: 'TRY'
              price: {
                value: 150
                currency: 'TRY'
                rateValue: null
              }
            }
            unitTax: {
              value: 388.84
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
                value: '275.00'
              },
              {
                key: 'VQ'
                value: '113.84'
              },
            ]
            serviceCharges: [
              {
                code: 'Fee'
                canApplyAmount: false
                confirmPassenger: false
                price: {
                  value: 150
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
              value: 150
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
      sessionToken: 'E111DA1FA538D6BB82B5AA6A5554D5277C3065067332CA76754500C5365AFA9D'
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
        ESB: {
          id: 90050
          code: 'ESB'
          value: [
            {
              langCode: 'tr_TR'
              value: 'Ankara Esenboğa Havalimani'
            },
          ]
          countryCode: 'tr'
          country: 'Türkiye'
          city: 'Ankara'
        }
      }
      airlineList: {
        VF: 'AJet'
      }
      applyCancelationInsurance: true
      buyInsurancePrice: 0
      sellInsurancePrice: 0
      showOnlyInsurancePrice: 0
      productKey: 'sQAoJk/Nylbi8vA1biKZ1EC8WQ7St5j7gvjX4xT2bR9V/Zsb6KbvovSUFIrfYkEJ65J5X659AMR0eeK280fXJhsMFWgrYynzPcMs/6h0GGc='
      moduleName: 'Flight'
      totalPrice: 1154.22
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
  }
}
