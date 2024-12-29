import { type Seat } from '@/app/bus/types'

type Props = {
  data: Seat
}

const SeatView: React.FC<Props> = ({ data }) => {
  return (
    <div className='relative'>
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
          fill='white'
        >
          <use xlinkHref='#seat' />
        </svg>
      </div>
    </div>
  )
}

export { SeatView }
