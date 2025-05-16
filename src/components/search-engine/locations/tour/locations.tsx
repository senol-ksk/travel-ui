'use client'

import { useRef, useState } from 'react'
import {
  TextInput,
  Transition,
  Paper,
  CloseButton,
  TextInputProps,
  Skeleton,
} from '@mantine/core'
import { useClickOutside, useFocusTrap } from '@mantine/hooks'
import { clsx } from 'clsx'

import { IoSearch } from 'react-icons/io5'

import { Input } from '@/components/search-engine/input'
import type {
  LocationResult,
  LocationResults,
} from '@/components/search-engine/locations/type'
import { MdOutlineSubdirectoryArrowRight } from 'react-icons/md'

type Props = {
  label: string
  inputProps?: TextInputProps
  onSelect?: (params: LocationResult) => void
  onChange?: (params: string) => void
  data?: LocationResults['Result']
  isLoading?: boolean
  defaultValue?: string
}

export const TourLocations: React.FC<Props> = ({
  label,
  inputProps,
  onSelect = () => {},
  onChange = () => {},
  isLoading = false,
  data = [],
  defaultValue = '',
}) => {
  const [locationContainerOpened, setLocationContainerOpened] = useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setLocationContainerOpened(false)
  )
  const [originValue, setOriginValue] = useState('')
  const [locatioName, setLocationName] = useState<string>(defaultValue)

  const focusTrapRef = useFocusTrap(true)
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className='relative'>
      <Input
        label={label}
        onClick={() => {
          setLocationContainerOpened(true)
        }}
        error={!!inputProps?.error}
        title={locatioName}
      />
      <Transition mounted={locationContainerOpened} transition='pop-top-right'>
        {(styles) => (
          <Paper
            ref={clickOutsideRef}
            className='fixed start-0 end-0 top-0 bottom-0 z-50 -ms-1 -mt-1 bg-white shadow-xl md:absolute md:end-auto md:bottom-auto md:max-w-[420px] md:min-w-[320px]'
            style={{ ...styles }}
          >
            <div className='flex justify-end md:hidden'>
              <CloseButton
                size={'xl'}
                onClick={() => setLocationContainerOpened(false)}
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
                  onChange(event.currentTarget.value)
                }}
                onFocus={(event) => event.target.select()}
                autoComplete='off'
                id='location_select'
                placeholder={label}
                size='xl'
                className='font-bold'
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
            <div className='max-h-[400px] min-h-[400px] overflow-y-auto'>
              <div
                className={clsx('grid w-9/12 gap-3 p-4', {
                  visible: isLoading,
                  hidden: !isLoading,
                })}
              >
                <Skeleton height={12} radius='xl' />
                <Skeleton height={12} mt={6} width='70%' radius='xl' />
                <Skeleton height={12} mt={6} radius='xl' />
              </div>
              {data && data.length > 0 && (
                <div>
                  {data.map((location) => {
                    const { Name, SubDestinations, Id } = location

                    return (
                      <div key={Id}>
                        <div className='relative'>
                          <button
                            type='button'
                            className='absolute start-0 end-0 top-0 bottom-0 border-0 bg-transparent p-0 transition-all hover:bg-blue-300/15'
                            onClick={() => {
                              setLocationName(Name)
                              onSelect(location)
                              setLocationContainerOpened(false)
                            }}
                          >
                            <span className='sr-only'>{Name}</span>
                          </button>
                          <div className='flex items-center gap-2 py-1 ps-4 pe-3'>
                            <div className='flex flex-col text-sm'>
                              <strong>{Name}</strong>
                            </div>
                          </div>
                        </div>
                        {SubDestinations.map((subDestination) => (
                          <div key={subDestination.Id}>
                            <div className='relative'>
                              <button
                                type='button'
                                className='absolute start-0 end-0 top-0 bottom-0 border-0 bg-transparent p-0 transition-all hover:bg-blue-300/15'
                                onClick={() => {
                                  setLocationName(subDestination.Name)
                                  onSelect(subDestination)
                                  setLocationContainerOpened(false)
                                }}
                              >
                                <span className='sr-only'>
                                  {subDestination.Name}
                                </span>
                              </button>
                              <div className='flex gap-3 px-4 py-1 ps-4 text-sm'>
                                <div className='text-xl'>
                                  <MdOutlineSubdirectoryArrowRight />
                                </div>
                                <div>{subDestination.Name}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              )}
              {!isLoading && data?.length === 0 ? (
                <div className='flex flex-col items-center gap-2 p-3 text-center'>
                  <div className='text-4xl'>
                    <IoSearch />
                  </div>
                  <div className='text-sm'>Şehir veya Havaalanı arayın.</div>
                </div>
              ) : null}
            </div>
          </Paper>
        )}
      </Transition>
    </div>
  )
}
