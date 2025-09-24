'use client'

import { useState } from 'react'

import { Skeleton } from '@mantine/core'
import { useLocalStorage, useMounted } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useTransitionRouter } from 'next-view-transitions'

import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { HotelCalendar } from '@/components/search-engine/calendar/hotel'
import { Locations } from '@/components/search-engine/locations/hotel/locations'
import { type LocationResults } from '@/components/search-engine/locations/hotel/type'
import { HotelPassengerDropdown } from '@/components/search-engine/passengers/hotel'
import { request } from '@/network'
import {
  HotelRoomOptionTypes,
  HotelSearchEngineSchemaType,
  searchEngineSchema,
  serializeHotelSearchParams,
} from '@/modules/hotel/searchParams'
import { SearchEngineButton } from '@/components/search-engine/search-button'
import { RiMapPin2Line } from 'react-icons/ri'

type IProps = {
  defaultValues?: HotelSearchEngineSchemaType
}

const defaultDates = [
  dayjs().add(3, 'd').toDate(),
  dayjs().add(7, 'd').toDate(),
]
const defaultRoom = [
  {
    adult: 2,
    child: 0,
    childAges: [],
  },
]

export const HotelSearchEngine: React.FC<IProps> = ({ defaultValues }) => {
  const mounted = useMounted()
  const router = useTransitionRouter()

  const [localParams, setLocalParams] =
    useLocalStorage<HotelSearchEngineSchemaType>({
      key: 'hotel-search-engine',
      getInitialValueInEffect: false,
      defaultValue: {
        checkinDate: defaultDates[0],
        checkoutDate: defaultDates[1],
        destination: {
          id: 0,
          name: '',
          slug: '',
          type: 0,
        },
        rooms: defaultRoom,
      },
    })

  if (dayjs(localParams.checkinDate).isBefore(dayjs())) {
    setLocalParams({
      ...localParams,
      checkinDate: defaultDates[0],
      checkoutDate: defaultDates[1],
    })
  }

  const form = useForm<HotelSearchEngineSchemaType>({
    resolver: zodResolver(searchEngineSchema),
    mode: 'onChange',
    defaultValues: defaultValues ?? localParams,
  })

  const [destinationLocationInputValue, setDestinationLocationInputValue] =
    useState('')
  const { data: destinationLocation, isLoading: destinationLocationLoading } =
    useQuery<LocationResults>({
      queryKey: ['hotel-locations', destinationLocationInputValue],
      enabled:
        !!destinationLocationInputValue &&
        destinationLocationInputValue.length > 2,
      queryFn: async () => {
        const getLocations = await request({
          url: `${process.env.API_DESTINATION_ROUTE}/v1.1/api/hotel/search`,
          params: {
            s: destinationLocationInputValue,
            id: null,
            scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
          },
        })

        return getLocations
      },
    })

  const onSubmit: SubmitHandler<HotelSearchEngineSchemaType> = (data) => {
    // setLocalParams(data)

    const searchParams = serializeHotelSearchParams('/hotel/search-results', {
      checkinDate: data.checkinDate,
      checkoutDate: data.checkoutDate,
      destination: data.destination.name,
      slug: data.destination.slug,
      destinationId: '' + data.destination.id,
      type: data.destination.type,
      rooms: data.rooms,
    })

    router.push(searchParams)
  }

  if (!mounted) {
    return <Skeleton h={50} radius={'md'} />
  }

  return (
    <form className='block' onSubmit={form.handleSubmit(onSubmit)}>
      <input type='hidden' {...form.register('destination')} />
      <input type='hidden' {...form.register('checkinDate')} />
      <input type='hidden' {...form.register('checkoutDate')} />
      <input type='hidden' {...form.register('rooms')} />

      <div className='grid grid-cols-17 gap-3 md:gap-3'>
        <div className='relative col-span-17 md:col-span-5'>
          <RiMapPin2Line
            size={20}
            className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
          />
          <Locations
            label='Nereye gitmek istersiniz?'
            data={destinationLocation?.Result}
            isLoading={destinationLocationLoading}
            onChange={(value) => {
              setDestinationLocationInputValue(value)
            }}
            inputProps={{ error: !!form.formState.errors.destination }}
            onSelect={(data) => {
              form.setValue('destination', {
                id: data.Id,
                name: data.Name,
                slug: data.Slug,
                type: data.Type,
              })
              form.trigger('destination')
            }}
            defaultValue={form.formState.defaultValues?.destination?.name}
          />
        </div>
        <div className='col-span-17 sm:col-span-6 md:col-span-5'>
          <HotelCalendar
            defaultDates={[
              new Date(
                form?.formState?.defaultValues?.checkinDate ?? defaultDates[0]
              ),
              new Date(
                form?.formState?.defaultValues?.checkoutDate ?? defaultDates[1]
              ),
            ]}
            onDateSelect={(dates) => {
              const checkinDate = dates[0]
              const checkoutDate = dates[1]

              if (checkinDate && dayjs(checkoutDate).isValid()) {
                form.setValue('checkinDate', new Date(checkinDate))
              }

              if (checkoutDate && dayjs(checkoutDate).isValid()) {
                form.setValue('checkoutDate', new Date(checkoutDate))
              }
            }}
          />
        </div>
        <div className='col-span-17 sm:col-span-6 md:col-span-5'>
          <HotelPassengerDropdown
            initialValues={
              form.formState.defaultValues?.rooms as HotelRoomOptionTypes[]
            }
            onChange={(params) => {
              form.setValue('rooms', params)
            }}
          />
        </div>
        <div className='col-span-17 flex grow-0 md:col-span-2'>
          <SearchEngineButton />
        </div>
      </div>
    </form>
  )
}
