import NumberFlow from '@number-flow/react'

type IProps = {
  value: number
}

const PriceNumberFlow: React.FC<IProps> = ({ value }) => {
  return (
    <NumberFlow
      format={{
        style: 'currency',
        currency: 'TRY',
        currencyDisplay: 'narrowSymbol',
      }}
      value={value}
    />
  )
}

export { PriceNumberFlow }
