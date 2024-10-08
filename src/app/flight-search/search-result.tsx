import dayjs from 'dayjs'
import clsx from 'clsx'

import type { ClientFlightDataModel } from '@/modules/flight/types'

export const SearchResultCard = (flight: ClientFlightDataModel) => {
  return (
    <div
      key={flight.id}
      className={clsx('rounded-lg border bg-white p-3 shadow')}
    >
      <div>
        {flight.flightDetailSegments[0].groupId}
        {
          flight.airLines.find(
            (item) =>
              item.code ===
              flight.flightDetailSegments.at(0)?.marketingAirline.code
          )?.value
        }{' '}
        <div className='text-sm font-semibold'>
          {flight.flightDetailSegments.at(0)?.flightNumber}
        </div>
      </div>
      <div className='flex gap-3'>
        <div>
          <div>
            Kalkış{' '}
            {flight?.flightDetailSegments.map((item) => {
              return `${item.origin.code} ${item.destination.code}`
            })}
          </div>
          {dayjs(flight?.flightDetailSegments.at(0)?.departureTime).format(
            'HH:mm'
          )}
        </div>
        <div>
          <div>
            Varış Kalkış {flight?.flightDetailSegments[0].destination.code}
          </div>
          {dayjs(flight?.flightDetailSegments.at(0)?.arrivalTime).format(
            'HH:mm'
          )}
        </div>
      </div>
      <div className='text-end text-lg font-bold'>
        {new Intl.NumberFormat('tr', {
          style: 'currency',
          currency: 'TRY',
        }).format(flight!.flightFare.totalPrice.value)}
      </div>
    </div>
  )
}
