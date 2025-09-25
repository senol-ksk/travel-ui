import { CyprusPackageSummaryResponse } from '@/app/reservation/types'

type IProps = {
  data: CyprusPackageSummaryResponse
}

export const CyprusPackageSummary: React.FC<IProps> = ({ data }) => {
  return <div>{data.roomGroup.hotel.name}</div>
}
