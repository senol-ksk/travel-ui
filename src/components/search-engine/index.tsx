'use client'

import { Skeleton, Tabs, TabsTab } from '@mantine/core'
import { useLocalStorage, useMounted } from '@mantine/hooks'

import {
  RiBuilding4Line,
  RiBusFill,
  RiCarLine,
  RiPlaneLine,
  RiRouteLine,
  RiShip2Line,
  RiShipLine,
  RiSuitcaseLine,
} from 'react-icons/ri'
import { Flight } from '@/modules/flight/'
import { HotelSearchEngine } from '@/modules/hotel'
import { CarRentSearchPanel } from '@/modules/carrent'
import { BusSearchEngine } from '@/modules/bus'
import { TransferSearchEngine } from '@/modules/transfer'
import { TourSearchEngine } from '@/modules/tour'

import classes from '@/components/search-engine/Search.module.css'
import { CruiseSearchEngine } from '@/modules/cruise'

const searchModules = {
  flight: { value: 'flight', title: 'Uçak' },
  hotel: { value: 'hotel', title: 'Otel' },
  carRental: { value: 'carrental', title: 'Araç' },
  bus: { value: 'bus', title: 'Otobüs' },
  transfer: { value: 'transfer', title: 'Transfer' },
  tour: { value: 'tour', title: 'Tur' },
  cruise: { value: 'cruise', title: 'Gemi' },
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
        tab: 'md:text-lg border-b-4 p-4',
        tabSection: 'hidden sm:flex',
        tabLabel: 'flex-none',
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
          leftSection={<RiPlaneLine size={20} />}
          className={classes.tab}
        >
          {searchModules.flight.title}
        </TabsTab>
        <TabsTab
          value={searchModules.hotel.value}
          leftSection={<RiBuilding4Line size={20} />}
          className={classes.tab}
        >
          {searchModules.hotel.title}
        </TabsTab>
        <TabsTab
          value={searchModules.carRental.value}
          leftSection={<RiCarLine size={20} />}
          className={classes.tab}
        >
          {searchModules.carRental.title}
        </TabsTab>
        <TabsTab
          value={'feribot'}
          leftSection={<RiShip2Line size={20} />}
          className={classes.tab}
        >
          <div>Feribot</div>
        </TabsTab>
        <TabsTab
          value={searchModules.bus.value}
          leftSection={<RiBusFill size={20} />}
          className={classes.tab}
        >
          {searchModules.bus.title}
        </TabsTab>
        <TabsTab
          value={searchModules.transfer.value}
          leftSection={<RiRouteLine size={20} />}
          className={classes.tab}
        >
          {searchModules.transfer.title}
        </TabsTab>
        <TabsTab
          value={searchModules.cruise.value}
          leftSection={<RiShipLine size={20} />}
          className={classes.tab}
        >
          {searchModules.cruise.title}
        </TabsTab>
        <TabsTab
          value={searchModules.tour.value}
          leftSection={<RiSuitcaseLine size={20} />}
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
        <Tabs.Panel value={searchModules.cruise.value}>
          <CruiseSearchEngine />
        </Tabs.Panel>
      </div>
    </Tabs>
  )
}
