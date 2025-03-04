import {
  createSerializer,
  parseAsString,
  parseAsIsoDate,
  parseAsStringEnum,
  parseAsArrayOf,
} from 'nuqs/server'

export const busSearchParams = {
  originId: parseAsString,
  destinationId: parseAsString,
  originSlug: parseAsString,
  destinationSlug: parseAsString,
  date: parseAsIsoDate,
  productKey: parseAsString,
}

export const serializeBusSearchParams = createSerializer(busSearchParams)

export enum SortOrderEnums {
  priceAsc = 'PRICE_ASC',
  priceDesc = 'PRICE_DESC',
  hourAsc = 'HOUR_ASC',
}

export const filterParsers = {
  order: parseAsStringEnum<SortOrderEnums>(
    Object.values(SortOrderEnums)
  ).withDefault(SortOrderEnums.priceAsc),
  type: parseAsArrayOf(parseAsString),
  origin: parseAsArrayOf(parseAsString),
  destination: parseAsArrayOf(parseAsString),
  company: parseAsArrayOf(parseAsString),
}
