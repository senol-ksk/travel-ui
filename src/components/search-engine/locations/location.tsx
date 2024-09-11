import { useEffect, useRef, useState } from 'react'
import {
  TextInput,
  Transition,
  Paper,
  CloseButton,
  TextInputProps,
} from '@mantine/core'
import { useClickOutside, useFocusTrap } from '@mantine/hooks'

import { IoSearch } from 'react-icons/io5'

import { Input } from '@/components/search-engine/input'

type Props = {
  label: string
  inputProps?: TextInputProps
  onSelect?: (params: string) => void
}

export const Locations: React.FC<Props> = ({ label, inputProps, onSelect }) => {
  const [returnLocationOpened, setReturnLocationOpened] = useState(false)
  const clickOutsideRef = useClickOutside(() => setReturnLocationOpened(false))
  const [originValue, setOriginValue] = useState('')

  const focusTrapRef = useFocusTrap(true)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className='relative'>
      <Input
        label={label}
        icon='location'
        onClick={() => {
          setReturnLocationOpened(true)
        }}
        error={!!inputProps?.error}
        title={originValue}
      />
      <Transition mounted={returnLocationOpened} transition='pop-top-right'>
        {(styles) => (
          <Paper
            ref={clickOutsideRef}
            className='fixed bottom-0 start-0 top-0 z-50 -ms-1 -mt-1 bg-white shadow-xl md:absolute md:bottom-auto md:end-0 md:min-w-[320px]'
            style={{ ...styles }}
          >
            <div className='flex justify-end md:hidden'>
              <CloseButton
                size={'xl'}
                onClick={() => setReturnLocationOpened(false)}
              />
            </div>
            <div className='sticky top-0 p-2' ref={focusTrapRef}>
              <label htmlFor='location_select' className='sr-only'>
                {label}
              </label>
              <TextInput
                ref={inputRef}
                value={originValue}
                onChange={(event) => {
                  setOriginValue(event.currentTarget.value)
                  onSelect && onSelect(event.currentTarget.value)
                }}
                onFocus={(event) => event.target.select()}
                autoComplete='off'
                id='location_select'
                placeholder={label}
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
