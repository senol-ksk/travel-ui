import dayjs from 'dayjs'
import { FaArrowRightLong } from 'react-icons/fa6'

import type { ClientFlightDataModel } from '@/modules/flight/types'
import { Button } from '@mantine/core'
import { formatCurrency } from '@/libs/util'

type IProps = {
  flight: ClientFlightDataModel
  onSelect: (arg: ClientFlightDataModel) => void
}

export const SearchResultCard = ({ onSelect = () => {}, flight }: IProps) => {
  const isDomestic = flight.flightDetails.every((item) => item.isDomestic)
  // const flightDetailSegments = flight.flightDetailSegments
  const { flightDetails, flightDetailSegments } = flight

  return (
    <div className={'rounded-lg border border-gray-300 p-3'}>
      {isDomestic ? (
        <div>
          <div>
            {
              flight.airLines.find(
                (item) =>
                  item.code ===
                  flightDetailSegments.at(0)?.marketingAirline.code
              )?.value
            }{' '}
            <div className='text-sm font-semibold'>
              {flightDetailSegments.at(0)?.flightNumber}
            </div>
          </div>
          <div className='flex gap-3'>
            <div>
              <div>
                Kalkış{' '}
                {flight?.flightDetailSegments.map((item) => {
                  return `${item.origin.code} ${item.destination.code}`
                })}
              </div>
              {dayjs(flight?.flightDetailSegments.at(0)?.departureTime).format(
                'HH:mm'
              )}
            </div>
            <div>
              <div>
                Varış Kalkış {flight?.flightDetailSegments[0].destination.code}
              </div>
              {dayjs(flight?.flightDetailSegments.at(0)?.arrivalTime).format(
                'HH:mm'
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* <textarea defaultValue={JSON.stringify(flight)}></textarea> */}
          <div className='grid grid-cols-2 gap-2'>
            {flightDetails.map((detail, index) => {
              // const detailSegment = flightDetailSegments.find(
              //   (segment) => segment.key === detail.flightSegmentKeys[index]
              // )

              const detailSegments = detail.flightSegmentKeys.map(
                (segmentKey) => {
                  return flightDetailSegments.find((segment) => {
                    return segmentKey === segment.key
                  })
                }
              )

              return (
                <div key={detail.key}>
                  {/* <textarea
                    defaultValue={JSON.stringify(detailSegments)}
                  ></textarea> */}
                  <div>
                    {
                      flight.airLines.find(
                        (airline) =>
                          airline.code ===
                          detailSegments.at(0)?.marketingAirline.code
                      )?.value
                    }
                  </div>
                  <div className='flex items-center gap-2'>
                    <div>
                      {}
                      {dayjs(detailSegments?.at(0)?.departureTime).format(
                        'HH:mm'
                      )}
                    </div>
                    <div>
                      <FaArrowRightLong />
                    </div>
                    <div>
                      {dayjs(detailSegments.at(-1)?.arrivalTime).format(
                        'HH:mm'
                      )}
                    </div>
                  </div>
                  <div>{detail.travelTime}</div>
                  <div>
                    {detail.flightSegmentKeys.length > 1
                      ? 'Aktarma var'
                      : 'Aktarma yok'}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className='text-end text-lg font-bold'>
        {formatCurrency(flight.flightFare.totalPrice.value)}
      </div>
      <div className='flex justify-end pt-3'>
        <Button
          type='button'
          onClick={() => {
            onSelect(flight)
          }}
        >
          Sec
        </Button>
      </div>
    </div>
  )
}
