import { PiSteeringWheelLight } from 'react-icons/pi'
import { SeatView } from './seat'
import { busSeatResponseDummy } from '@/app/bus/search-results/seat-response'
import clsx from 'clsx'
import { useLayoutEffect, useState } from 'react'
import { Seat } from '@/app/bus/types'

import { BusSeatIcons } from './icons'

let top = 0
let left = 0
const offset = 45

let col_counter = 0
let row_counter = 0

const BusFrame = () => {
  const [seatDataState, setSeatPositions] = useState<
    { left: number; top: number; seatData: Seat }[]
  >([])

  const [seatWrapperDimensions, setSeatWrapperDimensions] = useState({
    height: 0,
    width: 0,
  })

  const initSeatPostions = () => {
    const seats = busSeatResponseDummy.data.seats.map(
      (seat, seatIndex, seatData) => {
        top = row_counter * offset
        left = col_counter * offset

        row_counter = col_counter === 4 ? row_counter + 1 : row_counter
        col_counter = col_counter === 4 ? 0 : col_counter + 1

        if (seatData.length - 1 === seatIndex) {
          setSeatWrapperDimensions({
            height: row_counter * offset,
            width: 5 * offset,
          })

          row_counter = 0
          col_counter = 0
        }

        return {
          top,
          left,
          seatData: seat,
        }
      }
    )

    setSeatPositions(seats)
  }

  useLayoutEffect(() => {
    initSeatPostions()
  }, [])

  return (
    <>
      <BusSeatIcons />
      <div className='flex justify-center'>
        <div className='bus-wrapper relative rounded-3xl border-4 border-gray-500 bg-gray-50 p-4 text-gray-600'>
          <div className='flex w-1/3 flex-col items-center justify-center'>
            <div className='pb-3'>
              <PiSteeringWheelLight strokeWidth={5} size={40} />
            </div>
            <div
              id='bus-wheel-seperator'
              className='h-[3px] w-full rounded-lg bg-gray-400'
            />
          </div>

          <div id='seats-section' className='relative pt-1'>
            <div
              className='relative'
              style={{
                height: seatWrapperDimensions.height,
                width: seatWrapperDimensions.width,
              }}
            >
              {seatDataState.map((seat, seatIndex) => {
                return (
                  <div
                    key={seatIndex}
                    className={clsx(
                      'seat absolute flex h-[45px] w-[45px] items-center justify-center',
                      {
                        'opacity-0': seat.seatData.no < 0,
                      }
                    )}
                    style={{
                      left: seat.left,
                      top: seat.top,
                    }}
                  >
                    <SeatView
                      data={seat.seatData}
                      onSeatSelect={(gender) => {
                        console.log(gender)
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { BusFrame }
