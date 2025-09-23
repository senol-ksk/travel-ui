import React from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import 'dayjs/locale/tr'
import {
  AirlineCode,
  FlightDetail,
  FlightDetailSegment,
  AirportCode,
} from '@/app/flight/type'
import { MdOutlineLuggage } from 'react-icons/md'
import { FaRegClock } from 'react-icons/fa'
import { Button, Collapse, Tooltip } from '@mantine/core'
import { IoMoonOutline } from 'react-icons/io5'

dayjs.extend(duration)
dayjs.locale('tr')

type IProps = {
  details: FlightDetail[]
  detailSegments: FlightDetailSegment[]
  airlineValues?: AirlineCode[]
  airportValues?: AirportCode[]
  opened: boolean
  isDomestic?: boolean
}

function FlightDetailsSearch({
  details,
  detailSegments,
  airlineValues,
  airportValues,
  opened,
  isDomestic,
}: IProps) {
  function getAirportName(code: string) {
    if (!airportValues) return code

    const airport = airportValues.find((a) => a.Code === code)
    if (!airport) return code
    return airport.Value[0]?.Value
  }
  const [activeLegGroupId, setActiveLegGroupId] = React.useState<number>(0)
  return (
    <Collapse
      in={opened}
      transitionDuration={300}
      transitionTimingFunction='linear'
    >
      {!isDomestic && (
        <div className='flex items-center gap-2 p-2'>
          <Button
            className='border-0'
            onClick={() => setActiveLegGroupId(0)}
            variant={activeLegGroupId === 0 ? 'filled' : 'default'}
            color={activeLegGroupId === 0 ? 'gray' : ''}
            radius='md'
          >
            Gidiş Uçuşu
          </Button>
          {detailSegments.map((roundTrip, index) => {
            return roundTrip.groupId === 1 ? (
              <Button
                key={index}
                className='border-0'
                onClick={() => setActiveLegGroupId(1)}
                variant={activeLegGroupId === 1 ? 'filled' : 'default'}
                color={activeLegGroupId === 1 ? 'gray' : ''}
                radius='md'
              >
                Dönüş Uçuşu
              </Button>
            ) : null
          })}
          {detailSegments.map((roundTrip, index) => {
            return roundTrip.groupId === 1 ? (
              <Button
                key={index}
                className='border-0'
                onClick={() => setActiveLegGroupId(1)}
                variant={activeLegGroupId === 1 ? 'filled' : 'default'}
                color={activeLegGroupId === 1 ? 'gray' : ''}
                radius='md'
              >
                Dönüş Uçuşu
              </Button>
            ) : null
          })}
        </div>
      )}
      <div className='w-full rounded-lg p-3'>
        {details.map((detailLeg) => {
          const relatedSegments = detailSegments.filter(
            (s) => s.groupId === detailLeg.groupId
          )
          // console.log('details', relatedSegments)

          const isCurrentLegVisible =
            isDomestic ||
            (!isDomestic && detailLeg.groupId === activeLegGroupId)

          let firstDepTimeOfLeg = null
          let lastArrTimeOfLeg = null

          if (relatedSegments.length > 0) {
            firstDepTimeOfLeg = dayjs(relatedSegments[0].departureTime)
            lastArrTimeOfLeg = dayjs(
              relatedSegments[relatedSegments.length - 1].arrivalTime
            )
          }

          const isDepartureEarlyMorning =
            firstDepTimeOfLeg !== null &&
            firstDepTimeOfLeg.hour() >= 0 &&
            firstDepTimeOfLeg.hour() < 5

          const isArrivalNextDay =
            firstDepTimeOfLeg &&
            lastArrTimeOfLeg &&
            lastArrTimeOfLeg.isAfter(firstDepTimeOfLeg, 'day')

          return (
            <div key={detailLeg.key}>
              {isCurrentLegVisible &&
                relatedSegments.map((segment, index) => {
                  const airlineName =
                    airlineValues
                      ?.find((a) => a.Code === segment.marketingAirline?.code)
                      ?.Value.find((v) => v.LangCode === 'tr_TR')?.Value ??
                    segment.marketingAirline?.code

                  const dep = dayjs(segment.departureTime)
                  const arr = dayjs(segment.arrivalTime)
                  const origin = getAirportName(segment.origin.code)
                  const destination = getAirportName(segment.destination.code)
                  return (
                    <React.Fragment key={`${segment.key}-${index}`}>
                      <div className='mb-2'>
                        {airlineName} Uçuşu: {segment.flightNumber}
                      </div>
                      <div className='relative ml-2 pl-4'>
                        <div className='absolute top-2 bottom-2 left-0 w-[2px] bg-blue-800'></div>
                        <div className='absolute top-1 left-[-3px] h-2 w-2 rounded-full bg-blue-800'></div>
                        <div>
                          <span className='font-medium'>
                            {dep.format('HH:mm')} -{' '}
                          </span>
                          {dep.format('DD MMM dddd')}: {origin}
                        </div>
                        <div className='absolute bottom-1 left-[-3px] h-2 w-2 rounded-full bg-blue-800'></div>
                        <div className='mt-1'>
                          <span className='font-medium'>
                            {arr.format('HH:mm')}
                          </span>{' '}
                          - {arr.format('DD MMM dddd')}: {destination}
                        </div>
                      </div>
                      <div className='mt-2 ml-1 flex flex-wrap items-center gap-3 pt-2 text-sm'>
                        {/* <div className='flex items-center gap-1'>
                          <BsSuitcaseLgFill />
                          <span className='text-xs md:text-sm'>
                            1 parça x 8 kg kabin bagajı
                          </span>
                        </div> */}
                        {segment.baggageAllowance.maxWeight.value > 0 && (
                          <div className='flex items-center gap-1'>
                            <MdOutlineLuggage />

                            <span>
                              1 parça X{' '}
                              {segment.baggageAllowance.maxWeight.value} kg
                              bagaj
                            </span>
                          </div>
                        )}
                      </div>
                      {index < relatedSegments.length - 1 &&
                        (() => {
                          const next = relatedSegments[index + 1]
                          const wait = dayjs.duration(
                            dayjs(next.departureTime).diff(arr)
                          )
                          return (
                            <div className='relative my-3 mt-10 flex items-center justify-center border-t border-dashed border-black pb-4'>
                              <div className='absolute top-0 flex -translate-y-1/2 items-center gap-1 bg-gray-100 p-1 pb-2'>
                                <div>
                                  <FaRegClock />
                                </div>
                                <span>
                                  {index + 1}. Aktarma:{' '}
                                  <span className='font-bold'>
                                    {destination} -
                                  </span>
                                </span>
                                <span className='text-lg font-bold'>
                                  {wait.hours() ? `${wait.hours()}sa ` : ''}
                                  {wait.minutes()}dk
                                </span>
                                <span>Bekleme Süresi</span>
                              </div>
                            </div>
                          )
                        })()}
                    </React.Fragment>
                  )
                })}
              {isCurrentLegVisible &&
                (isDepartureEarlyMorning || isArrivalNextDay) && (
                  <div className='mt-5 flex items-center gap-2'>
                    {isDepartureEarlyMorning && firstDepTimeOfLeg && (
                      <Tooltip
                        label={
                          <>
                            Bu uçuş için{' '}
                            <strong>
                              {firstDepTimeOfLeg
                                .subtract(1, 'day')
                                .format('D MMMM YYYY')}
                            </strong>{' '}
                            gecesi <br />
                            havaalanında olmanız gerekiyor.
                          </>
                        }
                        withArrow
                        position='top'
                      >
                        <Button className='rounded-full border-0 bg-white p-1 px-3 text-black'>
                          <span>
                            <IoMoonOutline />{' '}
                          </span>{' '}
                          <span className='px-1'> Gece uçuşu</span>
                        </Button>
                      </Tooltip>
                    )}
                    {isArrivalNextDay && (
                      <Button className='rounded-full border-0 bg-white p-1 px-3 text-black'>
                        <span className='font-bold text-orange-500'>+1 </span>{' '}
                        <span className='px-1 text-black'>
                          Ertesi gün varış
                        </span>
                      </Button>
                    )}
                  </div>
                )}
            </div>
          )
        })}
      </div>
    </Collapse>
  )
}
export { FlightDetailsSearch }
