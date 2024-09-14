import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { z } from 'zod'
import { zodResolver } from 'mantine-form-zod-resolver'

import { useForm } from '@mantine/form'
import { Button, NativeSelect } from '@mantine/core'

import { request } from '@/network'
import { Input } from '@/components/search-engine/input'
import { Locations } from '@/components/search-engine/locations'
import { FlightCalendar } from '@/components/search-engine/calendar/flight'
import { PassengerDropdown } from '@/components/search-engine/passengers'
import type { LocationsApiResults } from '@/components/search-engine/locations/locations'

const schema = z.object({
  Origin: z.string().min(4),
  Destination: z.string().min(4),
})

export const Flight = () => {
  const [originLocationInputValue, setOriginLocationInputValue] = useState('')
  const [destinationLocationInputValue, setDestinationLocationInputValue] =
    useState('')

  const { data: originLocations, isLoading: originLocationsIsLoading } =
    useQuery<LocationsApiResults>({
      queryKey: ['flight-locations', originLocationInputValue],
      enabled:
        !!originLocationInputValue && originLocationInputValue.length > 3,
      queryFn: () =>
        request({
          url: `https://apipfn.lidyateknoloji.com/d/v1.1/api/flight/search?s=${originLocationInputValue}&id=&scope=2d932774-a9d8-4df9-aae7-5ad2727da1c7`,
        }),
    })
  const { data: destinationLocation, isLoading: destinationLocationLoading } =
    useQuery<LocationsApiResults>({
      queryKey: ['flight-locations', destinationLocationInputValue],
      enabled:
        !!destinationLocationInputValue &&
        destinationLocationInputValue.length > 3,
      queryFn: () =>
        request({
          url: `https://apipfn.lidyateknoloji.com/d/v1.1/api/flight/search?s=${destinationLocationInputValue}&id=&scope=2d932774-a9d8-4df9-aae7-5ad2727da1c7`,
        }),
    })

  const form = useForm<typeof schema.shape>({
    mode: 'uncontrolled',
    validate: zodResolver(schema),
  })

  return (
    <form onSubmit={form.onSubmit((event) => console.log(event))}>
      <div>
        <div hidden>
          <NativeSelect
            data={[
              { label: 'Ekonomi', value: '0' },
              { label: 'Business', value: '2' },
              { label: 'First Class', value: '3' },
            ]}
          />
        </div>
      </div>
      <div className='grid grid-cols-12 gap-2 md:gap-4'>
        <div className='col-span-12 sm:col-span-6 md:col-span-3'>
          <Locations
            label='Kalkış'
            inputProps={{ ...form.getInputProps('Origin') }}
            data={originLocations?.Result}
            isLoading={originLocationsIsLoading}
            onChange={(value) => {
              setOriginLocationInputValue(value)
            }}
            onSelect={(value) => {
              form.setValues({
                //@ts-ignore-next-line
                Origin: value,
              })
            }}
          />
        </div>
        <div className='col-span-12 sm:col-span-6 md:col-span-3'>
          <Locations
            label='Nereye'
            inputProps={{ ...form.getInputProps('Destination') }}
            data={destinationLocation?.Result}
            isLoading={destinationLocationLoading}
            onChange={(value) => {
              setDestinationLocationInputValue(value)
            }}
            onSelect={(value) => {
              form.setValues({
                //@ts-ignore-next-line
                Destination: value,
              })
            }}
          />
        </div>
        <div className='col-span-6 md:col-span-3 lg:col-span-2'>
          <FlightCalendar />
        </div>
        <div className='col-span-6 md:col-span-3 lg:col-span-2'>
          <PassengerDropdown />
        </div>
        <div className='sm:col-grid-2 col-span-12 flex grow-0 lg:col-span-2'>
          <Button
            className='mx-auto w-full sm:w-auto lg:h-full lg:w-full'
            type='submit'
          >
            Ara
          </Button>
        </div>
      </div>
    </form>
  )
}
