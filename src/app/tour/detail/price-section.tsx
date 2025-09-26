import { useState } from 'react'
import { Button, NativeSelect, Popover, Title } from '@mantine/core'
import { range } from '@mantine/hooks'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  PassengerFormTypes,
  passengerUpdateSchema,
  TourDetailApiResponse,
} from '@/modules/tour/type'
import { formatCurrency } from '@/libs/util'
import clsx from 'clsx'

type Props = {
  data: TourDetailApiResponse
  calculatedTotalPrice: number
  onPassengerChange?: (passengers: PassengerFormTypes) => void
}
const TourDetailPriceSection: React.FC<Props> = ({
  data,
  onPassengerChange = () => null,
  calculatedTotalPrice = 0,
}) => {
  const adultSelect = range(1, 3).map((value) => {
    return {
      label: `${value} Kişi`,
      value: `${value}:0`,
    }
  })

  const childAgeSelect = range(0, 12).map((value) => ({
    label: value === 0 ? `0-12 aylık` : `${value}`,
    value: '' + value,
  }))

  const [passengerPopoverOpened, setPassengerPopoverOpened] = useState(false)
  const passengerForm = useForm<PassengerFormTypes>({
    resolver: zodResolver(passengerUpdateSchema),
    mode: 'onSubmit',
    defaultValues: {
      adultCount: '2:0',
      childAge: ['-1'],
    },
  })
  const [passengersFormValues, setPassengerText] = useState(
    passengerForm.formState.defaultValues
  )

  const handlePassengerFormSubmit = (passengerFormData: PassengerFormTypes) => {
    // if (passengerForm.formState.isDirty) {
    // }
    onPassengerChange(passengerFormData)

    setPassengerPopoverOpened(false)
    setPassengerText(passengerFormData)
  }

  return (
    <div className='@container relative'>
      <div className='grid gap-3'>
        <Title order={3} fz={'h4'}>
          Tura katılacak Kişi Sayısı
        </Title>
        <div className='text-sm text-gray-700'>
          {passengersFormValues?.adultCount?.split('').at(0)} Yetişkin
          {Number(passengersFormValues?.childAge) >= 0 ? ' ve 1 Çocuk' : null}
        </div>
        <Popover
          width={300}
          trapFocus
          withArrow
          shadow='xl'
          onChange={setPassengerPopoverOpened}
          opened={passengerPopoverOpened}
          transitionProps={{
            transition: 'pop',
          }}
        >
          <Popover.Target>
            <Button
              type='button'
              variant='outline'
              onClick={() =>
                setPassengerPopoverOpened((prevState) => !prevState)
              }
            >
              Değiştir
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <form
              onSubmit={passengerForm.handleSubmit(handlePassengerFormSubmit)}
            >
              <div className='grid gap-3'>
                <div>
                  <Controller
                    control={passengerForm.control}
                    name='adultCount'
                    render={({ field }) => (
                      <NativeSelect
                        {...field}
                        data={adultSelect}
                        label='Yetişkin'
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    control={passengerForm.control}
                    name={`childAge.${0}`}
                    render={({ field }) => (
                      <NativeSelect
                        {...field}
                        data={[
                          { value: '-1', label: 'Çocuk Yok' },
                          ...childAgeSelect,
                        ]}
                        label='1. Çocuk Yaşı'
                      />
                    )}
                  />
                </div>
                <div>
                  <Button type='submit' fullWidth color={'green'}>
                    Güncelle
                  </Button>
                </div>
              </div>
            </form>
          </Popover.Dropdown>
        </Popover>

        <div
          className={clsx('flex justify-between pt-4', {
            'blur-sm': calculatedTotalPrice < 1,
          })}
        >
          <div>Toplam Tutar:</div>

          <div className='text-lg font-semibold'>
            {formatCurrency(calculatedTotalPrice)}
          </div>
        </div>
      </div>
    </div>
  )
}

export { TourDetailPriceSection }
