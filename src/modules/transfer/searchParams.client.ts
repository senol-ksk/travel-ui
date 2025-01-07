import {
  createSerializer,
  parseAsInteger,
  parseAsString,
  parseAsIsoDate,
} from 'nuqs/server'
import { z } from 'zod'

export const transferSearchParams = {
  originId: parseAsString,
  destinationId: parseAsString,
  originSlug: parseAsString,
  destinationSlug: parseAsString,
  date: parseAsIsoDate,
  time: parseAsString,
  searchToken: parseAsString,
  sessionToken: parseAsString,
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

export type TransferSearchEngineSchemaInfer = z.infer<
  typeof transferSearchEngineSchema
>
