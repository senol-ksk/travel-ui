import { formatCurrency } from '@/libs/util'
import { FlightDetail, FlightDetailSegment, FlightFareInfo } from '../type'
import { Button, Divider } from '@mantine/core'
import dayjs from 'dayjs'
import clsx from 'clsx'

type IProps = {
  fareInfo: FlightFareInfo
  details: FlightDetail[]
  detailSegments: FlightDetailSegment[]
  onSelect: (fareInfo: FlightFareInfo) => void
}

const FlightSearchResultsInternational: React.FC<IProps> = ({
  fareInfo,
  details,
  detailSegments,
  onSelect = () => null,
}) => {
  const flightNumber = detailSegments.at(0)?.flightNumber

  return (
    <div className={clsx(`@container rounded-lg border border-gray-300`)}>
      {/* <div>details ==={details.at(0)?.groupId}</div>
      <div>detailSegments ==={detailSegments.at(0)?.groupId}</div> */}
      {/* <div>
        <code>details</code>
        <input defaultValue={JSON.stringify(details)} />
      </div>*/}
      {/* <div>
        <code>detailSegments</code>
        <input defaultValue={JSON.stringify(detailSegments)} />
      </div> */}
      {details.map((detail) => (
        <div className='p-3' key={detail.key}>
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
                {dayjs(detailSegments.at(-1)?.arrivalTime).format('HH:mm')}
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
      ))}

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

export { FlightSearchResultsInternational }
