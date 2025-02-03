import { BusSummaryResponse } from '@/app/reservation/types'
import { Title } from '@mantine/core'
import dayjs from 'dayjs'

type IProps = {
  data: BusSummaryResponse
}

const BusSummary: React.FC<IProps> = ({ data }) => {
  const { busJourney } = data
  return (
    <div>
      <Title fz={'h4'}>{busJourney.company}</Title>
      <div>
        Kalkış {dayjs(busJourney.bus.departureDate).format('DD MMMM YYYY')}{' '}
        {dayjs(busJourney.bus.departureDate).format('HH:mm')}
      </div>
      <div>
        Varış: {dayjs(busJourney.bus.arrivalDate).format('DD MMMM YYYY')}{' '}
        {dayjs(busJourney.bus.arrivalDate).format('HH:mm')}
      </div>
    </div>
  )
}

export { BusSummary }
