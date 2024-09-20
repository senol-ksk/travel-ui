import type {
  ClientFlightDataModel,
  FlightDetails,
  FlightDetailSegment,
  FlightFareInfos,
  FlightSearchApiResponse,
} from '@/modules/flight/types'
import { getAirlineByCodeList } from '../search.request'

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

let searchResults: ClientFlightDataModel[] = []
const airLines: { value: string; code: string }[] = []
export const generateFlightData = async (): Promise<
  ClientFlightDataModel[]
> => {
  if (searchResults.length > 0) searchResults = []
  airlineList = [...new Set(airlineList)]

  if (airlineList.length > 0) {
    const airLinesServiceResponse = await getAirlineByCodeList(airlineList)

    airLinesServiceResponse.Result.forEach((element) => {
      airLines.push({
        value: element.Value[0].Value,
        code: element.Code,
      })
    })
    airlineList = [...new Set(airlineList)]
  }

  flightData.flightFareInfos.forEach((flightItem, count) => {
    var flightObject: ClientFlightDataModel = {
      flightFare: flightItem,
      flightDetails: [],
      flightDetailSegments: [],
      airLines: airLines,
      airportList: [],
      departureAirportList: [],
      returnAirportList: [],
      transferPoints: [],
      id: -1,
    }

    flightItem.flightDetailKeys.forEach((detailKey, detailCount) => {
      var detail = flightData.flightDetails.filter(
        (det) => det.key.toLocaleLowerCase() == detailKey.toLocaleLowerCase()
      )

      if (detail.length > 0) {
        flightObject?.flightDetails.push(detail[0])
        // flightObject!.groupId = groupId

        detail.at(0)?.flightSegmentKeys.forEach((segmentKey, segmentCount) => {
          var segment = flightData.flightDetailSegments.filter(
            (seg) => seg.key === segmentKey
          )

          if (segment.length > 0) {
            flightObject?.flightDetailSegments.push(segment[0])
          }
        })
      }

      flightObject!.id = 'id' + Math.random().toString(16).slice(2)

      searchResults.push(flightObject)
    })
  })

  if (flightData.flightDetailSegments.length > 0) {
    flightData.flightDetailSegments = []
    flightData.flightDetails = []
    flightData.flightFareInfos = []
  }

  return searchResults
}

const generatCompleted = () => {
  searchResults = []
}
