'use client'

import { useState } from 'react'
import { Box, Button, Grid } from '@mantine/core'
import { RiMapPin2Line } from 'react-icons/ri'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { CyprusSearchEnginePackagesCheck } from './package-checks/package-checks'
import { Locations } from '@/components/search-engine/locations/hotel/locations'
import { HotelCalendar } from '@/components/search-engine/calendar/hotel'
import { HotelPassengerDropdown } from '@/components/search-engine/passengers/hotel'
import { LocationResults } from '@/components/search-engine/locations/hotel/type'
import { request } from '@/network'
import { z } from '@/libs/zod'

type PackageValues = ('2' | '1')[]

const cyprusSearchEngineSchema = z.object({
  slug: z.string(),
  start_date: z.coerce.date(),
  end_date: z.coerce.date(),
  isFlightChoose: z.boolean(),
  isTransferChoose: z.boolean(),
  adults: z.number(),
  children: z.number(),
  airport: z.string(),
})

const CyprusSearchEngine = () => {
  const form = useForm({
    resolver: zodResolver(cyprusSearchEngineSchema),
  })

  const [selectedPackages, setSelectedPackages] = useState<PackageValues>([
    '1',
    '2',
  ])

  const [destinationLocationInputValue, setDestinationLocationInputValue] =
    useState('')
  const { data: destinationLocation, isLoading: destinationLocationLoading } =
    useQuery({
      queryKey: ['cyprus-locations', destinationLocationInputValue],
      enabled:
        !!destinationLocationInputValue &&
        destinationLocationInputValue.length > 0,
      queryFn: async () => {
        const getLocations = (await request({
          url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/hotel/search`,
          params: {
            s: destinationLocationInputValue,
            id: null,
            scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
          },
        })) as LocationResults

        return getLocations
      },
      select: (query) => {
        return query.Result.filter((item) => item.CountryCode === 'trnc')
      },
    })
  const [airlineLocationInputValue, setAirlineLocationInputValue] = useState('')
  const { data: airlineLocations, isLoading: airlineLocationsIsLoading } =
    useQuery<LocationResults>({
      queryKey: ['flight-origin-locations', airlineLocationInputValue],
      enabled:
        !!airlineLocationInputValue && airlineLocationInputValue.length > 0,
      queryFn: async () => {
        const getLocations = await request({
          url: `${process.env.NEXT_PUBLIC_API_GW_ROUTE}/d/v1.1/api/flight/search`,
          params: {
            s: airlineLocationInputValue,
            id: null,
            scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
          },
        })

        return getLocations
      },
    })

  const isTransferOrFlightSelected =
    selectedPackages.includes('1') || selectedPackages.includes('2')

  return (
    <form
      onSubmit={form.handleSubmit((data) => {
        console.log(data)
      })}
    >
      <div className='leading-md text-sm'>
        Seyahatinizi oluşturmak için bir paket seçin
      </div>
      <CyprusSearchEnginePackagesCheck
        selectedPackages={selectedPackages}
        onChange={(value) => {
          form.setValue('isFlightChoose', value.includes('1'))
          form.setValue('isTransferChoose', value.includes('2'))
          setSelectedPackages(value as PackageValues)
        }}
      />
      <Grid gutter={'xs'} mt={'sm'}>
        <Grid.Col
          span={{
            sm: isTransferOrFlightSelected ? 6 : 12,
            md: isTransferOrFlightSelected ? 2 : 5,
          }}
          pos={'relative'}
        >
          <RiMapPin2Line
            size={20}
            className='absolute top-1/2 left-1 z-10 mx-2 -translate-y-1/2'
          />
          <Locations
            label='Gidilecek Yer'
            data={destinationLocation}
            isLoading={destinationLocationLoading}
            onChange={(value) => {
              console.log(value)
              setDestinationLocationInputValue(value)
            }}
            inputProps={{ error: !!form.formState.errors.slug }}
            onSelect={(data) => {
              form.setValue('slug', data.Slug)
              form.trigger('slug')
            }}
          />
        </Grid.Col>
        {isTransferOrFlightSelected && (
          <Grid.Col
            span={{
              sm: 6,
              md: 3,
            }}
            pos={'relative'}
          >
            <RiMapPin2Line
              size={20}
              className='absolute top-1/2 left-1 z-10 mx-2 -translate-y-1/2'
            />
            <Locations
              label='Gidiş Dönüş Havalimanı'
              data={airlineLocations?.Result}
              isLoading={airlineLocationsIsLoading}
              onChange={(value) => {
                setAirlineLocationInputValue(value)
              }}
              // inputProps={{ error: !!form.formState.errors.destination }}
              onSelect={(data) => {
                // form.setValue('destination', {
                //   id: data.Id,
                //   name: data.Name,
                //   slug: data.Slug,
                //   type: data.Type,
                // })
                // form.trigger('destination')
              }}
            />
          </Grid.Col>
        )}
        <Grid.Col span={{ sm: 6, md: 3 }} pos={'relative'}>
          <HotelCalendar
            defaultDates={[new Date(), dayjs().add(2, 'days').toDate()]}
            onDateSelect={(dates) => {
              const checkinDate = dates[0]
              const checkoutDate = dates[1]
              form.setValue('start_date', dayjs(dates[0]).toDate())
              form.setValue('end_date', dayjs(dates[1]).toDate())
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6, md: 3 }}>
          <HotelPassengerDropdown
            initialValues={[{ adult: 2, child: 0, childAges: [] }]}
            maxRoomCount={1}
            onChange={(params) => {
              console.log(params)
              const adultCounts = params.reduce((a, b) => {
                return b.adult + a
              }, 0)
              const childCounts = params.reduce((a, b) => {
                return b.child + a
              }, 0)

              form.setValue('adults', adultCounts)
              form.setValue('children', childCounts)
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ md: 1 }}>
          <Box
            w={{ sm: '50%', md: '100%' }}
            h='100%'
            display={'grid'}
            mx={'auto'}
          >
            <Button
              type='submit'
              className='h-full rounded-xl px-0'
              size='lg'
              mih={42}
            >
              Ara
            </Button>
          </Box>
        </Grid.Col>
      </Grid>
    </form>
  )
}

export { CyprusSearchEngine }
