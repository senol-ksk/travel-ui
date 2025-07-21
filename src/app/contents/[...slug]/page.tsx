import { getContent } from '@/libs/cms-data'
import { CmsContent } from '@/types/cms-types'
import { Container, Title, TypographyStylesProvider } from '@mantine/core'
import { Link } from 'next-view-transitions'
import { notFound } from 'next/navigation'

type CmsParams = {
  content: {
    value: string
  }
  image: {
    value: string
  }
}

type CMSWidgets = {
  id: ID
  title: string
  typeId: ID
  collectionId: ID
  point: string
  params: {
    menu: {
      menus: {
        id: ID
        poolId: ID
        parentId: null
        language: string
        title: string
        url: string
        urlTarget: null
        comment: null
        icon: null
        image: null
        fileId: null
        active: boolean
        ordering: number
        createdBy: string
        createdDate: string
        updatedBy: string
        updatedDate: string
        items: []
      }[]
      value: string
    }
  }
  ordering: number
  language: string
  active: boolean
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params

  const data = (
    await getContent<CmsContent<CMSWidgets[], CmsParams>>(slug.join('/'))
  )?.data

  if (!data) return notFound() // or we can redirect custom not-fount page, see =>> https://nextjs.org/docs/app/api-reference/file-conventions/not-found
  const { params: cmsParams, widgets, title } = data

  return (
    <Container
      py={{
        base: 'md',
        sm: 'lg',
      }}
      className='flex flex-col gap-3 md:gap-5'
    >
      <Title>{title}</Title>
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-4'>
        <div className='md:col-span-1'>
          {widgets.map((widget) =>
            widget.params.menu.menus.map((menu) => (
              <div key={menu.id}>
                <Link href={menu.url}>{menu.title}</Link>
              </div>
            ))
          )}
        </div>
        <div className='md:col-span-3'>
          <TypographyStylesProvider>
            <div
              dangerouslySetInnerHTML={{ __html: cmsParams.content.value }}
            />
          </TypographyStylesProvider>
        </div>
      </div>
    </Container>
  )
}
