import { useRef, useState } from 'react'
import { TextInput, Transition, Paper, CloseButton } from '@mantine/core'
import { useClickOutside, useFocusTrap } from '@mantine/hooks'

import { IoSearch } from 'react-icons/io5'

import { Input } from '@/components/search-engine/input'

export const Locations = () => {
  const [returnLocationOpened, setReturnLocationOpened] = useState(false)
  const clickOutsideRef = useClickOutside(() => setReturnLocationOpened(false))
  const [originValue, setOriginValue] = useState('')

  const focusTrapRef = useFocusTrap()
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className='relative'>
      <Input
        label='Nereden'
        icon='location'
        onClick={() => {
          setReturnLocationOpened(true)
        }}
      />
      <Transition mounted={returnLocationOpened} transition='pop-top-right'>
        {(styles) => (
          <Paper
            ref={clickOutsideRef}
            className='fixed start-0 top-0 z-50 min-w-[320px] shadow-xl md:absolute'
            style={{ ...styles }}
          >
            <div className='sticky top-0 p-2' ref={focusTrapRef}>
              <label htmlFor='origin_select' className='sr-only'>
                Nereden
              </label>
              <TextInput
                ref={inputRef}
                value={originValue}
                onChange={(event) => setOriginValue(event.currentTarget.value)}
                autoComplete='off'
                id='origin_select'
                placeholder='Nereden'
                size='lg'
                rightSectionPointerEvents='all'
                rightSection={
                  <CloseButton
                    onClick={() => {
                      inputRef.current?.focus()
                      setOriginValue('')
                    }}
                    aria-label='Aramayı temizle'
                    style={{ display: originValue ? undefined : 'none' }}
                  />
                }
              />
            </div>
            <div className='min-h-[400px]'>
              <div className='flex flex-col items-center gap-2 pt-4 text-center'>
                <div className='text-4xl'>
                  <IoSearch />
                </div>
                <div className='text-sm'>Hava yolu veya Şehir arayın.</div>
              </div>
            </div>
          </Paper>
        )}
      </Transition>
    </div>
  )
}
