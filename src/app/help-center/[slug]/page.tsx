import { getContent } from '@/libs/cms-data'
import { CmsContent } from '@/types/cms-types'
import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Button,
  Container,
  Grid,
  GridCol,
  NavLink,
  Title,
  Typography,
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

  const menuUrl = `yardim/${slug}`
  const data = (
    await getContent<CmsContent<CMSHelpCenterWidget[], CMSHelpCenterParams>>(
      menuUrl
    )
  )?.data

  if (!data) return null
  const { widgets, title } = data
  const accordionData = widgets.filter((x) => x.point === 'list')
  const topMenu = widgets.filter((x) => x.point === 'help_menu')

  return (
    <Container className='flex flex-col gap-4 py-4 md:py-8'>
      <Title fz={'h3'}>{title}</Title>
      <Grid gutter={{ base: 'md', md: 'xl' }}>
        <GridCol span={{ sm: 3 }}>
          <div className='rounded-md border p-3'>
            {topMenu.map((item) =>
              item.params.menu.menus.map((menu) => {
                console.log(menu)
                return (
                  <div key={menu.id}>
                    <NavLink
                      label={menu.title}
                      href={menu.url}
                      component={Link}
                      variant={'/' + menuUrl === menu.url ? 'light' : 'subtle'}
                      active={'/' + menuUrl === menu.url}
                    />
                  </div>
                )
              })
            )}
          </div>
        </GridCol>
        <GridCol span={{ sm: 9 }}>
          <Accordion chevronPosition='right' variant='contained' radius='md'>
            {accordionData.map((accordion) => (
              <AccordionItem key={accordion.id} value={accordion.title}>
                <AccordionControl
                  classNames={{
                    label: 'font-medium py-2 md:py-6',
                  }}
                >
                  {accordion.title}
                </AccordionControl>
                <AccordionPanel>
                  <Typography>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: accordion.params.description.value,
                      }}
                    />
                  </Typography>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </GridCol>
      </Grid>
    </Container>
  )
}
