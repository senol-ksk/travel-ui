// ?pickup=istanbul-beylikduzu&dropoff=izmir-adnan-menderes-havalimani305223&pickup_date=2024-12-28&drop_date=2024-12-31&pickup_time=11%3A00&drop_time=12%3A00&driverAge=26

import {
  createSearchParamsCache,
  createSerializer,
  parseAsInteger,
  parseAsIsoDate,
  parseAsString,
  ParserBuilder,
} from 'nuqs/server'

export type CarSearchQueryParams = {
  driverAge: ParserBuilder<number>
  drop_date: ParserBuilder<Date>
  drop_time: ParserBuilder<string>
  dropoff: ParserBuilder<string>
  pickup_date: ParserBuilder<Date>
  pickup_time: ParserBuilder<string>
  pickup: ParserBuilder<string>
}

export const carSearchParamParser: CarSearchQueryParams = {
  driverAge: parseAsInteger,
  drop_date: parseAsIsoDate,
  drop_time: parseAsString,
  dropoff: parseAsString,
  pickup_date: parseAsIsoDate,
  pickup_time: parseAsString,
  pickup: parseAsString,
}

export const serializeCarSearchParams = createSerializer(carSearchParamParser)

export const carSearchParamsCahce =
  createSearchParamsCache(carSearchParamParser)
