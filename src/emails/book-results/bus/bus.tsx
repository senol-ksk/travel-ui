import {
  BusSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'

type IProps = {
  data: OperationResultType
}

export default function EmailBusOrderResult({ data }: IProps) {
  const { busJourney } = data.product.summaryResponse as BusSummaryResponse
  return <div>EmailBusOrderResult</div>
}
