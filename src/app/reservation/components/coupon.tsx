import { Button, TextInput } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { useRef } from 'react'

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
      <div className='text-lg font-semibold'>İndirim Kodu Kullan</div>
      <div className='flex gap-2 pt-3'>
        <TextInput
          ref={inputRef}
          value={couponValue}
          onChange={setCouponValue}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
            }
          }}
          maxLength={10}
          minLength={3}
          disabled={isCouponUsed}
        />
        <Button
          color={isCouponUsed ? 'red' : 'green'}
          type='button'
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
          {isCouponUsed ? 'Geri Al' : 'Kullan'}
        </Button>
      </div>
    </div>
  )
}

export { Coupon }
