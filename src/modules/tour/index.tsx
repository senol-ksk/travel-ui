'use client'

import { Button, Skeleton } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import dayjs from 'dayjs'
import { useTransitionRouter } from 'next-view-transitions'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalStorage, useMounted } from '@mantine/hooks'

import { TourCalendar } from '@/components/search-engine/calendar/tour'
import { TourLocations } from '@/components/search-engine/locations/tour/locations'
import { LocationResults } from '@/components/search-engine/locations/type'
import { request } from '@/network'
import { serializeTourSearchParams } from './searchResultParams'
import { SearchEngineButton } from '@/components/search-engine/search-button'
import { RiMapPin2Line } from 'react-icons/ri'

const defaultDates = [
  dayjs().add(3, 'd').toDate(),
  dayjs().add(100, 'd').toDate(),
]

const schema = z.object({
  destination: z.object({
    name: z.string().min(3),
    slug: z.string().min(3),
  }),
  checkinDate: z.coerce.date(),
  checkoutDate: z.coerce.date(),
})

type TourSearchEngineSchemaType = z.infer<typeof schema>

const TourSearchEngine = () => {
  const mounted = useMounted()
  const router = useTransitionRouter()

  const [localParams, setLocalParams] =
    useLocalStorage<TourSearchEngineSchemaType>({
      key: 'tour-search',
      getInitialValueInEffect: false,
      defaultValue: {
        checkinDate: defaultDates[0],
        checkoutDate: defaultDates[1],
        destination: {
          name: '',
          slug: '',
        },
      },
    })

  const formActions = useForm<TourSearchEngineSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: localParams,
  })

  const [destinationLocationInputValue, setDestinationLocationInputValue] =
    useState('')
  const { data: destinationLocation, isLoading: destinationLocationLoading } =
    useQuery<LocationResults>({
      queryKey: ['tour-locations', destinationLocationInputValue],
      enabled:
        !!destinationLocationInputValue &&
        destinationLocationInputValue.length > 2,
      queryFn: async () => {
        const getLocations = await request({
          //https://apipfn.lidyateknoloji.com/d/v1.1/api/tour/searchdomestic?s=balka&id=&scope=2d932774-a9d8-4df9-aae7-5ad2727da1c7
          //          url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/tour/search`,
          url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/tour/search`,
          params: {
            s: destinationLocationInputValue,
            id: null,
            scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
          },
        })

        return getLocations
      },
    })

  const handleSubmit = (data: TourSearchEngineSchemaType) => {
    setLocalParams(data)

    const url = serializeTourSearchParams('/tour/search-results', {
      checkinDate: data.checkinDate,
      checkoutDate: data.checkoutDate,
      destinationSlug: data.destination.slug,
    })

    router.push(url)
  }

  if (!mounted) {
    return (
      <div className='grid grid-cols-12 gap-3 md:grid-cols-3 md:gap-3'>
        <Skeleton height={40} radius={'lg'} />
        <Skeleton height={40} radius={'lg'} />
        <Skeleton height={40} radius={'lg'} />
      </div>
    )
  }

  return (
    <form onSubmit={formActions.handleSubmit(handleSubmit)}>
      <div className='grid grid-cols-12 gap-3 md:gap-3'>
        <div className='relative col-span-12 grid gap-3 md:col-span-7'>
          <RiMapPin2Line
            size={20}
            className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
          />
          <TourLocations
            label='Şehir, Ülke veya Tur Adı'
            isLoading={destinationLocationLoading}
            data={destinationLocation?.Result}
            onChange={(value) => {
              setDestinationLocationInputValue(value)
            }}
            inputProps={{
              error: formActions.formState.errors.destination?.name?.message,
            }}
            onSelect={(data) => {
              formActions.setValue('destination', {
                name: data.Name,
                slug: data.Slug,
              })
              formActions.trigger('destination')
            }}
            defaultValue={
              formActions.formState.defaultValues?.destination?.name
            }
          />
        </div>
        <div className='col-span-12 grid gap-3 md:col-span-3'>
          <TourCalendar
            defaultDates={[
              dayjs(formActions.formState.defaultValues?.checkinDate).toDate(),
              dayjs(formActions.formState.defaultValues?.checkoutDate).toDate(),
            ]}
            onDateSelect={(dates) => {
              const checkinDate = dates[0]
              const checkoutDate = dates[1]

              if (checkinDate && dayjs(checkoutDate).isValid()) {
                formActions.setValue('checkinDate', new Date(checkinDate))
              }

              if (checkoutDate && dayjs(checkoutDate).isValid()) {
                formActions.setValue('checkoutDate', new Date(checkoutDate))
              }
            }}
          />
        </div>
        <div className='col-span-12 grid gap-3 md:col-span-2'>
          <SearchEngineButton />
        </div>
      </div>
    </form>
  )
}

export { TourSearchEngine }
