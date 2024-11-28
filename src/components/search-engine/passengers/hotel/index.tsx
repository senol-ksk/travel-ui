import { useState } from 'react'

import { Transition, Paper, Button, ActionIcon } from '@mantine/core'
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

export const HotelPassengerDropdown: React.FC<Props> = ({
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
      count: initialValues?.Infant || 0,
    },
  })

  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )

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
                      // onClick={() => {
                      //   handlePassengerSelect('Adult', -1)
                      // }}
                      // data-disabled={passengersState.Adult.count === 1}
                      // disabled={passengersState.Adult.count === 1}
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
                        // handlePassengerSelect('Adult', 1)
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
