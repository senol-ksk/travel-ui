import { FaArrowRightLong } from 'react-icons/fa6'
import { Divider, Image, rem } from '@mantine/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import {
  FlightReservationSummary,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'
import { AirlineLogo } from '@/components/airline-logo'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}

const FlightSummary: React.FC<IProps> = ({ data }) => {
  const flightData = data.SummaryViewDataResponser
    .summaryResponse as FlightReservationSummary
  const airlines = flightData.airlineList
  const airports = flightData.airportList

  return (
    <div className='grid gap-5'>
      {flightData.flightList
        .sort((a, b) => a.flightDetail.groupId - b.flightDetail.groupId)
        .map((flightItem) => {
          const flightDetail = flightItem.flightDetail
          const flightSegments = flightItem.flightSegments
          const flightSegmentsFirstItem = flightSegments[0]
          const flightSegmentsLastItem = flightSegments.at(
            -1
          ) as typeof flightSegmentsFirstItem
          const hasTransfer = flightSegments.length > 1
          const transferCount = flightSegments.length - 1

          const flightFareInfo = flightItem.flightFareInfo

          return (
            <div key={flightItem.flightDetail.key}>
              <div className='flex gap-2'>
                <div>
                  <AirlineLogo
                    airlineCode={flightSegmentsFirstItem.marketingAirline.code}
                    alt={
                      airlines[flightSegmentsFirstItem.marketingAirline.code]
                    }
                  />
                </div>
                <div className='flex items-center gap-2'>
                  <div>
                    {airlines[flightSegmentsFirstItem.marketingAirline.code]}
                  </div>
                  <small>{flightSegmentsFirstItem.flightNumber}</small>
                </div>
              </div>
              <div className='flex items-center gap-2 font-semibold'>
                <div>
                  {airports[flightSegmentsFirstItem.origin.code].city}{' '}
                  <small>({flightSegmentsFirstItem.origin.code})</small>
                </div>
                <div>
                  <FaArrowRightLong size={20} />
                </div>
                <div>
                  {airports[flightSegmentsLastItem?.destination.code].city}
                  <small>({flightSegmentsLastItem?.destination.code})</small>
                </div>
              </div>
              <div>
                {dayjs(flightSegmentsFirstItem.departureTime).format(
                  'DD MMMM dddd YYYY HH:mm'
                )}
              </div>
              <div>
                {dayjs(flightSegmentsLastItem?.arrivalTime).format(
                  'DD MMMM dddd YYYY HH:mm'
                )}
              </div>
              {hasTransfer && (
                <div className='mt-2 rounded-md border border-yellow-300 bg-yellow-100 p-2 text-sm'>
                  <div className='pb-2 text-center font-semibold'>
                    {transferCount} Aktarma
                  </div>
                  {flightSegments.map((segment, segmentIndex, segmentArr) => {
                    const prevSegment = segmentArr[segmentIndex]
                    const prevDepartureTime = dayjs(prevSegment.departureTime)
                    const prevArrivalTime = dayjs(prevSegment.arrivalTime)
                    const departureTime = dayjs(segment.departureTime)
                    const arrivalTime = dayjs(segment.arrivalTime)
                    const transferDuration = prevArrivalTime.to(
                      departureTime,
                      true
                    )

                    if (segmentIndex === 0) return

                    return (
                      <div key={segment.key} className='grid gap-2'>
                        <div className='flex items-center gap-3'>
                          {transferCount > 1 && (
                            <div>{segmentIndex}. Aktarma</div>
                          )}

                          <div>
                            <strong>Bekleme Süresi:</strong> {transferDuration}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
    </div>
  )
}

export { FlightSummary }
