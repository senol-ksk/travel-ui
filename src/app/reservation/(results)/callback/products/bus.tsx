import { BusSummaryResponse } from '@/app/reservation/types'
import dayjs from 'dayjs'
import { CheckoutCard } from '@/components/card'
import Image from 'next/image'
import { Img } from '@react-email/components'

type IProps = {
  data: BusSummaryResponse
}

const BusSummary: React.FC<IProps> = ({ data }) => {
  const { busJourney } = data
  return (
    <CheckoutCard title='Sefer Bilgileri'>
      <div className='overflow-x-auto'>
        <div className='min-w-[800px] md:min-w-0'>
          <div className='flex w-full items-center justify-between p-1'>
            <div className='text-lg font-bold'>{busJourney.company}</div>
            <Img
              width={70}
              height={70}
              src={`https://eticket.ipektr.com/wsbos3/LogoVer.Aspx?fnum=${busJourney.companyId}`}
              alt={`${busJourney.company} logosu`}
            />
          </div>

          <div className='mt-2 mb-5 grid grid-cols-4'>
            <div>
              <div className='text-sm font-bold'>Firma</div>
              <div className='mt-1 text-sm'>{busJourney.company}</div>
            </div>
            <div>
              <div className='text-sm font-bold'>Kalkış</div>
              <div className='mt-1 text-sm'>{busJourney.origin}</div>
            </div>
            <div>
              <div className='text-sm font-bold'>Varış</div>
              <div className='mt-1 text-sm'>{busJourney.destination}</div>
            </div>
            <div>
              <div className='text-sm font-bold'>Tarih</div>
              <div className='mt-1 text-sm'>
                {dayjs(busJourney.bus.departureDate).format('DD.MM.YYYY HH:mm')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CheckoutCard>
  )
}

export { BusSummary }
