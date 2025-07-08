import React, { useState } from 'react'
import { Drawer, Button, Title, Loader, Accordion } from '@mantine/core'
import { HotelDetailDescription } from '@/app/hotel/types'
import { useQuery } from '@tanstack/react-query'
import { serviceRequest } from '@/network'
import { BiChevronRight } from 'react-icons/bi'
import { MdOutlineBeachAccess } from 'react-icons/md'
import { IoClose } from 'react-icons/io5'
import { CiDiscount1 } from 'react-icons/ci'

type IProps = {
  description: HotelDetailDescription
}

const HotelDrawers: React.FC<IProps> = ({ description }) => {
  const [opened, setOpened] = useState(false)
  const [activeDrawer, setActiveDrawer] = useState<number | null>(null)

  const handleDrawerOpen = (drawerNumber: number) => {
    setActiveDrawer(drawerNumber)
    setOpened(true)
  }

  const handleClose = () => {
    setOpened(false)
    setActiveDrawer(null)
  }

  const campaignDataQuery = useQuery({
    enabled: activeDrawer === 2,
    queryKey: ['hotel-detail-campaigns'],
    queryFn: async () => {
      const response = await serviceRequest<
        {
          id: ID
          params: {
            terms_Of_conditions: {
              value: string
            }
          }
          title: string

          categoryId: ID
        }[]
      >({
        axiosOptions: {
          url: 'api/hotel/campaings',
        },
      })

      return response?.data
    },
  })

  return (
    <>
      <div className='grid gap-3'>
        {description?.beachPool?.trim() && (
          <div className='hidden bg-white md:flex'>
            <div className='mt-1 px-2 py-3'>
              <MdOutlineBeachAccess className='text-blue-800' size={20} />
            </div>
            <div className='grid items-center'>
              <Button
                onClick={() => handleDrawerOpen(1)}
                variant='white'
                color='black'
                size='md'
                className='flex justify-start p-0 font-medium'
              >
                Plaj Bilgisi
              </Button>

              <div className='flex justify-between gap-5 rounded bg-white'>
                <div className='flex items-center gap-2'>
                  <div>
                    <div
                      className='text-xs'
                      dangerouslySetInnerHTML={{
                        __html: description.beachPool
                          ? description.beachPool.substring(0, 90)
                          : '',
                      }}
                    />
                    <div className='flex items-center'>
                      <Button
                        className='border-0 bg-transparent p-0 font-normal text-blue-700'
                        size='sm'
                        onClick={() => handleDrawerOpen(1)}
                      >
                        Devamını Göster
                      </Button>
                      <BiChevronRight size={20} color='blue' />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          <Button
            fullWidth
            onClick={() => handleDrawerOpen(2)}
            variant='white'
            color='black'
            size='md'
            radius='md'
            className='mb-2 flex justify-start py-3 font-medium md:mb-0'
            leftSection={<CiDiscount1 size={26} className='text-blue-800' />}
          >
            Kampanyalar ve Avantajlar
          </Button>
        </div>
      </div>

      <Drawer
        position='right'
        size='xl'
        opened={opened && activeDrawer === 1}
        onClose={handleClose}
        title={
          <div className='flex items-center'>
            <button
              onClick={handleClose}
              className='rounded-r-xl bg-red-800 p-2 px-5 text-white'
            >
              <IoClose color='white' />
            </button>
            <div className='px-5'>
              <Title className='text-md text-center md:text-2xl' order={3}>
                Plaj ve Havuz Bilgisi
              </Title>
            </div>
          </div>
        }
        className='border-gray-300 p-3'
        closeButtonProps={{
          style: { display: 'none' },
        }}
        classNames={{
          header: 'p-0',
        }}
      >
        <hr className='mt-3 mb-3 border-blue-500' />
        <div
          dangerouslySetInnerHTML={{
            __html: description.beachPool ? description.beachPool : '',
          }}
        />
      </Drawer>

      <Drawer
        position='right'
        size='xl'
        opened={opened && activeDrawer === 2}
        onClose={handleClose}
        title={
          <div className='flex items-center'>
            <button
              onClick={handleClose}
              className='rounded-r-xl bg-red-800 p-2 px-5 text-white'
            >
              <IoClose color='white' />
            </button>
            <div className='px-5'>
              <Title className='text-md text-center md:text-2xl' order={3}>
                Kampanyalar ve Avantajlar
              </Title>
            </div>
          </div>
        }
        className='border-gray-300 p-3'
        closeButtonProps={{
          style: { display: 'none' },
        }}
        classNames={{
          header: 'p-0',
        }}
      >
        <hr className='mt-3 mb-3 border-blue-500' />
        <div>
          {campaignDataQuery.isLoading ? (
            <div className='flex items-center justify-center p-8'>
              <Loader size={'xl'} />
            </div>
          ) : null}
        </div>
        {campaignDataQuery.data && campaignDataQuery.data.length && (
          <Accordion>
            {campaignDataQuery.data.map((campaign) => {
              return (
                <Accordion.Item key={campaign.id} value={'' + campaign.id}>
                  <Accordion.Control>{campaign.title}</Accordion.Control>
                  <Accordion.Panel>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: campaign.params.terms_Of_conditions.value,
                      }}
                    />
                  </Accordion.Panel>
                </Accordion.Item>
              )
            })}
          </Accordion>
        )}
      </Drawer>
    </>
  )
}

export { HotelDrawers }
