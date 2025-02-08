import { FaArrowRightLong } from 'react-icons/fa6'
import { Divider, Image, rem } from '@mantine/core'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import { FlightReservationSummary } from '@/types/passengerViewModel'

type IProps = {
  data: FlightReservationSummary
}

enum CabinClass {
  'Ekonomi',
  'Business',
}

const FlightSummary: React.FC<IProps> = ({ data }) => {
  const flightList = data.flightList.filter(
    (list) =>
      list.flightFareInfo.flightDetailKeys.filter(
        (detailKey) => list.flightDetail.key === detailKey
      ).length
  )

  return (
    <div>
      {/* <Title fz={'h5'} display={'flex'} className='items-center gap-2'>
        <span className='text-xl'>
          <FaPlaneDeparture />
        </span>
        <span>Gidiş Uçuşu</span>
      </Title> */}
      {flightList.map((flight, flightIndex) => {
        const flightDetails = flight.flightDetail
        const allSegments = flight.flightSegments.filter(
          (segments) => segments.groupId === flightDetails.groupId
        )

        const departureSegment = allSegments.at(0)
        const arrivalSegment = allSegments.at(-1)

        if (!departureSegment || !arrivalSegment) return null

        return (
          <div key={flight.flightDetail.key}>
            {flightIndex > 0 ? <Divider my={'md'} /> : null}
            <div className='flex items-center gap-3 py-2 font-semibold'>
              <div className='flex items-center gap-1'>
                <div>
                  {data.airportList[departureSegment?.origin.code].city}
                </div>
                <small>({departureSegment?.origin.code})</small>
              </div>
              <div className='text-xl'>
                <FaArrowRightLong />
              </div>
              <div className='flex items-center gap-1'>
                <div>
                  {
                    data.airportList[arrivalSegment.destination?.code as string]
                      .city
                  }
                </div>
                <small>({arrivalSegment.destination.code})</small>
              </div>
            </div>
            <div className='flex gap-2 text-sm font-semibold'>
              <div>
                {dayjs(departureSegment.departureTime).format(
                  'DD dddd MMMM YYYY'
                )}
              </div>
              <div>{dayjs(departureSegment.departureTime).format('HH:mm')}</div>
            </div>
            {allSegments.length > 1 &&
              allSegments.map((segments, segmentIndex, segmentArr) => {
                const prevSegment =
                  segmentArr[segmentIndex > 0 ? segmentIndex - 1 : 0]
                const prevDepartureTime = dayjs(prevSegment.departureTime)
                const prevArrivalTime = dayjs(prevSegment.arrivalTime)
                const departureTime = dayjs(segments.departureTime)
                const arrivalTime = dayjs(segments.arrivalTime)
                const transferDuration = prevArrivalTime.to(departureTime, true)

                if (segmentIndex === 0) return null
                return (
                  <div className='my-2 py-2 text-sm' key={segments.key}>
                    <div className='rounded-2xl border border-blue-200 p-2 text-center'>
                      {segmentIndex} Aktarma,{' '}
                      {
                        data.airportList[prevSegment.destination.code].value.at(
                          0
                        )?.value
                      }
                      <div className='pt-2 text-xs'>
                        Bekleme Süresi:{' '}
                        <span className='font-bold'>{transferDuration}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            <div className='flex gap-2 text-sm font-semibold'>
              <div>
                {dayjs(arrivalSegment.arrivalTime).format('DD dddd MMMM YYYY')}
              </div>
              <div>{dayjs(arrivalSegment.arrivalTime).format('HH:mm')}</div>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <div>
                <Image
                  src={`https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/${departureSegment.marketingAirline.code}_sq.svg`}
                  alt={data.airlineList[departureSegment.marketingAirline.code]}
                  style={{
                    width: rem(24),
                    height: rem(24),
                  }}
                />
              </div>
              <div>
                {data.airlineList[departureSegment.marketingAirline.code]}{' '}
                {departureSegment.flightNumber}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { FlightSummary }
