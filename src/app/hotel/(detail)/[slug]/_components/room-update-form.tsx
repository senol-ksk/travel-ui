import { useState } from 'react'
import { Button } from '@mantine/core'
import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'

dayjs.extend(UTC)

import { HotelCalendar } from '@/components/search-engine/calendar/hotel'
import { HotelPassengerDropdown } from '@/components/search-engine/passengers/hotel'

import {
  hotelDetailSearchParams,
  HotelRoomOptionTypes,
} from '@/modules/hotel/searchParams'
import { parseAsArrayOf, parseAsIsoDate, useQueryStates } from 'nuqs'
import { type SubmitHandler, useForm } from 'react-hook-form'

type RoomParams = {
  rooms: HotelRoomOptionTypes[]
  checkInDate: Date
  checkOutDate: Date
}

const roomUpdateParsers = {
  rooms: parseAsArrayOf<HotelRoomOptionTypes>,
  checkInDate: parseAsIsoDate,
  checkOutDate: parseAsIsoDate,
}

const RoomUpdateForm = () => {
  const [showCalendar, setShowCalendar] = useState(false)
  const [searchParams, setSearchParams] = useQueryStates(
    hotelDetailSearchParams
  )

  const form = useForm<RoomParams>({
    defaultValues: {
      checkInDate: dayjs(searchParams.checkInDate).toDate(),
      checkOutDate: dayjs(searchParams.checkOutDate).toDate(),
      rooms: searchParams.rooms,
    },
  })

  const handleSubmit: SubmitHandler<RoomParams> = (data) => {
    if (isFormDirty) {
      setSearchParams({
        isSearch: true,
        ...data,
      })
    }
  }

  const isFormDirty = form.formState.isDirty

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <input type='hidden' {...form.register('checkInDate')} />
      <input type='hidden' {...form.register('checkOutDate')} />
      <input type='hidden' {...form.register('rooms')} />

      <div className='grid gap-3 md:grid-cols-3'>
        <div>
          <HotelCalendar
            showCalendar={showCalendar}
            defaultDates={[
              form.formState.defaultValues?.checkInDate ??
                dayjs().add(2, 'd').toDate(),
              form.formState.defaultValues?.checkOutDate ??
                dayjs().add(7, 'd').toDate(),
            ]}
            onDateSelect={(dates) => {
              console.log(dates)
              form.setValue('checkInDate', dayjs.utc(dates[0]).toDate(), {
                shouldValidate: true,
                shouldDirty: true,
              })
              form.setValue('checkOutDate', dayjs.utc(dates[1]).toDate(), {
                shouldValidate: true,
                shouldDirty: true,
              })
            }}
          />
        </div>
        <div>
          <HotelPassengerDropdown
            initialValues={
              form.formState.defaultValues?.rooms as HotelRoomOptionTypes[]
            }
            onChange={(params) => {
              form.setValue('rooms', params, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }}
          />
        </div>
        <div className='col-span-1 flex justify-center md:justify-start'>
          <Button
            className='h-full p-3 px-8'
            type='submit'
            radius='xl'
            color={isFormDirty ? 'green' : 'blue'}
            onClick={() => {
              if (!isFormDirty) {
                setShowCalendar((prev) => !prev)
              }
            }}
          >
            {isFormDirty ? 'Güncelle' : 'Değiştir'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export { RoomUpdateForm }
