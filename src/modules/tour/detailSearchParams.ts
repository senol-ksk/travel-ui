import {
  createSearchParamsCache,
  createSerializer,
  parseAsString,
  type inferParserType,
} from 'nuqs/server'

export const tourDetailPageParamParser = {
  productKey: parseAsString,
  slug: parseAsString,
}

export const serializeTourDetailPageParams = createSerializer(
  tourDetailPageParamParser
)

export const tourDetailPageParamsCahce = createSearchParamsCache(
  tourDetailPageParamParser
)

export type TourDetailPageParamsType = inferParserType<
  typeof tourDetailPageParamParser
>
