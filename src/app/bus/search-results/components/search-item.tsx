import { Button, Image } from '@mantine/core'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import { BusSearchResultItem } from '@/app/bus/types'
import { formatCurrency } from '@/libs/util'
import { CiClock2 } from 'react-icons/ci'

type Props = {
  searchItem: BusSearchResultItem
  onSelect?: (bus: BusSearchResultItem) => void
}

const BusSearchItem: React.FC<Props> = ({
  searchItem,
  onSelect = () => {},
}) => {
  const departureDate = dayjs(searchItem.bus.departureDate)
  const arrivalDate = dayjs(searchItem.bus.arrivalDate)
  const travelDuration = dayjs.duration(arrivalDate.diff(departureDate))

  return (
    <div className='rounded-lg border border-gray-300'>
      <div className='p-3'>
        <div className='flex items-center gap-3'>
          <div className='w-[120px]'>
            <Image
              src={`https://eticket.ipektr.com/wsbos3/LogoVer.Aspx?fnum=${searchItem.companyId}`}
              alt={searchItem.company}
            />
          </div>
          <div className='pt-2 text-sm text-gray-600'>{searchItem.busType}</div>
        </div>
        <div className='flex items-center gap-5 pt-3'>
          <div>{dayjs(searchItem.bus.departureDate).format('HH:mm')}</div>
          <div className='relative flex-1'>
            <div className='absolute start-0 end-0 -top-6 flex justify-center'>
              <div className='flex items-center gap-1 text-sm text-gray-600'>
                <div>
                  <CiClock2 size={18} />
                </div>
                <div>{travelDuration.format('HH[sa] mm[dk]')}</div>
              </div>
            </div>
            <div className='h-[2px] rounded-3xl bg-green-500'></div>
          </div>
          <div>{dayjs(searchItem.bus.arrivalDate).format('HH:mm')}</div>
        </div>
        <div className='flex justify-between pt-2'>
          <div>{searchItem.origin}</div>
          <div>{searchItem.destination}</div>
        </div>
      </div>
      <div className='flex justify-between border-t p-3'>
        <div className='text-lg font-semibold'>
          {formatCurrency(searchItem.bus.internetPrice.value)}
        </div>
        <div>
          <Button type='button' onClick={() => onSelect(searchItem)}>
            Koltuk Seç
          </Button>
        </div>
      </div>
    </div>
  )
}

export { BusSearchItem }
