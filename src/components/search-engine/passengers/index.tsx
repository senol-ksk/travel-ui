import { useEffect, useRef, useState } from 'react'

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

type PassengerTypes = 'Adult' | 'Child' | 'Infant'

type PassengerRequestModel = { Adult: number; Child: number; Infant: number }

type Props = {
  onChange?: (params: {
    Adult?: number
    Child?: number
    Infant?: number
  }) => void
  initialValues?: PassengerRequestModel | null
}

export const PassengerDropdown: React.FC<Props> = ({
  onChange = () => {},
  initialValues,
}) => {
  const [passengersState, setPassengersState] = useState({
    Adult: {
      count: initialValues?.Adult || 1,
    },
    Child: {
      count: initialValues?.Child || 0,
    },
    Infant: {
      count: initialValues?.Child || 0,
    },
  })
  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )
  const handlePassengerSelect = (type: PassengerTypes, count: number): void => {
    const currentState = passengersState
    const shouldInfantDecrement =
      currentState.Adult.count === currentState.Infant.count &&
      type === 'Adult' &&
      count === -1
    if (shouldInfantDecrement) {
      onChange({
        Infant: currentState.Infant.count - 1,
        Child: currentState.Child.count,
        [type]: currentState[type].count + count,
      })
    } else {
      onChange({
        Adult: currentState.Adult.count,
        Infant: currentState.Infant.count,
        Child: currentState.Child.count,
        [type]: currentState[type].count + count,
      })
    }

    setPassengersState((prev) => {
      if (shouldInfantDecrement) {
        return {
          ...currentState,
          Infant: { count: currentState.Infant.count - 1 },
          [type]: {
            count: currentState[type].count + count,
          },
        }
      }

      return {
        ...prev,
        [type]: {
          count: prev[type].count + count,
        },
      }
    })
  }

  return (
    <div className='relative'>
      <Input
        icon={'passenger'}
        label='Yolcular'
        title={`${
          passengersState.Adult.count +
          passengersState.Child.count +
          passengersState.Infant.count
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
                        handlePassengerSelect('Adult', -1)
                      }}
                      data-disabled={passengersState.Adult.count === 1}
                      disabled={passengersState.Adult.count === 1}
                      aria-label='decrease-adult'
                    >
                      <FiMinus />
                    </ActionIcon>
                    <div className='text-sm' aria-label='adult-count'>
                      {passengersState.Adult.count}
                    </div>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('Adult', 1)
                      }}
                      data-disabled={
                        passengersState.Adult.count +
                          passengersState.Child.count ===
                        7
                      }
                      disabled={
                        passengersState.Adult.count +
                          passengersState.Child.count ===
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
                        handlePassengerSelect('Child', -1)
                      }}
                      data-disabled={passengersState.Child.count === 0}
                      disabled={passengersState.Child.count === 0}
                      aria-label='decrease-child'
                    >
                      <FiMinus />
                    </ActionIcon>
                    <div className='text-sm' aria-label='child-count'>
                      {passengersState.Child.count}
                    </div>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('Child', 1)
                      }}
                      data-disabled={
                        passengersState.Adult.count +
                          passengersState.Child.count ===
                        7
                      }
                      disabled={
                        passengersState.Adult.count +
                          passengersState.Child.count ===
                        7
                      }
                      aria-label='increase-child'
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
                        handlePassengerSelect('Infant', -1)
                      }}
                      data-disabled={passengersState.Infant.count === 0}
                      disabled={passengersState.Infant.count === 0}
                      aria-label='decrease-infant'
                    >
                      <FiMinus />
                    </ActionIcon>
                    <div className='text-sm' aria-label='infant-count'>
                      {passengersState.Infant.count}
                    </div>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('Infant', 1)
                      }}
                      // data-disabled={
                      //   passengersState.Adult.count ==
                      //   passengersState.Infant.count
                      // }
                      disabled={
                        passengersState.Adult.count ===
                        passengersState.Infant.count
                      }
                      aria-label='increase-infant'
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
