import { Button, Container, Image, Title } from '@mantine/core'
import { type SearchParams } from 'nuqs/server'
import NextImage from 'next/image'

import { getContentBySlugAsync } from '@/libs/cms-data'
import { Link } from 'next-view-transitions'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const CampaignsDefault: React.FC<PageProps> = async ({ searchParams }) => {
  const { slug, target } = await searchParams
  const path = `kampanyalar/${slug}/${target}`
  const content = (await getContentBySlugAsync(path))?.data

  if (!content) return <div>no data</div>

  return (
    <Container>
      <Title fz={'h3'}>{content?.title}</Title>
      <div>
        <div className='relative h-[200px] w-full'>
          <Image
            component={NextImage}
            src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${content.params.image.value}`}
            fill
            alt={content.title}
            radius={'md'}
          />
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: content?.params.sort_description.value,
          }}
        />
        {content.params.promation_code && (
          <div>
            {content.params.promation.value}
            <div>{content.params.promation_code.value}</div>
          </div>
        )}
        {content.params.description && (
          <div>
            <Title order={2} fz={'h4'}>
              {content.params.description_title.value}
            </Title>
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: content.params.description.value,
                }}
              />
            </div>
          </div>
        )}
        {content.params.terms_Of_conditions && (
          <div>
            <Title order={2} fz={'h4'}>
              {content.params.terms_Of_conditions_title.value}
            </Title>
            <div>
              <div
                dangerouslySetInnerHTML={{
                  __html: content.params.terms_Of_conditions.value,
                }}
              />
            </div>
          </div>
        )}

        <Button component={Link} href={content.params.link.value}>
          {content.params.btn_name.value}
        </Button>
      </div>
    </Container>
  )
}

export default CampaignsDefault
