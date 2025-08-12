import { AspectRatio, Button, Container, Image, Title } from '@mantine/core'
import { type SearchParams } from 'nuqs/server'
import NextImage from 'next/image'

import { getContentBySlugAsync } from '@/libs/cms-data'
import { Link } from 'next-view-transitions'
import { CampaignCopySection } from '@/app/campaigns/_components/campaign-copy-value'

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
      <div className='my-5 p-3'>
        <div className='relative mb-5 w-full'>
          <AspectRatio ratio={25 / 12} className='mb-5 pb-5'>
            <Image
              component={NextImage}
              src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${content.params.image.value}`}
              alt={content.title}
              width={5000}
              height={5000}
              priority
              radius={'md'}
              placeholder='empty'
            />
          </AspectRatio>
        </div>
        <Title className='mt-5 mb-2' fz={'h1'}>
          {content?.title}
        </Title>
        <div
          className=''
          dangerouslySetInnerHTML={{
            __html: content?.params.sort_description.value,
          }}
        />
        {content.params.promation_code && (
          <CampaignCopySection code={content.params.promation_code.value} />
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

        <Button
          size='md'
          className='my-5'
          component={Link}
          href={content.params.link.value}
        >
          {content.params.btn_name.value}
        </Button>
      </div>
    </Container>
  )
}

export default CampaignsDefault
