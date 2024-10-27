export type ChildNode = {
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
  childNodes: [
    {
      id: ID
      orderId: ID
      key: string
      items: [
        {
          valueType: string
          key: string
          value: {
            _passengerId: 0
            model_PassengerId: 1
            declaredAge: 0
            productType: 1
            checkinDate: '2024-11-27T07:40:00'
            calculationYearBased: false
            calculationYearType: 1
            passengerId: 0
            sequenceNo: 1
            type: 0
            gender: 0
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
            isContact: false
            flightFrequencyNo: null
            notes: null
            passportValidityDate: null
            webUserId: 0
            passportCountry: null
            groupOrderIndex: 0
            passengerKey: '8126560C2A454B7AFB0D3DCA1CA77D446D0170E107607B099E3969D8D213FA0F'
            isRecord: false
            listFlightFrequencyAirline: null
            listFlightFrequencyNo: null
            registeredPassengerId: 0
            isDontValidate: false
            hesCode: null
          }
          orderId: 1
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
  exceptionAction: null
  viewBag: {
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
    AdditionalData: {
      additionalData: {
        items: []
        owner: {
          type: number
          ownerKey: string
          identifier: null
        }
        subGroups: [
          {
            items: []
            owner: {
              type: 1
              ownerKey: 'Flight'
              identifier: null
            }
            subGroups: {
              items: [
                {
                  uniqueIdentifier: 'XBAG_SAW_ADB_PC_ALaCarteBaggageOffer1_Offer-1__Service-1_XBagServiceDef1_BagAllowance1_ADT_SH1_'
                  code: 'XBAG'
                  included: boolean
                  description: null
                  selected: boolean
                  required: boolean
                  indexNo: 0
                  data: '800.00:TRY:ADT:CarryOn:5:KG:SH1:'
                  filters: [
                    {
                      key: 'OriginDestination'
                      value: {
                        departureTime: '2024-11-27T00:00:00'
                        cabinClass: null
                        permittedAirlines: null
                        prohibitedAirlines: null
                        permittedConnectionPoints: null
                        prohibitedConnectionPoints: null
                        maxConnections: 0
                        origin: {
                          code: 'SAW'
                          isDomestic: false
                          iata: null
                          type: 7
                          id: 0
                        }
                        destination: {
                          code: 'ADB'
                          isDomestic: false
                          iata: null
                          type: 7
                          id: 0
                        }
                      }
                      indexNo: 0
                    },
                    {
                      key: 'Direction'
                      value: 1
                      indexNo: 0
                    },
                    {
                      key: 'PassengerId'
                      value: 'SH1'
                      indexNo: 0
                    },
                    {
                      key: 'PassengerType'
                      value: 'ADT'
                      indexNo: 0
                    },
                  ]
                },
                {
                  uniqueIdentifier: 'XBAG_SAW_ADB_PC_ALaCarteBaggageOffer1_Offer-2__Service-2_XBagServiceDef2_BagAllowance2_ADT_SH1_'
                  code: 'XBAG'
                  included: false
                  description: null
                  selected: false
                  required: false
                  indexNo: 1
                  data: '1600.00:TRY:ADT:CarryOn:10:KG:SH1:'
                  filters: [
                    {
                      key: 'OriginDestination'
                      value: {
                        departureTime: '2024-11-27T00:00:00'
                        cabinClass: null
                        permittedAirlines: null
                        prohibitedAirlines: null
                        permittedConnectionPoints: null
                        prohibitedConnectionPoints: null
                        maxConnections: 0
                        origin: {
                          code: 'SAW'
                          isDomestic: false
                          iata: null
                          type: 7
                          id: 0
                        }
                        destination: {
                          code: 'ADB'
                          isDomestic: false
                          iata: null
                          type: 7
                          id: 0
                        }
                      }
                      indexNo: 0
                    },
                    {
                      key: 'Direction'
                      value: 1
                      indexNo: 0
                    },
                    {
                      key: 'PassengerId'
                      value: 'SH1'
                      indexNo: 0
                    },
                    {
                      key: 'PassengerType'
                      value: 'ADT'
                      indexNo: 0
                    },
                  ]
                },
                {
                  uniqueIdentifier: 'XBAG_SAW_ADB_PC_ALaCarteBaggageOffer1_Offer-3__Service-3_XBagServiceDef3_BagAllowance3_ADT_SH1_'
                  code: 'XBAG'
                  included: false
                  description: null
                  selected: false
                  required: false
                  indexNo: 2
                  data: '3200.00:TRY:ADT:CarryOn:20:KG:SH1:'
                  filters: [
                    {
                      key: 'OriginDestination'
                      value: {
                        departureTime: '2024-11-27T00:00:00'
                        cabinClass: null
                        permittedAirlines: null
                        prohibitedAirlines: null
                        permittedConnectionPoints: null
                        prohibitedConnectionPoints: null
                        maxConnections: 0
                        origin: {
                          code: 'SAW'
                          isDomestic: false
                          iata: null
                          type: 7
                          id: 0
                        }
                        destination: {
                          code: 'ADB'
                          isDomestic: false
                          iata: null
                          type: 7
                          id: 0
                        }
                      }
                      indexNo: 0
                    },
                    {
                      key: 'Direction'
                      value: 1
                      indexNo: 0
                    },
                    {
                      key: 'PassengerId'
                      value: 'SH1'
                      indexNo: 0
                    },
                    {
                      key: 'PassengerType'
                      value: 'ADT'
                      indexNo: 0
                    },
                  ]
                },
                {
                  uniqueIdentifier: 'XBAG_SAW_ADB_PC_ALaCarteBaggageOffer1_Offer-4__Service-4_XBagServiceDef4_BagAllowance4_ADT_SH1_'
                  code: 'XBAG'
                  included: false
                  description: null
                  selected: false
                  required: false
                  indexNo: 3
                  data: '4800.00:TRY:ADT:CarryOn:30:KG:SH1:'
                  filters: [
                    {
                      key: 'OriginDestination'
                      value: {
                        departureTime: '2024-11-27T00:00:00'
                        cabinClass: null
                        permittedAirlines: null
                        prohibitedAirlines: null
                        permittedConnectionPoints: null
                        prohibitedConnectionPoints: null
                        maxConnections: 0
                        origin: {
                          code: 'SAW'
                          isDomestic: false
                          iata: null
                          type: 7
                          id: 0
                        }
                        destination: {
                          code: 'ADB'
                          isDomestic: false
                          iata: null
                          type: 7
                          id: 0
                        }
                      }
                      indexNo: 0
                    },
                    {
                      key: 'Direction'
                      value: 1
                      indexNo: 0
                    },
                    {
                      key: 'PassengerId'
                      value: 'SH1'
                      indexNo: 0
                    },
                    {
                      key: 'PassengerType'
                      value: 'ADT'
                      indexNo: 0
                    },
                  ]
                },
              ]
              owner: {
                type: number
                ownerKey: string
                identifier: string
              }
              subGroups: []
            }[]
          },
        ]
      }
    }
    PassengerData: {
      id: null
      orderId: ID
      key: 'ROOT'
      items: []
      childNodes: ChildNode[]
    }
    ModuleName: 'Flight'
    SummaryViewDataResponser: {
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
                      gender: 0
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
              isOWCCombinable: false
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
                StandartSeatSelection: false
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
                  isDomestic: false
                  iata: null
                  type: 7
                  id: 0
                }
                destination: {
                  code: 'ADB'
                  isDomestic: false
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
                isMeal: false
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
                  gender: 0
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
        airportList: {
          ADB: {
            id: 90074
            code: 'ADB'
            value: [
              {
                langCode: 'tr_TR'
                value: 'Adnan Menderes Havalimanı'
              },
            ]
            countryCode: 'tr'
            country: 'Türkiye'
            city: 'İzmir'
          }
        }
        airlineList: {
          PC: 'Pegasus  Havayolları'
        }
        applyCancelationInsurance: boolean
        buyInsurancePrice: number
        sellInsurancePrice: number
        showOnlyInsurancePrice: number
        moduleName: 'Flight'
        totalPrice: number
        priceCurrency: 'TRY'
        loyaltyMultiple: 2
        couponDiscountList: null
        extraCharges: null
        financellDiscount: {
          value: number
          currency: null
          rateValue: null
        }
      }
    }
    PassengerInfoBackUrl: string
    FlightDetailToSearchReturnPath: null
    ViewIsPassengerInfo: boolean
    IsPassengerViewDataCached: boolean
    HESAddressReq: false
    FlightCancellationInsuranceAmount: number
    FlightCancellationInsurancePasssengerCount: number
    isPassportReq: boolean
    isHESReq: boolean
    FlightArrivalDate: '27 Kasım 2024'
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
        isSucceeded: false
        diagnostics: {
          sessionToken: '7E3175C8FDC0420E19D7D6B44A8E685B27EFE7F12ABEC41D9669FCF29409053B'
          providerId: 2078
          providerName: 'Tamamliyo'
          generatingRequestTime: '00:00:00.3283172'
          callingServiceTime: '00:00:00.3182215'
          generatingResponseTime: '00:00:00.0102896'
          subDiagnostics: null
          lastException: null
          serviceRequestData: null
          serviceResponseData: null
          providerInfo: {
            isActive: boolean
            isProduction: false
          }
          traceId: null
        }
        eventMessages: []
        appName: string
        scopeCode: string
        logSessionToken: 'BE27D7BE9D18F8B500F6EDFFBB254BE6BCAAB1011463285BD23548A29878D677'
        logSearchToken: '738D00E2996563489F52CB7A25F1AAC938B757BA721C61028E77EC1BA4E54B26'
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
                      gender: 0
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
              isOWCCombinable: false
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
                StandartSeatSelection: false
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
                  isDomestic: false
                  iata: null
                  type: 7
                  id: 0
                }
                destination: {
                  code: 'ADB'
                  isDomestic: false
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
                isMeal: false
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
                  gender: 0
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
        hasOwc: false
        activeFlightTripKind: 1
        sessionToken: 'BE27D7BE9D18F8B500F6EDFFBB254BE6BCAAB1011463285BD23548A29878D677'
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
          ADB: {
            id: 90074
            code: 'ADB'
            value: [
              {
                langCode: 'tr_TR'
                value: 'Adnan Menderes Havalimanı'
              },
            ]
            countryCode: 'tr'
            country: 'Türkiye'
            city: 'İzmir'
          }
        }
        airlineList: {
          PC: 'Pegasus  Havayolları'
        }
        applyCancelationInsurance: false
        buyInsurancePrice: 0.0
        sellInsurancePrice: 0.0
        showOnlyInsurancePrice: 0.0
        moduleName: 'Flight'
        totalPrice: 2207.18
        priceCurrency: 'TRY'
        loyaltyMultiple: 2
        couponDiscountList: null
        extraCharges: null
        financellDiscount: {
          value: 0.0
          currency: null
          rateValue: null
        }
      }
    }
    Reservable: 1
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
    childNodes: [
      {
        id: null
        orderId: 1
        key: 'Adult'
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
              type: number
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
              customerId: 2
              customerUserId: 3
            }
            orderId: 3
          },
        ]
      },
    ]
  }
  paymentIndexModel: {
    isPhoneNumberConfirmed: false
    phoneNumber: ''
    billingInformationList: []
    installment: {
      installmentInfoList: [
        {
          amountPerInstallment: 2207.18
          bankName: 'YKB'
          binList: '510054,525864,533913,540061,540062,540063,540122,540129,542117,545103,552645,552659,554422'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'YKB'
          binList: '510054,525864,533913,540061,540062,540063,540122,540129,542117,545103,552645,552659,554422'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 584.9
          bankName: 'YKB'
          binList: '510054,525864,533913,540061,540062,540063,540122,540129,542117,545103,552645,552659,554422'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2339.6108
        },
        {
          amountPerInstallment: 397.29
          bankName: 'YKB'
          binList: '510054,525864,533913,540061,540062,540063,540122,540129,542117,545103,552645,552659,554422'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2383.7544
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'YKB'
          binList: '404809,446212,450634,455359,476625,476626,477959,479620,479794,479795,491205,491206,492128,492130,492131'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'YKB'
          binList: '404809,446212,450634,455359,476625,476626,477959,479620,479794,479795,491205,491206,492128,492130,492131'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 584.9
          bankName: 'YKB'
          binList: '404809,446212,450634,455359,476625,476626,477959,479620,479794,479795,491205,491206,492128,492130,492131'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2339.6108
        },
        {
          amountPerInstallment: 397.29
          bankName: 'YKB'
          binList: '404809,446212,450634,455359,476625,476626,477959,479620,479794,479795,491205,491206,492128,492130,492131'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2383.7544
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'HALKBANK'
          binList: '526290,537500,535241,526289,552879,543081,540435,521378,536503,542694,527284,510056'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'HALKBANK'
          binList: '526290,537500,535241,526289,552879,543081,540435,521378,536503,542694,527284,510056'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 579.38
          bankName: 'HALKBANK'
          binList: '526290,537500,535241,526289,552879,543081,540435,521378,536503,542694,527284,510056'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2317.539
        },
        {
          amountPerInstallment: 397.29
          bankName: 'HALKBANK'
          binList: '526290,537500,535241,526289,552879,543081,540435,521378,536503,542694,527284,510056'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2383.7544
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'HALKBANK'
          binList: '421030,447505,401049,415515,466260,451454,478551,499821,498852,492095,492094,415514,423480,456944,416607'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'HALKBANK'
          binList: '421030,447505,401049,415515,466260,451454,478551,499821,498852,492095,492094,415514,423480,456944,416607'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 579.38
          bankName: 'HALKBANK'
          binList: '421030,447505,401049,415515,466260,451454,478551,499821,498852,492095,492094,415514,423480,456944,416607'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2317.539
        },
        {
          amountPerInstallment: 397.29
          bankName: 'HALKBANK'
          binList: '421030,447505,401049,415515,466260,451454,478551,499821,498852,492095,492094,415514,423480,456944,416607'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2383.7544
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'Ziraat'
          binList: '404591,407814,413226,434528,434529,439561,444676,444677,444678,447504,454671,454672,454673,454674,460952,469884,476619,482465,487146,487147,487148,487149,416283,456838,494101'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'Ziraat'
          binList: '404591,407814,413226,434528,434529,439561,444676,444677,444678,447504,454671,454672,454673,454674,460952,469884,476619,482465,487146,487147,487148,487149,416283,456838,494101'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 584.9
          bankName: 'Ziraat'
          binList: '404591,407814,413226,434528,434529,439561,444676,444677,444678,447504,454671,454672,454673,454674,460952,469884,476619,482465,487146,487147,487148,487149,416283,456838,494101'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2339.6108
        },
        {
          amountPerInstallment: 393.61
          bankName: 'Ziraat'
          binList: '404591,407814,413226,434528,434529,439561,444676,444677,444678,447504,454671,454672,454673,454674,460952,469884,476619,482465,487146,487147,487148,487149,416283,456838,494101'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2361.6826
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'Ziraat'
          binList: '511885,512440,513662,516932,523529,525329,527682,527737,528208,530905,531102,533154,534981,535735,537470,540130,540134,542374,542941,546957,547287,549449,525339,527749,535248,539134,557844,533764,536479,533612,530699,533376,533184'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'Ziraat'
          binList: '511885,512440,513662,516932,523529,525329,527682,527737,528208,530905,531102,533154,534981,535735,537470,540130,540134,542374,542941,546957,547287,549449,525339,527749,535248,539134,557844,533764,536479,533612,530699,533376,533184'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 584.9
          bankName: 'Ziraat'
          binList: '511885,512440,513662,516932,523529,525329,527682,527737,528208,530905,531102,533154,534981,535735,537470,540130,540134,542374,542941,546957,547287,549449,525339,527749,535248,539134,557844,533764,536479,533612,530699,533376,533184'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2339.6108
        },
        {
          amountPerInstallment: 393.61
          bankName: 'Ziraat'
          binList: '511885,512440,513662,516932,523529,525329,527682,527737,528208,530905,531102,533154,534981,535735,537470,540130,540134,542374,542941,546957,547287,549449,525339,527749,535248,539134,557844,533764,536479,533612,530699,533376,533184'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2361.6826
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'GARANTI'
          binList: '374421,374422,374424,374425,374426,374427,375622,375623,375624,375625,375626,375627,375628,375629,375631,377137,377599,377598,377597,377596,374428,374423'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'GARANTI'
          binList: '374421,374422,374424,374425,374426,374427,375622,375623,375624,375625,375626,375627,375628,375629,375631,377137,377599,377598,377597,377596,374428,374423'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 584.9
          bankName: 'GARANTI'
          binList: '374421,374422,374424,374425,374426,374427,375622,375623,375624,375625,375626,375627,375628,375629,375631,377137,377599,377598,377597,377596,374428,374423'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2339.6108
        },
        {
          amountPerInstallment: 397.29
          bankName: 'GARANTI'
          binList: '374421,374422,374424,374425,374426,374427,375622,375623,375624,375625,375626,375627,375628,375629,375631,377137,377599,377598,377597,377596,374428,374423'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2383.7544
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'GARANTI'
          binList: '514915,520097,520922,520940,520988,521824,521825,522204,524659,526955,528939,528956,533169,534261,540036,540037,540118,540669,540709,541865,542030,543738,544078,544294,548935,553130,554253,554254,554960,557023,558699,537829,549997,538196,538139,538124,517048,517042,510151'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'GARANTI'
          binList: '514915,520097,520922,520940,520988,521824,521825,522204,524659,526955,528939,528956,533169,534261,540036,540037,540118,540669,540709,541865,542030,543738,544078,544294,548935,553130,554253,554254,554960,557023,558699,537829,549997,538196,538139,538124,517048,517042,510151'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 584.9
          bankName: 'GARANTI'
          binList: '514915,520097,520922,520940,520988,521824,521825,522204,524659,526955,528939,528956,533169,534261,540036,540037,540118,540669,540709,541865,542030,543738,544078,544294,548935,553130,554253,554254,554960,557023,558699,537829,549997,538196,538139,538124,517048,517042,510151'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2339.6108
        },
        {
          amountPerInstallment: 397.29
          bankName: 'GARANTI'
          binList: '514915,520097,520922,520940,520988,521824,521825,522204,524659,526955,528939,528956,533169,534261,540036,540037,540118,540669,540709,541865,542030,543738,544078,544294,548935,553130,554253,554254,554960,557023,558699,537829,549997,538196,538139,538124,517048,517042,510151'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2383.7544
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'GARANTI'
          binList: '403280,403666,404308,413836,426886,426887,426888,427314,427315,428220,428221,432154,448472,461668,462274,467293,467294,467295,474151,479660,479661,482489,482490,482491,487074,487075,489478,490175,492186,492187,492193,493845'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'GARANTI'
          binList: '403280,403666,404308,413836,426886,426887,426888,427314,427315,428220,428221,432154,448472,461668,462274,467293,467294,467295,474151,479660,479661,482489,482490,482491,487074,487075,489478,490175,492186,492187,492193,493845'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 584.9
          bankName: 'GARANTI'
          binList: '403280,403666,404308,413836,426886,426887,426888,427314,427315,428220,428221,432154,448472,461668,462274,467293,467294,467295,474151,479660,479661,482489,482490,482491,487074,487075,489478,490175,492186,492187,492193,493845'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2339.6108
        },
        {
          amountPerInstallment: 397.29
          bankName: 'GARANTI'
          binList: '403280,403666,404308,413836,426886,426887,426888,427314,427315,428220,428221,432154,448472,461668,462274,467293,467294,467295,474151,479660,479661,482489,482490,482491,487074,487075,489478,490175,492186,492187,492193,493845'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2383.7544
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'DENIZBANK'
          binList: '508129,510063,510118,510119,512017,512117,514924,515865,516731,516740,516741,516914,517047,520019,520303,520909,523515,529545,529876,533330,543358,543427,546764,549839,552679,555574,555636,555660,558443,558446,558448,558460,558514'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'DENIZBANK'
          binList: '508129,510063,510118,510119,512017,512117,514924,515865,516731,516740,516741,516914,517047,520019,520303,520909,523515,529545,529876,533330,543358,543427,546764,549839,552679,555574,555636,555660,558443,558446,558448,558460,558514'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 579.38
          bankName: 'DENIZBANK'
          binList: '508129,510063,510118,510119,512017,512117,514924,515865,516731,516740,516741,516914,517047,520019,520303,520909,523515,529545,529876,533330,543358,543427,546764,549839,552679,555574,555636,555660,558443,558446,558448,558460,558514'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2317.539
        },
        {
          amountPerInstallment: 397.29
          bankName: 'DENIZBANK'
          binList: '508129,510063,510118,510119,512017,512117,514924,515865,516731,516740,516741,516914,517047,520019,520303,520909,523515,529545,529876,533330,543358,543427,546764,549839,552679,555574,555636,555660,558443,558446,558448,558460,558514'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2383.7544
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'DENIZBANK'
          binList: '403134,404990,408625,409070,424360,424361,460345,460346,460347,472914,472915,476662,489456,489458'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'DENIZBANK'
          binList: '403134,404990,408625,409070,424360,424361,460345,460346,460347,472914,472915,476662,489456,489458'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 579.38
          bankName: 'DENIZBANK'
          binList: '403134,404990,408625,409070,424360,424361,460345,460346,460347,472914,472915,476662,489456,489458'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2317.539
        },
        {
          amountPerInstallment: 397.29
          bankName: 'DENIZBANK'
          binList: '403134,404990,408625,409070,424360,424361,460345,460346,460347,472914,472915,476662,489456,489458'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2383.7544
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'FINANSBANK'
          binList: '519324,521022,521836,529572,530818,531157,535177,542404,545120,545616,545847,547567,547800,526911'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'FINANSBANK'
          binList: '519324,521022,521836,529572,530818,531157,535177,542404,545120,545616,545847,547567,547800,526911'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 579.38
          bankName: 'FINANSBANK'
          binList: '519324,521022,521836,529572,530818,531157,535177,542404,545120,545616,545847,547567,547800,526911'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2317.539
        },
        {
          amountPerInstallment: 397.29
          bankName: 'FINANSBANK'
          binList: '519324,521022,521836,529572,530818,531157,535177,542404,545120,545616,545847,547567,547800,526911'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2383.7544
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'FINANSBANK'
          binList: '402277,402278,402563,403082,409364,410147,413583,414388,415565,422376,423277,423398,427311,435653,441007,442395,444029,499850,499851,499852'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'FINANSBANK'
          binList: '402277,402278,402563,403082,409364,410147,413583,414388,415565,422376,423277,423398,427311,435653,441007,442395,444029,499850,499851,499852'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 584.9
          bankName: 'FINANSBANK'
          binList: '402277,402278,402563,403082,409364,410147,413583,414388,415565,422376,423277,423398,427311,435653,441007,442395,444029,499850,499851,499852'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2339.6108
        },
        {
          amountPerInstallment: 397.29
          bankName: 'FINANSBANK'
          binList: '402277,402278,402563,403082,409364,410147,413583,414388,415565,422376,423277,423398,427311,435653,441007,442395,444029,499850,499851,499852'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2383.7544
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'ISBANK'
          binList: '510152,540667,540668,543771,548237,552096,553058'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'ISBANK'
          binList: '510152,540667,540668,543771,548237,552096,553058'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 584.9
          bankName: 'ISBANK'
          binList: '510152,540667,540668,543771,548237,552096,553058'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2339.6108
        },
        {
          amountPerInstallment: 397.29
          bankName: 'ISBANK'
          binList: '510152,540667,540668,543771,548237,552096,553058'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2383.7544
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'ISBANK'
          binList: '418342,418343,418344,418345,450803,454318,454358,454359,454360,479610'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'ISBANK'
          binList: '418342,418343,418344,418345,450803,454318,454358,454359,454360,479610'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 584.9
          bankName: 'ISBANK'
          binList: '418342,418343,418344,418345,450803,454318,454358,454359,454360,479610'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2339.6108
        },
        {
          amountPerInstallment: 397.29
          bankName: 'ISBANK'
          binList: '418342,418343,418344,418345,450803,454318,454358,454359,454360,479610'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2383.7544
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'AKBANK'
          binList: '512754,516840,520932,521807,524347,534253,550383,552608,552609,553056,557113,557829'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'AKBANK'
          binList: '512754,516840,520932,521807,524347,534253,550383,552608,552609,553056,557113,557829'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 584.9
          bankName: 'AKBANK'
          binList: '512754,516840,520932,521807,524347,534253,550383,552608,552609,553056,557113,557829'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2339.6108
        },
        {
          amountPerInstallment: 400.97
          bankName: 'AKBANK'
          binList: '512754,516840,520932,521807,524347,534253,550383,552608,552609,553056,557113,557829'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2405.8262
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'AKBANK'
          binList: '413252,425669,432071,432072,435508,435509,479680,493837'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'AKBANK'
          binList: '413252,425669,432071,432072,435508,435509,479680,493837'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 584.9
          bankName: 'AKBANK'
          binList: '413252,425669,432071,432072,435508,435509,479680,493837'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2339.6108
        },
        {
          amountPerInstallment: 400.97
          bankName: 'AKBANK'
          binList: '413252,425669,432071,432072,435508,435509,479680,493837'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2405.8262
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'Ziraat'
          binList: '979217,979280,979286,650083,650268,650273,650274,650846,650847,658768,680848,650849,650850'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'Ziraat'
          binList: '979217,979280,979286,650083,650268,650273,650274,650846,650847,658768,680848,650849,650850'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 584.9
          bankName: 'Ziraat'
          binList: '979217,979280,979286,650083,650268,650273,650274,650846,650847,658768,680848,650849,650850'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2339.6108
        },
        {
          amountPerInstallment: 393.61
          bankName: 'Ziraat'
          binList: '979217,979280,979286,650083,650268,650273,650274,650846,650847,658768,680848,650849,650850'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2361.6826
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'VAKIFBANK'
          binList: '520017,522441,531369,535576,535775,537504,540045,540046,542119,542798,542804,547244,552101,554548,555467,589311'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'VAKIFBANK'
          binList: '520017,522441,531369,535576,535775,537504,540045,540046,542119,542798,542804,547244,552101,554548,555467,589311'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 590.42
          bankName: 'VAKIFBANK'
          binList: '520017,522441,531369,535576,535775,537504,540045,540046,542119,542798,542804,547244,552101,554548,555467,589311'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2361.6826
        },
        {
          amountPerInstallment: 404.65
          bankName: 'VAKIFBANK'
          binList: '520017,522441,531369,535576,535775,537504,540045,540046,542119,542798,542804,547244,552101,554548,555467,589311'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2427.898
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'VAKIFBANK'
          binList: '402940,409084,411724,411943,411944,411979,415792,423478,428945,434530,434724,442671,459252,479909,483612,491005,493841,493846'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'VAKIFBANK'
          binList: '402940,409084,411724,411943,411944,411979,415792,423478,428945,434530,434724,442671,459252,479909,483612,491005,493841,493846'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 590.42
          bankName: 'VAKIFBANK'
          binList: '402940,409084,411724,411943,411944,411979,415792,423478,428945,434530,434724,442671,459252,479909,483612,491005,493841,493846'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2361.6826
        },
        {
          amountPerInstallment: 404.65
          bankName: 'VAKIFBANK'
          binList: '402940,409084,411724,411943,411944,411979,415792,423478,428945,434530,434724,442671,459252,479909,483612,491005,493841,493846'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2427.898
        },
        {
          amountPerInstallment: 2207.18
          bankName: 'VAKIFBANK'
          binList: '113015,650170\r\n'
          cardProgramName: 'Classic'
          installmentCount: 1
          totalAmount: 2207.18
        },
        {
          amountPerInstallment: 1136.7
          bankName: 'VAKIFBANK'
          binList: '113015,650170\r\n'
          cardProgramName: 'Classic'
          installmentCount: 2
          totalAmount: 2273.3954
        },
        {
          amountPerInstallment: 590.42
          bankName: 'VAKIFBANK'
          binList: '113015,650170\r\n'
          cardProgramName: 'Classic'
          installmentCount: 4
          totalAmount: 2361.6826
        },
        {
          amountPerInstallment: 404.65
          bankName: 'VAKIFBANK'
          binList: '113015,650170\r\n'
          cardProgramName: 'Classic'
          installmentCount: 6
          totalAmount: 2427.898
        },
      ]
      installmentType: 1
    }
    isDomestic: boolean
    isTotalSalaryNotEqualsZero: boolean
    showFinancell: boolean
    usedFinancellCredit: false
    paymentMethodList: null
    billingInfo: {
      id: 7566910135234401391
      name: ' '
      lastName: null
      type: 0
      tcKimlikNo: ''
      nationalityCheck: null
      countryCode: 'TR'
      city: 'İstanbul'
      district: 'Kadıköy'
      address: null
      mobilPhoneNumber: ''
      fullName: '  '
      email: null
    }
  }
  contactEmail: string | null
  contactGSM: string | null
  isInPromoList: boolean
  sessionToken: string
  searchToken: string
}
