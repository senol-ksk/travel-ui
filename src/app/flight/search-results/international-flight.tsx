import dayjs from 'dayjs'
import { memo } from 'react'
import { Button, Divider, rem } from '@mantine/core'
import { RxCaretRight } from 'react-icons/rx'

import { formatCurrency } from '@/libs/util'
import {
  AirlineCode,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
} from '../type'

import { AirlineLogo } from '@/components/airline-logo'
import { IoAirplaneSharp } from 'react-icons/io5'

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
    <div className={`@container rounded-lg border border-gray-300 shadow-sm`}>
      {details.map((detail) => {
        const relatedSegment = detailSegments.filter(
          (item) => detail.groupId === item.groupId
        )
        const hasTransferStop = relatedSegment.length > 1

        const lastArrivalTime = dayjs(relatedSegment.at(-1)?.arrivalTime)
        const firstDepartureTime = dayjs(relatedSegment.at(0)?.departureTime)
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
          <div className='p-3' key={detail.key}>
            {/* <input defaultValue={JSON.stringify(relatedDetailSegments)} /> */}
            <div className='flex items-center gap-3 pb-2'>
              <div>
                <AirlineLogo
                  airlineCode={relatedSegment[0].marketingAirline.code}
                  width={36}
                  height={36}
                />
              </div>
              <div>{airlineText?.Value}</div>
              <div>{relatedSegment.at(0)?.flightNumber}</div>
            </div>
            <div className='flex items-center gap-2'>
              <div>
                <div>
                  {dayjs(relatedSegment.at(0)?.departureTime).format('HH:mm')}
                </div>
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
                  {dayjs(relatedSegment.at(-1)?.arrivalTime).format('HH:mm')}{' '}
                  {arrivalIsAfter && <sup className='text-red-700'>+1</sup>}
                </div>
                <div>{relatedSegment.at(-1)?.destination.code}</div>
              </div>
            </div>
            <div className='-mt-3 flex items-center justify-center gap-3 text-sm'>
              <div className='flex gap-1 text-gray-700/80'>
                {totalFlightDuration.get('D') > 0 && (
                  <div>{totalFlightDuration.format('DD')} gün</div>
                )}
                <div>{totalFlightDuration.format('HH')}sa</div>
                <div>{totalFlightDuration.format('mm')}dk</div>
              </div>
              <div className='text-sm text-gray-600'>
                {hasTransferStop ? (
                  <span className='text-red-700'>
                    {relatedSegment.length - 1} Aktarma
                  </span>
                ) : (
                  'Aktarmasız'
                )}
              </div>
            </div>
            {hasTransferStop && (
              <div className='flex justify-center gap-1 text-xs text-gray-600'>
                {relatedSegment.map((segment, segmentIndex, segmentArr) => {
                  const firstItem = segmentIndex === 0
                  const middleItems = segmentIndex > 0 && segmentArr.length - 1
                  const lastItem = segmentIndex === segmentArr.length - 1
                  return (
                    <div key={segment.key} className='flex items-center'>
                      {firstItem && <span>{segment.origin.code}</span>}
                      {middleItems && (
                        <>
                          <span>
                            <RxCaretRight size={20} />
                          </span>
                          <span>
                            {segmentArr.at(segmentIndex)?.origin.code}
                          </span>
                        </>
                      )}
                      {lastItem && (
                        <>
                          <span>
                            <RxCaretRight size={20} />
                          </span>
                          <span>
                            {segmentArr.at(segmentIndex)?.destination.code}
                          </span>
                        </>
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

export { MemoizedFlightSearchResultsInternational }
