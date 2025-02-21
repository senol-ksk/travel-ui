'use client'

import { FloatingIndicator, Skeleton, Tabs, TabsTab } from '@mantine/core'
import { useLocalStorage, useMounted } from '@mantine/hooks'

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
  const [latestSearch, setLatestSearch] = useLocalStorage({
    key: 'latest-search',
    defaultValue: searchModules.flight.value,
    getInitialValueInEffect: false,
  })

  const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null)
  const [value, setValue] = useState<string | null>(latestSearch)
  const [controlsRefs, setControlsRefs] = useState<
    Record<string, HTMLButtonElement | null>
  >({})
  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs[val] = node
    setControlsRefs(controlsRefs)
  }

  const mounted = useMounted()

  if (!mounted)
    return <Skeleton visible={!mounted} radius={'lg'} mih={200}></Skeleton>

  return (
    <Tabs
      value={latestSearch}
      onChange={(val) => {
        if (val) {
          setLatestSearch(val)
        }
        setValue(val)
      }}
      variant='none'
    >
      <Tabs.List className={classes.list} ref={setRootRef}>
        <TabsTab
          value={searchModules.flight.value}
          ref={setControlRef(searchModules.flight.value)}
          className={classes.tab}
        >
          {searchModules.flight.title}
        </TabsTab>
        <TabsTab
          value={searchModules.hotel.value}
          ref={setControlRef(searchModules.hotel.value)}
          className={classes.tab}
        >
          {searchModules.hotel.title}
        </TabsTab>
        <TabsTab
          value={searchModules.carRental.value}
          ref={setControlRef(searchModules.carRental.value)}
          className={classes.tab}
        >
          {searchModules.carRental.title}
        </TabsTab>
        <TabsTab
          value={searchModules.bus.value}
          ref={setControlRef(searchModules.bus.value)}
          className={classes.tab}
        >
          {searchModules.bus.title}
        </TabsTab>
        <TabsTab
          value={searchModules.transfer.value}
          ref={setControlRef(searchModules.transfer.value)}
          className={classes.tab}
        >
          {searchModules.transfer.title}
        </TabsTab>
        <TabsTab
          value={searchModules.tour.value}
          ref={setControlRef(searchModules.tour.value)}
          className={classes.tab}
        >
          {searchModules.tour.title}
        </TabsTab>
        <FloatingIndicator
          target={value ? controlsRefs[value] : null}
          parent={rootRef}
          className={classes.indicator}
          transitionDuration={500}
        />
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
