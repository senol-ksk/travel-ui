import { getContent } from '@/libs/cms-data'
import { CmsContent } from '@/types/cms-types'
import {
  Button,
  Container,
  Title,
  TypographyStylesProvider,
} from '@mantine/core'
import { Link } from 'next-view-transitions'

type CMSHelpCenterParams = {
  sub_title: {
    value: string
  }
  content: {
    value: string
  }
  image: {
    value: string
  }
  images: {
    list: null
    value: null
  }
}

type CMSHelpCenterWidget = {
  id: ID
  title: string
  typeId: ID
  collectionId: null
  point: 'list' | 'help_menu'
  params: {
    sort_description: {
      value: string
    }
    description: {
      value: string
    }
    btn_text: {
      value: string
    }
    link: {
      value: string
    }
    image: {
      value: string
    }
    svg: {
      value: string
    }
    view_country: {
      value: string
    }
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
        updatedBy: null
        updatedDate: null
        items: []
      }[]
      value: string
    }
  }
  ordering: number
  language: string
  active: boolean
}

export default async function HelpCenterPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  console.log(slug)
  const menuUrl = `yardim/${slug}`
  const data = (
    await getContent<CmsContent<CMSHelpCenterWidget[], CMSHelpCenterParams>>(
      menuUrl
    )
  )?.data

  console.log(data)

  if (!data) return null
  const { widgets, title } = data
  const accordionData = widgets.filter((x) => x.point === 'list')
  const topMenu = widgets.filter((x) => x.point === 'help_menu')

  return (
    <Container className='flex flex-col gap-4 py-4 md:py-8'>
      <Title>{title}</Title>
      <div className='flex justify-center gap-3'>
        {topMenu.map((item) =>
          item.params.menu.menus.map((menu) => (
            <div key={menu.id}>
              <Button
                href={menu.url}
                component={Link}
                size='compact-sm'
                variant={'/' + menuUrl === menu.url ? 'filled' : 'outline'}
                radius={'lg'}
              >
                {menu.title}
              </Button>
            </div>
          ))
        )}
      </div>
      <div className='flex flex-col gap-4 pt-4'>
        {accordionData.map((accordion) => (
          <div key={accordion.id}>
            <Title order={4}>{accordion.title}</Title>
            <div className='pt-2'>
              <TypographyStylesProvider>
                <div
                  dangerouslySetInnerHTML={{
                    __html: accordion.params.description.value,
                  }}
                />
              </TypographyStylesProvider>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
