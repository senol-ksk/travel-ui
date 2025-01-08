import { Button, Skeleton } from '@mantine/core'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'

import { TourCalendar } from '@/components/search-engine/calendar/tour'
import { TourLocations } from '@/components/search-engine/locations/tour/locations'
import { LocationResults } from '@/components/search-engine/locations/type'
import { request } from '@/network'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocalStorage, useMounted } from '@mantine/hooks'
import { serializeTourSearchParams } from './searchResultParams'

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
  const router = useRouter()

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
          //https://apipfn.lidyateknoloji.com/d/v1.1/api/tour/search?s=balkan&id=&scope=aa2eff06-6a09-4320-bae2-a82f9504ff19
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
    console.log('Tour search engine submitdata', data)
    setLocalParams(data)
    //destination=balkan-turlari?checkinDate=2025-01-07&checkoutDate=2025-08-31
    const url = serializeTourSearchParams('/tour/search-results', {
      checkinDate: data.checkinDate,
      checkoutDate: data.checkoutDate,
      destination: data.destination.slug,
    })

    console.log(url)
    router.push(url)
  }

  // console.log(formActions.formState.defaultValues)

  if (!mounted) return <Skeleton height={50} radius={'lg'} />

  return (
    <form onSubmit={formActions.handleSubmit(handleSubmit)}>
      <div className='grid grid-cols-12 gap-3 md:gap-3'>
        <div className='col-span-12 grid gap-3 md:col-span-7'>
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
                formActions.setValue('checkinDate', checkinDate)
              }

              if (checkoutDate && dayjs(checkoutDate).isValid()) {
                formActions.setValue('checkoutDate', checkoutDate)
              }
            }}
          />
        </div>
        <div className='col-span-12 grid gap-3 md:col-span-2'>
          <Button className='mx-auto min-h-full md:w-full' type='submit'>
            Ara
          </Button>
        </div>
      </div>
    </form>
  )
}

export { TourSearchEngine }
