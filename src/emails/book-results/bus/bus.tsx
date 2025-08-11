import { busSeatResponseDummy } from '@/app/bus/search-results/seat-response'
import {
  BusSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'
import { busDummyResponse } from '../_dummy-response/bus'

type IProps = {
  data: OperationResultType
}

export default function EmailBusOrderResult({ data }: IProps) {
  const { busJourney } = data.product.summaryResponse as BusSummaryResponse
  const { passenger } = data
  return (
    <div>
      <div>{busDummyResponse.product.summaryResponse.hotelSlug}</div>
      otonusun dummy datası otelındekını koydum onu degsıtr satın alım yapıp
      datayı yerıne console.loıga yazdırıp al kopyala ve yerıne koy yoksa hata
      alaırısn
    </div>
  )
}
EmailBusOrderResult.PreviewProps = {
  data: busDummyResponse,
}
