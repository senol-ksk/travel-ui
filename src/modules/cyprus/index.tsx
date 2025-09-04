'use client'

import { useState } from 'react'
import { Box, Button, Grid } from '@mantine/core'
import { RiMapPin2Line } from 'react-icons/ri'
import dayjs from 'dayjs'

import { CyprusSearchEnginePackagesCheck } from './package-checks/package-checks'
import { Locations } from '@/components/search-engine/locations/hotel/locations'
import { HotelCalendar } from '@/components/search-engine/calendar/hotel'
import { HotelPassengerDropdown } from '@/components/search-engine/passengers/hotel'

type PackageValues = ('2' | '1')[]

const CyprusSearchEngine = () => {
  const [selectedPackages, setSelectedPackages] = useState<PackageValues>([
    '1',
    '2',
  ])
  const isTransferOrFlightSelected =
    selectedPackages.includes('1') || selectedPackages.includes('2')

  return (
    <div>
      <div className='leading-md text-sm'>
        Seyahatinizi oluşturmak için bir paket seçin
      </div>
      <CyprusSearchEnginePackagesCheck
        selectedPackages={selectedPackages}
        onChange={(value) => {
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
            // data={destinationLocation?.Result}
            // isLoading={destinationLocationLoading}
            // onChange={(value) => {
            //   setDestinationLocationInputValue(value)
            // }}
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
            defaultValue={'Kıbrıs'}
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
              // data={destinationLocation?.Result}
              // isLoading={destinationLocationLoading}
              // onChange={(value) => {
              //   setDestinationLocationInputValue(value)
              // }}
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
              defaultValue={'İstanbul Sabiha Gökçen Havaalanı (SAW)'}
            />
          </Grid.Col>
        )}
        <Grid.Col span={{ sm: 6, md: 3 }} pos={'relative'}>
          <HotelCalendar
            defaultDates={[new Date(), dayjs().add(2, 'days').toDate()]}
            onDateSelect={(dates) => {
              const checkinDate = dates[0]
              const checkoutDate = dates[1]
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ sm: 6, md: 3 }}>
          <HotelPassengerDropdown
            initialValues={[{ adult: 2, child: 0, childAges: [] }]}
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
    </div>
  )
}

export { CyprusSearchEngine }
