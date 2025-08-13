'use client'

import { TransferVehicle } from '@/app/transfer/types'
import { Box, rem, Title, Image } from '@mantine/core'
import { GoPerson } from 'react-icons/go'
import { IoIosCheckmarkCircle } from 'react-icons/io'
import { PiSuitcaseRolling } from 'react-icons/pi'
type IProps = {
  data?: TransferVehicle
}

const TransferExtraOptionsDetail: React.FC<IProps> = ({ data }) => {
  if (!data) return null
  return (
    <>
      <div>
        <div className='grid grid-cols-12 md:gap-4'>
          <div className='col-span-12 content-center md:col-span-4'>
            <Box
              mx='auto'
              w={{
                base: 200,
                md: 'auto',
              }}
            >
              <Image
                alt={data.vehicleTitle}
                src={data.transferInfo.vehiclePhotoUrl}
                radius={'md'}
                h='100%'
              />
            </Box>
          </div>
          <div className='col-span-12 content-center md:col-span-8'>
            <Title order={4} pb={rem(18)}>
              {data.vehicleTitle}
            </Title>
            <div className='flex gap-3'>
              <div className='flex items-center gap-1 text-sm text-gray-700'>
                <div>
                  <GoPerson size={18} />
                </div>
                <div>Maks. {data.transferInfo.transferMax.pax} Yolcu</div>
              </div>
              <div className='flex items-center gap-1 text-sm text-gray-700'>
                <div>
                  <PiSuitcaseRolling size={18} />
                </div>
                <div>Maks. {data.transferInfo.transferMax.suitcase}</div>
              </div>
            </div>
            <div className='flex items-center gap-1 pt-2 text-sm text-green-800'>
              <div>
                <IoIosCheckmarkCircle size={18} />
              </div>
              <div>
                Son {data.transferInfo.transferHour.freeChange} saate kadar
                değişiklik
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export { TransferExtraOptionsDetail }
