import { Button } from '@mantine/core'

import { Input } from '@/components/search-engine/input'

export const Flight = () => {
  return (
    <div className='grid gap-2 md:grid-cols-12 md:gap-4'>
      <div className='col-span-6 md:col-span-3'>
        <Input label='Nereden' icon='location' />
      </div>
      <div className='col-span-6 md:col-span-3'>
        <Input label='Nereye' icon='location' />
      </div>
      <div className='col-span-6 md:col-span-3 lg:col-span-2'>
        <Input label='Tarihler' icon={'calendar'} />
      </div>
      <div className='col-span-6 md:col-span-3 lg:col-span-2'>
        <Input label={'Yolcular'} icon={'passenger'} />
      </div>
      <div className='sm:col-grid-2 col-span-12 flex grow-0 lg:col-span-2'>
        <Button className='mx-auto w-full sm:w-auto lg:h-full lg:w-full'>
          Ara
        </Button>
      </div>
    </div>
  )
}
