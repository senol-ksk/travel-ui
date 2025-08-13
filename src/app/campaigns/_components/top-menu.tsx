import { getCategoriesByParent } from '@/libs/cms-data'
import { Button, ScrollArea } from '@mantine/core'
import { Link } from 'next-view-transitions'

const linkPrefix = '/kampanyalar'

const CampaignTopMenus = async () => {
  const campaignData = (await getCategoriesByParent())?.data

  return (
    <ScrollArea scrollbars='x' offsetScrollbars scrollbarSize={6}>
      <div className='flex gap-3'>
        <div>
          <Button
            radius={'md'}
            className='font-normal hover:bg-blue-100'
            variant='default'
            component={Link}
            href={linkPrefix}
            size='md'
          >
            Tümü
          </Button>
        </div>
        {campaignData?.map((item) => {
          return (
            <div key={item.id}>
              <Button
                radius={'md'}
                variant='default'
                component={Link}
                href={`${linkPrefix}?categoryId=${item.id}`}
                size='md'
                className='font-normal hover:bg-blue-100'
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
