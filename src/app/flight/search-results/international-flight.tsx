import dayjs from 'dayjs'
import { memo } from 'react'
import { Box, Button } from '@mantine/core'

import { RxCaretRight } from 'react-icons/rx'

import { formatCurrency } from '@/libs/util'
import type {
  AirportCode,
  AirlineCode,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
} from '../type'

import { AirlineLogo } from '@/components/airline-logo'
import { FlightDetailsSearch } from '../../flight/search-results/components/flight-detail'
import { PiSuitcaseRolling } from 'react-icons/pi'
import { MdOutlineAirplanemodeActive } from 'react-icons/md'
import { FaAngleRight } from 'react-icons/fa'
import { useDisclosure } from '@mantine/hooks'
import { IoIosClose } from 'react-icons/io'
type IProps = {
  airlineValues: AirlineCode[] | undefined
  airportValues?: AirportCode[]
  fareInfo: FlightFareInfo
  details: FlightDetail[]
  detailSegments: FlightDetailSegment[]
  onSelect: () => void
}

const FlightSearchResultsInternational: React.FC<IProps> = ({
  airlineValues,
  fareInfo,
  details,
  detailSegments,
  airportValues,
  onSelect = () => null,
}) => {
  const [detailsOpened, { toggle: toggleDetails }] = useDisclosure(false)

  return (
    <div className='items-center gap-x-4 rounded-lg border shadow hover:border-1 md:grid md:grid-cols-5'>
      <div className='col-span-4 grid'>
        {details.map((detail) => {
          const relatedSegment = detailSegments?.filter(
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
              className='relative mt-3 grid p-3 md:mt-0 md:grid-cols-3 md:px-3 md:py-3'
              key={detail.key}
              // onClick={onSelect}
            >
              <div className='start-0-0 absolute top-1/2 mt-4 h-8 w-1 -translate-y-1/2 rounded-tr-md rounded-br-md bg-gray-400 md:mt-0' />
              <div className='flex justify-between'>
                <div className='flex items-center gap-3 text-sm'>
                  <div>
                    <AirlineLogo
                      airlineCode={relatedSegment[0].marketingAirline.code}
                    />
                  </div>
                  <div>
                    <div>
                      {airlineText?.Value} {relatedSegment.at(0)?.flightNumber}
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-span-2'>
                <div className='mt-4 flex gap-2'>
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
                      <div className='absolute end-0 top-[1px] -translate-y-1/2 rotate-90 bg-white pb-[1px] text-blue-800'>
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
                          <div className='text-sm font-medium text-green-800'>
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

      <div className='grid h-full gap-3 px-3 text-center md:gap-0 md:py-5'>
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
          <Button
            className='border-0 bg-white px-0 text-sm font-normal text-blue-500'
            onClick={toggleDetails}
          >
            {detailsOpened ? (
              <>
                Detayı Kapat
                <IoIosClose size={25} />
              </>
            ) : (
              'Uçuş Detayı'
            )}
          </Button>
        </div>
      </div>

      <div className='col-span-5 rounded-lg bg-gray-100 text-start md:mr-5 md:mb-5 md:ml-5'>
        <FlightDetailsSearch
          details={details}
          detailSegments={detailSegments}
          airlineValues={airlineValues}
          opened={detailsOpened}
          airportValues={airportValues}
          isDomestic={false}
        />
      </div>
    </div>
  )
}

const MemoizedFlightSearchResultsInternational = memo(
  FlightSearchResultsInternational
)

export { MemoizedFlightSearchResultsInternational }
