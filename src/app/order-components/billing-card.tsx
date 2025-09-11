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
      <table cellPadding={5}>
        <tbody>
          <tr>
            <td className='w-32 font-medium'>İsim Soyisim</td>
            <td>:</td>
            <td className='font-bold'>{data.fullName}</td>
          </tr>
          <tr>
            <td className='w-32 font-medium'>TC. Kimlik No</td>
            <td>:</td>
            <td className='font-bold'>{data.idNumber}</td>
          </tr>
          <tr>
            <td className='w-32 font-medium'>GSM</td>
            <td>:</td>
            <td className='font-bold'>{data.gsm}</td>
          </tr>
          <tr>
            <td className='w-32 font-medium'>Adres</td>
            <td>:</td>
            <td className='font-bold'>{data.address}</td>
          </tr>
        </tbody>
      </table>
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
