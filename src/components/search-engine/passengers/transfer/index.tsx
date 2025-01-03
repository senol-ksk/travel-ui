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

type PassengerTypes = 'adult' | 'child' | 'infant'

type PassengerRequestModel = { adult: number; child: number; infant: number }

type Props = {
  onChange?: (params: {
    adult?: number
    child?: number
    infant?: number
  }) => void
  initialValues?: PassengerRequestModel | null
}

export const PassengerDropdown: React.FC<Props> = ({
  onChange = () => {},
  initialValues,
}) => {
  const [passengersState, setPassengersState] = useState({
    adult: {
      count: initialValues?.adult || 1,
    },
    child: {
      count: initialValues?.child || 0,
    },
    infant: {
      count: initialValues?.infant || 0,
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
      currentState.adult.count === currentState.infant.count &&
      type === 'adult' &&
      count === -1
    if (shouldInfantDecrement) {
      onChange({
        infant: currentState.infant.count - 1,
        child: currentState.child.count,
        [type]: currentState[type].count + count,
      })
    } else {
      onChange({
        adult: currentState.adult.count,
        infant: currentState.infant.count,
        child: currentState.child.count,
        [type]: currentState[type].count + count,
      })
    }

    setPassengersState((prev) => {
      if (shouldInfantDecrement) {
        return {
          ...currentState,
          Infant: { count: currentState.infant.count - 1 },
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
        label='Kişi sayısı'
        title={`${
          passengersState.adult.count +
          passengersState.child.count +
          passengersState.infant.count
        } Kişi`}
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
                  <div className='text-sm'>
                    Yetişkinler
                    <div>
                      <small>12+ Yaş</small>
                    </div>
                  </div>
                  <div className='flex items-center justify-between gap-3'>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('adult', -1)
                      }}
                      data-disabled={passengersState.adult.count === 1}
                      disabled={passengersState.adult.count === 1}
                      aria-label='decrease-adult'
                    >
                      <FiMinus />
                    </ActionIcon>
                    <div className='text-sm' aria-label='adult-count'>
                      {passengersState.adult.count}
                    </div>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('adult', 1)
                      }}
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
                      <small>(2 - 11 Yaş)</small>
                    </div>
                  </div>
                  <div className='flex items-center justify-between gap-3'>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('child', -1)
                      }}
                      data-disabled={passengersState.child.count === 0}
                      disabled={passengersState.child.count === 0}
                      aria-label='decrease-child'
                    >
                      <FiMinus />
                    </ActionIcon>
                    <div className='text-sm' aria-label='child-count'>
                      {passengersState.child.count}
                    </div>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('child', 1)
                      }}
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
                      <small>(0 - 2 Yaş)</small>
                    </div>
                  </div>
                  <div className='flex items-center justify-between gap-3'>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('infant', -1)
                      }}
                      data-disabled={passengersState.infant.count === 0}
                      disabled={passengersState.infant.count === 0}
                      aria-label='decrease-infant'
                    >
                      <FiMinus />
                    </ActionIcon>
                    <div className='text-sm' aria-label='infant-count'>
                      {passengersState.infant.count}
                    </div>
                    <ActionIcon
                      radius='xl'
                      variant='outline'
                      size={'lg'}
                      onClick={() => {
                        handlePassengerSelect('infant', 1)
                      }}
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
