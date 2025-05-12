'use client'

import { Skeleton, Tabs, TabsTab } from '@mantine/core'
import { useLocalStorage, useMounted } from '@mantine/hooks'

import { BiSolidPlaneAlt } from 'react-icons/bi'
import { IoCarSharp, IoBus } from 'react-icons/io5'
import { MdHotel } from 'react-icons/md'
import { TransferIcon } from '@/modules/bus/_icon'
import { FaSuitcase } from 'react-icons/fa'

import { Flight } from '@/modules/flight/'
import { HotelSearchEngine } from '@/modules/hotel'
import { CarRentSearchPanel } from '@/modules/carrent'
import { BusSearchEngine } from '@/modules/bus'
import { TransferSearchEngine } from '@/modules/transfer'
import { TourSearchEngine } from '@/modules/tour'

import classes from '@/components/search-engine/Search.module.css'

const searchModules = {
  flight: { value: 'flight', title: 'Uçak' },
  hotel: { value: 'hotel', title: 'Otel' },
  carRental: { value: 'carrental', title: 'Araç' },
  bus: { value: 'bus', title: 'Otobüs' },
  transfer: { value: 'transfer', title: 'Transfer' },
  tour: { value: 'tour', title: 'Tur' },
}

export const SearchEngine = () => {
  const mounted = useMounted()
  const [latestSearch, setLatestSearch] = useLocalStorage({
    key: 'latest-search',
    defaultValue: searchModules.flight.value,
    getInitialValueInEffect: false,
  })

  if (!mounted)
    return <Skeleton visible={!mounted} radius={'lg'} mih={200}></Skeleton>

  return (
    <Tabs
      value={latestSearch}
      onChange={(val) => {
        setLatestSearch(val ?? '')
      }}
      classNames={{
        tab: 'px-1 py-2 sm:py-3 md:text-lg border-b-4',
        tabSection: 'hidden sm:flex',
      }}
    >
      <Tabs.List
        px={{
          sm: 'sm',
          md: 'lg',
        }}
        grow
      >
        <TabsTab
          value={searchModules.flight.value}
          leftSection={<BiSolidPlaneAlt />}
          className={classes.tab}
        >
          {searchModules.flight.title}
        </TabsTab>
        <TabsTab
          value={searchModules.hotel.value}
          leftSection={<MdHotel />}
          className={classes.tab}
        >
          {searchModules.hotel.title}
        </TabsTab>
        <TabsTab
          value={searchModules.carRental.value}
          leftSection={<IoCarSharp />}
          className={classes.tab}
        >
          {searchModules.carRental.title}
        </TabsTab>
        <TabsTab
          value={searchModules.bus.value}
          leftSection={<IoBus />}
          className={classes.tab}
        >
          {searchModules.bus.title}
        </TabsTab>
        <TabsTab
          value={searchModules.transfer.value}
          leftSection={<TransferIcon />}
          className={classes.tab}
        >
          {searchModules.transfer.title}
        </TabsTab>
        <TabsTab
          value={searchModules.tour.value}
          leftSection={<FaSuitcase />}
          className={classes.tab}
        >
          {searchModules.tour.title}
        </TabsTab>
      </Tabs.List>

      <div className='p-4'>
        <Tabs.Panel value={searchModules.flight.value}>
          <Flight />
        </Tabs.Panel>
        <Tabs.Panel value={searchModules.hotel.value}>
          <HotelSearchEngine />
        </Tabs.Panel>
        <Tabs.Panel value={searchModules.carRental.value}>
          <CarRentSearchPanel />
        </Tabs.Panel>
        <Tabs.Panel value={searchModules.bus.value}>
          <BusSearchEngine />
        </Tabs.Panel>
        <Tabs.Panel value={searchModules.transfer.value}>
          <TransferSearchEngine />
        </Tabs.Panel>
        <Tabs.Panel value={searchModules.tour.value}>
          <TourSearchEngine />
        </Tabs.Panel>
      </div>
    </Tabs>
  )
}
