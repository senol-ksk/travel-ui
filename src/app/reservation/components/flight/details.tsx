import {
  FlightReservationFlightList,
  FlightReservationSummary,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'
import { IoAirplaneSharp, IoInformationCircle } from 'react-icons/io5'
import { AirlineLogo } from '@/components/airline-logo'
import dayjs from 'dayjs'
import { Tooltip } from '@mantine/core'
import { upperFirst } from '@mantine/hooks'

type IProps = {
  flightSegments: FlightReservationFlightList['flightSegments']
  data: ProductPassengerApiResponseModel['viewBag']
}

export const FlightDetailSummary: React.FC<IProps> = ({
  flightSegments,
  data,
}) => {
  const flightData = data.SummaryViewDataResponser
    .summaryResponse as FlightReservationSummary
  const airports = flightData.airportList
  const airlines = flightData.airlineList

  return (
    <div className='grid gap-4'>
      {flightSegments.map((segment, segmentIndex) => {
        const departureTime = dayjs(segment.departureTime)
        const arrivalTime = dayjs(segment.arrivalTime)
        const flightDuration = dayjs.duration(arrivalTime.diff(departureTime))

        return (
          <div
            key={segment.key}
            className='rounded-md border border-gray-400 px-2 py-3'
          >
            <div className='grid gap-3'>
              {flightSegments.length === 1 ? (
                <div className='flex items-center gap-1 rounded-md border border-green-200 bg-green-50 p-1'>
                  <div className='text-sm font-medium text-green-800'>
                    Aktarmasız
                  </div>
                </div>
              ) : (
                segmentIndex > 0 && (
                  <div className='flex items-center gap-1 rounded-md border border-red-200 bg-red-50 p-1 text-sm'>
                    <div className='flex items-center gap-2 text-red-600'>
                      <div className='font-bold text-red-800'>
                        {segmentIndex}. Aktarma:
                      </div>
                    </div>
                    <div className='font-bold text-red-800'>
                      Bekleme süresi:{' '}
                      {dayjs(segment.departureTime).to(
                        dayjs(flightSegments[segmentIndex - 1].arrivalTime),
                        true
                      )}
                    </div>
                  </div>
                )
              )}
              <div className='flex items-center gap-3'>
                <div className='leading-none'>
                  <AirlineLogo
                    airlineCode={segment.marketingAirline.code}
                    alt={airlines[segment.marketingAirline.code]}
                  />
                </div>
                <div className='text-sm font-medium text-gray-800'>
                  {airlines[segment.marketingAirline.code]} -{' '}
                  {segment.flightNumber}
                </div>
              </div>

              {segment.freeVolatileData?.BrandName && (
                <div className='flex items-center gap-2'>
                  <div className='text-sm text-gray-600'>
                    {segment.freeVolatileData.BrandName.toUpperCase()}
                  </div>
                  <div className='flex items-center gap-1'>
                    <IoInformationCircle
                      size={14}
                      className='cursor-help text-blue-600'
                    />
                  </div>
                </div>
              )}

              <div className='flex items-center gap-2'>
                <div className='text-sm font-medium'>
                  {departureTime.format('HH:mm')} -{' '}
                  {arrivalTime.format('HH:mm')}
                </div>
                <div className='text-sm'>
                  {departureTime.format('DD MMMM YYYY dddd')}
                </div>
                <div className='text-sm'>
                  ({flightDuration.format('H')}s {flightDuration.format('mm')}
                  dk)
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <div className='text-sm'>
                  {airports[segment.origin.code].city} ({segment.origin.code})
                </div>
                <div className='flex items-center gap-2'>
                  <IoAirplaneSharp size={16} />
                </div>
                <div className='text-sm'>
                  {airports[segment.destination.code].city} (
                  {segment.destination.code})
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
