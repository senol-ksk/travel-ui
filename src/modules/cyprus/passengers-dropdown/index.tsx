import { Input } from '@/components/search-engine/input'
import { HotelPassengerDropdown } from '@/components/search-engine/passengers/hotel'
import { Paper, Transition } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import { useState } from 'react'
import { RiUserLine } from 'react-icons/ri'

const CyprusSearchPassengers = () => {
  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )

  return (
    <div
      className='relative cursor-pointer'
      onClick={() => setContainerTransitionState(true)}
    >
      <RiUserLine
        size={20}
        className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
      />
      <Input label='Oda ve Kişi Sayısı' title={'1 oda 2 Yetişkin 4 Çocuk'} />
      <Transition mounted={containerTransitionState} transition='pop-top-right'>
        {(styles) => (
          <div
            ref={clickOutsideRef}
            className='fixed start-0 end-0 top-0 bottom-0 z-50 sm:absolute sm:start-auto sm:bottom-auto md:-ms-1 md:-mt-1'
            style={{ ...styles }}
            role='menu'
          >
            <Paper className='flex h-full flex-col rounded-lg border shadow-xl'></Paper>
          </div>
        )}
      </Transition>
    </div>
  )
}

export { CyprusSearchPassengers }
