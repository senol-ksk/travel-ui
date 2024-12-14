import { carDetailSearchParamsCache } from '@/app/car/searchParams'

export const CarDetail: React.FC = () => {
  const params = carDetailSearchParamsCache.all()

  return <div>detail data</div>
}
