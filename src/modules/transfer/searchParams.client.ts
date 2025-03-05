import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsIsoDate,
  parseAsStringEnum,
  parseAsArrayOf,
  parseAsFloat,
} from 'nuqs/server'
import { z } from 'zod'

export const transferSearchParams = {
  originId: parseAsString,
  destinationId: parseAsString,
  originSlug: parseAsString,
  destinationSlug: parseAsString,
  date: parseAsIsoDate,
  time: parseAsString,
  adultPassengerCount: parseAsInteger,
  babyPassengerCount: parseAsInteger,
  childrenPassengerCount: parseAsInteger,
}

export const serializeTransferSearchParams =
  createSerializer(transferSearchParams)

export const transferSearchEngineSchema = z.object({
  origin: z.object({
    Id: z.string().or(z.number()),
    Code: z.string(),
    Slug: z.string().nonempty(),
    PointName: z.string(),
    LocationName: z.string(),
    Type: z.string(),
  }),
  destination: z.object({
    Id: z.string().or(z.number()),
    Code: z.string(),
    Slug: z.string().nonempty(),
    PointName: z.string(),
    LocationName: z.string(),
    Type: z.string(),
  }),
  date: z.string(),
  time: z.string(),
  passengers: z.object({
    adult: z.number().min(1),
    child: z.number().min(0),
    infant: z.number().min(0),
  }),
})
export enum SortOrderEnums {
  priceAsc = 'PRICE_ASC',
  priceDesc = 'PRICE_DESC',
}

export const filterParsers = {
  order: parseAsStringEnum<SortOrderEnums>(
    Object.values(SortOrderEnums)
  ).withDefault(SortOrderEnums.priceAsc),
  priceRange: parseAsArrayOf(parseAsFloat),
  vehicle: parseAsArrayOf(parseAsString),
  pax: parseAsArrayOf(parseAsString),
}

export type TransferSearchEngineSchemaInfer = z.infer<
  typeof transferSearchEngineSchema
>
