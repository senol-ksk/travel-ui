'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTransitionRouter } from 'next-view-transitions'
import { DatesRangeValue } from '@mantine/dates'
import dayjs from 'dayjs'

import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useLocalStorage, useMounted } from '@mantine/hooks'
import { Button, NativeSelect, Radio, Group, Skeleton } from '@mantine/core'

import { request } from '@/network'

import { Locations } from '@/components/search-engine/locations'
import { FlightCalendar } from '@/components/search-engine/calendar/flight'
import { PassengerDropdown } from '@/components/search-engine/passengers/flight'
import type { LocationResults } from '@/components/search-engine/locations/type'
import { serializeFlightSearchParams } from './searchParams'

const formSchema = z.object({
  DepartureDate: z.coerce.date(),
  ReturnDate: z.coerce.date(),
  Destination: z.object({
    Code: z.string(),
    CountryCode: z.string(),
    ExtentionData: z.object({}),
    Iata: z.array(z.string()),
    Id: z.string().or(z.number()),
    IsDomestic: z.boolean(),
    Location: z.array(z.number()),
    Name: z.string(),
    Northeast: z.array(z.number()),
    ParentIds: z.array(z.number()),
    Select: z.boolean(),
    Slug: z.string(),
    Southwest: z.array(z.number()),
    SubDestinations: z.array(z.object({})),
    Type: z.number(),
  }),
  Origin: z.object({
    Code: z.string(),
    CountryCode: z.string(),
    ExtentionData: z.object({}),
    Iata: z.array(z.string()),
    Id: z.string().or(z.number()),
    IsDomestic: z.boolean(),
    Location: z.array(z.number()),
    Name: z.string(),
    Northeast: z.array(z.number()),
    ParentIds: z.array(z.number()),
    Select: z.boolean(),
    Slug: z.string(),
    Southwest: z.array(z.number()),
    SubDestinations: z.array(z.object({})),
    Type: z.number(),
  }),
  ActiveTripKind: z.union([z.literal('1'), z.literal('2')]),
  CabinClass: z.object({
    value: z.number().or(z.string()),
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

// import { serializeFlightSearchParams } from './searchParams'

export const Flight = () => {
  const mounted = useMounted()
  const router = useTransitionRouter()
  // const [originLocationInputValue, setOriginLocationInputValue] = useState('')
  // const [destinationLocationInputValue, setDestinationLocationInputValue] =
  //   useState('')

  const [dates, setDates] = useState<DatesRangeValue>([
    dayjs().add(6, 'days').toDate(),
    dayjs().add(8, 'days').toDate(),
  ])
  const [flightLocalObj, setFlightLocalObj] =
    useLocalStorage<FlightRequestType>({
      key: 'flight-search-engine',
      getInitialValueInEffect: false,
    })

  const form = useForm<FlightRequestType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ActiveTripKind: flightLocalObj?.ActiveTripKind ?? '1',
      CabinClass: flightLocalObj?.CabinClass ?? { title: 'Ekonomi', value: 0 },
      Destination: flightLocalObj?.Destination,
      Origin: flightLocalObj?.Origin,
      PassengerCounts: {
        Adult: flightLocalObj?.PassengerCounts?.Adult ?? 1,
        Child: flightLocalObj?.PassengerCounts?.Child ?? 0,
        Infant: flightLocalObj?.PassengerCounts?.Infant ?? 0,
      },
      DepartureDate: flightLocalObj?.DepartureDate
        ? flightLocalObj?.DepartureDate
        : dayjs().add(2, 'd').toDate(),
      ReturnDate: flightLocalObj?.ReturnDate
        ? flightLocalObj?.ReturnDate
        : dayjs().add(4, 'd').toDate(),
    },
  })

  const {
    data: originLocations,
    isLoading: originLocationsIsLoading,
    refetch: refetchOriginDestinations,
  } = useQuery<LocationResults>({
    queryKey: ['flight-origin-locations'],
    enabled: false,
    queryFn: async () => {
      const getLocations = await request({
        url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/flight/search`,
        params: {
          s: form.getValues('Origin.Slug'),
          id: null,
          scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
        },
      })

      return getLocations
    },
  })
  const {
    data: destinationLocation,
    isLoading: destinationLocationLoading,
    refetch: refetchTargetDestinations,
  } = useQuery<LocationResults>({
    queryKey: ['flight-destination-locations'],
    enabled: false,
    queryFn: async () => {
      const getLocations = await request({
        url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/flight/search`,
        params: {
          s: form.getValues('Destination.Slug'),
          id: null,
          scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
        },
      })

      return getLocations
    },
  })

  const handleFormSubmit = async (data: FlightRequestType) => {
    const departurDate = data.DepartureDate
    const returnDate =
      dayjs(data.ReturnDate).diff(data.DepartureDate, 'd') < 0
        ? dayjs(departurDate).add(2, 'd').toDate()
        : data.ReturnDate

    const searchUrl = serializeFlightSearchParams('/flight/search-results', {
      activeTripKind: data.ActiveTripKind,
      cabinClass: data.CabinClass,
      departureDate: departurDate,
      destination: {
        code: data.Destination.Code,
        iata: data.Destination.Iata,
        id: data.Destination.Id,
        isDomestic: data.Destination.IsDomestic,
        type: data.Destination.Type,
      },
      origin: {
        code: data.Origin.Code,
        iata: data.Origin.Iata,
        id: data.Origin.Id,
        isDomestic: data.Origin.IsDomestic,
        type: data.Origin.Type,
      },
      passengerCounts: data.PassengerCounts,
      returnDate: data.ActiveTripKind === '2' ? returnDate : null,
    })

    setFlightLocalObj(() => ({
      Origin: data.Origin,
      Destination: data.Destination,
      ReturnDate: returnDate,
      DepartureDate: departurDate,
      ActiveTripKind: data.ActiveTripKind,
      CabinClass: data.CabinClass,
      PassengerCounts: data.PassengerCounts,
    }))

    // router.push(`/flight-search?searchId=${generateUUID()}`)
    router.push(searchUrl)
  }

  if (!mounted) return <Skeleton height={80} />

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <div className='flex items-center gap-3 pb-4'>
        <div>
          <Radio.Group
            defaultValue={form.formState.defaultValues?.ActiveTripKind}
            name='ActiveTripKind'
            onChange={(value) => {
              if (value === '1' || value === '2') {
                form.setValue('ActiveTripKind', value)
                form.trigger('ActiveTripKind')
              }
            }}
          >
            <Group gap={'md'}>
              <Radio value={'1'} label='Tek Yön' />
              <Radio value={'2'} label='Gidiş-Dönüş' />
            </Group>
          </Radio.Group>
        </div>
        <div>
          <Controller
            control={form.control}
            name='CabinClass'
            render={({ field }) => (
              <NativeSelect
                data={[
                  { label: 'Ekonomi', value: '0' },
                  { label: 'Business', value: '2' },
                  { label: 'First Class', value: '3' },
                ]}
                defaultValue={form.formState.defaultValues?.CabinClass?.value}
                onChange={({ currentTarget }) => {
                  field.onChange({
                    value: +currentTarget.value,
                    title:
                      currentTarget.options[currentTarget.options.selectedIndex]
                        .innerText,
                  })
                }}
              />
            )}
          />
        </div>
      </div>
      <div className='grid grid-cols-12 gap-2 md:gap-4'>
        <div className='col-span-12 sm:col-span-6 md:col-span-3'>
          <Locations
            label='Kalkış'
            inputProps={{ error: !!form.formState.errors.Origin }}
            data={originLocations?.Result}
            isLoading={originLocationsIsLoading}
            defaultValue={form.formState.defaultValues?.Origin?.Name}
            onChange={(value) => {
              if (value.length > 2) {
                form.setValue('Origin.Slug', value)
                form.trigger('Origin.Slug').then((value) => {
                  if (value) {
                    refetchOriginDestinations()
                  }
                })
              }
            }}
            onSelect={(value) => {
              form.setValue('Origin', value)
            }}
          />
        </div>
        <div className='col-span-12 sm:col-span-6 md:col-span-3'>
          <Locations
            label='Nereye'
            inputProps={{ error: !!form.formState.errors.Destination }}
            defaultValue={form.formState.defaultValues?.Destination?.Name}
            data={destinationLocation?.Result}
            isLoading={destinationLocationLoading}
            onChange={(value) => {
              if (value.length > 2) {
                form.setValue('Destination.Slug', value)
                form.trigger('Destination.Slug').then((value) => {
                  if (value) {
                    refetchTargetDestinations()
                  }
                })
              }
            }}
            onSelect={(value) => {
              form.setValue('Destination', value)
            }}
          />
        </div>
        <div className='col-span-6 md:col-span-3 lg:col-span-2'>
          <FlightCalendar
            onDateSelect={(dates) => {
              if (dates[0]) {
                form.setValue('DepartureDate', new Date(dates[0]))

                if (!dates[1]) {
                  form.setValue(
                    'ReturnDate',
                    dayjs(dates[0]).add(2, 'd').toDate()
                  )
                }
              }

              if (dates[1]) {
                form.setValue('ReturnDate', new Date(dates[1]))
              }
            }}
            tripKind={
              form.getValues().ActiveTripKind === '1' ? 'one-way' : 'round-trip'
            }
            defaultDates={[
              new Date(form.getValues('DepartureDate')),
              new Date(form.getValues('ReturnDate')),
            ]}
          />
        </div>
        <div className='col-span-6 md:col-span-3 lg:col-span-2'>
          <PassengerDropdown
            initialValues={{
              ...form.getValues('PassengerCounts'),
            }}
            onChange={({ Adult, Child, Infant }) => {
              form.setValue('PassengerCounts', {
                Adult: Adult || 1,
                Child: Child || 0,
                Infant: Infant || 0,
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
