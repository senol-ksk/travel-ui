import { Suspense } from 'react'
import { Container, Skeleton, Title } from '@mantine/core'
import { SearchParams } from 'nuqs'

import { CampaignTopMenus } from './_components/top-menu'
import { CategoryContents } from './_components/category-contents'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const CampaignsDefault: React.FC<PageProps> = async ({ searchParams }) => {
  const { categoryId } = await searchParams
  return (
    <Container className='py-3 md:py-6'>
      <Title fz={'h2'} className='pb-5'>
        Kampanyalar
      </Title>
      <Suspense fallback={<Skeleton height={20} />}>
        <CampaignTopMenus searchParams={searchParams} />
      </Suspense>
      <div className='pt-5'>
        <Suspense
          fallback={
            <div className='grid gap-2'>
              <Skeleton h={200} />
              <Skeleton h={20} />
              <Skeleton h={20} />
            </div>
          }
        >
          <CategoryContents categoryId={categoryId as string} />
        </Suspense>
      </div>
    </Container>
  )
}

export default CampaignsDefault
