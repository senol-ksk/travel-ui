import { useMemo } from 'react'
import dayjs from 'dayjs'

import { ClientDataType, FlightDetailSegment } from '@/app/flight/type'
import {
  filterParsers,
  FlightFilterSearchParams,
  SortOrderEnums,
} from '@/modules/flight/searchParams'
import { useQueryStates } from 'nuqs'

// Precompute derived data for better performance
interface FlightWithDerivedData extends ClientDataType {
  _derived: {
    firstDepartureTime: dayjs.Dayjs
    firstDepartureTimeMs: number
    lastArrivalTime: dayjs.Dayjs
    durationMs: number
    departureHour: number
    returnDepartureHour: number | null
    group0SegmentCount: number
    group1SegmentCount: number
    marketingAirlines: Set<string>
    originCode: string
    destinationCode: string
    baggageOptions: Set<string>
  }
}

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
    flight.package?.forEach((pkg) => {
      pkg.segments.forEach((segment) => {
        const baggage = segment.baggageAllowance

        if (baggage.maxWeight.value > 0) {
          const pieceCount =
            baggage.piece.pieceCount === 0 ? 1 : baggage.piece.pieceCount
          const baggageOption = `${pieceCount}x${baggage.maxWeight.value}`
          baggageOptions.add(baggageOption)
        }
      })
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

// Function to precompute derived data for a flight
const precomputeDerivedData = (
  flight: ClientDataType
): FlightWithDerivedData => {
  const firstSegment = flight.segments[0]
  const lastSegment = flight.segments[flight.segments.length - 1]

  const firstDepartureTime = dayjs(firstSegment?.departureTime)
  const lastArrivalTime = dayjs(lastSegment?.arrivalTime)
  const now = dayjs()

  const returnSegments = flight.segments.filter(
    (segment) => segment.groupId === 1
  )
  const returnDepartureTime =
    returnSegments.length > 0 ? dayjs(returnSegments[0]?.departureTime) : null

  // Precompute frequently used values
  const derived = {
    firstDepartureTime,
    firstDepartureTimeMs: firstDepartureTime.diff(now, 'milliseconds'),
    lastArrivalTime,
    durationMs: lastArrivalTime.diff(firstDepartureTime, 'milliseconds'),
    departureHour: firstDepartureTime.hour() * 60 + firstDepartureTime.minute(),
    returnDepartureHour: returnDepartureTime
      ? returnDepartureTime.hour() * 60 + returnDepartureTime.minute()
      : null,
    group0SegmentCount: flight.segments.filter(
      (segment) => segment.groupId === 0
    ).length,
    group1SegmentCount: flight.segments.filter(
      (segment) => segment.groupId === 1
    ).length,
    marketingAirlines: new Set(
      flight.segments.map((segment) => segment.marketingAirline.code)
    ),
    originCode: firstSegment?.origin?.code ?? '',
    destinationCode: lastSegment?.destination?.code ?? '',
    baggageOptions: new Set([
      ...(flight.segments
        .map((segment) => {
          const baggage = segment.baggageAllowance
          if (baggage.maxWeight.value > 0) {
            const pieceCount =
              baggage.piece.pieceCount === 0 ? 1 : baggage.piece.pieceCount
            return `${pieceCount}x${baggage.maxWeight.value}`
          }
          return null
        })
        .filter(Boolean) as string[]),
      ...(flight.package?.flatMap(
        (pkg) =>
          pkg.segments
            .map((segment) => {
              const baggage = segment.baggageAllowance
              if (baggage.maxWeight.value > 0) {
                const pieceCount =
                  baggage.piece.pieceCount === 0 ? 1 : baggage.piece.pieceCount
                return `${pieceCount}x${baggage.maxWeight.value}`
              }
              return null
            })
            .filter(Boolean) as string[]
      ) || []),
    ]),
  }

  return { ...flight, _derived: derived }
}

// Optimized sorting function using precomputed data
const sortFlightsWithDerivedData = (
  flights: FlightWithDerivedData[],
  filterParams: FlightFilterSearchParams
) => {
  return flights.sort((a, b) => {
    switch (filterParams.order) {
      case SortOrderEnums.priceAsc:
        return a.fareInfo.totalPrice.value - b.fareInfo.totalPrice.value
      case SortOrderEnums.priceDesc:
        return b.fareInfo.totalPrice.value - a.fareInfo.totalPrice.value
      case SortOrderEnums.hourAsc:
        return a._derived.firstDepartureTimeMs - b._derived.firstDepartureTimeMs
      case SortOrderEnums.hourDesc:
        return b._derived.firstDepartureTimeMs - a._derived.firstDepartureTimeMs
      case SortOrderEnums.durationAsc:
        return a._derived.durationMs - b._derived.durationMs
      case SortOrderEnums.durationDesc:
        return b._derived.durationMs - a._derived.durationMs
      default:
        return a.fareInfo.totalPrice.value - b.fareInfo.totalPrice.value
    }
  })
}

// Optimized filtering function using precomputed data
const filterFlightsWithDerivedData = (
  flights: FlightWithDerivedData[],
  filterParams: FlightFilterSearchParams,
  isDomestic: boolean
): ClientDataType[] => {
  return flights
    .filter((data) => {
      // Single pass through all filters for better performance

      // Filter by number of stops
      if (filterParams?.numOfStops && filterParams.numOfStops.length > 0) {
        const hasMatchingStops = filterParams.numOfStops.some((numOfStops) => {
          if (isDomestic) {
            return data.segments.length === numOfStops + 1
          }
          return (
            data._derived.group0SegmentCount === numOfStops + 1 ||
            data._derived.group1SegmentCount === numOfStops + 1
          )
        })
        if (!hasMatchingStops) return false
      }

      // Filter by airlines
      if (filterParams.airlines && filterParams.airlines.length > 0) {
        const hasMatchingAirline = filterParams.airlines.some((airline) =>
          data._derived.marketingAirlines.has(airline)
        )
        if (!hasMatchingAirline) return false
      }

      // Filter by airports
      if (filterParams.airports && filterParams.airports.length > 0) {
        const hasMatchingAirport =
          filterParams.airports.includes(data._derived.originCode) ||
          filterParams.airports.includes(data._derived.destinationCode)
        if (!hasMatchingAirport) return false
      }

      // Filter by departure hours
      if (
        filterParams.departureHours &&
        filterParams.departureHours.length > 1
      ) {
        const isInTimeRange =
          data._derived.departureHour >= filterParams.departureHours[0] &&
          data._derived.departureHour <= filterParams.departureHours[1]
        if (!isInTimeRange) return false
      }

      if (
        filterParams.returnHours &&
        filterParams.returnHours.length > 1 &&
        data._derived.returnDepartureHour !== null
      ) {
        const isInReturnTimeRange =
          data._derived.returnDepartureHour >= filterParams.returnHours[0] &&
          data._derived.returnDepartureHour <= filterParams.returnHours[1]
        if (!isInReturnTimeRange) return false
      }

      // Filter by baggage
      if (filterParams.baggage && filterParams.baggage.length > 0) {
        const hasMatchingBaggage = filterParams.baggage.some(
          (selectedBaggage) => {
            const [selectedPieces, selectedWeight] = selectedBaggage.split('x')
            const selectedPiecesNum = parseInt(selectedPieces)
            const selectedWeightNum = parseInt(selectedWeight)

            const hasMatchingInMainSegments = data.segments.some((segment) => {
              const segmentWeight = segment.baggageAllowance.maxWeight.value
              const segmentPieces = segment.baggageAllowance.piece.pieceCount

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

            if (hasMatchingInMainSegments) return true

            return (
              data.package?.some((pkg) =>
                pkg.segments.some((segment) => {
                  const segmentWeight = segment.baggageAllowance.maxWeight.value
                  const segmentPieces =
                    segment.baggageAllowance.piece.pieceCount

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
              ) || false
            )
          }
        )
        if (!hasMatchingBaggage) return false
      }

      return true
    })
    .map(({ _derived, ...flight }) => flight) // Remove derived data before returning
}

export const useFilterActions = (flightData: ClientDataType[] | undefined) => {
  const [filterParams] = useQueryStates(filterParsers)

  const filteredData = useMemo(() => {
    if (!flightData || flightData.length === 0) return []

    const isDomestic = flightData.every(
      (data) => !!data.details.every((detail) => detail.isPromotional)
    )

    // Precompute derived data for all flights
    const flightsWithDerivedData = flightData.map(precomputeDerivedData)

    // Sort first
    const sortedFlights = sortFlightsWithDerivedData(
      flightsWithDerivedData,
      filterParams
    )

    // Then filter
    const filteredFlights = filterFlightsWithDerivedData(
      sortedFlights,
      filterParams,
      isDomestic
    )

    return filteredFlights
  }, [flightData, filterParams])

  return { filteredData }
}
