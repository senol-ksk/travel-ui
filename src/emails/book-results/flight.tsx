import { Heading } from '@react-email/components'
import { EmailBody } from '../_components/body'
import { FlightSummaryResponse } from '@/app/reservation/types'
import dayjs from 'dayjs'

type IProps = {
  data: FlightSummaryResponse
}

export function FlightBookResult({ data }: IProps) {
  return (
    <EmailBody>
      {data.flightList.map((flight) => {
        return (
          <div key={flight.flightDetail.key}>
            <Heading as='h3' className='text-lg'>
              <span>
                {flight.flightDetail.groupId === 0
                  ? 'Gidiş Uçuşu'
                  : 'Dönüş Uçuşu'}
              </span>
              <small className='text-xs'>
                {dayjs(flight.flightSegments.at(0)?.departureTime).format(
                  'DD MMMM YYYY'
                )}
              </small>
            </Heading>
          </div>
        )
      })}
    </EmailBody>
  )
}

export default FlightBookResult
