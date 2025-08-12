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
import { request } from '@/network'
import {
  serializeTransferSearchParams,
  transferSearchEngineSchema,
  TransferSearchEngineSchemaInfer,
} from './searchParams.client'
import { SearchEngineButton } from '@/components/search-engine/search-button'
import {
  RiCalendarEventLine,
  RiMapPin2Line,
  RiTimeLine,
  RiUserLine,
} from 'react-icons/ri'
import { TbArrowsRightLeft } from 'react-icons/tb'

const defaultDate = dayjs().add(5, 'day').toISOString()

const TransferSearchEngine = () => {
  const mounted = useMounted()
  const router = useTransitionRouter()
  const [transferSearchLocalStorage, setTransferSearchLocalStorage] =
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

  const handleSubmit = async (data: TransferSearchEngineSchemaInfer) => {
    setTransferSearchLocalStorage(data)

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
      }
    )

    router.push(searchResultUrl)
  }
  const switchWay = () => {
    const origin = formActions.getValues('origin')
    const destination = formActions.getValues('destination')
    formActions.setValue('origin', destination)
    formActions.setValue('destination', origin)
    formActions.trigger(['origin', 'destination'])
  }

  if (!mounted) {
    return <Skeleton h={70} />
  }

  return (
    <form onSubmit={formActions.handleSubmit(handleSubmit)}>
      <div className='grid grid-cols-1 gap-2 md:grid-cols-34'>
        <div className='relative col-span-16 grid grid-cols-12 gap-2 md:col-span-15'>
          <div className='relative col-span-13 sm:col-span-6'>
            <RiMapPin2Line
              size={20}
              className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
            />
            <Locations
              label='Nereden'
              inputProps={{ error: !!formActions.formState.errors.origin }}
              data={originLocations?.Result}
              isLoading={originLocationsIsLoading}
              defaultValue={formActions.getValues('origin').PointName}
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
          <Button
            onClick={switchWay}
            className='absolute z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-gray-500 bg-white md:top-1/2 md:left-1/2'
          >
            <TbArrowsRightLeft
              size={20}
              className='rotate-90 text-blue-800 transition-transform md:rotate-0'
            />
          </Button>
          <div className='relative col-span-13 sm:col-span-6'>
            <RiMapPin2Line
              size={20}
              className='absolute top-1/2 left-0 z-10 mx-4 -translate-y-1/2'
            />
            <Locations
              key={formActions.getValues('destination').Slug || 'destination'}
              label='Nereye'
              inputProps={{ error: !!formActions.formState.errors.destination }}
              data={destinationLocation?.Result}
              isLoading={destinationLocationLoading}
              defaultValue={formActions.getValues('destination').PointName}
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
        <div className='relative col-span-8 md:col-span-5'>
          <RiCalendarEventLine
            size={20}
            className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
          />{' '}
          <TransferCalendar
            onDateSelect={(date) => {
              if (date) {
                formActions.setValue('date', dayjs(date).toISOString())
              }
            }}
            defaultDate={dayjs(transferSearchLocalStorage.date).toDate()}
          />
        </div>
        <div className='relative col-span-8 md:col-span-5'>
          <RiTimeLine
            size={20}
            className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
          />
          <TransferHours
            label={<div className='px-3'>Alış Saati</div>}
            onChange={(event) => {
              formActions.setValue('time', event.currentTarget.value)
            }}
            defaultValue={formActions.formState.defaultValues?.time}
          />
        </div>
        <div className='relative col-span-16 md:col-span-5'>
          <RiUserLine
            size={20}
            className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
          />
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
              formActions.setValue('passengers', {
                adult: passengers.adult,
                child: passengers.child,
                infant: passengers.infant,
              })
            }}
          />
        </div>
        <div className='col-span-16 md:col-span-4'>
          <SearchEngineButton />
        </div>
      </div>
    </form>
  )
}

export { TransferSearchEngine }
