'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Skeleton } from '@mantine/core'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { TransferCalendar } from '@/components/search-engine/calendar/transfer'
import { Locations } from '@/components/search-engine/locations/transfer/locations'
import { TransferHours } from './hour-select'
import { PassengerDropdown } from '@/components/search-engine/passengers/transfer'
import { LocationResults } from '@/components/search-engine/locations/type'
import { getTransferSearchSessionToken, request } from '@/network'
import { useLocalStorage, useMounted } from '@mantine/hooks'
import dayjs from 'dayjs'
import { serializeTransferSearchParams } from './searchParams.client'

const transferSearchEngineSchema = z.object({
  origin: z.object({
    Id: z.string().or(z.number()),
    Code: z.string(),
    Name: z.string(),
    Slug: z.string().nonempty(),
  }),
  destination: z.object({
    Id: z.string().or(z.number()),
    Code: z.string(),
    Name: z.string(),
    Slug: z.string().nonempty(),
  }),
  date: z.string(),
  time: z.string(),
  passengers: z.object({
    adult: z.number().min(1),
    child: z.number().min(0),
    infant: z.number().min(0),
  }),
})

type TransferSearchEngineSchemaInfer = z.infer<
  typeof transferSearchEngineSchema
>

const defaultDate = dayjs().add(5, 'day').toISOString()

const TransferSearchEngine = () => {
  const mounted = useMounted()
  const router = useRouter()
  const [transferSearchLocalStorage, setTransferSearchLocalStroge] =
    useLocalStorage<TransferSearchEngineSchemaInfer>({
      key: 'transfer-search-engine',
      getInitialValueInEffect: false,
      defaultValue: {
        date: defaultDate,
        destination: {
          Code: '',
          Id: -1,
          Name: '',
          Slug: '',
        },
        origin: {
          Code: '',
          Id: -1,
          Name: '',
          Slug: '',
        },
        passengers: {
          adult: 1,
          child: 0,
          infant: 0,
        },
        time: '12:00',
      },
    })

  const formActions = useForm<TransferSearchEngineSchemaInfer>({
    resolver: zodResolver(transferSearchEngineSchema),
    defaultValues: transferSearchLocalStorage,
  })

  const [originLocationInputValue, setOriginLocationInputValue] = useState('')
  const [destinationLocationInputValue, setDestinationLocationInputValue] =
    useState('')

  const { data: originLocations, isLoading: originLocationsIsLoading } =
    useQuery<LocationResults>({
      queryKey: ['flight-locations', originLocationInputValue],
      enabled:
        !!originLocationInputValue && originLocationInputValue.length > 2,
      queryFn: async () => {
        const getLocations = await request({
          url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/transfer/search`,
          params: {
            s: originLocationInputValue,
            id: null,
            scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
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
        destinationLocationInputValue.length > 2,
      queryFn: async () => {
        const getLocations = await request({
          url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/transfer/search`,
          params: {
            s: destinationLocationInputValue,
            id: null,
            scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
          },
        })

        return getLocations
      },
    })

  const sessionSearchTokenMutation = useMutation({
    mutationKey: ['session-search-token'],
    mutationFn: getTransferSearchSessionToken,
  })

  const handleSubmit = async (data: TransferSearchEngineSchemaInfer) => {
    setTransferSearchLocalStroge(data)

    const { searchToken, sessionToken } =
      await sessionSearchTokenMutation.mutateAsync()

    const searchResultUrl = serializeTransferSearchParams(
      '/transfer/search-results',
      {
        date: dayjs(data.date).toDate(),
        destinationSlug: data.destination.Slug,
        originSlug: data.origin.Slug,
        time: data.time,
        destinationId: '' + data.destination.Id,
        originId: '' + data.origin.Id,
        adultPassengerCount: data.passengers.adult,
        babyPassengerCount: data.passengers.infant,
        childrenPassengerCount: data.passengers.child,
        searchToken,
        sessionToken,
      }
    )

    router.push(searchResultUrl)
  }

  if (!mounted) {
    return <Skeleton h={70} />
  }

  return (
    <form onSubmit={formActions.handleSubmit(handleSubmit)}>
      <div className='grid grid-cols-12 gap-2 md:gap-4'>
        <div className='col-span-12 grid grid-cols-12 gap-2 md:col-span-5 md:gap-4'>
          <div className='col-span-12 sm:col-span-6'>
            <Locations
              label='Nereden'
              inputProps={{ error: !!formActions.formState.errors.origin }}
              data={originLocations?.Result}
              isLoading={originLocationsIsLoading}
              defaultValue={formActions.formState.defaultValues?.origin?.Name}
              onChange={setOriginLocationInputValue}
              onSelect={(value) => {
                formActions.setValue('origin', value)
              }}
            />
          </div>
          <div className='col-span-12 sm:col-span-6'>
            <Locations
              label='Nereye'
              inputProps={{ error: !!formActions.formState.errors.destination }}
              data={destinationLocation?.Result}
              isLoading={destinationLocationLoading}
              defaultValue={
                formActions.formState.defaultValues?.destination?.Name
              }
              onChange={setDestinationLocationInputValue}
              onSelect={(value) => {
                formActions.setValue('destination', value)
              }}
            />
          </div>
        </div>
        <div className='col-span-4 md:col-span-2'>
          <TransferCalendar
            onDateSelect={(date) => {
              if (date) {
                formActions.setValue('date', dayjs(date).toISOString())
              }
            }}
            defaultDate={dayjs(transferSearchLocalStorage.date).toDate()}
          />
        </div>
        <div className='col-span-4 md:col-span-2'>
          <TransferHours
            label='Saat'
            onChange={(event) => {
              formActions.setValue('time', event.currentTarget.value)
            }}
            defaultValue={formActions.formState.defaultValues?.time}
          />
        </div>
        <div className='col-span-4 md:col-span-2'>
          <PassengerDropdown
            onChange={(passengers) => {
              formActions.setValue('passengers', {
                adult: passengers.adult ?? 1,
                child: passengers.child ?? 0,
                infant: passengers.infant ?? 0,
              })
            }}
          />
        </div>
        <div className='col-span-12 md:col-span-1'>
          <Button
            type='submit'
            className='mx-auto w-full md:size-full'
            loading={sessionSearchTokenMutation.isPending}
          >
            Ara
          </Button>
        </div>
      </div>
    </form>
  )
}

export { TransferSearchEngine }
