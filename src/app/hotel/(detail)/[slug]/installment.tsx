import { Fragment } from 'react'
import { Image, Table } from '@mantine/core'

import { HotelDetailInstallmentData } from '@/app/hotel/types'
import { formatCurrency } from '@/libs/util'
import { InstallmentBankDescription } from './installment-description'
import { CiCircleInfo } from 'react-icons/ci'
import { MdInfo } from 'react-icons/md'

type IProps = {
  price: number
  installmentData: HotelDetailInstallmentData
}

const InstallmentTable: React.FC<IProps> = ({ price, installmentData }) => {
  const bankRows = installmentData.items.map((item) => (
    <Fragment key={item.bank}>
      <Table.Tr>
        <Table.Td rowSpan={3} className='bg-gray-100'>
          <Image src={item.logo} maw={90} mx={'auto'} alt={item.bank} />
        </Table.Td>
        <Table.Td className='bg-gray-100'></Table.Td>
        <Table.Td className='bg-gray-100'>
          <div className='text-center font-bold'>Tek Çekim</div>
        </Table.Td>
        {installmentData.headers.map((header) => (
          <Table.Td key={header} className='bg-gray-100'>
            <div className='text-center font-bold'>
              <div>{header} Taksit</div>
            </div>
          </Table.Td>
        ))}
      </Table.Tr>
      <Table.Tr>
        <Table.Td className='font-bold'>Aylık Taksit</Table.Td>
        <Table.Td>{formatCurrency(price)}</Table.Td>
        {installmentData.headers.map((header, headerIndex) => {
          const calculatedPrice =
            price + (price * item.installments[header]) / 100
          return (
            <Table.Td key={headerIndex}>
              <div className='text-center'>
                {typeof item.installments[header] === 'number' ? (
                  <div>{formatCurrency(calculatedPrice / header)}</div>
                ) : (
                  '-'
                )}
              </div>
            </Table.Td>
          )
        })}
      </Table.Tr>
      <Table.Tr>
        <Table.Td className='bg-white font-bold'>Toplam Fiyat</Table.Td>
        <Table.Td className='bg-white'>{formatCurrency(price)}</Table.Td>
        {installmentData.headers.map((header, headerIndex) => {
          const calculatedPrice =
            price + (price * item.installments[header]) / 100
          return (
            <Table.Td key={headerIndex} className='bg-white'>
              <div className='text-center'>
                {typeof item.installments[header] === 'number' ? (
                  <div className='font-normal'>
                    {formatCurrency(calculatedPrice)}
                  </div>
                ) : (
                  '-'
                )}
              </div>
            </Table.Td>
          )
        })}
      </Table.Tr>
      {item.description && (
        <Table.Tr>
          <Table.Td colSpan={installmentData.headers.length + 3}>
            <InstallmentBankDescription
              content={
                <div
                  className='text-xs'
                  dangerouslySetInnerHTML={{
                    __html: item.description,
                  }}
                />
              }
            />
          </Table.Td>
        </Table.Tr>
      )}
    </Fragment>
  ))

  return (
    <div>
      <Table stickyHeader stickyHeaderOffset={0} striped withColumnBorders>
        <Table.Tbody>{bankRows}</Table.Tbody>
      </Table>
      <div className='my-2 flex gap-1 text-xs'>
        <MdInfo className='text-blue-900' size={18} />
        Yönetmelik doğrultusunda; ticari kartlarla yapılan işlemlerde ödeme
        erteleme kampanyasından yararlanılamıyor ve taksit yapılamıyor.
      </div>
    </div>
  )
}

export { InstallmentTable }
