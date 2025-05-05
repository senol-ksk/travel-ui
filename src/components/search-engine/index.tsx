'use client'

import { Skeleton, Tabs, TabsTab } from '@mantine/core'
import { useLocalStorage, useMounted } from '@mantine/hooks'
import { BiSolidPlaneAlt } from 'react-icons/bi'
import { IoCarSharp } from 'react-icons/io5'
import { MdHotel } from 'react-icons/md'

import { Flight } from '@/modules/flight/'
import { HotelSearchEngine } from '@/modules/hotel'
import { CarRentSearchPanel } from '@/modules/carrent'
import { BusSearchEngine } from '@/modules/bus'
import { TransferSearchEngine } from '@/modules/transfer'
import { TourSearchEngine } from '@/modules/tour'
import { useState } from 'react'

const searchModules = {
  flight: { value: 'flight', title: 'Uçak' },
  hotel: { value: 'hotel', title: 'Otel' },
  carRental: { value: 'carrental', title: 'Araç' },
  bus: { value: 'bus', title: 'Otobüs' },
  transfer: { value: 'transfer', title: 'Transfer' },
  tour: { value: 'tour', title: 'Tur' },
}

import classes from '@/components/search-engine/Search.module.css'

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
        tab: 'py-3 text-lg font-semibold border-b-4 text-dark-7',
      }}
    >
      <Tabs.List
        px={{
          sm: 'sm',
          md: 'lg',
        }}
        color='dark'
        grow
      >
        <TabsTab
          value={searchModules.flight.value}
          leftSection={<BiSolidPlaneAlt size={20} />}
          className={classes.tab}
        >
          {searchModules.flight.title}
        </TabsTab>
        <TabsTab
          value={searchModules.hotel.value}
          leftSection={<MdHotel size={20} />}
          className={classes.tab}
        >
          {searchModules.hotel.title}
        </TabsTab>
        <TabsTab
          value={searchModules.carRental.value}
          leftSection={<IoCarSharp size={20} />}
          className={classes.tab}
        >
          {searchModules.carRental.title}
        </TabsTab>
        <TabsTab value={searchModules.bus.value} className={classes.tab}>
          {searchModules.bus.title}
        </TabsTab>
        <TabsTab value={searchModules.transfer.value} className={classes.tab}>
          {searchModules.transfer.title}
        </TabsTab>
        <TabsTab value={searchModules.tour.value} className={classes.tab}>
          {searchModules.tour.title}
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
