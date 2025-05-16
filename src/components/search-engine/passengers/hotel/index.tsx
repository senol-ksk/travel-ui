import { useState } from 'react'

import { Transition, Paper, Button, ActionIcon, Title } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'

import { Input } from '@/components/search-engine/input'
import { HotelGuestsActions } from './guests'
import { HotelRoomOptionTypes } from '@/modules/hotel/searchParams'

type Props = {
  onChange?: (params: HotelRoomOptionTypes[]) => void
  initialValues: HotelRoomOptionTypes[]
}

export const HotelPassengerDropdown: React.FC<Props> = ({
  onChange = () => {},
  initialValues,
}) => {
  const [roomState, setRoomState] = useState(initialValues)

  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )

  return (
    <div className='relative h-full'>
      <Input
        label='Misafir'
        title={`${roomState.length} Oda, ${roomState.reduce(
          (a, b) => a + b.adult + b.child,
          0
        )} Misafir`}
        onClick={() => setContainerTransitionState(true)}
      />

      <Transition mounted={containerTransitionState} transition='pop-top-right'>
        {(styles) => {
          return (
            <div
              ref={clickOutsideRef}
              className='fixed start-0 end-0 top-0 bottom-0 z-50 sm:absolute sm:start-auto sm:bottom-auto md:-ms-1 md:-mt-1'
              style={{ ...styles }}
              role='menu'
            >
              <Paper className='flex h-full flex-col rounded-lg shadow-xl'>
                <div className='grid min-w-[320px] gap-7 p-5'>
                  <HotelGuestsActions
                    initialValues={roomState}
                    onChange={(params) => {
                      onChange(params)
                      setRoomState(params)
                    }}
                  />

                  <div className='text-end'>
                    <Button
                      type='button'
                      onClick={() => setContainerTransitionState(false)}
                    >
                      Tamam
                    </Button>
                  </div>
                </div>
              </Paper>
            </div>
          )
        }}
      </Transition>
    </div>
  )
}
