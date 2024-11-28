'use client'
import { Tabs, TabsTab } from '@mantine/core'

import { Flight } from '@/modules/flight/'
import { HotelSearchEngine } from '@/modules/hotel'

const searchModules = {
  flight: { value: 'flight', title: 'Uçak' },
  hotel: { value: 'hotel', title: 'Otel' },
  carRental: { value: 'carrental', title: 'Araç' },
}

export const SearchEngine = () => (
  <Tabs defaultValue={searchModules.flight.value}>
    <Tabs.List className='px-2 pt-2 md:px-4 md:pt-4'>
      <TabsTab value={searchModules.flight.value}>
        {searchModules.flight.title}
      </TabsTab>
      <TabsTab value={searchModules.hotel.value}>
        {searchModules.hotel.title}
      </TabsTab>
      <TabsTab value={searchModules.carRental.value}>
        {searchModules.carRental.title}
      </TabsTab>
    </Tabs.List>

    <div className='p-2 md:p-4'>
      <Tabs.Panel value={searchModules.flight.value}>
        <Flight />
      </Tabs.Panel>

      <Tabs.Panel value={searchModules.hotel.value}>
        <HotelSearchEngine />
      </Tabs.Panel>

      <Tabs.Panel value={searchModules.carRental.value}>
        {searchModules.carRental.title}
      </Tabs.Panel>
    </div>
  </Tabs>
)
