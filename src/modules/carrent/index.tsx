'use client'

import { Controller, useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button, Checkbox, NativeSelect, Skeleton } from '@mantine/core'
import { range, useLocalStorage, useMounted } from '@mantine/hooks'
import clsx from 'clsx'
import { useState } from 'react'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { useTransitionRouter } from 'next-view-transitions'

import { request } from '@/network'
import { CarHours } from './hour-select'
import { CarCalendar } from '@/components/search-engine/calendar/car'
import { CarLocations } from '@/components/search-engine/locations/car/locations'
import type { LocationResults } from '@/components/search-engine/locations/type'
import { carSearchEngineSchema, CarSearchEngineSchemaTypeInfer } from './types'
import { serializeCarSearchParams } from './searchParams'
import { SearchEngineButton } from '@/components/search-engine/search-button'
import { RiMapPin2Line, RiTimeLine } from 'react-icons/ri'
import { MdKeyboardArrowDown } from 'react-icons/md'

const defaultDates = {
  drop_date: dayjs().add(2, 'day').toDate(),
  pickup_date: dayjs().add(3, 'day').toDate(),
}

const CarRentSearchPanel: React.FC = () => {
  const router = useTransitionRouter()
  const [carSearchLocalStorage, setCarSearchLocalStroge] =
    useLocalStorage<CarSearchEngineSchemaTypeInfer>({
      key: 'car-search-engine',
      getInitialValueInEffect: false,
      defaultValue: {
        driverAge: 26,
        drop_date: defaultDates.drop_date,
        pickup_date: defaultDates.pickup_date,
        drop_time: dayjs().add(2, 'hours').format('HH:00'),
        pickup_time: dayjs().format('HH:00'),
        dropoff: {
          Code: '',
          CountryCode: '',
          Id: -1,
          IsDomestic: false,
          Name: '',
          Slug: '',
        },
        pickup: {
          Slug: '',
          Code: '',
          CountryCode: '',
          Id: -1,
          IsDomestic: false,
          Name: '',
        },
        isDiffrentLocation: false,
      },
    })
  const mounted = useMounted()
  const [isDiffrentDropLocation, setIsDiffrentLocation] = useState(
    carSearchLocalStorage.isDiffrentLocation
  )
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')

  const { data: pickupLocationData, isLoading: pickupLocationDataIsLoading } =
    useQuery<LocationResults>({
      queryKey: ['car-locations', pickupLocation],
      enabled: !!pickupLocation && pickupLocation.length > 2,
      queryFn: async () => {
        const getLocations = await request({
          url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/carrental/search`,
          params: {
            s: pickupLocation,
            id: null,
            scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
          },
        })

        return getLocations
      },
    })
  const { data: dropoffLocationData, isLoading: dropoffLocationIsLoading } =
    useQuery<LocationResults>({
      queryKey: ['car-locations', dropoffLocation],
      enabled: !!dropoffLocation && dropoffLocation.length > 2,
      queryFn: async () => {
        const getLocations = await request({
          url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/carrental/search`,
          params: {
            s: dropoffLocation,
            id: null,
            scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
          },
        })

        return getLocations
      },
    })

  const formActions = useForm<CarSearchEngineSchemaTypeInfer>({
    resolver: zodResolver(carSearchEngineSchema),
    defaultValues: carSearchLocalStorage,
  })

  const onSubmit: SubmitHandler<CarSearchEngineSchemaTypeInfer> = (data) => {
    setCarSearchLocalStroge(data)

    const url = serializeCarSearchParams('/car/search-results', {
      driverAge: data.driverAge,
      drop_date: data.drop_date,
      drop_time: data.drop_time,
      dropoff: !data.isDiffrentLocation ? data.pickup.Slug : data.dropoff.Slug,
      pickup: data.pickup.Slug,
      pickup_date: data.pickup_date,
      pickup_time: data.pickup_time,
    })

    router.push(url)
  }

  if (!mounted) return <Skeleton h={50} />

  return (
    <form className='block' onSubmit={formActions.handleSubmit(onSubmit)}>
      <input {...formActions.register('pickup')} type='hidden' />
      <input {...formActions.register('dropoff')} type='hidden' />
      <input {...formActions.register('pickup_date')} type='hidden' />
      <input {...formActions.register('drop_date')} type='hidden' />

      <div className='grid grid-cols-16 gap-3 md:grid-cols-25 md:gap-3'>
        <div className='col-span-16 h-full md:col-span-7'>
          <div className='grid h-full grid-cols-6 gap-3'>
            <div
              className={clsx('relative col-span-6 h-full', {
                'relative md:col-span-3': isDiffrentDropLocation,
                'relative md:col-span-6': !isDiffrentDropLocation,
              })}
            >
              <RiMapPin2Line
                size={20}
                className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
              />
              <CarLocations
                inputProps={{
                  error: !!formActions.formState.errors.pickup,
                }}
                label='Alış Yeri'
                data={pickupLocationData?.Result}
                isLoading={pickupLocationDataIsLoading}
                onChange={(value) => {
                  setPickupLocation(value)
                }}
                onSelect={(data) => {
                  const value = {
                    Code: data.Code,
                    CountryCode: data.CountryCode,
                    Id: data.Id,
                    IsDomestic: data.IsDomestic,
                    Name: data.Name,
                    Slug: data.Slug,
                  }

                  if (!isDiffrentDropLocation) {
                    formActions.setValue('dropoff', value)
                    formActions.trigger('dropoff')
                  }
                  formActions.setValue('pickup', value)
                  formActions.trigger('pickup')
                }}
                defaultValue={formActions.formState.defaultValues?.pickup?.Name}
              />
            </div>
            {isDiffrentDropLocation ? (
              <div className='relative col-span-6 md:col-span-3'>
                <RiMapPin2Line
                  size={20}
                  className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
                />
                <CarLocations
                  inputProps={{
                    error: !!formActions.formState.errors.dropoff,
                  }}
                  isLoading={dropoffLocationIsLoading}
                  label='Bırakılış Yeri'
                  data={dropoffLocationData?.Result}
                  onChange={(value) => {
                    setDropoffLocation(value)
                  }}
                  onSelect={(data) => {
                    const value = {
                      Code: data.Code,
                      CountryCode: data.CountryCode,
                      Id: data.Id,
                      IsDomestic: data.IsDomestic,
                      Slug: data.Slug,
                      Name: data.Name,
                    }
                    formActions.setValue('dropoff', value)
                    formActions.trigger('dropoff')
                  }}
                  defaultValue={
                    formActions.formState.defaultValues?.dropoff?.Name
                  }
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className='col-span-16 md:col-span-7'>
          <CarCalendar
            defaultDates={[
              dayjs(
                formActions.formState.defaultValues?.pickup_date
              ).toDate() ?? defaultDates.pickup_date,
              dayjs(formActions.formState.defaultValues?.drop_date).toDate() ??
                defaultDates.drop_date,
            ]}
            onDateSelect={(dates) => {
              if (dates[0]) {
                formActions.setValue('pickup_date', new Date(dates[0]))
              }
              if (dates[1]) {
                formActions.setValue('drop_date', new Date(dates[1]))
              }
            }}
          />
        </div>
        <div className='relative col-span-8 font-normal md:col-span-4'>
          <RiTimeLine
            size={20}
            className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
          />
          <MdKeyboardArrowDown
            size={20}
            className='absolute top-1/2 right-0 z-10 mx-2 -translate-y-1/2'
          />

          <CarHours
            label={<div className='px-3'>Alış Saati</div>}
            onChange={(event) => {
              const value = event.currentTarget.value
              formActions.setValue('pickup_time', value)
            }}
            defaultValue={
              formActions.formState.defaultValues?.pickup_time ?? '12:00'
            }
          />
        </div>
        <div className='relative col-span-8 md:col-span-4'>
          <RiTimeLine
            size={20}
            className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
          />
          <MdKeyboardArrowDown
            size={20}
            className='absolute top-1/2 right-0 z-10 mx-2 -translate-y-1/2'
          />
          <CarHours
            label={<div className='px-3'>Teslim Saati</div>}
            onChange={(event) => {
              const value = event.currentTarget.value
              formActions.setValue('drop_time', value)
            }}
            defaultValue={
              formActions.formState.defaultValues?.drop_time ?? '12:00'
            }
          />
        </div>
        <div className='col-span-16 md:col-span-3'>
          <SearchEngineButton />
        </div>
      </div>
      <div className='grid items-center justify-between gap-3 pt-3 md:flex md:justify-start md:gap-9'>
        <Checkbox
          label='Araç farklı bir yerde teslim edilecek'
          defaultChecked={isDiffrentDropLocation}
          onChange={({ currentTarget }) => {
            setIsDiffrentLocation(currentTarget.checked)
            formActions.setValue('isDiffrentLocation', currentTarget.checked)
          }}
        />
        <Controller
          control={formActions.control}
          name='driverAge'
          render={({ field }) => (
            <NativeSelect
              {...field}
              onChange={({ currentTarget: { value } }) => {
                field.onChange(+value)
              }}
              variant='unstyle'
              label='Sürücünün yaşı'
              classNames={{
                root: 'flex items-center',
                wrapper: 'flex item-center',
              }}
              data={range(18, 26).map((age) => ({
                label: age === 26 ? `${age}+` : `${age}`,
                value: `${age}`,
              }))}
            />
          )}
        />
      </div>
    </form>
  )
}

export { CarRentSearchPanel }
