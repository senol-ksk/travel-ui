import { CheckIcon, Group, Radio, ScrollArea, Stack } from '@mantine/core'
import { CyprusFlight } from '../types'
import { formatCurrency } from '@/libs/util'
import dayjs from 'dayjs'

type IProps = {
  flightData: CyprusFlight['flightSegmentList'][0]
  onChange: (value: string) => void
  selectedValue: string
}

const CyprusFlightSelect: React.FC<IProps> = ({
  flightData,
  onChange,
  selectedValue,
}) => {
  return (
    <ScrollArea.Autosize mah={300}>
      <Radio.Group value={selectedValue} onChange={onChange}>
        <Stack>
          {flightData.flightList.map((flight) => {
            return flight.flightDetails.map((flightDetail) => {
              const {
                // origin, /// window object has `origin`, that's why it's added so
                flightNo,
                departureDate,
                departureTime,
                arrivalDate,
                arrivalTime,
                destination,
              } = flightDetail
              return (
                <Radio.Card key={flightNo} value={flightNo} p={'md'}>
                  <Group wrap='nowrap' align='flex-start'>
                    <Radio.Indicator icon={CheckIcon} />
                    <div>
                      <div>
                        {dayjs(departureDate).format('DD MMMM, dddd YYYY')}{' '}
                        {dayjs(arrivalDate).format('DD MMMM, dddd YYYY')}
                      </div>
                      <div className='flex gap-3'>
                        <div>
                          {flightDetail.origin} {destination}
                        </div>
                        <div>
                          {departureTime} - {arrivalTime}
                        </div>
                        <div>
                          {formatCurrency(flightDetail.totalPrice.value)}
                        </div>
                      </div>
                    </div>
                  </Group>
                </Radio.Card>
              )
            })
          })}
        </Stack>
      </Radio.Group>
    </ScrollArea.Autosize>
  )
}

export { CyprusFlightSelect }
