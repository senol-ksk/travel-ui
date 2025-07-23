import dayjs from 'dayjs'
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
  drop_date: parseAsIsoDate.withDefault(dayjs().add(10, 'days').toDate()),
  drop_time: parseAsString,
  dropoff: parseAsString,
  pickup_date: parseAsIsoDate.withDefault(dayjs().add(5, 'days').toDate()),
  pickup_time: parseAsString,
  pickup: parseAsString,
}

export const serializeCarSearchParams = createSerializer(carSearchParamParser)

export const carSearchParamsCache =
  createSearchParamsCache(carSearchParamParser)
