import {
  BusGender,
  SeatColors,
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
  onSeatSelect: (genderType: BusGender) => void
  maxSelectCountReached: boolean
}

const SeatView: React.FC<Props> = ({
  data,
  onSeatSelect = () => null,
  maxSelectCountReached = false,
}) => {
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
    data.status === SeatStatus.REZERVTOMAN ||
    data.status === SeatStatus.REZERVTOWOMAN ||
    data.no < 0

  const handleSeatSelect = (genderType: BusGender) => {
    setSelectedState((prev) => !prev)
    closeGenderFrame()
    onSeatSelect(genderType)
  }

  const seatColor = selectedState
    ? SeatColors.SELECTED
    : data.status === SeatStatus.TAKENBYMAN ||
        data.status === SeatStatus.REZERVTOMAN
      ? SeatColors.MALE
      : data.status === SeatStatus.TAKENBYWOMAN ||
          data.status === SeatStatus.REZERVTOWOMAN
        ? SeatColors.WOMAN
        : SeatColors.AVAILABLE

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
              if (selectedState || maxSelectCountReached) {
                setSelectedState(false)
                onSeatSelect(BusGender.EMPTY)
              } else {
                openGenderFrame()
              }
            }}
          >
            <div
              className='flex size-[36px] items-center justify-center rounded-t-lg border-t border-r border-b-4 border-l border-gray-600 border-b-gray-600 pt-1'
              style={{
                backgroundColor: `var(${seatColor})`,
              }}
            >
              <div className='seat-no absolute start-0 end-0 top-0 bottom-0 z-10 flex items-center justify-center text-sm text-black'>
                {data.no}
              </div>
              {/* <svg
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
                    : data.status === SeatStatus.TAKENBYMAN ||
                        data.status === SeatStatus.REZERVTOMAN
                      ? 'blue'
                      : data.status === SeatStatus.TAKENBYWOMAN ||
                          data.status === SeatStatus.REZERVTOWOMAN
                        ? 'pink'
                        : 'white'
                }
              >
                <use xlinkHref='#seat' />
              </svg> */}
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
