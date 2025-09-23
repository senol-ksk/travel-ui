import { memo } from 'react'
import { Box, Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { PiSuitcaseRolling } from 'react-icons/pi'
import { FaAngleRight } from 'react-icons/fa6'
import { MdOutlineAirplanemodeActive } from 'react-icons/md'
import { formatCurrency } from '@/libs/util'
import {
  AirportCode,
  AirlineCode,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
} from '@/app/flight/type'
import { AirlineLogo } from '@/components/airline-logo'
import { FlightDetailsSearch } from '../../flight/search-results/components/flight-detail'
import { IoIosClose } from 'react-icons/io'
dayjs.extend(duration)

type IProps = {
  fareInfo: FlightFareInfo
  details: FlightDetail[]
  detailSegments: FlightDetailSegment[]
  onSelect: () => void
  airlineValues: AirlineCode[] | undefined
  airportValues?: AirportCode[]
}

const FlightSearchResultsOneWayDomestic: React.FC<IProps> = ({
  fareInfo,
  details,
  detailSegments,
  airlineValues,
  airportValues,
  onSelect = () => null,
}) => {
  const [detailsOpened, { toggle: toggleDetails }] = useDisclosure(false)
  return (
    <div className='items-center gap-x-4 rounded-lg border shadow hover:border-1 md:grid md:grid-cols-5'>
      <div className='col-span-4 grid gap-4'>
        {details.map((detail) => {
          const relatedSegment = detailSegments?.filter(
            (segment) => detail.groupId === segment.groupId
          )
          const hasTransferStop = relatedSegment.length > 1
          const flightNumber = relatedSegment.at(0)?.flightNumber

          const firstDepartureTime = dayjs(relatedSegment.at(0)?.departureTime)
          const lastArrivalTime = dayjs(relatedSegment.at(-1)?.arrivalTime)
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
              key={detail.key}
              className='relative mt-5 grid p-3 md:mt-0 md:grid-cols-3 md:p-5'
              // onClick={onSelect}
            >
              <div className='start-0-0 absolute top-1/2 mt-5 h-8 w-1 -translate-y-1/2 rounded-tr-md rounded-br-md bg-gray-400 md:mt-0' />
              <div className='mb-5 flex items-center gap-3 text-sm md:mb-0'>
                <div>
                  <AirlineLogo
                    airlineCode={relatedSegment[0].marketingAirline.code.toLocaleLowerCase()}
                  />
                </div>
                <div>
                  <div>
                    {airlineText?.Value} {flightNumber}
                  </div>
                  {/* <div className='flex items-center gap-1'>
                    <PiSuitcaseRolling />
                    <div>8 kg El Bagajı</div>
                  </div> */}
                </div>
              </div>
              <div className='col-span-2'>
                <div className='flex gap-2'>
                  <div>
                    <div className='text-xl leading-none font-semibold'>
                      {firstDepartureTime.format('HH:mm')}
                    </div>
                    <div className='text-center'>
                      {relatedSegment.at(0)?.origin.code}
                    </div>
                  </div>
                  <div className='mt-2 grow'>
                    <div className='relative'>
                      <Box bg={'blue'} h={2} className='rounded' />
                      <div className='top-[1px]text-blue-800 absolute end-0 -translate-y-1/2 rotate-90 bg-white pb-[1px]'>
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
                              <span className='font-medium text-red-600'>
                                {relatedSegment.length - 1} Aktarma
                              </span>
                            ) : (
                              <span className='font-medium text-green-800'>
                                Aktarmasız
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {hasTransferStop && (
                        <div className='flex justify-center gap-2 text-xs text-gray-600'>
                          {relatedSegment.map(
                            (segment, segmentIndex, segmentArr) => {
                              return (
                                <div
                                  key={segment.key}
                                  className='flex items-center gap-1'
                                >
                                  <span>{segment.origin.code} &gt;</span>
                                  {segmentIndex > 0 && (
                                    <span>
                                      {
                                        segmentArr.at(segmentIndex)?.destination
                                          .code
                                      }
                                    </span>
                                  )}
                                </div>
                              )
                            }
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className='relative text-xl leading-none font-semibold'>
                      {lastArrivalTime.format('HH:mm')}

                      {arrivalIsAfter && (
                        <sup className='absolute -end-4 -top-2 text-xs leading-none font-bold text-red-700'>
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
      <div className='grid gap-1 px-3 text-center md:pt-6'>
        <div className='text-xl font-semibold'>
          {formatCurrency(fareInfo.totalPrice.value)}
        </div>
        <div>
          <Button
            onClick={onSelect}
            type='button'
            fullWidth
            size='md'
            rightSection={<FaAngleRight size={12} />}
          >
            Seç
          </Button>
        </div>
        <Button
          className='border-0 bg-white px-0 text-sm font-normal text-blue-500'
          onClick={toggleDetails}
        >
          {detailsOpened ? (
            <>
              Detayı Kapat <IoIosClose size={25} />
            </>
          ) : (
            'Uçuş Detayı'
          )}
        </Button>
      </div>

      <div className='col-span-5 rounded-lg bg-gray-100 text-start md:mr-5 md:mb-5 md:ml-5'>
        <FlightDetailsSearch
          details={details}
          detailSegments={detailSegments}
          airlineValues={airlineValues}
          airportValues={airportValues}
          opened={detailsOpened}
          isDomestic={true}
        />
      </div>
    </div>
  )
}

const MemoizedFlightSearchResultsDomestic = memo(
  FlightSearchResultsOneWayDomestic
)

export { MemoizedFlightSearchResultsDomestic }
