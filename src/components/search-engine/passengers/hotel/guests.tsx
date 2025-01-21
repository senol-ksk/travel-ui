import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { ActionIcon, Button, NativeSelect, Select, Title } from '@mantine/core'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { range } from '@mantine/hooks'
import { FaPlus } from 'react-icons/fa6'

import type { HotelRoomOptionTypes } from '@/components/search-engine/passengers/hotel'

type Props = {
  onChange?: (params: HotelRoomOptionTypes) => void
  initialValues: HotelRoomOptionTypes
}

type HandleChildAgesParam = {
  roomIndex: number
  ageIndex: number
  value: number
}

const HotelGuestsActions: React.FC<Props> = ({
  initialValues,
  onChange = () => null,
}) => {
  const [roomState, setRoomState] =
    useState<HotelRoomOptionTypes>(initialValues)

  function handleChildAges({
    ageIndex,
    roomIndex,
    value,
  }: HandleChildAgesParam) {
    const nextState = roomState
    nextState[roomIndex].childAges[ageIndex] = value
    setRoomState([...nextState])
    onChange(nextState)
  }

  function handlePassengerSelect({
    room,
    index,
    action,
    type,
  }: {
    index: number
    room: HotelRoomOptionTypes[0]
    action: number
    type: 'adult' | 'child'
  }) {
    const nextRoomState = roomState

    const currentRoom: HotelRoomOptionTypes[0] = {
      ...room,
      [type]: roomState[index][type] + action,
    }

    if (type === 'child') {
      if (action === 1) {
        currentRoom.childAges.push(1)
      } else {
        currentRoom.childAges.pop()
      }
    }

    nextRoomState[index] = currentRoom
    setRoomState([...nextRoomState])
    onChange(nextRoomState)
  }

  return roomState.map((room, index) => {
    return (
      <div
        key={index}
        className={clsx('grid gap-2', {
          'border-t border-gray-400 pt-3': index > 0,
        })}
      >
        <Title order={5}>{index + 1}.Oda</Title>
        <div className='flex items-center justify-between'>
          <div className='text-sm'>Yetişkinler</div>
          <div className='flex items-center justify-between gap-3'>
            <ActionIcon
              type='button'
              radius='xl'
              variant='outline'
              size={'lg'}
              onClick={() => {
                handlePassengerSelect({
                  index,
                  room,
                  action: -1,
                  type: 'adult',
                })
              }}
              data-disabled={room.adult === 1}
              disabled={room.adult === 1}
              aria-label='decrease-adult'
            >
              <FiMinus />
            </ActionIcon>
            <div className='text-sm' aria-label='adult-count'>
              {room.adult}
            </div>
            <ActionIcon
              type='button'
              radius='xl'
              variant='outline'
              size={'lg'}
              onClick={() => {
                handlePassengerSelect({
                  index,
                  room,
                  action: 1,
                  type: 'adult',
                })
              }}
              data-disabled={room.adult + room.child === 5}
              disabled={room.adult + room.child === 5}
              aria-label='increase-adult'
            >
              <FiPlus />
            </ActionIcon>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div className='text-sm'>Çocuk</div>
          <div className='flex items-center justify-between gap-3'>
            <ActionIcon
              radius='xl'
              variant='outline'
              size={'lg'}
              onClick={() => {
                handlePassengerSelect({
                  index,
                  room,
                  action: -1,
                  type: 'child',
                })
              }}
              data-disabled={room.child === 0}
              disabled={room.child === 0}
              aria-label='decrease-child'
            >
              <FiMinus />
            </ActionIcon>
            <div className='text-sm' aria-label='child-count'>
              {room.child}
            </div>
            <ActionIcon
              radius='xl'
              variant='outline'
              size={'lg'}
              onClick={() => {
                handlePassengerSelect({
                  index,
                  room,
                  action: 1,
                  type: 'child',
                })
              }}
              data-disabled={room.adult + room.child === 5}
              disabled={room.adult + room.child === 5}
              aria-label='increase-child'
            >
              <FiPlus />
            </ActionIcon>
          </div>
        </div>
        {room.childAges.length ? (
          <div className='grid gap-2'>
            {room.childAges.map((child, ageIndex) => {
              return (
                <NativeSelect
                  key={ageIndex}
                  label={`${ageIndex + 1}. Çocuk yaşı`}
                  data={range(1, 12).map(String)}
                  defaultValue={child}
                  aria-placeholder='1. Çocuk yaşı'
                  size='xs'
                  onChange={(event) => {
                    handleChildAges({
                      ageIndex,
                      roomIndex: index,
                      value: +event.currentTarget.value,
                    })
                  }}
                />
              )
            })}
          </div>
        ) : null}

        <div className='pt-2 text-end'>
          <Button
            size='xs'
            variant='subtle'
            color={roomState.length > 1 ? 'red' : 'blue'}
            type='button'
            leftSection={<FaPlus />}
            onClick={() => {
              let nextState = roomState

              if (roomState.length > 1) {
                nextState.splice(index, 1)
                setRoomState([...nextState])
              } else {
                nextState = [
                  ...nextState,
                  { adult: 1, child: 0, childAges: [] },
                ]
                setRoomState(nextState)
              }
              onChange(nextState)
            }}
          >
            {roomState.length > 1 ? 'Odayı Sil' : 'Oda Ekle'}
          </Button>
        </div>
      </div>
    )
  })
}

export { HotelGuestsActions }
