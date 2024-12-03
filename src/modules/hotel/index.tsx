import { HotelCalendar } from '@/components/search-engine/calendar/hotel'
import { Locations } from '@/components/search-engine/locations/hotel/locations'
import { type LocationResults } from '@/components/search-engine/locations/hotel/type'
import { HotelPassengerDropdown } from '@/components/search-engine/passengers/hotel'
import { request } from '@/network'
import { Button } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'

export const HotelSearchEngine = () => {
  const [destinationLocationInputValue, setDestinationLocationInputValue] =
    useState('')
  const { data: destinationLocation, isLoading: destinationLocationLoading } =
    useQuery<LocationResults>({
      queryKey: ['flight-locations', destinationLocationInputValue],
      enabled:
        !!destinationLocationInputValue &&
        destinationLocationInputValue.length > 2,
      queryFn: async () => {
        const getLocations = await request({
          url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/hotel/search`,
          params: {
            s: destinationLocationInputValue,
            id: null,
            scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
          },
        })

        return getLocations
      },
    })

  return (
    <form className='block'>
      <div className='grid grid-cols-12 gap-3 md:gap-3'>
        <div className='col-span-12 md:col-span-4'>
          <Locations
            label='Şehir ya da otel adı seçiniz'
            data={destinationLocation?.Result}
            isLoading={destinationLocationLoading}
            onChange={(value) => {
              setDestinationLocationInputValue(value)
            }}
          />
        </div>
        <div className='col-span-12 sm:col-span-6 md:col-span-3'>
          <HotelCalendar
            defaultDates={[
              dayjs().add(3, 'd').toDate(),
              dayjs().add(7, 'd').toDate(),
            ]}
            onDateSelect={(dates) => {
              console.log(dates)
            }}
          />
        </div>
        <div className='col-span-12 sm:col-span-6 md:col-span-3'>
          <HotelPassengerDropdown
            initialValues={[
              {
                adult: 2,
                child: 0,
                childAges: [],
              },
            ]}
            onChange={(params) => {
              // console.log('search engine', params)
            }}
          />
        </div>
        <div className='col-span-12 flex grow-0 md:col-span-2'>
          <Button
            type='submit'
            className='mx-auto min-h-full md:w-full'
            // loading={isRedirecting}
          >
            Ara
          </Button>
        </div>
      </div>
    </form>
  )
}
