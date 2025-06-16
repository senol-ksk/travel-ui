import { Accordion } from '@mantine/core'
import { useState } from 'react'

import { HotelDetailDescription } from '@/app/hotel/types'

type IProps = {
  description: HotelDetailDescription
}

const ImportantInfos: React.FC<IProps> = ({ description }) => {
  const [opened, setOpened] = useState<string | null>('0')

  const toggleAccordion = (value: string) => {
    setOpened(opened === value ? null : value)
  }

  return (
    <div className='rounded bg-gray-50 p-3'>
      <Accordion className='bg-white p-3' value={opened}>
        <Accordion.Item value='0'>
          <Accordion.Control onClick={() => toggleAccordion('0')}>
            Önemli Bilgiler
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
