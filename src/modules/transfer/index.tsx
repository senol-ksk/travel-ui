'use client'

import { useState } from 'react'
import { useTransitionRouter } from 'next-view-transitions'
import { Button, Skeleton } from '@mantine/core'
import { useLocalStorage, useMounted } from '@mantine/hooks'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'

import { TransferCalendar } from '@/components/search-engine/calendar/transfer'
import { Locations } from '@/components/search-engine/locations/transfer/locations'
import { TransferHours } from './hour-select'
import { PassengerDropdown } from '@/components/search-engine/passengers/transfer'
import { LocationResults } from '@/components/search-engine/locations/type'
import { getTransferSearchSessionToken, request } from '@/network'
import {
  serializeTransferSearchParams,
  transferSearchEngineSchema,
  TransferSearchEngineSchemaInfer,
} from './searchParams.client'

const defaultDate = dayjs().add(5, 'day').toISOString()

const TransferSearchEngine = () => {
  const mounted = useMounted()
  const router = useTransitionRouter()
  const [transferSearchLocalStorage, setTransferSearchLocalStroge] =
    useLocalStorage<TransferSearchEngineSchemaInfer>({
      key: 'transfer-search-engine',
      getInitialValueInEffect: false,
      defaultValue: {
        date: defaultDate,
        destination: {
          Code: '',
          Id: -1,
          Slug: '',
          LocationName: '',
          PointName: '',
          Type: '',
        },
        origin: {
          Code: '',
          Id: -1,
          Slug: '',
          LocationName: '',
          PointName: '',
          Type: '',
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
    console.log('Transfer Search Data Submited', data)
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

    console.log(searchResultUrl)

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
              defaultValue={
                formActions.formState.defaultValues?.origin?.PointName
              }
              onChange={setOriginLocationInputValue}
              onSelect={(value, parentLocation) => {
                formActions.setValue('origin', {
                  Code: value.Code,
                  Id: Object.values(value.ExtentionData)[0],
                  PointName: value.Name,
                  LocationName: parentLocation
                    ? parentLocation.Name
                    : value.Name,
                  Slug: value.Slug,
                  Type: Object.values(value.ExtentionData)[1],
                })
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
                formActions.formState.defaultValues?.destination?.PointName
              }
              onChange={setDestinationLocationInputValue}
              onSelect={(value, parentLocation) => {
                formActions.setValue('destination', {
                  Code: value.Code,
                  Id: Object.values(value.ExtentionData)[0],
                  PointName: value.Name,
                  LocationName: parentLocation
                    ? parentLocation.Name
                    : value.Name,
                  Slug: value.Slug,
                  Type: Object.values(value.ExtentionData)[1],
                })
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
            initialValues={{
              adult:
                formActions.formState.defaultValues?.passengers?.adult ?? 1,
              child:
                formActions.formState.defaultValues?.passengers?.child ?? 0,
              infant:
                formActions.formState.defaultValues?.passengers?.infant ?? 0,
            }}
            onChange={(passengers) => {
              console.log(passengers)
              formActions.setValue('passengers', {
                adult: passengers.adult,
                child: passengers.child,
                infant: passengers.infant,
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
