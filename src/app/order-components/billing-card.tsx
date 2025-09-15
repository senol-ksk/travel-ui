import { Img } from '@react-email/components'
import { ReactNode } from 'react'

type IProps = {
  data: {
    fullName: React.ReactNode
    idNumber: React.ReactNode
    gsm: React.ReactNode
    address: React.ReactNode
  }
}
export const BillingCard: React.FC<IProps> = ({ data }) => {
  return (
    <>
      <div className='grid gap-2 text-sm'>
        <div className='flex items-center gap-2'>
          <div className='w-32 font-medium'>İsim Soyisim</div>
          <div>:</div>
          <div>{data.fullName}</div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-32 font-medium'>TC. Kimlik No</div>
          <div>:</div>
          <div>{data.idNumber}</div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-32 font-medium'>GSM</div>
          <div>:</div>
          <div>{data.gsm}</div>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-32 font-medium'>Adres</div>
          <div>:</div>
          <div>{data.address}</div>
        </div>
      </div>
      <div className='my-2 flex items-center rounded-lg bg-blue-700 p-3 text-sm font-bold text-white'>
        <Img
          alt='ikon'
          width={20}
          height={20}
          className='mr-3'
          src='https://ykmturizm.mncdn.com/11/Files/email/img/blue-info.png'
        />
        E-faturanız mail adresinize ayrıca gönderilecektir.
      </div>
    </>
  )
}
