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

    ModuleName: 'Flight' | 'Hotel'
    SummaryViewDataResponser: {
      summaryResponse: FlightReservationSummary
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
    SummaryViewDataResponserPI: {
      summaryResponse: {
        flightList: [
          {
            flightFareInfo: {
              flightDetailKeys: [
                'GwTA//4g3ToiewUaAz/Cgo6cvDJghhYWoQGVAK2462YSgJJl7DUxNorLXyfT/drCfj4tm/C3r+hDSf4XtUlvDlER+4VlXTkHHdJBIIQNSHS/efzt68jZEnpT7JvByV5jfndwihlXaUIT+bESsCiRKwoIw+yTBKTZT74nQ7FIIq7f61zGPtORTywh1gw/a3Qfwk6qXbDQpvCHzGGdbVH/yL2UYwEK0H3yhqGRctjWoUtqXefENLkD+PAsanWP0fsP21+02GqpmIpsSDzx6hj6EiL6LMQ8AU2A1v4YEtWQwlUIHV5lbpEhSLG72w9o7h3boLGdqdz8px2YoOtTXX0G/Jnl8i9CQaiTzTSYPn5RYD76Oh8iVGE5AUaAmGmqRqx0ntY7k8czRJj5qYMf5Tuoh5mfpRH15sKG1InxeJOsUv5ETSdACfcU5vfXxF1H9k3iC35XldH4b/e9d3fou+DXZSijpuxkylcFFAmR9wFTprFJfNkvXEuawFRvJiPzyxzYk6gKBNFkH5YWwE51DtpbsWzIj3UzhqvE/iJmJTwhhZb/BWDtVUihP398oCIMSsfb',
              ]
              groupId: 0
              key: 'GwTA//4g3ToiewUaAz/Cgo6cvDJghhYWoQGVAK2462YSgJJl7DUxNorLXyfT/drCfj4tm/C3r+hDSf4XtUlvDq0rcyBWQcOgSoSIOpY8kmXBblb5zIEGfj+b2gA0A+oBo2t57oB+I09CdD4aEclgcBV0ybAQpPxkLVw75FvdSfjyezzS4WaQacpTOxjvPPzTyR2qLik7bAH+W5Prt3itmcYdva1xBPe89v+e4KzzC09HkH6lYvBgbYJexX3JhvbBj3eKg8jz3C6u7OpHOhHVbDPFkxkzP1UVX4SuzObEuqVWtye4VnKHABp3Mbr1ogemX8jJ6fGyuRmIyZXs6qxfNTvRejvNp0t8xx6HPPjbrpwQKelaKOvHI1nqqWtMIjO4/7KQkJangWc2NfqQe+YWwXmvdBmiFucgxpPQ8iEBGExjRpPGFWLSU/E2MgJBRB5Y+WGVoyM0TiQO4Dw0Ql3LJXvG4sH3SHRgADs9hDDB5kA='
              totalPrice: {
                value: 2207.18
                currency: 'TRY'
                rateValue: null
              }
              basePrice: {
                value: 1584.88
                currency: 'TRY'
                rateValue: null
              }
              taxes: {
                value: 422.3
                currency: 'TRY'
                rateValue: null
              }
              discount: {
                value: 0.0
                currency: null
                rateValue: null
              }
              buyFee: {
                code: null
                price: {
                  value: 0.0
                  currency: null
                  rateValue: null
                }
              }
              fee: {
                code: ''
                price: {
                  value: 200.0
                  currency: 'TRY'
                  rateValue: null
                }
              }
              passengerPrices: [
                {
                  unitPrice: {
                    value: 2207.18
                    currency: 'TRY'
                    rateValue: null
                  }
                  unitBasePrice: {
                    value: 1584.88
                    currency: 'TRY'
                    rateValue: null
                  }
                  unitFee: {
                    code: ''
                    price: {
                      value: 200.0
                      currency: 'TRY'
                      rateValue: null
                    }
                  }
                  unitTax: {
                    value: 422.3
                    currency: 'TRY'
                    rateValue: null
                  }
                  cancelPenalty: null
                  changePenalty: null
                  passengers: [
                    {
                      key: '8126560C2A454B7AFB0D3DCA1CA77D446D0170E107607B099E3969D8D213FA0F'
                      name: null
                      passengerType: 0
                      age: 0
                      birthday: '0001-01-01T00:00:00'
                      gender: GenderEnums
                    },
                  ]
                  taxInfos: [
                    {
                      key: 'VQ'
                      value: '122.30'
                    },
                    {
                      key: 'YR'
                      value: '300.00'
                    },
                    {
                      key: '||'
                      value: '0'
                    },
                  ]
                  serviceCharges: null
                },
              ]
              taxInfos: null
              serviceCharges: null
            }
            flightDetail: {
              key: 'GwTA//4g3ToiewUaAz/Cgo6cvDJghhYWoQGVAK2462YSgJJl7DUxNorLXyfT/drCfj4tm/C3r+hDSf4XtUlvDlER+4VlXTkHHdJBIIQNSHS/efzt68jZEnpT7JvByV5jfndwihlXaUIT+bESsCiRKwoIw+yTBKTZT74nQ7FIIq7f61zGPtORTywh1gw/a3Qfwk6qXbDQpvCHzGGdbVH/yL2UYwEK0H3yhqGRctjWoUtqXefENLkD+PAsanWP0fsP21+02GqpmIpsSDzx6hj6EiL6LMQ8AU2A1v4YEtWQwlUIHV5lbpEhSLG72w9o7h3boLGdqdz8px2YoOtTXX0G/Jnl8i9CQaiTzTSYPn5RYD76Oh8iVGE5AUaAmGmqRqx0ntY7k8czRJj5qYMf5Tuoh5mfpRH15sKG1InxeJOsUv5ETSdACfcU5vfXxF1H9k3iC35XldH4b/e9d3fou+DXZSijpuxkylcFFAmR9wFTprFJfNkvXEuawFRvJiPzyxzYk6gKBNFkH5YWwE51DtpbsWzIj3UzhqvE/iJmJTwhhZb/BWDtVUihP398oCIMSsfb'
              groupId: 0
              flightSegmentKeys: [
                '6GwTA//4g3ToiewUaAz/Cgo6cvDJghhYWoQGVAK2462YSgJJl7DUxNorLXyfT/drCfj4tm/C3r+hDSf4XtUlvDq0rcyBWQcOgSoSIOpY8kmUUo3rG76R0eGqj7O4fPBG/ZYpq8vKR/5bn8XnzWDNQxr6VCg3n8dc/vKhCm1yLxRsEZWTA2AQCnMgg57rWKEmLZOH7kMsQgdYcwMKYQsFTog==',
              ]
              travelTime: '01:10:00'
              direction: 1
              isDomestic: boolean
              isOWCCombinable: boolean
              isPromotional: boolean
              reservable: boolean
              freeVolatileData: {
                data: 'OFFERITEM6_1:SH1'
                OfferID: 'NDQzNzgwNSo0MTk2OTE2MjAxOSo1MDc0NzgqWk9XKloqZmFsc2UqQTIwN0pINTgqMTkwMDYqT1cqdHJ1ZSoxMDA3LjE4KlRSWSoyMDI0LTExLTI3KlFxZlpncGhJSDNnaTFWOFYzVGt1cFF4cTBPY0tEc2I5S0FPY0xUNSUyQnU4cSUyRnFxbUwwSDMlMkZMbUlIaXNubzN4N1dSUmh2WjhBbzd3JTJCa2tzUkhIR0dXRmclM0QlM0Q='
                Owner: 'PC'
                ResponseID: '75a64c86fc7e4000a63abf437b803242'
                brandname: 'EXTRA'
                Seq: 'FL_SAWADB_2'
                SegmentRefs: 'NDQzNzgwNQ=='
                PassengerList: 'SH1'
                StandartSeatSelection: boolean
                AllSeatSelection: boolean
                FreeSandwich: boolean
                Entertainment: boolean
                FlexibleReturnChangeRight: boolean
              }
            }
            flightSegments: [
              {
                key: '6GwTA//4g3ToiewUaAz/Cgo6cvDJghhYWoQGVAK2462YSgJJl7DUxNorLXyfT/drCfj4tm/C3r+hDSf4XtUlvDq0rcyBWQcOgSoSIOpY8kmUUo3rG76R0eGqj7O4fPBG/ZYpq8vKR/5bn8XnzWDNQxr6VCg3n8dc/vKhCm1yLxRsEZWTA2AQCnMgg57rWKEmLZOH7kMsQgdYcwMKYQsFTog=='
                groupId: 0
                origin: {
                  code: 'SAW'
                  isDomestic: boolean
                  iata: null
                  type: 7
                  id: 0
                }
                destination: {
                  code: 'ADB'
                  isDomestic: boolean
                  iata: null
                  type: 7
                  id: 0
                }
                departureTime: '2024-11-27T07:40:00'
                arrivalTime: '2024-11-27T08:50:00'
                flightTime: '01:10:00'
                operatingAirline: {
                  code: 'PC'
                  value: null
                  countryCode: null
                }
                marketingAirline: {
                  code: 'PC'
                  value: null
                  countryCode: null
                }
                flightNumber: '2184'
                cabinClass: 0
                bookingCode: 'ZOW'
                equipment: null
                isMeal: boolean
                quota: 9
                baggageAllowance: {
                  maxWeight: {
                    value: 20.0
                    unit: 0
                  }
                  piece: {
                    pieceCount: 0
                  }
                }
                freeVolatileData: {
                  ResBookDesigID: {
                    SeatsLeft: 9
                    SeatsLeftSpecified: boolean
                    Value: 'Z'
                  }
                  ResBookDesigCode: 'ZOW'
                  Baggage: 'BaggageAllowance4'
                  BrandName: 'EXTRA'
                  Seq: 'FL_SAWADB_2'
                }
              },
            ]
            flightPackageInfos: []
          },
        ]
        flightFareInfo: {
          flightDetailKeys: null
          groupId: 0
          key: null
          totalPrice: {
            value: 2207.18
            currency: 'TRY'
            rateValue: null
          }
          basePrice: {
            value: 1584.88
            currency: 'TRY'
            rateValue: null
          }
          taxes: {
            value: 422.3
            currency: 'TRY'
            rateValue: null
          }
          discount: {
            value: 0.0
            currency: null
            rateValue: null
          }
          buyFee: {
            code: null
            price: {
              value: 0.0
              currency: null
              rateValue: null
            }
          }
          fee: {
            code: ''
            price: {
              value: 200.0
              currency: 'TRY'
              rateValue: null
            }
          }
          passengerPrices: [
            {
              unitPrice: {
                value: 2207.18
                currency: 'TRY'
                rateValue: null
              }
              unitBasePrice: {
                value: 1584.88
                currency: 'TRY'
                rateValue: null
              }
              unitFee: {
                code: ''
                price: {
                  value: 200.0
                  currency: 'TRY'
                  rateValue: null
                }
              }
              unitTax: {
                value: 422.3
                currency: 'TRY'
                rateValue: null
              }
              cancelPenalty: null
              changePenalty: null
              passengers: [
                {
                  key: '8126560C2A454B7AFB0D3DCA1CA77D446D0170E107607B099E3969D8D213FA0F'
                  name: null
                  passengerType: 0
                  age: 0
                  birthday: '0001-01-01T00:00:00'
                  gender: GenderEnums
                },
              ]
              taxInfos: [
                {
                  key: 'VQ'
                  value: '122.30'
                },
                {
                  key: 'YR'
                  value: '300.00'
                },
                {
                  key: '||'
                  value: '0'
                },
              ]
              serviceCharges: null
            },
          ]
          taxInfos: []
          serviceCharges: []
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
        buyInsurancePrice: 0.0
        sellInsurancePrice: 0.0
        showOnlyInsurancePrice: 0.0
        moduleName: 'Flight'
        totalPrice: number
        priceCurrency: string
        loyaltyMultiple: number
        couponDiscountList: null
        extraCharges: null
        financellDiscount: ServicePriceType
      }
    }
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
