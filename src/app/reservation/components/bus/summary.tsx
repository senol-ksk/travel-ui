import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { BusSummaryResponse } from '../../types'
import { Box, Image, Title } from '@mantine/core'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { CheckoutCard } from '@/components/card'
import { formatCurrency } from '@/libs/util'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}

const BusSummarySection: React.FC<IProps> = ({ data }) => {
  const busData = data.SummaryViewDataResponser
    .summaryResponse as BusSummaryResponse

  return (
    <CheckoutCard>
      <div className='grid gap-3'>
        <div className='flex justify-between gap-2'>
          <Title order={5}>{busData.busJourney.company}</Title>
          <div>
            <Image
              src={`https://eticket.ipektr.com/wsbos3/LogoVer.Aspx?fnum=${busData.busJourney.companyId}`}
              alt={busData.busJourney.company}
              w={80}
            />
          </div>
        </div>
        <div>
          <div className='font-semibold'>Kalkış</div>
          <div className='text-sm text-gray-600'>
            {busData.busJourney.origin}
          </div>
          <div className='text-sm'>
            {dayjs(busData.busJourney.bus.departureDate).format(
              'DD MMMM YYYY HH:mm'
            )}
          </div>
        </div>
        <div>
          <div className='font-semibold'>Varış</div>
          <div className='text-sm text-gray-600'>
            {busData.busJourney.destination}
          </div>
          <div className='text-sm'>
            {dayjs(busData.busJourney.bus.arrivalDate).format(
              'DD MMMM YYYY HH:mm'
            )}
          </div>
        </div>
        <div>
          <div className='pb-2 font-semibold'>Seçili koltuklar</div>
          <div className='flex gap-2'>
            {busData.busJourney.selectedSeats.map((seat) => (
              <div key={seat.paxId}>
                <Box
                  w={40}
                  h={40}
                  className={clsx(
                    {
                      'bg-pink-200': seat.gender === 1,
                      'bg-blue-200': seat.gender === 2,
                    },
                    'flex items-center justify-center rounded border text-lg'
                  )}
                >
                  {seat.no}
                </Box>
              </div>
            ))}
          </div>
        </div>
        <div className='flex justify-between gap-2 border-t pt-3'>
          <div>Toplam Tutar</div>
          <div className='text-lg font-semibold'>
            {formatCurrency(busData.totalPrice)}
          </div>
        </div>
      </div>
    </CheckoutCard>
  )
}

export { BusSummarySection }
