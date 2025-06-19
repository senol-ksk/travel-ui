import {
  createLoader,
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  parseAsStringEnum,
  type inferParserType,
} from 'nuqs/server'

export const tourSearchResultParamParser = {
  checkinDate: parseAsIsoDate,
  checkoutDate: parseAsIsoDate,
  destinationSlug: parseAsString,
  isCruise: parseAsBoolean.withDefault(false),
}

export const serializeTourSearchParams = createSerializer(
  tourSearchResultParamParser
)

export const tourSearchParamCache = createSearchParamsCache(
  tourSearchResultParamParser
)

export const loadTourSearchParams = createLoader(tourSearchResultParamParser)

export type TourSearchResultParamsType = inferParserType<
  typeof tourSearchResultParamParser
>

export enum SortOrderEnums {
  priceAsc = 'PRICE_ASC',
  priceDesc = 'PRICE_DESC',
  dateAsc = 'DATE_ASC',
  dateDesc = 'DATE_DESC',
}

export const filterParser = {
  order: parseAsStringEnum<SortOrderEnums>(
    Object.values(SortOrderEnums)
  ).withDefault(SortOrderEnums.priceAsc),
  priceRange: parseAsArrayOf(parseAsFloat),
  nightCount: parseAsArrayOf(parseAsInteger),
  regions: parseAsArrayOf(parseAsString),
}
