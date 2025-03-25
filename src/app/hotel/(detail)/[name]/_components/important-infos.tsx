import { HotelDetailDescription } from '@/app/hotel/types'
import { Accordion } from '@mantine/core'
import React, { useState } from 'react'

type IProps = {
  description: HotelDetailDescription
}

const ImportantInfos: React.FC<IProps> = ({ description }) => {
  const [opened, setOpened] = useState<string | null>('0')

  const toggleAccordion = (value: string) => {
    setOpened(opened === value ? null : value)
  }

  return (
    <div className='bg-sky-50 p-3'>
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
