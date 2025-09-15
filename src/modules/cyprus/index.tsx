'use client'

import { useState } from 'react'
import { Box, Button, Grid, Skeleton } from '@mantine/core'
import { RiMapPin2Line } from 'react-icons/ri'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import { type Route } from 'next'

import { z } from '@/libs/zod'
import { CyprusSearchEnginePackagesCheck } from './package-checks/package-checks'
import { Locations } from '@/components/search-engine/locations/hotel/locations'
import { HotelCalendar } from '@/components/search-engine/calendar/hotel'
import { HotelPassengerDropdown } from '@/components/search-engine/passengers/hotel'
import { LocationResults } from '@/components/search-engine/locations/hotel/type'
import { request } from '@/network'
import { useDestinationGetBySlug } from '@/hooks/destination'
import { useTransitionRouter } from 'next-view-transitions'
import { cyprusRoomParser, cyprusSearchSerializer } from './searchParams'
import { useGetAirportByCodeList } from '@/hooks/useGetAirport'

type PackageValues = ('2' | '1')[]

const cyprusSearchEngineSchema = z
  .object({
    name: z.string(), // hotel name indeed
    slug: z.string(), // hotel slug indeed
    id: z.number(), // hotel id indeed
    checkInDate: z.coerce.date(),
    checkOutDate: z.coerce.date(),
    isFlight: z.boolean(),
    isTransfer: z.boolean(),
    airportCode: z.string().optional(),
    airport: z
      .object({
        code: z.string(),
        name: z.string(),
      })
      .optional(),
    rooms: cyprusRoomParser,
    type: z.number(),
  })
  .superRefine((values, ctx) => {
    if ((values.isFlight || values.isTransfer) && !values.airport?.code) {
      ctx.addIssue({
        path: ['airportCode'],
        message: 'Zorunlu alan',
        code: 'custom',
      })
    }
  })

type CyprusSearchEngineSearchParams = z.infer<typeof cyprusSearchEngineSchema>
const defaultDates: [Date, Date] = [
  dayjs().add(1, 'months').toDate(),
  dayjs().add(1, 'months').add(5, 'days').toDate(),
]

type IProps = {
  defaultValues?: {
    checkInDate?: CyprusSearchEngineSearchParams['checkInDate']
    checkOutDate?: CyprusSearchEngineSearchParams['checkOutDate']
    isFlight?: CyprusSearchEngineSearchParams['isFlight']
    isTransfer?: CyprusSearchEngineSearchParams['isTransfer']
    rooms?: CyprusSearchEngineSearchParams['rooms']
    slug?: CyprusSearchEngineSearchParams['slug']
    airportCode?: CyprusSearchEngineSearchParams['airportCode']
  }
}

const CyprusSearchEngine: React.FC<IProps> = ({ defaultValues }) => {
  const form = useForm({
    resolver: zodResolver(cyprusSearchEngineSchema),
    defaultValues: {
      checkInDate: dayjs(
        defaultValues?.checkInDate ?? defaultDates[0]
      ).toDate(),
      checkOutDate: dayjs(
        defaultValues?.checkOutDate ?? defaultDates[1]
      ).toDate(),
      isFlight:
        typeof defaultValues?.isFlight === 'boolean'
          ? defaultValues?.isFlight
          : true,
      isTransfer:
        typeof defaultValues?.isTransfer === 'boolean'
          ? defaultValues?.isTransfer
          : true,
      rooms: defaultValues?.rooms ?? [
        { adult: 2, child: 0, childBirthdays: [] },
      ],
      slug: defaultValues?.slug,
      airportCode: defaultValues?.airportCode,
    },
  })
  const router = useTransitionRouter()

  const getDefaultHotelLocation = useDestinationGetBySlug({
    moduleName: 'Hotel',
    slugs: [form.formState.defaultValues?.slug ?? 'kibris'],
  })
  const defaultHotelLocationData = getDefaultHotelLocation?.data[0]
  const getAirportInfo = useGetAirportByCodeList([
    form.formState.defaultValues?.airportCode ?? '',
  ])

  if (getAirportInfo.data && !form.formState.defaultValues?.airport) {
    const airportInfo = getAirportInfo.data[0]
    form.setValue('airportCode', airportInfo.Code)
    form.setValue('airport', {
      code: airportInfo.Code,
      name: airportInfo.Value.find((lang) => lang.LangCode === 'tr_TR')
        ?.Value as string,
    })
  }
  if (
    (!form.getValues('slug') &&
      !form.formState.defaultValues?.slug &&
      defaultHotelLocationData?.Result.Slug) ||
    (!form.getValues('name') &&
      !form.formState.defaultValues?.name &&
      defaultHotelLocationData?.Result.Name)
  ) {
    form.setValue(
      'slug',
      getDefaultHotelLocation?.data.at(0)?.Result.Slug as string,
      {
        shouldValidate: true,
      }
    )
    form.setValue(
      'name',
      getDefaultHotelLocation?.data.at(0)?.Result.Name as string,
      {
        shouldValidate: true,
      }
    )
    form.setValue(
      'type',
      getDefaultHotelLocation?.data.at(0)?.Result.Type as number,
      {
        shouldValidate: true,
      }
    )
    form.setValue(
      'id',
      getDefaultHotelLocation?.data.at(0)?.Result.Id as number,
      {
        shouldValidate: true,
      }
    )
  }

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
      queryKey: ['cyprus-flight-origin-locations', airlineLocationInputValue],
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
    form.getValues('isTransfer') || form.getValues('isFlight')

  const submitSearchResults = (data: CyprusSearchEngineSearchParams) => {
    const searchUrl = cyprusSearchSerializer(
      '/cyprus/search-results',
      data
    ) as Route

    router.push(searchUrl)
  }

  return (
    <form onSubmit={form.handleSubmit(submitSearchResults)}>
      <div className='leading-md text-sm'>
        Seyahatinizi oluşturmak için bir paket seçin
      </div>
      <CyprusSearchEnginePackagesCheck
        selectedPackages={[
          form.getValues('isFlight') ? '1' : '',
          form.getValues('isTransfer') ? '2' : '',
        ]}
        onChange={(value) => {
          form.setValue('isFlight', value.includes('1'), {
            shouldValidate: true,
          })
          form.setValue('isTransfer', value.includes('2'), {
            shouldValidate: true,
          })
          form.trigger(['isTransfer', 'isFlight'])
          // setSelectedPackages(value as PackageValues)
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
          {getDefaultHotelLocation.pending ? (
            <Skeleton className='z-30 size-full' />
          ) : (
            <>
              <RiMapPin2Line
                size={20}
                className='absolute top-1/2 left-1 mx-2 -translate-y-1/2'
              />
              <Locations
                label='Gidilecek Yer'
                data={destinationLocation}
                isLoading={destinationLocationLoading}
                onChange={(value) => {
                  setDestinationLocationInputValue(value)
                }}
                inputProps={{ error: !!form.formState.errors.slug }}
                onSelect={(data) => {
                  form.setValue('slug', data.Slug)
                  form.setValue('name', data.Name)
                  form.setValue('type', data.Type)
                  form.setValue('id', +data.Id)
                  form.trigger(['slug', 'name', 'type', 'id'])
                }}
                defaultValue={
                  form.getValues('name') ??
                  getDefaultHotelLocation.data[0]?.Result.Name
                }
              />
            </>
          )}
        </Grid.Col>
        {isTransferOrFlightSelected && (
          <Grid.Col
            span={{
              sm: 6,
              md: 3,
            }}
            pos={'relative'}
          >
            {getAirportInfo.isLoading ? (
              <Skeleton className='z-30 size-full' />
            ) : (
              <>
                <RiMapPin2Line
                  size={20}
                  className='absolute top-1/2 left-1 mx-2 -translate-y-1/2'
                />
                <Locations
                  label='Gidiş Dönüş Havalimanı'
                  data={airlineLocations?.Result}
                  isLoading={airlineLocationsIsLoading}
                  onChange={(value) => {
                    setAirlineLocationInputValue(value)
                  }}
                  inputProps={{
                    error:
                      !!form.formState.errors.airport?.message ||
                      !!form.formState.errors.airportCode?.message,
                  }}
                  defaultValue={form.getValues('airport.name')}
                  onSelect={(data) => {
                    form.setValue('airport', {
                      code: data.Code,
                      name: data.Name,
                    })
                    form.setValue('airportCode', data.Code)
                    form.trigger(['airport', 'airportCode'])
                  }}
                />
              </>
            )}
          </Grid.Col>
        )}
        <Grid.Col span={{ sm: 6, md: 3 }} pos={'relative'}>
          <HotelCalendar
            defaultDates={[
              form.getValues('checkInDate') ??
                form.formState.defaultValues?.checkInDate ??
                defaultDates[0],
              form.getValues('checkOutDate') ??
                form.formState.defaultValues?.checkOutDate ??
                defaultDates[1],
            ]}
            onDateSelect={(dates) => {
              const checkinDate = dates[0]
              const checkoutDate = dates[1]

              form.setValue('checkInDate', dayjs.utc(checkinDate).toDate())
              form.setValue('checkOutDate', dayjs.utc(checkoutDate).toDate())
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6, md: 3 }}>
          <HotelPassengerDropdown
            initialValues={[
              {
                adult:
                  form.getValues('rooms').at(0)?.adult ??
                  form.formState.defaultValues?.rooms?.at(0)?.adult ??
                  2,
                child:
                  form.getValues('rooms').at(0)?.child ??
                  form.formState.defaultValues?.rooms?.at(0)?.child ??
                  0,
                childAges: form.getValues('rooms').at(0)?.childBirthdays ?? [],
              },
            ]}
            maxRoomCount={1}
            onChange={(params) => {
              const rooms = params.map((room) => {
                return {
                  adult: room.adult,
                  child: room.child,
                  childBirthdays: room.childAges,
                }
              }) as CyprusSearchEngineSearchParams['rooms']

              form.setValue('rooms', rooms)
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
              loading={form.formState.isSubmitting}
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
