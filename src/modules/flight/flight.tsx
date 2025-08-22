'use client'

import { useQuery } from '@tanstack/react-query'
import { useTransitionRouter } from 'next-view-transitions'
import dayjs from 'dayjs'
import { MdKeyboardArrowDown } from 'react-icons/md'

import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useLocalStorage, useMounted } from '@mantine/hooks'
import { Select, Radio, Group, Skeleton, Button } from '@mantine/core'

import { request } from '@/network'

import { Locations } from '@/components/search-engine/locations'
import { FlightCalendar } from '@/components/search-engine/calendar/flight'
import { PassengerDropdown } from '@/components/search-engine/passengers/flight'
import type { LocationResults } from '@/components/search-engine/locations/type'
import { serializeFlightSearchParams } from './searchParams'
import { SearchEngineButton } from '@/components/search-engine/search-button'
import { RiCalendarEventLine, RiMapPin2Line, RiUserLine } from 'react-icons/ri'
import { TbArrowsRightLeft } from 'react-icons/tb'
import { useState } from 'react'

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

type FlightRequestType = z.infer<typeof formSchema>

export const Flight = () => {
  const mounted = useMounted()
  const router = useTransitionRouter()

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
    const departureDate = data.DepartureDate
    const returnDate =
      dayjs(data.ReturnDate).diff(data.DepartureDate, 'd') < 0
        ? dayjs(departureDate).add(2, 'd').toDate()
        : data.ReturnDate

    const searchUrl = serializeFlightSearchParams('/flight/search-results', {
      activeTripKind: data.ActiveTripKind,
      cabinClass: data.CabinClass,
      departureDate: departureDate,
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
      // returnDate: data.ActiveTripKind === '2' ? returnDate : null,
      ...(data.ActiveTripKind === '2' && { returnDate: returnDate }),
    })

    setFlightLocalObj(() => ({
      Origin: data.Origin,
      Destination: data.Destination,
      ReturnDate: returnDate,
      DepartureDate: departureDate,
      ActiveTripKind: data.ActiveTripKind,
      CabinClass: data.CabinClass,
      PassengerCounts: data.PassengerCounts,
    }))

    // router.push(`/flight-search?searchId=${generateUUID()}`)
    router.push(searchUrl)
  }
  const switchWay = () => {
    const origin = form.getValues('Origin')
    const destinaton = form.getValues('Destination')
    form.setValue('Origin', destinaton)
    form.setValue('Destination', origin)
    form.trigger(['Origin', 'Destination'])
  }
  if (!mounted) return <Skeleton height={80} />

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <div className='flex items-center gap-4 pb-4 md:gap-3'>
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
              <Radio
                className='font-medium'
                variant='outline'
                value={'2'}
                label='Gidiş-Dönüş'
              />
              <Radio
                className='font-medium'
                variant='outline'
                value={'1'}
                label='Tek Yön'
              />
            </Group>
          </Radio.Group>
        </div>
        <Controller
          control={form.control}
          name='CabinClass'
          render={({ field }) => {
            const options = [
              { label: 'Ekonomi', value: '0' },
              { label: 'Business', value: '2' },
              { label: 'First Class', value: '3' },
            ]

            return (
              <Select
                data={options}
                checkIconPosition='right'
                radius='xl'
                className='w-30'
                rightSection={<MdKeyboardArrowDown size={24} />}
                defaultValue={
                  form.formState.defaultValues?.CabinClass?.value !== undefined
                    ? String(form.formState.defaultValues?.CabinClass?.value)
                    : undefined
                }
                onChange={(value) => {
                  const selected = options.find((opt) => opt.value === value)
                  if (value && selected) {
                    field.onChange({
                      value: +value,
                      title: selected.label,
                    })
                  }
                }}
                classNames={{
                  input: 'bg-blue-100 text-sm font-medium border-gray-700',
                  dropdown:
                    'min-w-[265px] py-[15px] md:ml-[77px] text-xs font-semibold',
                  option:
                    'text-[17px] py-[12px] font-semibold hover:bg-blue-100 text-xs',
                }}
              />
            )
          }}
        />
      </div>
      <div className='grid grid-cols-16 items-center gap-2 md:grid-cols-25 md:gap-3'>
        <div className='relative col-span-16 gap-2 md:col-span-12 md:grid md:grid-cols-12 md:gap-3'>
          <div className='relative col-span-16 pb-2 md:col-span-6 md:p-0'>
            <RiMapPin2Line
              size={20}
              className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
            />
            <Locations
              label='Nereden'
              inputProps={{ error: !!form.formState.errors.Origin }}
              data={originLocations?.Result}
              isLoading={originLocationsIsLoading}
              defaultValue={form.getValues('Origin')?.Name}
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
          <Button
            onClick={switchWay}
            className='absolute top-1/2 right-0 z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-gray-500 bg-white md:top-1/2 md:left-1/2'
          >
            <TbArrowsRightLeft
              size={20}
              className='rotate-90 text-blue-800 transition-transform md:rotate-0'
            />
          </Button>
          <div className='relative col-span-16 md:col-span-6'>
            <RiMapPin2Line
              size={20}
              className='absolute top-1/2 left-0 z-10 mx-4 -translate-y-1/2'
            />

            <Locations
              label='Nereye?'
              inputProps={{
                error: !!form.formState.errors.Destination,
              }}
              defaultValue={form.getValues('Destination')?.Name}
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
        </div>
        <div className='relative col-span-16 md:col-span-6'>
          <RiCalendarEventLine
            size={20}
            className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
          />
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
        <div className='relative col-span-16 md:col-span-3 lg:col-span-4'>
          <RiUserLine
            size={20}
            className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
          />
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
        <div className='sm:col-grid-2 col-span-16 p-0 md:col-span-3'>
          <SearchEngineButton title='Uçuş Ara' />
        </div>
      </div>
    </form>
  )
}
