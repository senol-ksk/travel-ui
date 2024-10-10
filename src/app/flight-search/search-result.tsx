import dayjs from 'dayjs'
import clsx from 'clsx'

import type { ClientFlightDataModel } from '@/modules/flight/types'
import { Button } from '@mantine/core'
import { formatCurrency } from '@/libs/util'

type IProps = {
  flight: ClientFlightDataModel
  onSelect: (arg: ClientFlightDataModel) => void
}

export const SearchResultCard = ({ onSelect = () => {}, flight }: IProps) => {
  return (
    <div
      key={flight.id}
      className={clsx('rounded-lg border bg-white p-3 shadow')}
    >
      <div>
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
        {formatCurrency(flight!.flightFare.totalPrice.value)}
      </div>
      <div className='flex justify-end pt-3'>
        <Button
          type='button'
          onClick={() => {
            onSelect(flight)
          }}
        >
          Sec
        </Button>
      </div>
    </div>
  )
}
