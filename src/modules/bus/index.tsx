'use client'

import { useState } from 'react'
import { Button, Radio, Skeleton, Stack } from '@mantine/core'
import { useLocalStorage, useMounted } from '@mantine/hooks'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { BusLocations } from '@/components/search-engine/locations/bus/locations'
import { LocationResults } from '@/components/search-engine/locations/type'
import { getBusSearchSessionToken, request } from '@/network'
import { BusCalendar } from '@/components/search-engine/calendar/bus'
import { useTransitionRouter } from 'next-view-transitions'
import { serializeBusSearchParams } from './searchParams'
import { SearchEngineButton } from '@/components/search-engine/search-button'
import { RiMapPin2Line } from 'react-icons/ri'
import { TbArrowsRightLeft } from 'react-icons/tb'

dayjs.extend(isToday)
dayjs.extend(isTomorrow)

const busSearchEngineSchema = z.object({
  Date: z.coerce.date(),
  Origin: z.object({
    Id: z.string().nonempty(),
    Name: z.string().nonempty(),
    Slug: z.string().nonempty(),
  }),
  Destination: z.object({
    Id: z.string().nonempty(),
    Name: z.string().nonempty(),
    Slug: z.string().nonempty(),
  }),
})

type BusSearchEngineInfer = z.infer<typeof busSearchEngineSchema>

const BusSearchEngine = () => {
  const mounted = useMounted()
  const router = useTransitionRouter()

  const [localStorageData, setLocalStorageData] =
    useLocalStorage<BusSearchEngineInfer>({
      key: 'bus-search-engine',
      getInitialValueInEffect: false,
      defaultValue: {
        Date: dayjs().add(1, 'd').toDate(),
        Destination: {
          Id: '0',
          Name: '',
          Slug: '',
        },
        Origin: {
          Id: '0',
          Name: '',
          Slug: '',
        },
      },
    })

  const formActions = useForm<BusSearchEngineInfer>({
    resolver: zodResolver(busSearchEngineSchema),
    defaultValues: {
      ...localStorageData,
      Date: dayjs().isAfter(localStorageData.Date, 'day')
        ? dayjs().add(1, 'd').toDate()
        : dayjs(localStorageData.Date).toDate(),
    },
  })

  const [pickupLocation, setPickupLocation] = useState('')
  const [targetLocation, setTargetLocation] = useState('')

  const { data: pickupLocationData, isLoading: pickupLocationDataIsLoading } =
    useQuery<LocationResults>({
      queryKey: ['car-locations', pickupLocation],
      enabled: !!pickupLocation && pickupLocation.length > 2,
      queryFn: async () => {
        const getLocations = await request({
          url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/bus/search`,
          params: {
            s: pickupLocation,
            id: null,
            scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
          },
        })

        return getLocations
      },
    })

  const { data: targeLocationData, isLoading: targetLocationDataIsLoading } =
    useQuery<LocationResults>({
      queryKey: ['car-locations', targetLocation],
      enabled: !!targetLocation && targetLocation.length > 2,
      queryFn: async () => {
        const getLocations = await request({
          url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/bus/search`,
          params: {
            s: targetLocation,
            id: null,
            scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
          },
        })

        return getLocations
      },
    })

  const handleSubmit = async (data: BusSearchEngineInfer) => {
    setLocalStorageData(data)

    const url = serializeBusSearchParams('/bus/search-results', {
      originId: data.Origin.Id,
      destinationId: data.Destination.Id,
      destinationSlug: data.Destination.Slug,
      originSlug: data.Origin.Slug,
      date: data.Date,
      // searchToken: tokens.searchToken,
      // sessionToken: tokens.sessionToken,
    })

    router.push(url)
  }
  const switchWay = () => {
    const origin = formActions.getValues('Origin')
    const destination = formActions.getValues('Destination')
    formActions.setValue('Origin', destination)
    formActions.setValue('Destination', origin)
  }
  if (!mounted) return <Skeleton h={50} />

  return (
    <form className='block' onSubmit={formActions.handleSubmit(handleSubmit)}>
      <div className='grid grid-cols-12 gap-3 md:grid-cols-25 md:gap-3'>
        <div className='relative col-span-12 grid gap-3 md:col-span-15 md:grid-cols-14'>
          <div className='relative col-span-7'>
            <RiMapPin2Line
              size={20}
              className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
            />
            <BusLocations
              key={formActions.watch('Origin').Slug || 'origin'}
              label='Nereden'
              data={pickupLocationData?.Result}
              isLoading={pickupLocationDataIsLoading}
              defaultValue={formActions.getValues('Origin').Name}
              onChange={(value) => {
                setPickupLocation(value)
              }}
              onSelect={(value) => {
                const extensionId = Object.values(value.ExtentionData).at(0)

                if (extensionId) {
                  formActions.setValue('Origin', {
                    Id: extensionId,
                    Name: value.Name,
                    Slug: value.Slug,
                  })
                }
              }}
              inputProps={{
                error: !!formActions.formState.errors.Origin,
              }}
            />
          </div>
          <Button
            onClick={switchWay}
            className='absolute z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-gray-500 bg-white md:top-1/2 md:left-1/2'
          >
            <TbArrowsRightLeft
              size={20}
              className='rotate-90 text-blue-800 transition-transform md:rotate-0'
            />
          </Button>
          <div className='relative col-span-7'>
            <RiMapPin2Line
              size={20}
              className='absolute top-1/2 left-0 z-10 mx-4 -translate-y-1/2'
            />
            <BusLocations
              key={formActions.watch('Destination').Slug || 'destination'}
              label='Nereye'
              data={targeLocationData?.Result}
              isLoading={targetLocationDataIsLoading}
              defaultValue={formActions.getValues('Destination').Name}
              onChange={(value) => {
                setTargetLocation(value)
              }}
              onSelect={(value) => {
                const extensionId = Object.values(value.ExtentionData).at(0)

                if (extensionId) {
                  formActions.setValue('Destination', {
                    Id: extensionId,
                    Name: value.Name,
                    Slug: value.Slug,
                  })
                }
              }}
              inputProps={{
                error: !!formActions.formState.errors.Destination,
              }}
            />
          </div>
        </div>
        <div className='relative col-span-12 md:col-span-5'>
          <div className='relative h-full'>
            <BusCalendar
              defaultDate={formActions.getValues('Date')}
              onDateSelect={(date) => {
                if (date) {
                  formActions.setValue('Date', new Date(date), {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  })
                }
              }}
            />
          </div>
        </div>
        <div className='col-span-12 md:col-span-2'>
          <div className='flex flex-row gap-8 md:flex-col md:gap-3'>
            <Radio
              checked={dayjs(formActions.getValues('Date')).isToday()}
              label='Bugün'
              onChange={(event) => {
                if (event.target.checked) {
                  formActions.setValue('Date', new Date())
                  formActions.trigger('Date')
                }
              }}
            />
            <Radio
              checked={dayjs(formActions.getValues('Date')).isTomorrow()}
              label='Yarın'
              onChange={(event) => {
                if (event.target.checked) {
                  formActions.setValue('Date', dayjs().add(1, 'd').toDate())
                  formActions.trigger('Date')
                }
              }}
            />
          </div>
        </div>
        <div className='col-span-12 md:col-span-3'>
          {/* <Button
            type='submit'
            className='w-full md:h-full'
            loading={searchSessionTokenQuery.isPending}
          >
            Ara
          </Button> */}
          <SearchEngineButton />
        </div>
      </div>
    </form>
  )
}

export { BusSearchEngine }
