import { useEffect, useRef, useState } from 'react'
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
import { IoAirplaneSharp } from 'react-icons/io5'
import { MdOutlineSubdirectoryArrowRight } from 'react-icons/md'

import { Input } from '@/components/search-engine/input'
import type {
  LocationResult,
  LocationResults,
} from '@/components/search-engine/locations/type'

type Props = {
  label: string
  inputProps?: TextInputProps
  onSelect?: (params: LocationResult) => void
  onChange?: (params: string) => void
  data?: LocationResults['Result']
  isLoading?: boolean
  defaultValue?: string | null
}

export const Locations: React.FC<Props> = ({
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
  const [locatioName, setLocationName] = useState<null | string>(null)

  const focusTrapRef = useFocusTrap(true)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (defaultValue) setLocationName(defaultValue)
  }, [defaultValue])

  return (
    <div className='relative'>
      <Input
        label={label}
        icon='location'
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
              {data?.length > 0 && (
                <div>
                  {data.map((location) => {
                    const { Id, Name, SubDestinations } = location

                    return (
                      <div key={Id}>
                        <div className='relative'>
                          <button
                            type='button'
                            className='hover:bg-opacity-15 absolute start-0 end-0 top-0 bottom-0 border-0 bg-transparent p-0 transition-all hover:bg-blue-300'
                            onClick={() => {
                              setLocationName(Name)
                              onSelect(location)
                              setLocationContainerOpened(false)
                            }}
                          >
                            <span className='sr-only'>{Name}</span>
                          </button>
                          <div className='flex items-center gap-3 p-4'>
                            <div className='text-2xl'>
                              <IoAirplaneSharp />
                            </div>
                            <div className='flex flex-col text-sm'>
                              <strong>{Name}</strong>
                            </div>
                          </div>
                        </div>
                        {SubDestinations.length > 0 && (
                          <div className='grid'>
                            {SubDestinations.map((subLocation) => {
                              const { Id: subId, Name: subName } = subLocation

                              return (
                                <div key={subId} className='relative'>
                                  <button
                                    type='button'
                                    className='hover:bg-opacity-15 absolute start-0 end-0 top-0 bottom-0 border-0 bg-transparent p-0 transition-all hover:bg-blue-300'
                                    onClick={() => {
                                      setLocationName(subName)
                                      onSelect(subLocation)
                                      setLocationContainerOpened(false)
                                    }}
                                  >
                                    <span className='sr-only'>{subName}</span>
                                  </button>
                                  <div className='flex gap-2 py-2 ps-12 pe-2'>
                                    <div className='text-2xl'>
                                      <MdOutlineSubdirectoryArrowRight />
                                    </div>
                                    <div className='text-sm'>{subName}</div>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              {!isLoading && data.length === 0 ? (
                <div className='flex flex-col items-center gap-2 p-3 text-center'>
                  <div className='text-4xl'>
                    <IoSearch />
                  </div>
                  <div className='text-sm'>Hava yolu veya Şehir arayın.</div>
                </div>
              ) : null}
            </div>
          </Paper>
        )}
      </Transition>
    </div>
  )
}
