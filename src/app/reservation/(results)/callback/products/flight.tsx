import dayjs from 'dayjs'
import { AspectRatio, Divider, Image } from '@mantine/core'
import NextImage from 'next/image'

import { CabinTypes } from '@/types/flight'
import { CheckoutCard } from '@/components/card'
import { FlightSummaryResponse } from '@/app/reservation/types'
import { Img, Link } from '@react-email/components'

type IProps = {
  data: FlightSummaryResponse
}

export const FlightSummary: React.FC<IProps> = ({ data }) => {
  return (
    <>
      <Link href={`${process.env.SITE_URL}/kampanyalar?categoryId=158`}>
        <Img
          height={200}
          className='mb-3 w-auto'
          src='https://ykmturizm.mncdn.com/11/Files/638935150899736437.png'
        />
      </Link>
      <div className='grid gap-3'>
        {data.flightList.map((flight) => {
          return (
            <div key={flight.flightDetail.key}>
              <CheckoutCard
                title={
                  flight.flightDetail.groupId === 0
                    ? 'Gidiş Uçuşu'
                    : 'Dönüş Uçuşu'
                }
              >
                <div className='grid gap-3'>
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
                    <div className='text-sm text-gray-700'>
                      {
                        data.airlineList[
                          flight.flightSegments[0].marketingAirline.code
                        ]
                      }{' '}
                      - {flight.flightSegments[0].flightNumber}
                    </div>
                    <div className='text-sm text-gray-700'>
                      {CabinTypes[flight.flightSegments[0].cabinClass]}
                    </div>
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
                    <div className='text-sm text-gray-700'>
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
                    <div className='text-sm text-gray-700'>
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
                  <div className='text-sm text-gray-700'>
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
    </>
  )
}
