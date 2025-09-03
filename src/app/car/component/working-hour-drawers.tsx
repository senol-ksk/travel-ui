import { Alert, Drawer, Tabs } from '@mantine/core'
import { DetailResponseData } from '../detail/type'
import dayjs from 'dayjs'

type Props = {
  data: DetailResponseData
  opened: boolean
  onClose: () => void
  defaultTab: 'get' | 'give'
}
const WorkingHoursDrawer: React.FC<Props> = ({
  data,
  opened,
  onClose,
  defaultTab,
}) => {
  return (
    <>
      <Drawer
        size={'lg'}
        opened={opened}
        onClose={onClose}
        title={<div className='text-xl font-bold'>Çalışma Saatleri</div>}
        position='right'
        overlayProps={{
          opacity: 0.5,
          blur: 2,
        }}
      >
        <Tabs
          defaultValue={defaultTab}
          classNames={{
            tab: 'border-b-5 rounded md:p-1',
            tabSection: 'hidden sm:flex',
            tabLabel: 'flex-none',
          }}
        >
          <Tabs.List className='flex justify-around text-xl'>
            <Tabs.Tab className='text-lg font-medium' value='get'>
              Teslm Alış
            </Tabs.Tab>
            <Tabs.Tab className='text-lg font-medium' value='give'>
              Teslim Ediş
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value='get' className='grid' id='get'>
            <div className='text-md my-3 grid gap-2 font-medium'>
              <div className='text-md md:text-lg'>
                {data.pickupStation.location.name}
              </div>
              <div>
                {dayjs
                  .utc(data.carRentalSearchPanel.pickupDate)
                  .format('DD MMMM YYYY, HH:mm')}
              </div>
            </div>{' '}
            {data.pickupStation.times.length > 1 &&
              data.pickupStation.times.map((timeItem, index) => {
                const days = [
                  'Pazar',
                  'Pazartesi',
                  'Salı',
                  'Çarşamba',
                  'Perşembe',
                  'Cuma',
                  'Cumartesi',
                ]
                return (
                  <div
                    key={index}
                    className='m-5 grid grid-cols-2 items-center gap-2 md:grid-cols-4'
                  >
                    <div className='col-span-1'>
                      <strong>{days[Number(timeItem.day)]}</strong>
                    </div>
                    <div className='col-span-1'>
                      {timeItem.openingTime} - {timeItem.closingTime}
                    </div>
                  </div>
                )
              })}
            <div className='my-3 flex items-center gap-1 text-lg font-medium'>
              <div>Telefon :</div>
              {data.pickupStation.phoneNumbers.map((phoneNumber, index) => {
                return <div key={index}>{phoneNumber.number}</div>
              })}
            </div>
          </Tabs.Panel>

          <Tabs.Panel value='give' className='grid' id='give'>
            <div className='text-md my-3 grid gap-2 font-medium'>
              <div className='text-md md:text-lg'>
                {data.returnStation.location.name}
              </div>
              <div>
                {dayjs
                  .utc(data.carRentalSearchPanel.returnDate)
                  .format('DD MMMM YYYY, HH:mm')}
              </div>
            </div>{' '}
            {data.returnStation.times.length > 1 &&
              data.returnStation.times.map((timeItem, index) => {
                const days = [
                  'Pazar',
                  'Pazartesi',
                  'Salı',
                  'Çarşamba',
                  'Perşembe',
                  'Cuma',
                  'Cumartesi',
                ]
                return (
                  <div
                    key={index}
                    className='m-5 grid grid-cols-2 items-center gap-2 md:grid-cols-4'
                  >
                    <div className='col-span-1'>
                      <strong>{days[Number(timeItem.day)]}</strong>
                    </div>
                    <div className='col-span-1'>
                      {timeItem.openingTime} - {timeItem.closingTime}
                    </div>
                  </div>
                )
              })}
            <div className='my-3 flex items-center gap-1 text-lg font-medium'>
              <div>Telefon :</div>
              {data.returnStation.phoneNumbers.map((phoneNumber, index) => {
                return <div key={index}>{phoneNumber.number}</div>
              })}
            </div>
          </Tabs.Panel>
        </Tabs>
      </Drawer>
    </>
  )
}
export { WorkingHoursDrawer }
