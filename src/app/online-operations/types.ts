export type OperationResultWithBookingCodeResponse = {
  productDataViewResponser: {
    dataViewResponsers:
      | CarBookingDetailApiResponse
      | HotelBookingDetailApiResponse
    totalPrice: number
    totalPriceCurrency: number
  }
  flightETicketViewDataModel: null
  flightTicketNumber: string | null
}

export type CarBookingDetailApiResponse = [
  {
    summaryResponse: {
      detailResponse: {
        items: [
          {
            carDetail: {
              name: 'Dacia Sandero Manuel veya Benzeri'
              pickupDate: '2025-04-21T00:00:00'
              pickupId: '303809'
              pickupCode: 'Sivas Nuri Demirağ Havalimanı (VAS)'
              returnDate: '2025-04-22T00:00:00'
              returnId: '303809'
              returnCode: 'Sivas Nuri Demirağ Havalimanı (VAS)'
              type: 0
              category: 'Standart'
              doorCount: 4
              passengerCount: 0
              imageUrl: null
              vendorUrl: null
              vendorName: null
              airConditioning: false
              automaticTransmission: false
              transmissionDrive: 0
              fuelType: 1
              included: []
              navigationSystem: {
                isAvailable: false
                isIncluded: false
              }
              baggages: {
                big: null
                small: null
              }
              carGroupName: 'Dacia Sandero Manuel veya Benzeri'
              seatCount: null
              deposit: {
                value: 0
                currency: null
                rateValue: null
              }
              kminCluded: null
              addKmRate: {
                value: 0
                currency: null
                rateValue: null
              }
              minDriverAge: 0
              licenseYear: 0
              brand: null
              model: null
              deliveryType: '\u0000'
            }
            carIncluded: []
            carInsurances: []
            carExtraOption: []
            oneWay: {
              value: 0
              currency: 'TRY'
              rateValue: null
            }
            orginalTotalPrice: {
              value: 1592.73
              currency: 'TRY'
              rateValue: null
            }
            carMessage: {
              showDetail: false
              message: null
              showExtras: false
            }
            servicePrice: {
              value: 0
              currency: 'TRY'
              rateValue: null
            }
            totalCommission: {
              value: 0
              currency: null
              rateValue: null
            }
            buyServiceFee: 132.73
            sellServiceFee: 132.73
            key: '26649'
            totalPrice: {
              value: 1592.73
              currency: 'TRY'
              rateValue: null
            }
            basePrice: {
              value: 1327.27
              currency: 'TRY'
              rateValue: null
            }
            taxes: {
              value: 0
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
                value: 132.73
                currency: 'TRY'
                rateValue: null
              }
            }
            fee: {
              code: 'SellFee'
              price: {
                value: 0
                currency: 'TRY'
                rateValue: null
              }
            }
            passengerPrices: [
              {
                unitPrice: {
                  value: 1460
                  currency: 'TRY'
                  rateValue: null
                }
                unitBasePrice: {
                  value: 1327.27
                  currency: 'TRY'
                  rateValue: null
                }
                unitFee: {
                  code: 'TRY'
                  price: {
                    value: 132.73
                    currency: 'TRY'
                    rateValue: null
                  }
                }
                unitTax: {
                  value: 0
                  currency: 'TRY'
                  rateValue: null
                }
                cancelPenalty: null
                changePenalty: null
                passengers: null
                taxInfos: [
                  {
                    key: 'YR'
                    value: '0'
                  },
                  {
                    key: 'VQ'
                    value: '0'
                  },
                ]
                serviceCharges: [
                  {
                    code: 'Fee'
                    canApplyAmount: false
                    confirmPassenger: false
                    price: {
                      value: 132.73
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
                  value: 132.73
                  currency: 'TRY'
                  rateValue: null
                }
                desciption: null
              },
            ]
          },
        ]
        validationInformations: {
          age: {
            ageReferenceDate: '2025-04-21T16:08:27.7939389+03:00'
            infantAgeBegin: '7.00:00:00'
            childAgeBegin: 2
            adultAgeBegin: 12
            ageCalculationType: 0
          }
        }
        availableSpecialRequests: object
        sessionToken: 'C5C66CAD7762AE287DBD2BD2407DCA5369670A85D2AA4BBA321FEFE06533E550'
        traceId: 'C5C66CAD7762AE287DBD2BD2407DCA5369670A85D2AA4BBA321FEFE06533E550'
        isSucceeded: true
        diagnostics: {
          sessionToken: null
          providerId: 0
          providerName: null
          generatingRequestTime: '00:00:00'
          callingServiceTime: '00:00:00'
          generatingResponseTime: '00:00:00'
          subDiagnostics: null
          lastException: null
          serviceRequestData: null
          serviceResponseData: null
          providerInfo: null
          traceId: null
        }
        eventMessages: []
        appName: 'fulltrip.prod.webapp.html'
        scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7'
        logSessionToken: 'C5C66CAD7762AE287DBD2BD2407DCA5369670A85D2AA4BBA321FEFE06533E550'
        logSearchToken: 'C5C66CAD7762AE287DBD2BD2407DCA5369670A85D2AA4BBA321FEFE06533E550'
      }
      pickupStation: null
      returnStation: null
      searchReponse: null
      carRentalSearchPanel: {
        origin: [
          {
            id: 303809
            code: null
            countryCode: null
            name: 'Sivas Nuri Demirağ Havalimanı (VAS)'
            isDomestic: false
            providerName: null
          },
        ]
        destination: [
          {
            id: 303809
            code: null
            countryCode: null
            name: 'Sivas Nuri Demirağ Havalimanı (VAS)'
            isDomestic: false
            providerName: null
          },
        ]
        pickupDate: '2025-04-21T00:00:00'
        pickupHour: null
        returnDate: '2025-04-22T00:00:00'
        returnHour: null
        driverAge: 0
        receivedProviders: null
        customerId: 3
        customerUserId: 13
        sessionToken: 'C5C66CAD7762AE287DBD2BD2407DCA5369670A85D2AA4BBA321FEFE06533E550'
        apiRoute: null
        apiAction: null
        appName: 'fulltrip.prod.webapp.html'
        scopeName: 'fulltrip.prod.webapp.html'
        searchToken: 'C5C66CAD7762AE287DBD2BD2407DCA5369670A85D2AA4BBA321FEFE06533E550'
        scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7'
      }
      moduleName: 'CarRental'
      totalPrice: 1592.73
      priceCurrency: 'TRY'
      loyaltyMultiple: 0
      couponDiscountList: null
      extraCharges: {
        CIP: {
          value: 132.73
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
      modules: [3]
      passengers: [
        {
          type: 0
          gender: 0
          fullName: 'GULAGA  GOL'
          birthday: '1964-07-22T00:00:00'
          identityNumber: '36*******06'
          bookingCode: '25042019334483454'
          campaignCode: null
          eTicketNumber: null
          firstName: 'GULAGA'
          lastName: 'GOL'
          mobilePhoneNumber: '+90532*****22'
          email: 'ERKANGOL915@GMAIL.COM'
          marketingAirlineCode: ''
          isRoundedTrip: false
          module: 3
          groupOrderIndex: 1
          localPassengerSequenceNo: 1
          localRelatedPassengerSequenceNo: null
          discount: {
            value: 0
            currency: null
            rateValue: null
          }
          productItemId: 825932
        },
      ]
      billingInformation: [
        {
          billingName: 'Gülağa Göl'
          isCompany: false
          address: 'Kadikoy Kadikoy Istanbul'
          taxNo: null
        },
      ]
      paymentInformation: {
        basketTotal: 1592.73
        basketDiscountTotal: 0
        collectingTotal: 1592.73
        financellTotal: 0
        mlTotal: null
        rateOfInterest: 1
        installmentCount: 6
        bankName: 'HALKBANK'
        encryptedCardHolder: 'E**** G**'
        encryptedCardNumber: '415514******0730'
        sellingCurrency: 'TRY'
      }
      ssrList: null
      passengerCargoAddress: null
      bookingDateTime: '2025-04-20T19:32:18.7533174'
      fromSession: false
      authorizeKey: null
      shoppingFileId: 0
      taxAmount: 0
      shippingAmount: 0
      operationResultPromotionUsageList: null
    }
  },
  {
    summaryResponse: {
      detailResponse: {
        items: [
          {
            carDetail: {
              name: 'Dacia Sandero Manuel veya Benzeri'
              pickupDate: '2025-04-21T00:00:00'
              pickupId: '303809'
              pickupCode: 'Sivas Nuri Demirağ Havalimanı (VAS)'
              returnDate: '2025-04-22T00:00:00'
              returnId: '303809'
              returnCode: 'Sivas Nuri Demirağ Havalimanı (VAS)'
              type: 0
              category: 'Standart'
              doorCount: 4
              passengerCount: 0
              imageUrl: null
              vendorUrl: null
              vendorName: null
              airConditioning: false
              automaticTransmission: false
              transmissionDrive: 0
              fuelType: 1
              included: []
              navigationSystem: {
                isAvailable: false
                isIncluded: false
              }
              baggages: {
                big: null
                small: null
              }
              carGroupName: 'Dacia Sandero Manuel veya Benzeri'
              seatCount: null
              deposit: {
                value: 0
                currency: null
                rateValue: null
              }
              kminCluded: null
              addKmRate: {
                value: 0
                currency: null
                rateValue: null
              }
              minDriverAge: 0
              licenseYear: 0
              brand: null
              model: null
              deliveryType: '\u0000'
            }
            carIncluded: []
            carInsurances: []
            carExtraOption: []
            oneWay: {
              value: 0
              currency: 'TRY'
              rateValue: null
            }
            orginalTotalPrice: {
              value: 1592.73
              currency: 'TRY'
              rateValue: null
            }
            carMessage: {
              showDetail: false
              message: null
              showExtras: false
            }
            servicePrice: {
              value: 0
              currency: 'TRY'
              rateValue: null
            }
            totalCommission: {
              value: 0
              currency: null
              rateValue: null
            }
            buyServiceFee: 132.73
            sellServiceFee: 132.73
            key: '26649'
            totalPrice: {
              value: 1592.73
              currency: 'TRY'
              rateValue: null
            }
            basePrice: {
              value: 1327.27
              currency: 'TRY'
              rateValue: null
            }
            taxes: {
              value: 0
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
                value: 132.73
                currency: 'TRY'
                rateValue: null
              }
            }
            fee: {
              code: 'SellFee'
              price: {
                value: 0
                currency: 'TRY'
                rateValue: null
              }
            }
            passengerPrices: [
              {
                unitPrice: {
                  value: 1460
                  currency: 'TRY'
                  rateValue: null
                }
                unitBasePrice: {
                  value: 1327.27
                  currency: 'TRY'
                  rateValue: null
                }
                unitFee: {
                  code: 'TRY'
                  price: {
                    value: 132.73
                    currency: 'TRY'
                    rateValue: null
                  }
                }
                unitTax: {
                  value: 0
                  currency: 'TRY'
                  rateValue: null
                }
                cancelPenalty: null
                changePenalty: null
                passengers: null
                taxInfos: [
                  {
                    key: 'YR'
                    value: '0'
                  },
                  {
                    key: 'VQ'
                    value: '0'
                  },
                ]
                serviceCharges: [
                  {
                    code: 'Fee'
                    canApplyAmount: false
                    confirmPassenger: false
                    price: {
                      value: 132.73
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
                  value: 132.73
                  currency: 'TRY'
                  rateValue: null
                }
                desciption: null
              },
            ]
          },
        ]
        validationInformations: {
          age: {
            ageReferenceDate: '2025-04-21T16:08:27.7939389+03:00'
            infantAgeBegin: '7.00:00:00'
            childAgeBegin: 2
            adultAgeBegin: 12
            ageCalculationType: 0
          }
        }
        availableSpecialRequests: object
        sessionToken: 'C5C66CAD7762AE287DBD2BD2407DCA5369670A85D2AA4BBA321FEFE06533E550'
        traceId: 'C5C66CAD7762AE287DBD2BD2407DCA5369670A85D2AA4BBA321FEFE06533E550'
        isSucceeded: true
        diagnostics: {
          sessionToken: null
          providerId: 0
          providerName: null
          generatingRequestTime: '00:00:00'
          callingServiceTime: '00:00:00'
          generatingResponseTime: '00:00:00'
          subDiagnostics: null
          lastException: null
          serviceRequestData: null
          serviceResponseData: null
          providerInfo: null
          traceId: null
        }
        eventMessages: []
        appName: 'fulltrip.prod.webapp.html'
        scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7'
        logSessionToken: 'C5C66CAD7762AE287DBD2BD2407DCA5369670A85D2AA4BBA321FEFE06533E550'
        logSearchToken: 'C5C66CAD7762AE287DBD2BD2407DCA5369670A85D2AA4BBA321FEFE06533E550'
      }
      pickupStation: null
      returnStation: null
      searchReponse: null
      carRentalSearchPanel: {
        origin: [
          {
            id: 303809
            code: null
            countryCode: null
            name: 'Sivas Nuri Demirağ Havalimanı (VAS)'
            isDomestic: false
            providerName: null
          },
        ]
        destination: [
          {
            id: 303809
            code: null
            countryCode: null
            name: 'Sivas Nuri Demirağ Havalimanı (VAS)'
            isDomestic: false
            providerName: null
          },
        ]
        pickupDate: '2025-04-21T00:00:00'
        pickupHour: null
        returnDate: '2025-04-22T00:00:00'
        returnHour: null
        driverAge: 0
        receivedProviders: null
        customerId: 3
        customerUserId: 13
        sessionToken: 'C5C66CAD7762AE287DBD2BD2407DCA5369670A85D2AA4BBA321FEFE06533E550'
        apiRoute: null
        apiAction: null
        appName: 'fulltrip.prod.webapp.html'
        scopeName: 'fulltrip.prod.webapp.html'
        searchToken: 'C5C66CAD7762AE287DBD2BD2407DCA5369670A85D2AA4BBA321FEFE06533E550'
        scopeCode: '2d932774-a9d8-4df9-aae7-5ad2727da1c7'
      }
      moduleName: 'CarRental'
      totalPrice: 1592.73
      priceCurrency: 'TRY'
      loyaltyMultiple: 0
      couponDiscountList: null
      extraCharges: {
        CIP: {
          value: 132.73
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
export type HotelBookingDetailApiResponse = [
  {
    summaryResponse: {
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
              isPaid: false
              featured: false
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
  },
  {
    operationResultViewData: {
      modules: [2]
      passengers: [
        {
          type: 0
          gender: 0
          fullName: 'CENK  TOZLU'
          birthday: '1985-02-21T00:00:00'
          identityNumber: '32*******04'
          bookingCode: 'HD-25031J6K'
          campaignCode: null
          eTicketNumber: 'HD-25031J6K'
          firstName: 'CENK'
          lastName: 'TOZLU'
          mobilePhoneNumber: '+90532*****37'
          email: 'CENKINMSNADRESI@HOTMAIL.COM'
          marketingAirlineCode: ''
          isRoundedTrip: false
          module: 2
          groupOrderIndex: 1
          localPassengerSequenceNo: 0
          localRelatedPassengerSequenceNo: 0
          discount: ServicePriceType
          productItemId: 821738
        },
        {
          type: 0
          gender: 1
          fullName: 'CANAN ASLI  PAMUKOGLU'
          birthday: '1988-08-18T00:00:00'
          identityNumber: '35*******66'
          bookingCode: 'HD-25031J6K'
          campaignCode: null
          eTicketNumber: 'HD-25031J6K'
          firstName: 'CANAN ASLI'
          lastName: 'PAMUKOGLU'
          mobilePhoneNumber: '+90532*****37'
          email: 'CENKINMSNADRESI@HOTMAIL.COM'
          marketingAirlineCode: ''
          isRoundedTrip: false
          module: 2
          groupOrderIndex: 1
          localPassengerSequenceNo: 0
          localRelatedPassengerSequenceNo: 0
          discount: ServicePriceType
          productItemId: 821738
        },
      ]
      billingInformation: [
        {
          billingName: 'cenk tozlu'
          isCompany: false
          address: 'Kadikoy Kadikoy Istanbul'
          taxNo: null
        },
      ]
      paymentInformation: {
        basketTotal: 12890.25
        basketDiscountTotal: 9562.5
        collectingTotal: 3327.75
        financellTotal: 0.0
        mlTotal: null
        rateOfInterest: 1.0
        installmentCount: 6
        bankName: 'HALKBANK'
        encryptedCardHolder: 'c*** t****'
        encryptedCardNumber: '415514******8567'
        sellingCurrency: 'TRY'
      }
      ssrList: null
      passengerCargoAddress: null
      bookingDateTime: '2025-03-21T08:40:59.0275994'
      fromSession: false
      authorizeKey: null
      shoppingFileId: 0
      taxAmount: 0.0
      shippingAmount: 0.0
      operationResultPromotionUsageList: null
    }
  },
  {
    summaryResponse: {
      searchToken: '96BE5E77B105ED5E8DDF0A50A1B369FEEF95FCF3AD5B726C072629318DAC2575'
      sessionToken: '96BE5E77B105ED5E8DDF0A50A1B369FEEF95FCF3AD5B726C072629318DAC2575'
      destinationSlug: null
      hotelSlug: null
      roomGroup: {
        hotelId: 1264239
        hotelKey: '111798'
        hotel: {
          id: 0
          name: 'Assos Nazlihan Hotel'
          slug: null
          zip_code: null
          address: null
          destination: null
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
          images: null
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
          last_update: '0001-01-01T00:00:00'
          video_list: null
          web_site: null
          deleted: false
          destination_slug: null
          old_destination_slug: null
          rating: 0.0
          listing_rate: 0
          sales_rate: 0
          destination_id: 0
          destination_map: null
          search_rate: 0
          reviews: null
          nearby_restaurants: null
          comment_info: null
          documents: null
          food_drinks: null
          can_coupon_used: false
        }
        roomDetails: {
          '111798': {
            roomKey: ''
            description: ''
            allotment: 2
            bedType: ''
            roomType: 'Standart Oda'
            quantity: 2
            size: 0.0
            facilities: [
              {
                id: 24855
                name: 'Lcd TV'
                scope_id: 0
                type_id: 0
                isPaid: false
                featured: false
                icon_key: null
                priority: 0
              },
              {
                id: 24857
                name: 'Elektronik Kasa'
                scope_id: 0
                type_id: 0
                isPaid: false
                featured: false
                icon_key: null
                priority: 0
              },
              {
                id: 24859
                name: 'Minibar'
                scope_id: 0
                type_id: 0
                isPaid: true
                featured: false
                icon_key: null
                priority: 0
              },
              {
                id: 24860
                name: 'Su Isıtıcısı'
                scope_id: 0
                type_id: 0
                isPaid: false
                featured: false
                icon_key: null
                priority: 0
              },
              {
                id: 24862
                name: 'Telefon'
                scope_id: 0
                type_id: 0
                isPaid: true
                featured: false
                icon_key: null
                priority: 0
              },
              {
                id: 24864
                name: 'Parke Kaplı Zemin'
                scope_id: 0
                type_id: 0
                isPaid: false
                featured: false
                icon_key: null
                priority: 0
              },
              {
                id: 24866
                name: 'Saç Kurutma Makinesi'
                scope_id: 0
                type_id: 0
                isPaid: false
                featured: false
                icon_key: null
                priority: 0
              },
              {
                id: 69359
                name: 'Split Klima'
                scope_id: 0
                type_id: 0
                isPaid: false
                featured: false
                icon_key: null
                priority: 0
              },
              {
                id: 69362
                name: 'Havlu'
                scope_id: 0
                type_id: 0
                isPaid: false
                featured: false
                icon_key: null
                priority: 0
              },
              {
                id: 69360
                name: 'Duşakabin '
                scope_id: 0
                type_id: 0
                isPaid: false
                featured: false
                icon_key: null
                priority: 0
              },
              {
                id: 69358
                name: 'Uydu Yayını'
                scope_id: 0
                type_id: 0
                isPaid: false
                featured: false
                icon_key: null
                priority: 0
              },
              {
                id: 69361
                name: 'Sivrisinek Teli'
                scope_id: 0
                type_id: 0
                isPaid: false
                featured: false
                icon_key: null
                priority: 0
              },
            ]
            pensionType: 'Oda Kahvaltı'
            pensionTypeId: 9
            extraInformations: ['']
            images: null
          }
        }
        rooms: [
          {
            passengerKeys: null
            nightlyRates: null
            addonInfos: null
            freeChildAges: null
            freeNights: 0
            discountInformations: null
            key: ''
            totalPrice: {
              value: 0.0
              currency: null
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
              code: null
              price: {
                value: 0.0
                currency: null
                rateValue: null
              }
            }
            fee: {
              code: null
              price: {
                value: 0.0
                currency: null
                rateValue: null
              }
            }
            passengerPrices: null
            taxInfos: null
            serviceCharges: null
          },
        ]
        averageRate: {
          value: 4250.0
          currency: 'TRY'
          rateValue: null
        }
        nightlyRateTotal: {
          value: 12750.0
          currency: 'TRY'
          rateValue: null
        }
        discountDescription: null
        cancelWarrantyPrice: {
          value: 140.0
          currency: 'TRY'
          rateValue: null
        }
        useCancelWarranty: true
        prepaid: null
        accommodationTax: null
        isSingleMaleRestriction: null
        cancellationPolicy: '14.06.2025 tarihinden sonraki iptal için 12.750,00₺ ücret talep edilecektir.'
        cancellationPolicies: [
          {
            penaltyPrice: {
              value: 12750.0
              currency: 'TRY'
              rateValue: null
            }
            optionDate: '2025-06-14T10:00:00'
            description: '14.06.2025 10:00 tarihine kadar kesintisiz iptal hakkınız bulunmaktadır. 14.06.2025 10:00 tarihi itibari ile 12750,00 ₺ ücret talep edilecektir.'
          },
        ]
        additionalInfos: null
        nonRefundable: false
        checkInDate: '2025-07-12T00:00:00'
        minNight: 0
        checkOutDate: '2025-07-15T00:00:00'
        earlyBooking: false
        addonInfos: null
        packageSearchType: 0
        provisionTime: '0001-01-01T00:00:00'
        provider: 'JollyHotel'
        priceDifferenceBackGuarantee: false
        canCouponUsed: false
        key: '111798'
        totalPrice: {
          value: 12890.25
          currency: 'TRY'
          rateValue: null
        }
        basePrice: {
          value: 11486.49
          currency: 'TRY'
          rateValue: null
        }
        taxes: {
          value: 0.0
          currency: 'TRY'
          rateValue: null
        }
        discount: {
          value: 2250.0
          currency: 'TRY'
          rateValue: null
        }
        buyFee: {
          code: 'TRY'
          price: {
            value: 0.0
            currency: 'TRY'
            rateValue: null
          }
        }
        fee: {
          code: 'SellFee'
          price: {
            value: 1264.0
            currency: 'TRY'
            rateValue: null
          }
        }
        passengerPrices: [
          {
            unitPrice: {
              value: 12750.0
              currency: 'TRY'
              rateValue: null
            }
            unitBasePrice: {
              value: 11486.49
              currency: 'TRY'
              rateValue: null
            }
            unitFee: {
              code: 'TRY'
              price: {
                value: 1263.51
                currency: 'TRY'
                rateValue: null
              }
            }
            unitTax: {
              value: 0.0
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
                value: '0'
              },
              {
                key: 'VQ'
                value: '0'
              },
            ]
            serviceCharges: [
              {
                code: 'Fee'
                canApplyAmount: false
                confirmPassenger: false
                price: {
                  value: 1263.51
                  currency: 'TRY'
                  rateValue: null
                }
                desciption: null
              },
            ]
          },
        ]
        taxInfos: null
        serviceCharges: null
      }
      status: null
      productKey: '4NpaU9nZdNjye/Zh09uCiCHmq9GOHGzPlonk9vC6/F7rgjHN4/WAhj6ASGxTUPGt11kV4ddxE00412l/QlQS6vOCFlhf7osndGM+ijlODLu8VLsac1wlgW314Y18cQGVYjbAeWB0NvJHf+f+BdsRbRTYWUrXfTT4u54VAHMpQEIz3Zb8LWx8ZuNgIzROA/GXBmlePe8QN4U9pDuUFQpyHlNkPpt9kkEQNO93tipSOpI='
      moduleName: 'Hotel'
      totalPrice: 12890.25
      priceCurrency: 'TRY'
      loyaltyMultiple: 0
      couponDiscountList: null
      extraCharges: {
        CIP: {
          value: 0.0
          currency: 'TRY'
          rateValue: null
        }
      }
      financellDiscount: {
        value: 0.0
        currency: null
        rateValue: null
      }
    }
  },
]
