import { getContent } from '@/libs/cms-data'
import { CmsContent } from '@/types/cms-types'
import { Container, Title, Typography } from '@mantine/core'
import { Route } from 'next'
import { Link } from 'next-view-transitions'
import { notFound } from 'next/navigation'
import { FaArrowRight } from 'react-icons/fa'
import { headers } from 'next/headers'

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
  const headersList = await headers()
  const currentPath = headersList.get('x-pathname') || `/${slug.join('/')}`

  const data = (
    await getContent<CmsContent<CMSWidgets[], CmsParams>>(slug.join('/'))
  )?.data

  if (!data) return notFound() // or we can redirect custom not-found page, see =>> https://nextjs.org/docs/app/api-reference/file-conventions/not-found
  const { params: cmsParams, widgets, title } = data

  if (widgets && !widgets.length) notFound()

  return (
    <Container
      py={{
        base: 'md',
        sm: 'lg',
      }}
      className='flex flex-col gap-3 md:gap-5'
    >
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-4'>
        <div className='max-h-[300px] w-full max-w-xs flex-shrink-0 gap-4 overflow-y-auto rounded-md border p-2 shadow md:col-span-1'>
          {widgets.map((widget) =>
            widget.params.menu?.menus?.map((menu) => {
              const isActive = menu.url === currentPath
              return (
                <Link
                  href={menu.url as Route}
                  key={menu.id}
                  className={`group my-1 flex items-center justify-between rounded-md p-2 transition-all duration-100 ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:text-blue-800'}`}
                >
                  <div>{menu.title}</div>
                  <FaArrowRight
                    className={`transition-opacity duration-100 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  />
                </Link>
              )
            })
          )}
        </div>
        <div className='rounded-md border p-2 shadow md:col-span-3'>
          <Title order={2} className='mb-3'>
            {title}
          </Title>
          <Typography>
            <div
              dangerouslySetInnerHTML={{ __html: cmsParams.content.value }}
            />
          </Typography>
        </div>
      </div>
    </Container>
  )
}
