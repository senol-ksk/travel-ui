import {
  BusGender,
  SeatSideStatus,
  SeatStatus,
  type Seat,
} from '@/app/bus/types'
import { Button, Popover } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import clsx from 'clsx'
import { useState } from 'react'

type Props = {
  data: Seat
  onSeatSelect: (genderType: BusGender | 0) => void
}

const SeatView: React.FC<Props> = ({ data, onSeatSelect = () => null }) => {
  const [
    genderFrame,
    {
      close: closeGenderFrame,
      open: openGenderFrame,
      toggle: toggleGenderFrame,
    },
  ] = useDisclosure(false)

  const [selectedState, setSelectedState] = useState(false)
  const isSeatAvailable =
    data.status === SeatStatus.TAKENBYMAN ||
    data.status === SeatStatus.TAKENBYWOMAN ||
    data.no < 0

  const handleSeatSelect = (genderType: BusGender) => {
    setSelectedState((prev) => !prev)
    closeGenderFrame()
    onSeatSelect(genderType)
  }

  if (data.no < 0) return null

  return (
    <>
      <Popover
        width={200}
        position='bottom'
        withArrow
        shadow='md'
        disabled={isSeatAvailable}
        opened={genderFrame}
        onChange={toggleGenderFrame}
      >
        <Popover.Target>
          <Button
            unstyled
            className='relative cursor-pointer bg-transparent'
            disabled={isSeatAvailable}
            onClick={() => {
              if (selectedState) {
                setSelectedState(false)
                onSeatSelect(0)
              } else {
                openGenderFrame()
              }
            }}
          >
            <div className='seat-no absolute bottom-0 end-0 start-0 top-0 z-10 flex items-center justify-center pb-1'>
              {data.no}
            </div>
            <div className='seat-icon'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                xmlnsXlink='http://www.w3.org/1999/xlink'
                height={37}
                width={36}
                style={{
                  transform: 'rotate(90deg)',
                }}
                stroke='gray'
                fill={
                  selectedState
                    ? 'green'
                    : data.status === SeatStatus.TAKENBYMAN
                      ? 'blue'
                      : data.status === SeatStatus.TAKENBYWOMAN
                        ? 'pink'
                        : 'white'
                }
              >
                <use xlinkHref='#seat' />
              </svg>
            </div>
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <div className='grid grid-cols-2 justify-center gap-3'>
            <button
              type='button'
              className={clsx(
                'grid cursor-pointer justify-center gap-1 border-0 bg-white p-0 align-middle text-sm',
                {
                  'opacity-35': !(
                    data.sideStatus === SeatSideStatus.SaleToMr ||
                    data.sideStatus === SeatSideStatus.empty
                  ),
                }
              )}
              disabled={
                !(
                  data.sideStatus === SeatSideStatus.SaleToMr ||
                  data.sideStatus === SeatSideStatus.empty
                )
              }
              onClick={() => {
                handleSeatSelect(BusGender.MALE)
              }}
            >
              <div>
                <svg xmlns='http://www.w3.org/2000/svg' width='62' height='62'>
                  <use xlinkHref='#seat-man' />
                </svg>
              </div>
              <div>Erkek</div>
            </button>
            <button
              type='button'
              className={clsx(
                'grid cursor-pointer justify-center gap-1 border-0 bg-white p-0 align-middle text-sm',
                {
                  'opacity-35': !(
                    data.sideStatus === SeatSideStatus.SaleToLady ||
                    data.sideStatus === SeatSideStatus.empty
                  ),
                }
              )}
              disabled={
                !(
                  data.sideStatus === SeatSideStatus.SaleToLady ||
                  data.sideStatus === SeatSideStatus.empty
                )
              }
              onClick={() => {
                handleSeatSelect(BusGender.WOMAN)
              }}
            >
              <div>
                <svg xmlns='http://www.w3.org/2000/svg' width='62' height='62'>
                  <use xlinkHref='#seat-woman' />
                </svg>
              </div>
              <div>Kadın</div>
            </button>
          </div>
        </Popover.Dropdown>
      </Popover>
    </>
  )
}

export { SeatView }
