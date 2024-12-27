import { Button, Image } from '@mantine/core'
import { BusSearchResultItem } from './types'
import dayjs from 'dayjs'

type Props = {
  searchItem: BusSearchResultItem
  onSelect?: (bus: BusSearchResultItem) => void
}

const BusSearchItem: React.FC<Props> = ({
  searchItem,
  onSelect = () => {},
}) => {
  return (
    <div className='rounded-lg border border-gray-300'>
      <div className='p-3'>
        <div className='w-[120px]'>
          <Image
            src={`https://eticket.ipektr.com/wsbos3/LogoVer.Aspx?fnum=${searchItem.companyId}`}
            alt={searchItem.company}
          />
        </div>
        <div className='flex items-center gap-5 pt-3'>
          <div>{dayjs(searchItem.bus.departureDate).format('HH:mm')}</div>
          <div className='h-[2px] flex-1 rounded-3xl bg-green-500'></div>
          <div>{dayjs(searchItem.bus.arrivalDate).format('HH:mm')}</div>
        </div>
        <div className='flex justify-between pt-2'>
          <div>{searchItem.origin}</div>
          <div>{searchItem.destination}</div>
        </div>
      </div>
      <div className='grid justify-end border-t p-3'>
        <Button type='button' onClick={() => onSelect(searchItem)}>
          Koltuk Seç
        </Button>
      </div>
    </div>
  )
}

export { BusSearchItem }
