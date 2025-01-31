import dayjs from 'dayjs'
import { AspectRatio, Divider, Image } from '@mantine/core'
import NextImage from 'next/image'

import type { FlightSummaryResponse } from '@/app/reservation/(results)/type'
import { CabinTypes } from '@/types/flight'
import { CheckoutCard } from '@/components/card'

type IProps = {
  data: FlightSummaryResponse
}

export const FlightSummary: React.FC<IProps> = ({ data }) => {
  console.log(data)
  const isDomestic = data.flightList.some((x) => x.flightDetail.isDomestic)

  return (
    <div className='grid gap-3'>
      {data.flightList.map((flight) => {
        return (
          <div key={flight.flightDetail.key}>
            <CheckoutCard>
              <div className='grid gap-3'>
                <div>
                  <h3 className='m-0 flex items-baseline gap-2'>
                    {flight.flightDetail.groupId === 0
                      ? 'Gidiş Uçuşu'
                      : 'Dönüş Uçuşu'}
                    <small className='text-xs'>
                      {dayjs(flight.flightSegments.at(0)?.departureTime).format(
                        'DD MMMM YYYY'
                      )}
                    </small>
                  </h3>
                </div>
                <Divider />
                <div className='flex items-center gap-2'>
                  <div className='relative h-[30px] w-[30px]'>
                    <AspectRatio>
                      <Image
                        component={NextImage}
                        alt={flight.flightSegments[0]?.marketingAirline.code}
                        src={`https://fulltripstatic.mncdn.com/a/airlines/${flight.flightSegments[0].marketingAirline.code}.png?width=auto`}
                        fill
                      />
                    </AspectRatio>
                  </div>
                  <div>
                    {
                      data.airlineList[
                        flight.flightSegments[0].marketingAirline.code
                      ]
                    }{' '}
                    - {flight.flightSegments[0].flightNumber}
                  </div>
                  <div>{CabinTypes[flight.flightSegments[0].cabinClass]}</div>
                </div>
                <div className='flex'>
                  <div className='text-lg font-semibold'>
                    {dayjs(flight.flightSegments[0].departureTime).format(
                      'HH:mm'
                    )}
                  </div>
                  <div className='mx-6 flex flex-1 items-center'>
                    <div className='w-full rounded-2xl border-t-2 border-green-800'></div>
                  </div>
                  <div className='text-lg font-semibold'>
                    {dayjs(flight.flightSegments[0].arrivalTime).format(
                      'HH:mm'
                    )}
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div>
                    {
                      data.airportList[flight.flightSegments[0].origin.code]
                        .city
                    }{' '}
                    (
                    {
                      data.airportList[flight.flightSegments[0].origin.code]
                        .code
                    }
                    )
                  </div>
                  <div>
                    {
                      data.airportList[
                        flight.flightSegments[0].destination.code
                      ].city
                    }{' '}
                    (
                    {
                      data.airportList[
                        flight.flightSegments[0].destination.code
                      ].code
                    }
                    )
                  </div>
                </div>
                <Divider />
                <div className='text-sm'>
                  {flight.flightSegments[0].flightTime.split(':').at(0)}
                  sa {flight.flightSegments[0].flightTime.split(':').at(1)}
                  dk
                </div>
              </div>
            </CheckoutCard>
          </div>
        )
      })}
    </div>
  )
}
