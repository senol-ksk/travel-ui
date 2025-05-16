import { useEffect, useRef, useState } from 'react'

import {
  Transition,
  Paper,
  CloseButton,
  Skeleton,
  Button,
  ActionIcon,
  Text,
} from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'

import { FiPlus, FiMinus } from 'react-icons/fi'

import { Input } from '@/components/search-engine/input'

type PassengerTypes = 'adult' | 'child' | 'infant'

type PassengerRequestModel = { adult: number; child: number; infant: number }

type Props = {
  onChange?: (params: { adult: number; child: number; infant: number }) => void
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
    <div className='relative h-full'>
      <Input
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
            className='fixed start-0 end-0 top-0 bottom-0 z-50 sm:absolute sm:start-auto sm:bottom-auto md:-ms-1 md:-mt-1'
            style={{ ...styles }}
            role='menu'
          >
            <Paper className='flex h-full flex-col rounded-lg shadow-xl'>
              <div className='grid min-w-[320px] gap-7 p-5'>
                <div className='flex items-center justify-between'>
                  <Text className='text-sm'>
                    Yetişkinler
                    <Text size='sm'>(12+ Yaş)</Text>
                  </Text>
                  <div className='flex items-center justify-between gap-3'>
                    <ActionIcon
                      color='black'
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
                    <Text size='sm' aria-label='adult-count'>
                      {passengersState.adult.count}
                    </Text>
                    <ActionIcon
                      color='black'
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
                  <Text className='text-sm'>
                    Çocuk
                    <Text size='sm'> (2 - 11 Yaş)</Text>
                  </Text>
                  <div className='flex items-center justify-between gap-3'>
                    <ActionIcon
                      color='black'
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
                    <Text aria-label='child-count'>
                      {passengersState.child.count}
                    </Text>
                    <ActionIcon
                      color='black'
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
                  <Text className='text-sm'>
                    Bebek
                    <Text size='sm'>(0 - 2 Yaş)</Text>
                  </Text>
                  <div className='flex items-center justify-between gap-3'>
                    <ActionIcon
                      color='black'
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
                    <Text aria-label='infant-count'>
                      {passengersState.infant.count}
                    </Text>
                    <ActionIcon
                      color='black'
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
