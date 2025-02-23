import dayjs from 'dayjs'

import { ClientDataType, FlightDetailSegment } from '../type'
import {
  FlightFilterSearchParams,
  SortOrderEnums,
} from '@/modules/flight/searchParams'

export const removeDuplicateFlights = (
  data: { segments: FlightDetailSegment[] }[]
) => {
  const flightMap = new Map()

  data.forEach((item) => {
    const flightNumbers = item.segments
      .map((segment) => segment.flightNumber)
      .join(',')

    if (!flightMap.has(flightNumbers)) {
      flightMap.set(flightNumbers, item)
    } else {
      // Keep the entry with the most segments
      if (item.segments.length > flightMap.get(flightNumbers).segments.length) {
        flightMap.set(flightNumbers, item)
      }
    }
  })

  return Array.from(flightMap.values())
}

export const filterActions = (
  flightData: ClientDataType[],
  filterParams: FlightFilterSearchParams
) => {
  const filtered = flightData.sort((a, b) => {
    const a_departure = dayjs(a.segments.at(0)?.departureTime)
    const b_departure = dayjs(b.segments.at(0)?.departureTime)
    const a_departure_ms = a_departure.diff(dayjs(), 'milliseconds')
    const b_departure_ms = b_departure.diff(dayjs(), 'milliseconds')

    const a_firstDepartureDate = dayjs(a.segments.at(0)?.departureTime)
    const a_lastArrivalDate = dayjs(a.segments.at(-1)?.arrivalTime)
    const b_firstDepartureDate = dayjs(b.segments.at(0)?.departureTime)
    const b_lastArrivalDate = dayjs(b.segments.at(-1)?.arrivalTime)

    const a_duration = a_lastArrivalDate.diff(
      a_firstDepartureDate,
      'milliseconds'
    )

    const b_duration = b_lastArrivalDate.diff(
      b_firstDepartureDate,
      'milliseconds'
    )

    switch (filterParams.order) {
      case SortOrderEnums.priceAsc:
        return a.fareInfo.totalPrice.value - b.fareInfo.totalPrice.value
      case SortOrderEnums.priceDesc:
        return b.fareInfo.totalPrice.value - a.fareInfo.totalPrice.value
      case SortOrderEnums.hourAsc:
        return a_departure_ms - b_departure_ms
      case SortOrderEnums.hourDesc:
        return b_departure_ms - a_departure_ms
      case SortOrderEnums.durationAsc:
        return a_duration - b_duration
      case SortOrderEnums.durationDesc:
        return b_duration - a_duration

      default:
        return a.fareInfo.totalPrice.value - b.fareInfo.totalPrice.value
    }
  })

  return filtered
}
