import {
  createSearchParamsCache,
  createSerializer,
  parseAsIsoDate,
  parseAsString,
  type inferParserType,
} from 'nuqs/server'

export const tourSearchResultParamParser = {
  checkinDate: parseAsIsoDate,
  checkoutDate: parseAsIsoDate,
  destinationSlug: parseAsString,
}

export const serializeTourSearchParams = createSerializer(
  tourSearchResultParamParser
)

export const tourSearchParamsCahce = createSearchParamsCache(
  tourSearchResultParamParser
)

export type TourSearchResultParamsType = inferParserType<
  typeof tourSearchResultParamParser
>
