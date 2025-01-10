import { TourDeatilApiResponse } from '@/modules/tour/type'
import { Image, Title } from '@mantine/core'

type Props = {
  data: TourDeatilApiResponse
}

const TourDetail: React.FC<Props> = ({ data }) => {
  return (
    <div className='@container'>
      <Title className='pb-4 text-lg @lg:text-xl'>{data.package.title}</Title>

      <div>
        <Image
          src={data.package.imageUrl}
          alt={data.package.title}
          radius={'md'}
        />
      </div>
    </div>
  )
}

export { TourDetail }
