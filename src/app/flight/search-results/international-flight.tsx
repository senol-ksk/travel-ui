import { formatCurrency } from '@/libs/util'
import {
  AirlineCode,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
} from '../type'
import { Button, Divider, Skeleton } from '@mantine/core'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { AirlineLogo } from '@/components/airline-logo'
import { useSearchResultsQueries } from '../search-queries'
import { useMemo } from 'react'

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
    <div className={clsx(`@container rounded-lg border border-gray-300`)}>
      {details.map((detail) => {
        const relatedDetailSegments = detailSegments.filter(
          (item) => detail.groupId === item.groupId
        )
        const airlineText = airlineValues
          ?.find(
            (airline) =>
              airline.Code === relatedDetailSegments[0].marketingAirline.code
          )
          ?.Value.find((item) => item.LangCode === 'tr_TR')

        return (
          <div className='p-3' key={detail.key}>
            <div className='flex items-center gap-3 pb-2'>
              <div>
                <AirlineLogo
                  airlineCode={relatedDetailSegments[0].marketingAirline.code}
                  width={36}
                  height={36}
                />
              </div>
              <div>{airlineText?.Value}</div>
              <div>{relatedDetailSegments.at(0)?.flightNumber}</div>
            </div>
            <div className='flex items-center gap-2'>
              <div>
                <div>
                  {dayjs(relatedDetailSegments.at(0)?.departureTime).format(
                    'HH:mm'
                  )}
                </div>
                <div>{relatedDetailSegments.at(0)?.origin.code}</div>
              </div>
              <div className='relative grow'>
                <Divider color='green' />
              </div>
              <div>
                <div>
                  {dayjs(relatedDetailSegments.at(-1)?.arrivalTime).format(
                    'HH:mm'
                  )}
                </div>
                <div>{relatedDetailSegments.at(-1)?.destination.code}</div>
              </div>
            </div>
            <div className='flex justify-center'>
              <div className='text-sm text-gray-400'>
                {relatedDetailSegments.length > 1
                  ? `${relatedDetailSegments.length - 1} Aktarma`
                  : 'Aktarmasız'}
              </div>
            </div>
          </div>
        )
      })}

      <div className='flex items-center justify-between border-t p-3 pt-4'>
        <div>{formatCurrency(fareInfo.totalPrice.value)}</div>
        <div>
          <Button
            type='button'
            onClick={() => {
              onSelect()
            }}
          >
            Seç
          </Button>
        </div>
      </div>
    </div>
  )
}

export { FlightSearchResultsInternational }
