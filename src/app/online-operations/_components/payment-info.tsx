import { formatCurrency } from '@/libs/util'
import { OperationResultViewData } from '../types'
import { BookDetailCard } from './card'

type IProps = {
  data: OperationResultViewData
}

export const PaymentInfo: React.FC<IProps> = ({ data }) => {
  return (
    <BookDetailCard>
      <div className='flex justify-between gap-3'>
        <div>Toplam:</div>
        <div>{formatCurrency(data.paymentInformation.collectingTotal)}</div>
      </div>
    </BookDetailCard>
  )
}
