import { getCategoriesByParent } from '@/libs/cms-data'
import { Button, ScrollArea } from '@mantine/core'
import { Link } from 'next-view-transitions'
import { SearchParams } from 'nuqs'

const linkPrefix = '/kampanyalar'

type CampaignTopMenusProps = {
  searchParams: Promise<SearchParams>
}

const CampaignTopMenus = async ({ searchParams }: CampaignTopMenusProps) => {
  const { categoryId } = await searchParams
  const campaignData = (await getCategoriesByParent())?.data

  return (
    <ScrollArea
      scrollbars='x'
      offsetScrollbars
      scrollbarSize={13}
      className='pb-3'
    >
      <div className='flex gap-3'>
        <div>
          <Button
            radius={'md'}
            className={`font-normal hover:bg-blue-100 ${!categoryId ? 'bg-blue-800 text-white hover:bg-blue-800' : ''}`}
            variant='default'
            component={Link}
            href={linkPrefix}
            size='md'
          >
            Tümü
          </Button>
        </div>
        {campaignData?.map((item) => {
          const isActive = categoryId === String(item.id)
          return (
            <div key={item.id}>
              <Button
                radius={'md'}
                variant='default'
                component={Link}
                href={`${linkPrefix}?categoryId=${item.id}`}
                size='md'
                className={`font-normal hover:bg-blue-100 ${isActive ? 'bg-blue-800 text-white hover:bg-blue-800' : ''}`}
              >
                {item.title}
              </Button>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

export { CampaignTopMenus }
