import { OperationResultType } from '@/app/reservation/types'

type IProps = {
  data: OperationResultType
}

export default function EmailCarRentalOrderResult({ data }: IProps) {
  return (
    <div>
      <code>{`<EmailCarRentalOrderResult />`}</code>
    </div>
  )
}
