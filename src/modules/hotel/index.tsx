import { Button, Skeleton } from '@mantine/core'
import { useLocalStorage, useMounted } from '@mantine/hooks'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'

import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { HotelCalendar } from '@/components/search-engine/calendar/hotel'
import { Locations } from '@/components/search-engine/locations/hotel/locations'
import { type LocationResults } from '@/components/search-engine/locations/hotel/type'
import { HotelPassengerDropdown } from '@/components/search-engine/passengers/hotel'
import { request } from '@/network'
import { serializeHotelSearchParams } from '@/modules/hotel/searchParams'

const schema = z.object({
  destination: z.object({
    name: z.string().min(3),
    id: z.number().or(z.string()),
    slug: z.string().min(3),
    type: z.number(),
  }),
  checkinDate: z.coerce.date(),
  checkoutDate: z.coerce.date(),
  rooms: z.array(
    z.object({
      adult: z.number(),
      child: z.number(),
      childAges: z.array(z.number()),
    })
  ),
})

type HotelSearchEngineSchemaType = z.infer<typeof schema>

export const HotelSearchEngine = () => {
  const mounted = useMounted()
  const router = useRouter()

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

  const form = useForm<HotelSearchEngineSchemaType>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: localParams,
  })
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

  const onSubmit: SubmitHandler<HotelSearchEngineSchemaType> = (data) => {
    setLocalParams(data)

    const rooms = data.rooms
      .flatMap((room) => room.adult + '-' + room.childAges.join('-'))
      .toString()

    const searchParams = serializeHotelSearchParams({
      checkinDate: data.checkinDate,
      checkoutDate: data.checkoutDate,
      destination: data.destination.name,
      slug: data.destination.slug,
      destinationId: '' + data.destination.id,
      type: data.destination.type,
      rooms,
    })

    router.push(`/hotel/search-results${searchParams}`)
  }

  if (!mounted) {
    return (
      <div className='grid gap-3 md:grid-cols-4'>
        <Skeleton visible h={50} />
        <Skeleton visible h={50} />
        <Skeleton visible h={50} />
        <Skeleton visible h={50} />
      </div>
    )
  }

  return (
    <form className='block' onSubmit={form.handleSubmit(onSubmit)}>
      <input type='hidden' {...form.register('destination')} />
      <input type='hidden' {...form.register('checkinDate')} />
      <input type='hidden' {...form.register('checkoutDate')} />
      <input type='hidden' {...form.register('rooms')} />

      <div className='grid grid-cols-12 gap-3 md:gap-3'>
        <div className='col-span-12 md:col-span-4'>
          <Locations
            label='Şehir ya da otel adı seçiniz'
            data={destinationLocation?.Result}
            isLoading={destinationLocationLoading}
            onChange={(value) => {
              setDestinationLocationInputValue(value)
            }}
            inputProps={{ error: form.formState.errors.destination?.message }}
            onSelect={(data) => {
              form.setValue('destination', {
                id: data.Id,
                name: data.Name,
                slug: data.Slug,
                type: data.Type,
              })
              form.trigger('destination')
            }}
            defaultValue={localParams.destination.name}
          />
        </div>
        <div className='col-span-12 sm:col-span-6 md:col-span-3'>
          <HotelCalendar
            defaultDates={[
              new Date(localParams.checkinDate),
              new Date(localParams.checkoutDate),
            ]}
            onDateSelect={(dates) => {
              const checkinDate = dates[0]
              const checkoutDate = dates[1]

              if (checkinDate && dayjs(checkoutDate).isValid()) {
                form.setValue('checkinDate', checkinDate)
              }

              if (checkoutDate && dayjs(checkoutDate).isValid()) {
                form.setValue('checkoutDate', checkoutDate)
              }
            }}
          />
        </div>
        <div className='col-span-12 sm:col-span-6 md:col-span-3'>
          <HotelPassengerDropdown
            initialValues={localParams.rooms}
            onChange={(params) => {
              console.log(params)

              form.setValue('rooms', params)
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
