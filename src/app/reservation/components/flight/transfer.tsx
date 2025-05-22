import {
  FlightReservationFlightList,
  FlightReservationSummary,
} from '@/types/passengerViewModel'
import { Box, Collapse, Divider, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import { GoChevronDown, GoChevronUp } from 'react-icons/go'
import { MdTransferWithinAStation } from 'react-icons/md'

type IProps = {
  flightSegments: FlightReservationFlightList['flightSegments']
}

export const FlightTransferSummary: React.FC<IProps> = ({ flightSegments }) => {
  const [opened, { toggle }] = useDisclosure(false)

  const transferCount = flightSegments.length - 1

  return (
    <div className=''>
      <Divider
        my='xs'
        labelPosition='center'
        label={
          <UnstyledButton
            onClick={toggle}
            type='button'
            display={'flex'}
            className='items-center gap-2'
          >
            <Box className='text-dark-200 text-xs font-semibold'>
              {transferCount} Aktarma
            </Box>
            {opened ? <GoChevronUp /> : <GoChevronDown />}
          </UnstyledButton>
        }
      />
      <Collapse in={opened}>
        <div className='pb-2 font-semibold'>
          <div className='flex items-center gap-2'>
            <div>
              <MdTransferWithinAStation size={20} />
            </div>
            <div>{transferCount} Aktarma</div>
          </div>
        </div>
        <div>
          {flightSegments.map((segment, segmentIndex, segmentArr) => {
            const prevSegment = segmentArr[segmentIndex]

            const prevArrivalTime = dayjs(prevSegment.arrivalTime)
            const departureTime = dayjs(segment.departureTime)
            const transferDuration = prevArrivalTime.to(departureTime, true)

            if (segmentIndex === 0) return

            return (
              <div key={segment.key} className='grid gap-2'>
                <div className='flex items-center gap-3'>
                  {transferCount > 1 && <div>{segmentIndex}. Aktarma</div>}

                  <div>
                    <strong>Bekleme Süresi:</strong> {transferDuration}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Collapse>
    </div>
  )
}
