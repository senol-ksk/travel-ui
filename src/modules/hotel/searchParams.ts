import { boolean, z } from 'zod'

import type { HotelSearchParams } from '@/types/hotel'
import {
  createParser,
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

export enum HotelSortOrderEnums {
  priceDescending = 'PriceDescending',
  priceAscending = 'PriceAscending',
  // listingRateAscending = 'ListingRateAscending',
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
  // infant: number
  // student: number
  // senior: number
  // military: number
}

export const hotelSearchParamParser = {
  checkinDate: parseAsIsoDate,
  checkoutDate: parseAsIsoDate,
  destination: parseAsString,
  destinationId: parseAsString,
  slug: parseAsString,
  type: parseAsInteger,
  rooms: parseAsString,
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
}

const roomSchema = z.object({
  adult: z.number(),
  child: z.number(),
  childAges: z.array(z.number()),
})

export const hotelDetailSearchParams = {
  propertyName: parseAsString,
  isSearch: parseAsBoolean.withDefault(false),
  slug: parseAsString,
  productKey: parseAsString,
  sessionToken: parseAsString,
  searchToken: parseAsString,
  type: parseAsInteger,
  hotelSlug: parseAsString,
  checkInDate: parseAsIsoDate,
  checkOutDate: parseAsIsoDate,
  rooms: parseAsArrayOf(parseAsJson(roomSchema.parse)),
}

export type HotelDetailSearchParamsType = inferParserType<
  typeof hotelDetailSearchParams
>

export const serializeHotelDetailParams = createSearchParamsCache(
  hotelDetailSearchParams
)

export const serializeHotelSearchParams = createSerializer<HotelSearchParams>(
  hotelSearchParamParser
)

export const hotelSearchParamsCahce =
  createSearchParamsCache<HotelSearchParams>(hotelSearchParamParser)

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
