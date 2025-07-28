import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { BusSummaryResponse } from '../../types'
import { Box, Image, Title } from '@mantine/core'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { CheckoutCard } from '@/components/card'
import { formatCurrency } from '@/libs/util'
import { MdDescription } from 'react-icons/md'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}

const BusSummarySection: React.FC<IProps> = ({ data }) => {
  const busData = data.SummaryViewDataResponser
    .summaryResponse as BusSummaryResponse

  const depDate = dayjs(busData.busJourney.bus.departureDate)
  const arrDate = dayjs(busData.busJourney.bus.arrivalDate)

  const allDuration = dayjs.duration(arrDate.diff(depDate))

  const hours = allDuration.hours()
  const minutes = allDuration.minutes()

  const durationText = `${hours} saat ${minutes} dakika`
  return (
    <CheckoutCard>
      <div className='grid gap-3'>
        <div className='mb-3 hidden items-center gap-3 border-b pb-2 text-lg font-semibold md:flex'>
          <MdDescription size={22} className='text-blue-800' />
          <div>Seyahat Özeti</div>
        </div>
        <div className='grid grid-cols-9 border-b py-3'>
          <div className='col-span-1 mt-1 flex flex-col items-center'>
            <div className='z-10 h-3 w-3 rounded-full bg-blue-800'></div>
            <div className='h-13 w-0.5 bg-blue-700'></div>
            <div className='z-10 h-3 w-3 rounded-full bg-blue-800'></div>
          </div>

          <div className='col-span-8 grid gap-3'>
            <div className='mx-auto flex w-full max-w-md flex-col gap-3 text-sm'>
              <div className='grid grid-cols-[70px_1fr] items-center gap-2'>
                <div className='font-semibold'>Kalkış :</div>
                <div>{busData.busJourney.origin}</div>
              </div>

              <div className='grid grid-cols-[70px_1fr] items-center gap-2'>
                <div className='font-semibold'>Varış :</div>
                <div>{busData.busJourney.destination}</div>
              </div>

              <div className='grid grid-cols-[70px_1fr] items-center gap-2'>
                <div className='font-semibold'>Firma :</div>
                <div>{busData.busJourney.company}</div>
              </div>

              <div className='grid grid-cols-[70px_1fr] items-center gap-2'>
                <div className='font-semibold'>Tarih :</div>
                <div>
                  {dayjs(busData.busJourney.bus.departureDate).format(
                    'DD MMMM YYYY'
                  )}
                </div>
              </div>

              <div className='grid grid-cols-[70px_1fr] items-center gap-2'>
                <div className='font-semibold'>Saat :</div>
                <div>
                  {dayjs(busData.busJourney.bus.departureDate).format('HH:mm')}
                </div>
              </div>

              <div className='grid grid-cols-[70px_1fr] items-start gap-2'>
                <div className='pt-1 font-semibold'>Koltuk :</div>
                <div className='flex flex-wrap gap-2'>
                  {busData.busJourney.selectedSeats.map((seat) => (
                    <Box
                      key={seat.paxId}
                      w={30}
                      h={30}
                      className={clsx(
                        {
                          'bg-pink-200': seat.gender === 1,
                          'bg-blue-200': seat.gender === 2,
                        },
                        'flex items-center justify-center rounded-md border text-sm font-bold'
                      )}
                    >
                      {seat.no}
                    </Box>
                  ))}
                </div>
              </div>

              <div className='grid grid-cols-[70px_1fr] items-center gap-2'>
                <div className='font-semibold'>Süre :</div>
                <div className='font-medium'>{durationText}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-between gap-2'>
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
