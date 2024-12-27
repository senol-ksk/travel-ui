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
import { createSerializer, parseAsString, parseAsIsoDate } from 'nuqs/server'

import { BusLocations } from '@/components/search-engine/locations/bus/locations'
import { LocationResults } from '@/components/search-engine/locations/type'
import { getBusSearchSessionToken, getSessionToken, request } from '@/network'
import { BusCalendar } from '@/components/search-engine/calendar/bus'
import { useRouter } from 'next/navigation'
import { serializeBusSearchParams } from './searchParmas'

dayjs.extend(isToday)
dayjs.extend(isTomorrow)

const busSearhEngineSchema = z.object({
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

type BusSearchEngineInfer = z.infer<typeof busSearhEngineSchema>

const BusSearchEngine = () => {
  const mounted = useMounted()
  const router = useRouter()

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
    resolver: zodResolver(busSearhEngineSchema),
    defaultValues: localStorageData,
  })

  const [departurDate, setDepartureDate] = useState(localStorageData.Date)

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

  const searchSessionTokenQuery = useMutation({
    mutationKey: ['bus-search-session-token', localStorageData],
    mutationFn: getBusSearchSessionToken,
  })

  const handleSubmit = async (data: BusSearchEngineInfer) => {
    setLocalStorageData(data)

    const tokens = await searchSessionTokenQuery.mutateAsync()

    const url = serializeBusSearchParams('/bus/search-results', {
      originId: data.Origin.Id,
      destinationId: data.Destination.Id,
      destinationSlug: data.Destination.Slug,
      originSlug: data.Origin.Slug,
      date: data.Date,
      searchToken: tokens.searchToken,
      sessionToken: tokens.sessionToken,
    })

    router.push(url)
  }

  if (!mounted) return <Skeleton h={50} />

  return (
    <form className='block' onSubmit={formActions.handleSubmit(handleSubmit)}>
      <div className='grid grid-cols-12 gap-3 md:gap-3'>
        <div className='col-span-12 grid gap-3 md:col-span-7 md:grid-cols-6'>
          <div className='col-span-3'>
            <BusLocations
              label='Nereden'
              data={pickupLocationData?.Result}
              isLoading={pickupLocationDataIsLoading}
              defaultValue={localStorageData.Origin.Name}
              onChange={(value) => {
                setPickupLocation(value)
              }}
              onSelect={(value) => {
                const extentionId = Object.values(value.ExtentionData).at(0)

                if (extentionId) {
                  formActions.setValue('Origin', {
                    Id: extentionId,
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
          <div className='relative col-span-3'>
            <BusLocations
              label='Nereye'
              data={targeLocationData?.Result}
              isLoading={targetLocationDataIsLoading}
              defaultValue={localStorageData.Destination.Name}
              onChange={(value) => {
                setTargetLocation(value)
              }}
              onSelect={(value) => {
                const extentionId = Object.values(value.ExtentionData).at(0)

                if (extentionId) {
                  formActions.setValue('Destination', {
                    Id: extentionId,
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
        <div className='relative col-span-12 md:col-span-2'>
          <div className='relative'>
            <BusCalendar
              defaultDate={new Date(departurDate)}
              onDateSelect={(date) => {
                if (date) {
                  setDepartureDate(date)
                  formActions.setValue('Date', date)
                }
              }}
            />
          </div>
        </div>
        <div className='col-span-12 md:col-span-1'>
          <Stack gap={10}>
            <Radio
              checked={dayjs(departurDate).isToday()}
              label='Bugün'
              onChange={(event) => {
                if (event.target.checked) {
                  setDepartureDate(new Date())
                  formActions.setValue('Date', new Date())
                }
              }}
            />
            <Radio
              checked={dayjs(departurDate).isTomorrow()}
              label='Yarın'
              onChange={(event) => {
                if (event.target.checked) {
                  setDepartureDate(dayjs().add(1, 'd').toDate())
                  formActions.setValue('Date', dayjs().add(1, 'd').toDate())
                }
              }}
            />
          </Stack>
        </div>
        <div className='col-span-12 md:col-span-2'>
          <Button
            type='submit'
            className='w-full md:h-full'
            loading={searchSessionTokenQuery.isPending}
            disabled={searchSessionTokenQuery.isPending}
          >
            Ara
          </Button>
        </div>
      </div>
    </form>
  )
}

export { BusSearchEngine }