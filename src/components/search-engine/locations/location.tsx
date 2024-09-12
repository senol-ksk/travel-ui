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

import { IoSearch } from 'react-icons/io5'
import { IoAirplaneSharp } from 'react-icons/io5'
import { MdOutlineSubdirectoryArrowRight } from 'react-icons/md'

import { Input } from '@/components/search-engine/input'
import { LocationsApiResults } from './locations'
import { clsx } from 'clsx'

type Props = {
  label: string
  inputProps?: TextInputProps
  onSelect?: (params: string) => void
  onChange?: (params: string) => void
  data?: LocationsApiResults['Result']
  isLoading?: boolean
}

export const Locations: React.FC<Props> = ({
  label,
  inputProps,
  onSelect = () => {},
  onChange = () => {},
  isLoading = false,
  data = [],
}) => {
  const [locationContainerOpened, setLocationContainerOpened] = useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setLocationContainerOpened(false)
  )
  const [originValue, setOriginValue] = useState('')
  const [locatioName, setLocationName] = useState('')

  const focusTrapRef = useFocusTrap(true)
  const inputRef = useRef<HTMLInputElement>(null)

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
            className='fixed bottom-0 end-0 start-0 top-0 z-50 -ms-1 -mt-1 bg-white shadow-xl md:absolute md:bottom-auto md:end-auto md:min-w-[320px] md:max-w-[420px]'
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
                  {data.map(({ Id, Name, SubDestinations }) => (
                    <div key={Id}>
                      <div className='relative'>
                        <button
                          type='button'
                          className='absolute bottom-0 end-0 start-0 top-0 border-0 bg-transparent p-0 transition-all hover:bg-blue-400 hover:bg-opacity-15'
                          onClick={() => {
                            setLocationName(Name)
                            onSelect && onSelect(Name)
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
                          {SubDestinations.map(
                            ({ Id: subId, Name: subName }) => (
                              <div key={subId} className='relative'>
                                <button
                                  type='button'
                                  className='absolute bottom-0 end-0 start-0 top-0 border-0 bg-transparent p-0 transition-all hover:bg-blue-400 hover:bg-opacity-15'
                                  onClick={() => {
                                    setLocationName(subName)
                                    onSelect && onSelect(subName)
                                    setLocationContainerOpened(false)
                                  }}
                                >
                                  <span className='sr-only'>{subName}</span>
                                </button>
                                <div className='flex gap-2 py-2 pe-2 ps-12'>
                                  <div className='text-2xl'>
                                    <MdOutlineSubdirectoryArrowRight />
                                  </div>
                                  <div className='text-sm'>{subName}</div>
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
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