import { Button, TextInput } from '@mantine/core'
import { useInputState, useMediaQuery } from '@mantine/hooks'
import { useRef } from 'react'
import { CiShoppingTag } from 'react-icons/ci'
import { MdOutlineConfirmationNumber, MdSell } from 'react-icons/md'

type IProps = {
  onRevoke: () => void
  defaultCouponValue?: string
  onCouponSubmit: (couponValue: string) => void
  loading: boolean
  isCouponUsed: boolean
}

const Coupon: React.FC<IProps> = ({
  onCouponSubmit = () => {},
  defaultCouponValue,
  onRevoke,
  loading,
  isCouponUsed,
}) => {
  const [couponValue, setCouponValue] = useInputState(defaultCouponValue ?? '')
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <MdSell size={22} className='text-blue-800' />
        <span className='text-xl font-bold'>İndirim Kodu Kullan</span>
      </div>
      <div className='flex gap-2 pt-3'>
        <TextInput
          className='w-[70%] md:w-[49%]'
          ref={inputRef}
          size='md'
          placeholder='Kodu giriniz'
          value={couponValue}
          onChange={setCouponValue}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
            }
          }}
          minLength={3}
          disabled={isCouponUsed}
        />
        <Button
          color={isCouponUsed ? 'red' : 'green'}
          type='button'
          radius='md'
          size='md'
          loading={loading}
          onClick={() => {
            if (couponValue.length < 3 && !isCouponUsed) {
              inputRef.current?.focus()
              return
            }

            if (isCouponUsed) {
              onRevoke()
              return
            }

            onCouponSubmit(couponValue)
          }}
        >
          {isCouponUsed ? 'Geri Al' : 'Uygula'}
        </Button>
      </div>
    </div>
  )
}

export { Coupon }
