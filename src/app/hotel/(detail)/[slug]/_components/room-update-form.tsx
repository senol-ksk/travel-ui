import { useState } from 'react'
import { ActionIcon, Button } from '@mantine/core'
import dayjs from 'dayjs'
import UTC from 'dayjs/plugin/utc'

dayjs.extend(UTC)

import { HotelCalendar } from '@/components/search-engine/calendar/hotel'
import { HotelPassengerDropdown } from '@/components/search-engine/passengers/hotel'

import {
  hotelDetailSearchParams,
  type HotelRoomOptionTypes,
} from '@/modules/hotel/searchParams'
import { parseAsArrayOf, parseAsIsoDate, useQueryStates } from 'nuqs'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { IoSearchSharp } from 'react-icons/io5'

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
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false)
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

  const calendar = (
    <HotelCalendar
      showCalendar={showCalendar}
      onClose={() => {
        setShowCalendar(false)
      }}
      defaultDates={[
        form.formState.defaultValues?.checkInDate ??
          dayjs().add(2, 'd').toDate(),
        form.formState.defaultValues?.checkOutDate ??
          dayjs().add(7, 'd').toDate(),
      ]}
      onDateSelect={(dates) => {
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
  )

  const isFormDirty = form.formState.isDirty

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className='relative flex gap-3 text-xs font-semibold md:hidden'>
        <div
          className='flex items-center rounded border bg-white p-3'
          role='button'
          onClick={() => {
            setShowCalendar(true)
          }}
        >
          {dayjs(form.getValues('checkInDate')).format('DD MMMM')}
        </div>
        <div
          className='flex items-center rounded border bg-white p-3'
          role='button'
          onClick={() => {
            setShowCalendar(true)
          }}
        >
          {dayjs(form.getValues('checkOutDate')).format('DD MMMM')}
        </div>
        <div
          className='flex items-center gap-2 rounded border bg-white p-3'
          role='button'
          onClick={() => {
            setShowPassengerDropdown(true)
          }}
        >
          <div>{form.getValues('rooms').length} Oda</div>
          <div>{'-'}</div>
          <div>
            {form.getValues('rooms').reduce((a, b) => {
              return a + b.adult + b.child
            }, 0)}{' '}
            Misafir
          </div>
        </div>
        <div className='flex-1'>
          <ActionIcon w={'100%'} h={'100%'} type='submit'>
            <IoSearchSharp size={24} />
          </ActionIcon>
        </div>
      </div>
      <div className='size-0 gap-3 overflow-hidden md:grid md:size-auto md:grid-cols-3 md:overflow-visible'>
        <div>{calendar}</div>
        <div>
          <HotelPassengerDropdown
            opened={showPassengerDropdown}
            onClose={() => {
              setShowPassengerDropdown(false)
            }}
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
                setShowCalendar(true)
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
