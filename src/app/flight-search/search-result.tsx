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
  const isDomestic =
    flight.flightDetails.filter((item) => item.isDomestic).length > 0

  const flightDetailSegments = flight.flightDetailSegments

  return (
    <div
      key={flight.id}
      className={clsx('rounded-lg border bg-white p-3 shadow')}
    >
      {isDomestic ? (
        <div>
          <div>
            {
              flight.airLines.find(
                (item) =>
                  item.code ===
                  flightDetailSegments.at(0)?.marketingAirline.code
              )?.value
            }{' '}
            <div className='text-sm font-semibold'>
              {flightDetailSegments.at(0)?.flightNumber}
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
        </div>
      ) : (
        <div>
          <div>
            <div>{flightDetailSegments.at(0)?.marketingAirline.code}</div>
            <div>
              {dayjs(flightDetailSegments.at(0)?.departureTime).format('HH:mm')}
            </div>
            {flightDetailSegments.filter((item) => (item.groupId = 0)).length >
            1
              ? 'Aktarma var'
              : 'aktarma yok'}
            <hr />
            <div>{flightDetailSegments.at(-1)?.marketingAirline.code}</div>
            <div>
              {dayjs(flightDetailSegments.at(-1)?.departureTime).format(
                'HH:mm'
              )}
            </div>
          </div>
          <div className='text-end text-lg font-bold'>
            {formatCurrency(flight!.flightFare.totalPrice.value)}
          </div>
        </div>
      )}

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
