import { Preview } from '@react-email/components'

import { EmailBody } from '@/emails/_components/body'

import {
  CyprusPackageSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'

import { __dummy__cyprusPackageResult } from '../_dummy-response/cyprus'

type IProps = {
  data: OperationResultType
}

export default function EmailCyprusPackageBookResult({ data }: IProps) {
  const {
    roomGroup: { hotel },
  } = data.product.summaryResponse as CyprusPackageSummaryResponse

  return (
    <EmailBody previewText='Kıbrıs Satın Alma Bilgileriniz'>
      {hotel.name}
    </EmailBody>
  )
}

EmailCyprusPackageBookResult.PreviewProps = {
  data: __dummy__cyprusPackageResult.data,
}
