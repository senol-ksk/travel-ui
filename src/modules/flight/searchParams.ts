import {
  createSerializer,
  inferParserType,
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDate,
  parseAsJson,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs'
import { z } from 'zod'

export enum SortOrderEnums {
  priceAsc = 'PRICE_ASC',
  priceDesc = 'PRICE_DESC',
  hourAsc = 'HOUR_ASC',
  hourDesc = 'HOUR_DESC',
  durationAsc = 'DURATION_ASC',
  durationDesc = 'DURATION_DESC',
}

const cabinClassSchema = z.object({
  value: z.string().or(z.number()),
  title: z.string(),
})

const passengerCounts = z.object({
  Adult: z.number(),
  Child: z.number(),
  Infant: z.number(),
})

const destinationSchema = z.object({
  code: z.string(),
  iata: z.array(z.string()),
  type: z.number(),
  isDomestic: z.boolean(),
  id: z.number().or(z.string()),
})

export const flightSearchParams = {
  origin: parseAsJson(destinationSchema.parse),
  destination: parseAsJson(destinationSchema.parse),
  departureDate: parseAsIsoDate,
  returnDate: parseAsIsoDate,
  activeTripKind: parseAsString,
  cabinClass: parseAsJson(cabinClassSchema.parse),
  passengerCounts: parseAsJson(passengerCounts.parse),
}

export const filterParsers = {
  order: parseAsStringEnum<SortOrderEnums>(
    Object.values(SortOrderEnums)
  ).withDefault(SortOrderEnums.priceAsc),
  numOfStops: parseAsArrayOf(parseAsInteger),
}

export type FlightFilterSearchParams = inferParserType<typeof filterParsers>
export const serializeFlightSearchParams = createSerializer(flightSearchParams)
