import { TourDetailApiResponse } from '@/modules/tour/type'
import { AspectRatio, Button, Image, Spoiler, Title } from '@mantine/core'
import dayjs from 'dayjs'

type Props = {
  data: TourDetailApiResponse
}

const TourDetail: React.FC<Props> = ({ data }) => {
  return (
    <div className='@container grid gap-3'>
      <Title className='text-lg @lg:text-xl'>{data.package.title}</Title>

      <div>
        <AspectRatio ratio={16 / 9}>
          <Image
            src={data.detail.images.at(0)}
            alt={data.package.title}
            radius={'md'}
          />
        </AspectRatio>
      </div>
      <div className='flex gap-3'>
        <div>{dayjs(data.package.startDate).format('DD MMMM YYYY')}</div>
        <div>{dayjs(data.package.endDate).format('DD MMMM YYYY')}</div>
        <div>Tarihlerinde</div>
      </div>
      <div>
        <Title order={2} fz={'h4'} pb={'lg'}>
          Tur Programı
        </Title>

        <Spoiler
          maxHeight={200}
          hideLabel={'Daha Az Görüntüle'}
          showLabel={'Daha fazla göster'}
        >
          <div className='grid gap-3'>
            {data.detail.tourProgram.map((tourProgram, tourProgramIndex) => (
              <div key={tourProgramIndex}>
                <Title order={4} fz={'h5'}>
                  {tourProgram.title}
                </Title>
                <div
                  dangerouslySetInnerHTML={{
                    __html: tourProgram.description,
                  }}
                />
              </div>
            ))}
          </div>
        </Spoiler>
      </div>
      <div>
        <Title order={3} fz={'h4'}>
          Dahil Olan Hizmetler
        </Title>
        <Spoiler
          hideLabel={'Daha Az Görüntüle'}
          showLabel={'Daha fazla göster'}
          maxHeight={120}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: data.detail.includedInformation,
            }}
          />
        </Spoiler>
      </div>
      <div>
        <Title order={3} fz={'h4'}>
          Dahil Olmayan Hizmetler
        </Title>
        <Spoiler
          maxHeight={120}
          hideLabel={'Daha Az Görüntüle'}
          showLabel={'Daha fazla göster'}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: data.detail.notIncludedInformation,
            }}
          />
        </Spoiler>
      </div>
    </div>
  )
}

export { TourDetail }
