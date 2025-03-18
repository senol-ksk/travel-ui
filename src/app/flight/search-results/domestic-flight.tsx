import { memo } from 'react'
import { Button, Divider } from '@mantine/core'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { IoAirplaneSharp } from 'react-icons/io5'

import { formatCurrency } from '@/libs/util'
import {
  AirlineCode,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
} from '@/app/flight/type'
import { AirlineLogo } from '@/components/airline-logo'

dayjs.extend(duration)

type IProps = {
  fareInfo: FlightFareInfo
  details: FlightDetail[]
  detailSegments: FlightDetailSegment[]
  onSelect: () => void
  airlineValues: AirlineCode[] | undefined
}

const FlightSearchResultsOneWayDomestic: React.FC<IProps> = ({
  fareInfo,
  details,
  detailSegments,
  airlineValues,
  onSelect = () => null,
}) => {
  return (
    <div
      className='@container cursor-pointer rounded-lg border border-gray-300 hover:border-1 hover:shadow-lg'
      onClick={onSelect}
    >
      {details.map((detail) => {
        const relatedSegment = detailSegments.filter(
          (segment) => detail.groupId === segment.groupId
        )
        const hasTransferStop = relatedSegment.length > 1
        const flightNumber = relatedSegment.at(0)?.flightNumber

        const firstDepartureTime = dayjs.utc(
          relatedSegment.at(0)?.departureTime
        )
        const lastArrivalTime = dayjs.utc(relatedSegment.at(-1)?.arrivalTime)
        const arrivalIsAfter = lastArrivalTime.isAfter(firstDepartureTime, 'D')

        const totalFlightDuration = dayjs.duration(
          lastArrivalTime.diff(firstDepartureTime)
        )

        const airlineText = airlineValues
          ?.find(
            (airline) =>
              airline.Code === relatedSegment[0].marketingAirline.code
          )
          ?.Value.find((item) => item.LangCode === 'tr_TR')

        return (
          <div key={detail.key} className='p-3'>
            <div className='flex items-center gap-3 pb-2'>
              <AirlineLogo
                airlineCode={relatedSegment[0].marketingAirline.code.toLocaleLowerCase()}
              />
              <div>{airlineText?.Value}</div>
              <div>{flightNumber}</div>
            </div>
            <div className='flex items-center gap-2'>
              <div>
                <div>{firstDepartureTime.format('HH:mm')}</div>
                <div>{relatedSegment.at(0)?.origin.code}</div>
              </div>
              <div className='relative grow'>
                <Divider color='green' />
                <div className='absolute end-0 top-0 -translate-y-1/2 bg-white ps-2'>
                  <IoAirplaneSharp size={18} />
                </div>
              </div>
              <div>
                <div>
                  {lastArrivalTime.format('HH:mm')}
                  {arrivalIsAfter && <sup className='text-red-700'> +1</sup>}
                </div>
                <div>{relatedSegment.at(-1)?.destination.code}</div>
              </div>
            </div>
            <div className='flex items-center justify-center gap-3 text-sm text-gray-700'>
              <div className='flex gap-1'>
                {totalFlightDuration.get('D') > 0 && (
                  <div>{totalFlightDuration.format('DD')} gün</div>
                )}
                <div>{totalFlightDuration.format('HH')}sa</div>
                <div>{totalFlightDuration.format('mm')}dk</div>
              </div>
              <div className='flex justify-center'>
                <div className='text-sm text-gray-500'>
                  {hasTransferStop ? (
                    <span className='text-red-600'>
                      {relatedSegment.length - 1} Aktarma
                    </span>
                  ) : (
                    'Aktarmasız'
                  )}
                </div>
              </div>
            </div>
            {/* {hasTransferStop && (
              <div className='flex items-center justify-center gap-1 p-1 text-xs text-gray-600'>
                <span>{relatedSegment[0].origin.code}</span>
                <span>&gt;</span>
                <span>{relatedSegment[0].destination.code}</span>
                <span>&gt;</span>
                <span>{relatedSegment[1].destination.code}</span>
              </div>
            )} */}
            {hasTransferStop && (
              <div className='flex justify-center gap-1 text-xs text-gray-600'>
                {relatedSegment.map((segment, segmentIndex, segmentArr) => {
                  return (
                    <div key={segment.key} className='flex items-center gap-1'>
                      <span>{segment.origin.code} &gt;</span>
                      {segmentIndex > 0 && (
                        <span>
                          {segmentArr.at(segmentIndex)?.destination.code}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
      <div className='flex items-center justify-between border-t p-3 pt-4'>
        <div>{formatCurrency(fareInfo.totalPrice.value)}</div>
        <div>
          <Button>Seç</Button>
        </div>
      </div>
    </div>
  )
}

const MemoizedFlightSearchResultsDomestic = memo(
  FlightSearchResultsOneWayDomestic
)

export { MemoizedFlightSearchResultsDomestic }
