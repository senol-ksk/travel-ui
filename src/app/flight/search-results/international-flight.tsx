import { formatCurrency } from '@/libs/util'
import {
  AirlineCode,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
} from '../type'
import { Button, Divider, Skeleton } from '@mantine/core'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { AirlineLogo } from '@/components/airline-logo'
import { memo } from 'react'

type IProps = {
  airlineValues: AirlineCode[] | undefined
  fareInfo: FlightFareInfo
  details: FlightDetail[]
  detailSegments: FlightDetailSegment[]
  onSelect: () => void
  // onSelect: (fareInfo: FlightFareInfo) => void
}

const FlightSearchResultsInternational: React.FC<IProps> = ({
  airlineValues,
  fareInfo,
  details,
  detailSegments,
  onSelect = () => null,
}) => {
  // const flightNumber = detailSegments.at(0)?.flightNumber

  return (
    <div className={clsx(`@container rounded-lg border border-gray-300`)}>
      {details.map((detail) => {
        const relatedDetailSegments = detailSegments.filter(
          (item) => detail.groupId === item.groupId
        )

        const lastArrivalTime = dayjs(relatedDetailSegments.at(-1)?.arrivalTime)
        const firstDepartureTime = dayjs(
          relatedDetailSegments.at(0)?.departureTime
        )
        const arrivalIsAfter = lastArrivalTime.isAfter(firstDepartureTime, 'D')

        const totalFlightDuration = dayjs.duration(
          lastArrivalTime.diff(firstDepartureTime)
        )

        const airlineText = airlineValues
          ?.find(
            (airline) =>
              airline.Code === relatedDetailSegments[0].marketingAirline.code
          )
          ?.Value.find((item) => item.LangCode === 'tr_TR')

        return (
          <div className='p-3' key={detail.key}>
            {/* <input defaultValue={JSON.stringify(relatedDetailSegments)} /> */}
            <div className='flex items-center gap-3 pb-2'>
              <div>
                <AirlineLogo
                  airlineCode={relatedDetailSegments[0].marketingAirline.code}
                  width={36}
                  height={36}
                />
              </div>
              <div>{airlineText?.Value}</div>
              <div>{relatedDetailSegments.at(0)?.flightNumber}</div>
            </div>
            <div className='flex items-center gap-2'>
              <div>
                <div>
                  {dayjs(relatedDetailSegments.at(0)?.departureTime).format(
                    'HH:mm'
                  )}
                </div>
                <div>{relatedDetailSegments.at(0)?.origin.code}</div>
              </div>
              <div className='relative grow'>
                <Divider color='green' />
              </div>
              <div>
                <div>
                  {dayjs(relatedDetailSegments.at(-1)?.arrivalTime).format(
                    'HH:mm'
                  )}{' '}
                  {arrivalIsAfter && <sup className='text-red-700'>+1</sup>}
                </div>
                <div>{relatedDetailSegments.at(-1)?.destination.code}</div>
              </div>
            </div>
            <div className='flex items-center justify-center gap-3'>
              <div className='flex gap-1'>
                {totalFlightDuration.get('D') > 0 && (
                  <div>{totalFlightDuration.format('DD')} gün</div>
                )}
                <div>{totalFlightDuration.format('HH')}sa</div>
                <div>{totalFlightDuration.format('mm')}dk</div>
              </div>
              <div className='text-sm text-gray-600'>
                {relatedDetailSegments.length > 1 ? (
                  <span className='text-red-700'>
                    {relatedDetailSegments.length - 1} Aktarma
                  </span>
                ) : (
                  'Aktarmasız'
                )}
              </div>
            </div>
          </div>
        )
      })}

      <div className='flex items-center justify-between border-t p-3 pt-4'>
        <div>{formatCurrency(fareInfo.totalPrice.value)}</div>
        <div>
          <Button
            type='button'
            onClick={() => {
              onSelect()
            }}
          >
            Seç
          </Button>
        </div>
      </div>
    </div>
  )
}

const MemoizedFlightSearchResultsInternational = memo(
  FlightSearchResultsInternational
)

export {
  FlightSearchResultsInternational,
  MemoizedFlightSearchResultsInternational,
}
