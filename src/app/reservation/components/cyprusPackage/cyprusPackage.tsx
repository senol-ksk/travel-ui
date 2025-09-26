import {
  CyprusPackageInfoApiResponse,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}

export const CyprusPackageSummarySection: React.FC<IProps> = ({ data }) => {
  const summaryResponse = data.SummaryViewDataResponser
    .summaryResponse as CyprusPackageInfoApiResponse

  return <div>{summaryResponse.roomGroup.hotel.name}</div>
}
