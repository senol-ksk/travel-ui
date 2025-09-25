'use client'
import { MainDrawer } from '@/app/hotel/(detail)/[slug]/_components/main-drawer'
import { HotelDetailResponseHotelInfo } from '@/app/hotel/types'
import { Button } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { BsCheck } from 'react-icons/bs'
import { MdKeyboardArrowRight } from 'react-icons/md'

type IProps = {
  facilityTypes: HotelDetailResponseHotelInfo['facilityTypes']
  hotelInfo: HotelDetailResponseHotelInfo
}

export const HotelFeatures: React.FC<IProps> = ({
  facilityTypes,
  hotelInfo,
}) => {
  const [
    generalInfoDrawerOpened,
    { open: openGeneralInfoDrawer, close: closeGeneralInfoDrawer },
  ] = useDisclosure(false)

  const handleDrawerClose = () => {
    closeGeneralInfoDrawer()
  }
  return (
    <>
      <ul className='grid grid-cols-2 gap-4 text-sm sm:grid-cols-4'>
        {facilityTypes.slice(0, 8).map((facilityType, index) => (
          <li
            key={facilityType.id || index}
            className={`truncate ${index > 3 ? 'hidden sm:list-item' : ''}`}
          >
            <BsCheck className='mr-1 inline-block text-blue-800' />
            {facilityType.name}
          </li>
        ))}
      </ul>
      <div className='mt-5'>
        <Button
          onClick={openGeneralInfoDrawer}
          className='bg-transparent p-0 font-normal text-blue-700 md:my-0'
        >
          Tesisin tüm olanaklarını görün
          <MdKeyboardArrowRight size={20} />
        </Button>
      </div>
      <MainDrawer
        opened={generalInfoDrawerOpened}
        onClose={handleDrawerClose}
        data={hotelInfo}
        description={hotelInfo.hotel.descriptions}
      />
    </>
  )
}
