import { Accordion } from '@mantine/core'
import { useState } from 'react'
import { HotelDetailResponseHotelInfo } from '@/app/hotel/types'

import { HotelDetailDescription } from '@/app/hotel/types'

type IProps = {
  description: HotelDetailDescription
  data: HotelDetailResponseHotelInfo | undefined
}

const ImportantInfos: React.FC<IProps> = ({ description, data }) => {
  const [opened, setOpened] = useState<string | null>(null)

  return (
    <div className='rounded bg-gray-50 p-3'>
      <Accordion className='bg-white p-3' value={opened} onChange={setOpened}>
        <Accordion.Item value='0'>
          <Accordion.Control>
            <div className='grid grid-cols-2'>
              <div>
                <div className='text-xl font-semibold'>Check-in</div>
                <strong>{data?.hotel.checkin_from}</strong>
              </div>
              <div>
                <div className='text-xl font-semibold'>Check-out</div>
                <strong>{data?.hotel.checkout_to}</strong>
              </div>
            </div>
          </Accordion.Control>

          <Accordion.Panel>
            <div
              dangerouslySetInnerHTML={{
                __html: description.importentInfo || '',
              }}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </div>
  )
}

export { ImportantInfos }
