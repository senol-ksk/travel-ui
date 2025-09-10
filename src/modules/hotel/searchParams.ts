import { z } from 'zod'

import {
  createSearchParamsCache,
  createSerializer,
  inferParserType,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsIsoDate,
  parseAsJson,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server'
import dayjs from 'dayjs'

export enum HotelSortOrderEnums {
  priceDescending = 'PriceDescending',
  priceAscending = 'PriceAscending',
  listingRateDescending = 'ListingRateDescending',
  nameAscending = 'NameAscending',
  nameDescending = 'NameDescending',
  starAscending = 'StarAscending',
  starDescending = 'StarDescending',
}

export type HotelRoomOptionTypes = {
  childAges: number[]
  adult: number
  child: number
}
const roomSchema = z.object({
  adult: z.number(),
  child: z.number(),
  childAges: z.array(z.number()),
})

export const hotelSearchParamParser = {
  checkinDate: parseAsIsoDate.withDefault(dayjs().add(10, 'days').toDate()),
  checkoutDate: parseAsIsoDate.withDefault(dayjs().add(17, 'days').toDate()),
  destination: parseAsString,
  destinationId: parseAsString,
  slug: parseAsString,
  type: parseAsInteger,
  rooms: parseAsArrayOf(parseAsJson(roomSchema.parse)).withDefault([
    {
      adult: 2,
      child: 0,
      childAges: [],
    },
  ]),
}
export const hotelFilterSearchParams = {
  orderBy: parseAsStringEnum<HotelSortOrderEnums>(
    Object.values(HotelSortOrderEnums)
  ).withDefault(HotelSortOrderEnums.listingRateDescending),
  hotelName: parseAsString,
  priceRange: parseAsArrayOf(parseAsInteger),
  maxStarRating: parseAsInteger,
  minStarRating: parseAsInteger,
  destinationIds: parseAsArrayOf(parseAsString),
  pensionTypes: parseAsArrayOf(parseAsString),
  themes: parseAsArrayOf(parseAsString),
  facilities: parseAsArrayOf(parseAsString),
}

export const hotelDetailSearchParams = {
  propertyName: parseAsString,
  isSearch: parseAsBoolean.withDefault(false),
  slug: parseAsString,
  productKey: parseAsString,
  sessionToken: parseAsString,
  searchToken: parseAsString,
  type: parseAsInteger,
  hotelSlug: parseAsString,
  checkInDate: parseAsIsoDate.withDefault(dayjs().add(2, 'day').toDate()),
  checkOutDate: parseAsIsoDate.withDefault(dayjs().add(7, 'day').toDate()),
  rooms: parseAsArrayOf(parseAsJson(roomSchema.parse)).withDefault([
    { adult: 2, child: 0, childAges: [] },
  ]),
}

export type HotelDetailSearchParamsType = inferParserType<
  typeof hotelDetailSearchParams
>

export const serializeHotelDetailParams = createSearchParamsCache(
  hotelDetailSearchParams
)

export const serializeHotelSearchParams = createSerializer(
  hotelSearchParamParser
)

export const hotelSearchParamsCahce = createSearchParamsCache(
  hotelSearchParamParser
)

export const searchEngineSchema = z.object({
  destination: z.object({
    name: z.string().min(3),
    id: z.number().or(z.string()),
    slug: z.string().min(3),
    type: z.number(),
  }),
  checkinDate: z.coerce.date(),
  checkoutDate: z.coerce.date(),
  rooms: z.array(
    z.object({
      adult: z.number(),
      child: z.number(),
      childAges: z.array(z.number()),
    })
  ),
})

export type HotelSearchEngineSchemaType = z.infer<typeof searchEngineSchema>
