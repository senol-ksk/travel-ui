import dayjs from 'dayjs'
import { memo } from 'react'
import { Box, Button, Divider, rem } from '@mantine/core'
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
import { FlightDetailsSearch } from '../../flight/search-results/components/flight-detail'
import { PiSuitcaseRolling } from 'react-icons/pi'
import { MdOutlineAirplanemodeActive } from 'react-icons/md'
import { FaAngleRight } from 'react-icons/fa'
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
    <div className='@container items-center gap-4 rounded-lg border shadow hover:border-1 md:grid md:grid-cols-5'>
      <div className='col-span-4 grid'>
        {details.map((detail) => {
          const relatedSegment = detailSegments.filter(
            (item) => detail.groupId === item.groupId
          )
          const hasTransferStop = relatedSegment.length > 1

          const lastArrivalTime = dayjs(relatedSegment.at(-1)?.arrivalTime)
          const firstDepartureTime = dayjs(relatedSegment.at(0)?.departureTime)
          const arrivalIsAfter = lastArrivalTime.isAfter(
            firstDepartureTime,
            'D'
          )

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
            <div
              className='relative grid p-3 md:grid-cols-3 md:px-5 md:py-3'
              key={detail.key}
              // onClick={onSelect}
            >
              <div className='start-0-0 absolute top-1/2 h-8 w-1 -translate-y-1/2 rounded-tr-md rounded-br-md bg-gray-400' />
              <div className='flex justify-between'>
                <div className='flex gap-3 text-sm'>
                  <div>
                    <AirlineLogo
                      airlineCode={relatedSegment[0].marketingAirline.code}
                    />
                  </div>
                  <div>
                    <div>
                      {airlineText?.Value} {relatedSegment.at(0)?.flightNumber}
                    </div>
                    <div className='flex items-center gap-1'>
                      <PiSuitcaseRolling />
                      8kg El Bagajı
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-span-2'>
                <div className='flex gap-2'>
                  <div>
                    <div className='text-xl leading-none font-semibold'>
                      {dayjs(relatedSegment.at(0)?.departureTime).format(
                        'HH:mm'
                      )}
                    </div>
                    <div className='text-center'>
                      {relatedSegment.at(0)?.origin.code}
                    </div>
                  </div>
                  <div className='mt-2 grow'>
                    <div className='relative'>
                      <Box bg={'blue'} h={2} className='rounded' />
                      <div
                        className='absolute end-0 -translate-y-1/2 rotate-90 bg-white text-blue-800'
                        style={{ top: 1, paddingBottom: 1 }}
                      >
                        <MdOutlineAirplanemodeActive size={18} />
                      </div>
                    </div>
                    <div className='pt-3'>
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
                              <span className='text-red-700'>
                                {relatedSegment.length - 1} Aktarma
                              </span>
                            ) : (
                              'Aktarmasız'
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {hasTransferStop && (
                      <div className='flex justify-center gap-1 text-xs text-gray-600'>
                        {relatedSegment.map(
                          (segment, segmentIndex, segmentArr) => {
                            const firstItem = segmentIndex === 0
                            const middleItems =
                              segmentIndex > 0 && segmentArr.length - 1
                            const lastItem =
                              segmentIndex === segmentArr.length - 1
                            return (
                              <div
                                key={segment.key}
                                className='flex items-center'
                              >
                                {firstItem && (
                                  <span>{segment.origin.code}</span>
                                )}
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
                                      {
                                        segmentArr.at(segmentIndex)?.destination
                                          .code
                                      }
                                    </span>
                                  </>
                                )}
                              </div>
                            )
                          }
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className='relative text-xl leading-none font-semibold'>
                      {dayjs(relatedSegment.at(-1)?.arrivalTime).format(
                        'HH:mm'
                      )}{' '}
                      {arrivalIsAfter && (
                        <sup className='absolute -end-4 -top-2 text-xs leading-none font-normal text-red-700'>
                          +1
                        </sup>
                      )}
                    </div>
                    <div className='text-center'>
                      {relatedSegment.at(-1)?.destination.code}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className='grid h-full gap-3 border-l px-3 py-5 text-center'>
        <div className='text-xl font-semibold'>
          {formatCurrency(fareInfo.totalPrice.value)}
        </div>
        <div>
          <Button
            type='button'
            onClick={onSelect}
            fullWidth
            size='md'
            rightSection={<FaAngleRight size={12} />}
          >
            Seç
          </Button>
        </div>
        <div>
          <FlightDetailsSearch />
        </div>
      </div>
    </div>
  )
}

const MemoizedFlightSearchResultsInternational = memo(
  FlightSearchResultsInternational
)

export { MemoizedFlightSearchResultsInternational }
