import dayjs from 'dayjs'
import {
  createLoader,
  createSerializer,
  parseAsBoolean,
  parseAsInteger,
  parseAsIsoDate,
  parseAsJson,
  parseAsString,
} from 'nuqs/server'
import { z } from 'zod'

const dummySp = {
  params: {
    hotelSearchModuleRequest: {
      rooms: [
        {
          childBirthdays: [],
          adult: 2,
          child: 0,
          infant: 0,
          student: 0,
          senior: 0,
          military: 0,
        },
      ],
      id: 372352,
      name: 'Kıbrıs',
      slug: 'kibris',
      location: [0, 0],
      northeast: null,
      southwest: null,
      type: 1,
      countryCode: 'trnc',
      checkInDate: '2025-09-04T00:00:00',
      checkOutDate: '2025-09-12T00:00:00',
      domestic: false,
      tags: null,
      earlyBooking: false,
      pageNo: 0,
      pageSize: 20,
      languageCode: 'tr_TR',
      orderBy: 9,
      hotelName: null,
      maxPrice: 0,
      minPrice: 0,
      maxStarRating: 0,
      minStarRating: 0,
      maxTripAdvisorRating: 0,
      minTripAdvisorRating: 0,
      facilities: null,
      pensionTypes: null,
      themes: null,
      destinationIds: null,
      nonRefundable: null,
      isAvailabilityResult: false,
      isSocketConnected: false,
      extentionData: {},
      provider: null,
      sessionToken:
        'A58E7E07A70BDF5E7F0D04B8EC7ACD7AB49901DA0879BDBCF5E702BCEA0DE6E7',
      apiRoute: null,
      apiAction: null,
      appName: null,
      scopeName: null,
      searchToken:
        '49C25B07E92AC2421ED5D5976F2B6A62189CFC6C435A942C344B28A36B99E55E',
      scopeCode: '00000000-0000-0000-0000-000000000000',
    },
    isTransfer: true,
    isFlight: true,
    tripType: 0,
    airportCode: 'AYT',
    sessionToken:
      'A58E7E07A70BDF5E7F0D04B8EC7ACD7AB49901DA0879BDBCF5E702BCEA0DE6E7',
    apiRoute: 'CyprusPackageService',
    apiAction: 'api/CyprusPackage/Search',
    appName: 'paraflytravel.preprod.webapp.html',
    scopeName: 'PARAFLYTRAVEL',
    searchToken:
      '49C25B07E92AC2421ED5D5976F2B6A62189CFC6C435A942C344B28A36B99E55E',
    scopeCode: 'aa2eff06-6a09-4320-bae2-a82f9504ff19',
    customerId: 0,
    customerUserId: 0,
  },
  sessionToken:
    'A58E7E07A70BDF5E7F0D04B8EC7ACD7AB49901DA0879BDBCF5E702BCEA0DE6E7',
  apiRoute: 'CyprusPackageService',
  apiAction: 'api/CyprusPackage/Search',
  requestType:
    'TravelAccess.Core.Models.CyprusPackage.HotelSearchApiRequest, Business.Models.CyprusPackage, Version=1.0.7.0, Culture=neutral, PublicKeyToken=null',
  returnType:
    'Core.Models.ResultModels.RestResult`1[[TravelAccess.Core.Models.BaseRequestResponses.SearchRestClientResponse`1[[TravelAccess.Core.Models.CyprusPackage.CyprusPackageSearchResponse, Core.Models.CyprusPackage, Version=1.0.6.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null',
  device: 'WEB2C325390785BE7BF49E270007A84D887',
  languageCode: 'tr_TR',
  ipAddress: null,
  mlToken: '300e4d36-e149-4324-a09d-81c83d297f9d',
}

export const cyprusRoomParser = z.array(
  z.object({
    childBirthdays: z.array(z.number()),
    adult: z.number(),
    child: z.number(),
    // infant: z.number(),
    // student: z.number(),
    // senior: z.number(),
    // military: z.number(),
  })
)

export const cyprusSearchParams = {
  isTransfer: parseAsBoolean.withDefault(true),
  isFlight: parseAsBoolean.withDefault(true),
  rooms: parseAsJson(cyprusRoomParser.parse).withDefault([
    {
      adult: 2,
      child: 0,
      childBirthdays: [],
    },
  ]),
  checkInDate: parseAsIsoDate.withDefault(dayjs().add(1, 'months').toDate()),
  checkOutDate: parseAsIsoDate.withDefault(
    dayjs().add(1, 'months').add(5, 'days').toDate()
  ),
  slug: parseAsString.withDefault('kibris'),
  name: parseAsString,
  airportCode: parseAsString,
  type: parseAsInteger,
  id: parseAsInteger,
  orderBy: parseAsInteger.withDefault(9),
  earlyBooking: parseAsBoolean.withDefault(false),
  languageCode: parseAsString.withDefault('tr_TR'),
  pageNo: parseAsInteger.withDefault(0),
  pageSize: parseAsInteger.withDefault(20),
  maxPrice: parseAsInteger.withDefault(0),
  minPrice: parseAsInteger.withDefault(0),
  maxStarRating: parseAsInteger.withDefault(0),
  minStarRating: parseAsInteger.withDefault(0),
  maxTripAdvisorRating: parseAsInteger.withDefault(0),
  minTripAdvisorRating: parseAsInteger.withDefault(0),
  isAvailabilityResult: parseAsBoolean.withDefault(false),
  isSocketConnected: parseAsBoolean.withDefault(false),
  // tags: null,
  // hotelName: null,
  // facilities: null,
  // pensionTypes: null,
  // themes: null,
  // destinationIds: null,
  // nonRefundable: null,
  // extentionData: {},
  // provider: null,
}

export const loadCyprusSearchParams = createLoader(cyprusSearchParams)
export const cyprusSearchSerializer = createSerializer(cyprusSearchParams)
