import { formatCurrency } from '@/libs/util'
import { FlightDetail, FlightDetailSegment, FlightFareInfo } from '../type'
import { Button, Divider } from '@mantine/core'
import dayjs from 'dayjs'

type IProps = {
  fareInfo: FlightFareInfo
  details: FlightDetail[]
  detailSegments: FlightDetailSegment[]
  onSelect: (fareInfo: FlightFareInfo) => void
}

const FlightSearchResultsOneWayDomestic: React.FC<IProps> = ({
  fareInfo,
  details,
  detailSegments,
  onSelect = () => null,
}) => {
  const flightNumber = detailSegments.at(0)?.flightNumber

  return (
    <div className='@container rounded-lg border border-gray-300'>
      <div className='p-3'>
        <div>
          {detailSegments.at(0)?.marketingAirline.code} {flightNumber}
        </div>
        <div className='flex items-center gap-2'>
          <div>
            <div>
              {dayjs(detailSegments.at(0)?.departureTime).format('HH:mm')}
            </div>
            <div>{detailSegments.at(0)?.origin.code}</div>
          </div>
          <div className='relative grow'>
            <Divider color='green' />
          </div>
          <div>
            <div>
              {dayjs(detailSegments.at(0)?.arrivalTime).format('HH:mm')}
            </div>
            <div>{detailSegments.at(-1)?.destination.code}</div>
          </div>
        </div>
        <div className='flex justify-center'>
          <div className='text-sm text-gray-400'>
            {detailSegments.length > 1
              ? `${detailSegments.length - 1} Aktarma`
              : 'Aktarmasız'}
          </div>
        </div>
      </div>
      <div className='flex items-center justify-between border-t p-3 pt-4'>
        <div>{formatCurrency(fareInfo.totalPrice.value)}</div>
        <div>
          <Button
            type='button'
            onClick={() => {
              onSelect(fareInfo)
            }}
          >
            Seç
          </Button>
        </div>
      </div>
    </div>
  )
}

export { FlightSearchResultsOneWayDomestic }
