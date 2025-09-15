import dayjs from 'dayjs'

import { ClientDataType, FlightDetailSegment } from '@/app/flight/type'
import {
  filterParsers,
  FlightFilterSearchParams,
  SortOrderEnums,
} from '@/modules/flight/searchParams'
import { useQueryStates } from 'nuqs'

export const extractBaggageOptions = (
  flightData: ClientDataType[] | undefined
) => {
  if (!flightData) return []
  const baggageOptions = new Set<string>()

  flightData.forEach((flight) => {
    flight.segments.forEach((segment) => {
      const baggage = segment.baggageAllowance

      if (baggage.maxWeight.value > 0) {
        const pieceCount =
          baggage.piece.pieceCount === 0 ? 1 : baggage.piece.pieceCount
        const baggageOption = `${pieceCount}x${baggage.maxWeight.value}`
        baggageOptions.add(baggageOption)
      }
    })
  })
  return Array.from(baggageOptions)
}

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

const sortOrder = (
  flightData: ClientDataType[] | undefined,
  filterParams: FlightFilterSearchParams
) => {
  return flightData?.sort((a, b) => {
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
}

export const useFilterActions = (flightData: ClientDataType[] | undefined) => {
  const [filterParams] = useQueryStates(filterParsers)
  const isDomestic = flightData?.every(
    (data) => !!data.details.every((detail) => detail.isPromotional)
  )

  const filteredData = sortOrder(flightData, filterParams)
    // transfer/stop count
    ?.filter((data) => {
      if (filterParams?.numOfStops) {
        return (
          filterParams?.numOfStops.filter((numOfStops) => {
            return isDomestic
              ? data.segments.length === numOfStops + 1
              : data.segments.filter((segment) => segment.groupId === 0)
                  .length ===
                  numOfStops + 1 ||
                  data.segments.filter((segment) => segment.groupId === 1)
                    .length ===
                    numOfStops + 1
          }).length > 0
        )
      }
      return true
    })
    .filter((data) => {
      if (filterParams.airlines && filterParams.airlines.length) {
        return (
          data.segments.filter((segment) => {
            return filterParams.airlines?.includes(
              segment.marketingAirline.code
            )
          }).length > 0
        )
      }

      return true
    })
    .filter((data) => {
      if (filterParams.airports && filterParams.airports.length) {
        return (
          filterParams.airports.includes(
            data.segments?.at(0)?.origin?.code ?? ''
          ) ||
          filterParams.airports.includes(
            data.segments?.at(-1)?.destination?.code ?? ''
          )
        )
      }

      return true
    })
    .filter((data) => {
      const departureHour = data.segments.map((segment) => {
        const hour = dayjs(segment.departureTime).hour()
        const minute = dayjs(segment.departureTime).minute()
        const calculate = hour * 60 + minute
        return calculate
      })[0]

      if (
        filterParams.departureHours &&
        filterParams.departureHours?.length > 1
      )
        return (
          departureHour >= filterParams.departureHours[0] &&
          departureHour <= filterParams.departureHours[1]
        )

      return true
    })
    .filter((data) => {
      if (filterParams.baggage && filterParams.baggage.length) {
        return data.segments.some((segment) => {
          const segmentWeight = segment.baggageAllowance.maxWeight.value
          const segmentPieces = segment.baggageAllowance.piece.pieceCount

          return filterParams.baggage?.some((selectedBaggage) => {
            const [selectedPieces, selectedWeight] = selectedBaggage.split('x')
            const selectedPiecesNum = parseInt(selectedPieces)
            const selectedWeightNum = parseInt(selectedWeight)

            if (
              selectedPiecesNum === 1 &&
              segmentPieces === 0 &&
              selectedWeightNum === segmentWeight
            ) {
              return true
            }

            return (
              selectedPiecesNum === segmentPieces &&
              selectedWeightNum === segmentWeight
            )
          })
        })
      }
      return true
    })

  return { filteredData }
}
