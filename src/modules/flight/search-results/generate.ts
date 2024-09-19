import type {
  FlightDetails,
  FlightDetailSegment,
  FlightFareInfos,
  FlightSearchApiResponse,
} from '@/modules/flight/types'
import { getAirlineByCodeList } from '../search.request'
import dayjs from 'dayjs'

const dataTypes: ['flightFareInfos', 'flightDetailSegments', 'flightDetails'] =
  ['flightFareInfos', 'flightDetailSegments', 'flightDetails']

const flightData: {
  flightFareInfos: FlightFareInfos[string][]
  flightDetailSegments: FlightDetailSegment[string][]
  flightDetails: FlightDetails[string][]
} = {
  flightFareInfos: [],
  flightDetailSegments: [],
  flightDetails: [],
}
let airlineList: string[] = []

export const collectFlightData = (
  flightReponse: FlightSearchApiResponse['data']['searchResults']
) => {
  const recivedData = flightReponse

  recivedData.forEach((flight) => {
    Object.keys(flight.flightDetailSegments).forEach((segment) => {
      var item = flight.flightDetailSegments[segment]
      airlineList.push(item.marketingAirline.code)

      if (item.operatingAirline != null) {
        if (item.operatingAirline.code != item.marketingAirline.code) {
          airlineList.push(item.operatingAirline.code)
        } else {
          item.operatingAirline = null
        }
      }
    })
  })

  dataTypes.forEach((type) => {
    recivedData.forEach((flightItem) => {
      const providerName = flightItem.diagnostics.providerName
      Object.keys(flightItem[type]).forEach((item) => {
        if (type === 'flightFareInfos') {
          flightItem[type][item].providerName = providerName
        }

        // @ts-expect-error
        flightData[type].push(flightItem[type][item])
      })
    })
  })
}

const airlineCodes: {
  [key: string]: {
    tr_TR: string
  }
} = {}

type ClientFlightDataModel =
  | {
      flightFare: FlightFareInfos
      flightDetails: []
      flightDetailSegments: []
      minPrice: 0
      maxPrice: 0
      airLineList: []
      airportList: []
      departureAirportList: []
      returnAirportList: []
      transferPoints: []
      groupId: 0
      id: number | string
    }[]
  | null

const searchResults: ClientFlightDataModel = []

export const generateFlightData = async (
  groupId: number | null
): Promise<ClientFlightDataModel> => {
  airlineList = [...new Set(airlineList)]
  if (airlineList.length > 0) {
    const airLinesServiceResponse = await getAirlineByCodeList(airlineList)

    airLinesServiceResponse.Result.forEach((element) => {
      airlineCodes[element.Code] = {
        tr_TR: element.Value[0].Value,
      }
    })
  }

  flightData.flightFareInfos.forEach((flightItem, count) => {
    if (groupId !== null) {
      var flightObject = {
        id: '',
        flightFare: flightItem,
        flightDetails: [],
        flightDetailSegments: [],
        minPrice: 0,
        maxPrice: 0,
        airLineList: [],
        airportList: [],
        departureAirportList: [],
        returnAirportList: [],
        transferPoints: [],
        groupId: 0,
      }
      var totalFlightTime = '00:00:00'

      flightItem.flightDetailKeys.forEach((detailKey, detailCount) => {
        var detail = flightData.flightDetails.filter(
          (det) =>
            det.key.toLocaleLowerCase() == detailKey.toLocaleLowerCase() &&
            det.groupId === groupId
        )

        if (detail.length > 0) {
          // @ts-expect-error
          flightObject.flightDetails.push(detail[0])
          flightObject.groupId = groupId

          detail
            .at(0)
            ?.flightSegmentKeys.forEach((segmentKey, segmentCount) => {
              var segment = flightData.flightDetailSegments.filter(
                (seg) => seg.key === segmentKey && seg.groupId === groupId
              )

              if (segment.length > 0) {
                // if (segment[0].operatingAirline != null) {
                // }
                var flightHour = dayjs(
                  segment[0].flightTime,
                  'HH:mm:ss'
                ).format('HH')
                var flightMinute = dayjs(
                  segment[0].flightTime,
                  'HH:mm:ss'
                ).format('mm')

                // @ts-expect-error
                flightObject.flightDetailSegments.push(segment[0])
              }
            })
        }

        flightObject.id = 'id' + Math.random().toString(16).slice(2)
        // @ts-expect-error
        searchResults.push(flightObject)
      })
    }
  })

  return searchResults
}
