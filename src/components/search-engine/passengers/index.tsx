import { useRef, useState } from 'react'

import {
  Transition,
  Paper,
  CloseButton,
  Skeleton,
  Button,
  ActionIcon,
} from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'

import { FiPlus, FiMinus } from 'react-icons/fi'

import { Input } from '@/components/search-engine/input'

type PassengerTypes = 'adults' | 'children' | 'infants'

export const PassengerDropdown = () => {
  const [passengersState, setPassengersState] = useState({
    adults: {
      count: 1,
    },
    children: {
      count: 0,
    },
    infants: {
      count: 0,
    },
  })
  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )
  const handlePassengerSelect = (type: PassengerTypes, count: number): void => {
    setPassengersState({
      ...passengersState,
      [type]: { count: passengersState[type].count + count },
    })
  }

  return (
    <div className='relative'>
      <Input
        icon={'passenger'}
        label='Yolcular'
        title={`${
          passengersState.adults.count +
          passengersState.children.count +
          passengersState.infants.count
        } Yolcu`}
        onClick={() => setContainerTransitionState(true)}
      />
      <Transition mounted={containerTransitionState} transition='pop-top-right'>
        {(styles) => (
          <div
            ref={clickOutsideRef}
            className='fixed bottom-0 end-0 start-0 top-0 z-50 sm:absolute sm:bottom-auto sm:start-auto md:-ms-1 md:-mt-1'
            style={{ ...styles }}
            role='menu'
          >
            <Paper className='flex h-full flex-col rounded-lg shadow-xl'>
              <div className='grid min-w-[320px] gap-7 p-5'>
                <div className='flex items-center justify-between'>
                  <div className='text-sm'>Yetişkinler</div>
                  <div className='flex items-center justify-between gap-3'>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('adults', -1)
                      }}
                      data-disabled={passengersState.adults.count === 1}
                      disabled={passengersState.adults.count === 1}
                      aria-label='decrease-adult'
                    >
                      <FiMinus />
                    </ActionIcon>
                    <div className='text-sm' aria-label='adult-count'>
                      {passengersState.adults.count}
                    </div>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('adults', 1)
                      }}
                      data-disabled={
                        passengersState.adults.count +
                          passengersState.children.count ===
                        7
                      }
                      disabled={
                        passengersState.adults.count +
                          passengersState.children.count ===
                        7
                      }
                      aria-label='increase-adult'
                    >
                      <FiPlus />
                    </ActionIcon>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='text-sm'>
                    Çocuk
                    <div>
                      <small>(2-12 Yaş arası)</small>
                    </div>
                  </div>
                  <div className='flex items-center justify-between gap-3'>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('children', -1)
                      }}
                      data-disabled={passengersState.children.count === 0}
                      disabled={passengersState.children.count === 0}
                      aria-label='decrease-children'
                    >
                      <FiMinus />
                    </ActionIcon>
                    <div className='text-sm' aria-label='children-count'>
                      {passengersState.children.count}
                    </div>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('children', 1)
                      }}
                      data-disabled={
                        passengersState.adults.count +
                          passengersState.children.count ===
                        7
                      }
                      disabled={
                        passengersState.adults.count +
                          passengersState.children.count ===
                        7
                      }
                      aria-label='increase-children'
                    >
                      <FiPlus />
                    </ActionIcon>
                  </div>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='text-sm'>
                    Bebek
                    <div>
                      <small>(0-12 Yaş arası)</small>
                    </div>
                  </div>
                  <div className='flex items-center justify-between gap-3'>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('infants', -1)
                      }}
                      data-disabled={passengersState.infants.count === 0}
                      disabled={passengersState.infants.count === 0}
                      aria-label='decrease-infants'
                    >
                      <FiMinus />
                    </ActionIcon>
                    <div className='text-sm' aria-label='infants-count'>
                      {passengersState.infants.count}
                    </div>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('infants', 1)
                      }}
                      data-disabled={
                        passengersState.infants.count ===
                        passengersState.adults.count
                      }
                      disabled={
                        passengersState.infants.count ===
                        passengersState.adults.count
                      }
                      aria-label='increase-infants'
                    >
                      <FiPlus />
                    </ActionIcon>
                  </div>
                </div>
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
        )}
      </Transition>
    </div>
  )
}
