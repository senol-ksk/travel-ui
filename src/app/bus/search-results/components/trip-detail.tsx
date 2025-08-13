import { Button, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { RouteInfo, Seat } from '@/app/bus/types'
import dayjs from 'dayjs'

type IProps = {
  routeInfos: RouteInfo[] | undefined
}
const TripDetail: React.FC<IProps> = ({ routeInfos }) => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Button variant='transparent' onClick={open}>
        Sefer Detayları
      </Button>
      <Modal
        size='xl'
        opened={opened}
        onClose={close}
        title={<div className='text-lg font-bold'>Sefer Detayları</div>}
      >
        <p className='mb-4 grid'>
          <span className='text-lg font-bold'>Uyarı: </span>
          <span className='text-sm text-gray-700'>
            Belirtilen süreler otobüs firması tarafından iletilmektedir. Kalkış
            ve varış saatleri tahmini olup saat değişiklikleri Parafly Travel
            sorumluluğunda değildir.
          </span>
        </p>

        <div className='mb-2 text-lg font-bold'>Güzergah</div>

        <div className='space-y-3'>
          {routeInfos?.map((route, index) => (
            <div key={index} className='flex items-center gap-5 border-b p-2'>
              <div className='font-bold'>
                {dayjs(route.arrivalDate).format('HH:mm')}
              </div>
              <div>{route.destination} </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}

export { TripDetail }
