import { useState } from 'react'
import { Button } from '@mantine/core'
import dayjs from 'dayjs'

import { HotelCalendar } from '@/components/search-engine/calendar/hotel'
import { HotelPassengerDropdown } from '@/components/search-engine/passengers/hotel'
import { useHotelDataQuery } from '@/app/hotel/(detail)/detailDataQuery'
import {
  hotelDetailSearchParams,
  HotelRoomOptionTypes,
  HotelSearchEngineSchemaType,
} from '@/modules/hotel/searchParams'
import { parseAsArrayOf, parseAsIsoDate, useQueryStates } from 'nuqs'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useLocalStorage } from '@mantine/hooks'

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
  const { hotelDetailQuery } = useHotelDataQuery()
  const [searchParams, setSearchParams] = useQueryStates(
    hotelDetailSearchParams
  )

  const detailQueryData = hotelDetailQuery?.data?.data
  const searchPanel = detailQueryData?.searchPanel
  const rooms = searchPanel?.rooms

  const form = useForm<RoomParams>({
    defaultValues: {
      checkInDate: dayjs(
        searchParams.checkInDate ?? searchPanel?.checkInDate
      ).toDate(),
      checkOutDate: dayjs(
        searchParams.checkOutDate ?? searchPanel?.checkOutDate
      ).toDate(),
      rooms: searchParams.rooms ?? rooms,
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

      <div className='grid grid-cols-3 gap-3'>
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
              form.setValue(
                'checkInDate',
                dayjs(dates[0]?.toISOString()).toDate(),
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              )
              form.setValue(
                'checkOutDate',
                dayjs(dates[1]?.toISOString()).toDate(),
                {
                  shouldValidate: true,
                  shouldDirty: true,
                }
              )
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
        <div className='col-span-1'>
          <Button
            className='h-full'
            type='submit'
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
