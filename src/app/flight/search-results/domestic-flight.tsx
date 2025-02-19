import { formatCurrency } from '@/libs/util'
import {
  AirlineCode,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
} from '../type'
import { Button, Divider } from '@mantine/core'
import dayjs from 'dayjs'
import { AirlineLogo } from '@/components/airline-logo'
import { useSearchResultsQueries } from '../search-queries'

type IProps = {
  fareInfo: FlightFareInfo
  details: FlightDetail[]
  detailSegments: FlightDetailSegment[]
  onSelect: (fareInfo: FlightFareInfo) => void
  airlineValues: AirlineCode[] | undefined
}

const FlightSearchResultsOneWayDomestic: React.FC<IProps> = ({
  fareInfo,
  details,
  detailSegments,
  airlineValues,
  onSelect = () => null,
}) => {
  return (
    <div className='@container rounded-lg border border-gray-300'>
      {details.map((detail) => {
        const relatedSegment = detailSegments.filter(
          (segment) => detail.groupId === segment.groupId
        )
        const flightNumber = relatedSegment.at(0)?.flightNumber

        const airlineText = airlineValues
          ?.find(
            (airline) =>
              airline.Code === relatedSegment[0].marketingAirline.code
          )
          ?.Value.find((item) => item.LangCode === 'tr_TR')

        return (
          <div key={detail.key} className='p-3'>
            <div className='flex items-center gap-3 pb-2'>
              <AirlineLogo
                airlineCode={relatedSegment[0].marketingAirline.code.toLocaleLowerCase()}
              />
              <div>{airlineText?.Value}</div>
              <div>{flightNumber}</div>
            </div>
            <div className='flex items-center gap-2'>
              <div>
                <div>
                  {dayjs(relatedSegment.at(0)?.departureTime).format('HH:mm')}
                </div>
                <div>{relatedSegment.at(0)?.origin.code}</div>
              </div>
              <div className='relative grow'>
                <Divider color='green' />
              </div>
              <div>
                <div>
                  {dayjs(relatedSegment.at(0)?.arrivalTime).format('HH:mm')}
                </div>
                <div>{relatedSegment.at(-1)?.destination.code}</div>
              </div>
            </div>
            <div className='flex justify-center'>
              <div className='text-sm text-gray-500'>
                {relatedSegment.length > 1
                  ? `${relatedSegment.length - 1} Aktarma`
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
