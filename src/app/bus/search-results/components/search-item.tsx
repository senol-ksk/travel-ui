import { Button, Image } from '@mantine/core'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import { BusSearchResultItem } from '@/app/bus/types'
import { formatCurrency } from '@/libs/util'
import { CiClock2 } from 'react-icons/ci'
import { GoChevronRight } from 'react-icons/go'
import {
  MdOutlineAirlineSeatReclineExtra,
  MdOutlineChevronRight,
} from 'react-icons/md'
import { LuClock } from 'react-icons/lu'

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
    <div className='relative rounded-lg border border-gray-300'>
      <div className='start-0-0 absolute top-1/2 mt-5 h-8 w-1 -translate-y-1/2 rounded-tr-md rounded-br-md bg-gray-400 md:mt-0' />
      <div className='p-3'>
        <div className='flex items-center gap-3'>
          <div className='w-[120px]'>
            <Image
              src={`https://eticket.ipektr.com/wsbos3/LogoVer.Aspx?fnum=${searchItem.companyId}`}
              alt={searchItem.company}
            />
          </div>
          <div className='flex items-center gap-2 pt-2'>
            <div>
              <MdOutlineAirlineSeatReclineExtra size={22} />
            </div>
            <div className='text-sm'>{searchItem.busType}</div>
          </div>
        </div>
        <div className='flex items-center gap-5 pt-3'>
          <div className='text-lg font-semibold'>
            {dayjs(searchItem.bus.departureDate).format('HH:mm')}
          </div>
          <div className='relative flex-1'>
            <div className='absolute start-0 end-0 -top-7 flex justify-center'>
              <div className='flex items-center gap-1'>
                <div>
                  <LuClock />
                </div>
                <div className='text-sm'>
                  {travelDuration.format('HH[sa] mm[dk]')}
                </div>
              </div>
            </div>
            <div className='h-[2px] rounded-3xl bg-blue-800'></div>
            <div className='absolute end-0 top-1/2 -me-2 -translate-y-1/2 text-blue-800'>
              <MdOutlineChevronRight size={20} />
            </div>
          </div>
          <div className='text-lg'>
            {dayjs(searchItem.bus.arrivalDate).format('HH:mm')}
          </div>
        </div>
        <div className='flex justify-between text-sm'>
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
