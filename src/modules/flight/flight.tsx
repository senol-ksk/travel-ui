'use client'

import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useRouter } from 'next/navigation'

import { z } from 'zod'
import { zodResolver } from 'mantine-form-zod-resolver'

import { useForm } from '@mantine/form'
import { Button, NativeSelect, Radio, Group } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'

import { request } from '@/network'

import { Locations } from '@/components/search-engine/locations'
import { FlightCalendar } from '@/components/search-engine/calendar/flight'
import { PassengerDropdown } from '@/components/search-engine/passengers'
import type {
  LocationResult,
  LocationResults,
} from '@/components/search-engine/locations/locations'
import dayjs from 'dayjs'
import { DatesRangeValue } from '@mantine/dates'
import { createSearch, FlightApiRequestParams } from './search.request'

const formSchema = z.object({
  Destination: z.string().min(3),
  Origin: z.string().min(3),
  ActiveTripKind: z.number(),
  CabinClassSelect: z.string(),
  CabinClass: z.object({
    value: z.number(),
    title: z.union([
      z.literal('Ekonomi'),
      z.literal('Business'),
      z.literal('First Class'),
      z.string(),
    ]),
  }),
  PassengerCounts: z.object({
    Adult: z.number(),
    Child: z.number(),
    Infant: z.number(),
  }),
})

const schema = formSchema

type FlightRequestType = z.infer<typeof schema>

export const Flight = () => {
  const router = useRouter()

  const [selectedOriginLocation, setSelectedOriginLocation] =
    useState<LocationResult>()
  const [selectedDepartureLocation, setSelectedDeparturLocation] =
    useState<LocationResult>()
  const [originLocationInputValue, setOriginLocationInputValue] = useState('')
  const [destinationLocationInputValue, setDestinationLocationInputValue] =
    useState('')

  const [dates, setDates] = useState<DatesRangeValue>([
    dayjs().add(6, 'days').toDate(),
    dayjs().add(8, 'days').toDate(),
  ])
  const [flightLocalObj, setFlightLocalObj] =
    useLocalStorage<FlightApiRequestParams>({
      key: 'flight',
    })

  const form = useForm<FlightRequestType>({
    mode: 'uncontrolled',
    validate: zodResolver(schema),
    initialValues: {
      ActiveTripKind: 1,
      CabinClass: { title: 'Ekonomi', value: 0 },
      CabinClassSelect: '0',
      Destination: '',
      Origin: '',
      PassengerCounts: {
        Adult: 1,
        Child: 0,
        Infant: 0,
      },
    },
  })

  useEffect(() => {
    if (flightLocalObj) {
      setSelectedOriginLocation(flightLocalObj.Origin)
      setSelectedDeparturLocation(flightLocalObj.Destination)
      setDates([
        dayjs(flightLocalObj.Dates.at(0)).toDate(),
        flightLocalObj.Dates.at(1)
          ? dayjs(flightLocalObj.Dates.at(1)).toDate()
          : null,
      ])
      form.initialize({
        ...flightLocalObj,
        Destination: flightLocalObj.Destination.Name,
        Origin: flightLocalObj.Origin.Name,
        CabinClassSelect: flightLocalObj.CabinClass?.value.toString(),
      })
    }
  }, [])

  const { data: originLocations, isLoading: originLocationsIsLoading } =
    useQuery<LocationResults>({
      queryKey: ['flight-locations', originLocationInputValue],
      enabled:
        !!originLocationInputValue && originLocationInputValue.length > 3,
      queryFn: async () => {
        const getLocations = await request({
          url: 'https://apipfn.lidyateknoloji.com/d/v1.1/api/flight/search',
          params: {
            s: originLocationInputValue,
            id: null,
            scope: '2d932774-a9d8-4df9-aae7-5ad2727da1c7',
          },
        })

        return getLocations
      },
    })
  const { data: destinationLocation, isLoading: destinationLocationLoading } =
    useQuery<LocationResults>({
      queryKey: ['flight-locations', destinationLocationInputValue],
      enabled:
        !!destinationLocationInputValue &&
        destinationLocationInputValue.length > 3,
      queryFn: async () => {
        const getLocations = await request({
          url: 'https://apipfn.lidyateknoloji.com/d/v1.1/api/flight/search',
          params: {
            s: destinationLocationInputValue,
            id: null,
            scope: '2d932774-a9d8-4df9-aae7-5ad2727da1c7',
          },
        })

        return getLocations
      },
    })

  const handleFormSubmit = (events: FlightRequestType) => {
    createSearch({
      Origin: selectedOriginLocation!,
      Destination: selectedDepartureLocation!,
      Dates: dates,
      ActiveTripKind: form.getValues().ActiveTripKind,
      CabinClass: {
        value: form.getValues().CabinClass.value,
        title: form.getValues().CabinClass.title,
      },
      PassengerCounts: form.getValues().PassengerCounts,
    })

    setFlightLocalObj(() => ({
      Origin: selectedOriginLocation!,
      Destination: selectedDepartureLocation!,
      Dates: dates,
      ActiveTripKind: form.getValues().ActiveTripKind,
      CabinClass: {
        value: form.getValues().CabinClass.value,
        title: form.getValues().CabinClass.title,
      },
      PassengerCounts: form.getValues().PassengerCounts,
    }))

    router.push('/flight-search')
  }

  return (
    <form onSubmit={form.onSubmit(handleFormSubmit)}>
      <div className='flex grow items-center justify-between gap-3 pb-4 sm:justify-start'>
        <div>
          <Radio.Group
            key={form.key('ActiveTripKind')}
            {...form.getInputProps('ActiveTripKind')}
            onChange={(value) => {
              form.setFieldValue('ActiveTripKind', +value)
            }}
          >
            <Group gap={'md'}>
              <Radio value={1} label='Tek Yön' />
              <Radio value={2} label='Gidiş-Dönüş' />
            </Group>
          </Radio.Group>
        </div>
        <div className='flex'>
          <NativeSelect
            data={[
              { label: 'Ekonomi', value: '0' },
              { label: 'Business', value: '2' },
              { label: 'First Class', value: '3' },
            ]}
            key={form.key('CabinClassSelect')}
            {...form.getInputProps('CabinClassSelect')}
            onChange={({ currentTarget }) => {
              form.setFieldValue('CabinClass', {
                value: +currentTarget.value,
                title:
                  currentTarget.options[currentTarget.options.selectedIndex]
                    .innerText,
              })
            }}
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
            defaultValue={flightLocalObj?.Origin?.Name || null}
            onChange={(value) => {
              setOriginLocationInputValue(value)
            }}
            onSelect={(value) => {
              form.setFieldValue('Origin', value.Name)
              setSelectedOriginLocation(value)
            }}
          />
        </div>
        <div className='col-span-12 sm:col-span-6 md:col-span-3'>
          <Locations
            label='Nereye'
            inputProps={{ ...form.getInputProps('Destination') }}
            defaultValue={flightLocalObj?.Destination?.Name || null}
            data={destinationLocation?.Result}
            isLoading={destinationLocationLoading}
            onChange={(value) => {
              setDestinationLocationInputValue(value)
            }}
            onSelect={(value) => {
              form.setFieldValue('Destination', value.Name)
              setSelectedDeparturLocation(value)
            }}
          />
        </div>
        <div className='col-span-6 md:col-span-3 lg:col-span-2'>
          <FlightCalendar
            onDateSelect={(dates) => {
              setDates(dates)
            }}
            tripKind={
              form.getValues().ActiveTripKind === 1 ? 'one-way' : 'round-trip'
            }
            defaultDates={dates}
          />
        </div>
        <div className='col-span-6 md:col-span-3 lg:col-span-2'>
          <PassengerDropdown
            initialValues={
              flightLocalObj
                ? {
                    Adult: flightLocalObj?.PassengerCounts.Adult,
                    Child: flightLocalObj?.PassengerCounts.Child,
                    Infant: flightLocalObj?.PassengerCounts.Infant,
                  }
                : null
            }
            onChange={({ Adult, Child, Infant }) => {
              form.setFieldValue('PassengerCounts', {
                Adult,
                Child,
                Infant,
              })
            }}
          />
        </div>
        <div className='sm:col-grid-2 col-span-12 flex grow-0 lg:col-span-2'>
          <Button
            type='submit'
            className='mx-auto w-full sm:w-auto lg:h-full lg:w-full'
          >
            Ara
          </Button>
        </div>
      </div>
    </form>
  )
}
