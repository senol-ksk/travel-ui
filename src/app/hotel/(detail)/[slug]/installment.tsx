import { Fragment } from 'react'
import { Image, Table } from '@mantine/core'

import { HotelDetailInstallmentData } from '@/app/hotel/types'
import { formatCurrency } from '@/libs/util'
import { InstallmentBankDescription } from './installment-description'

type IProps = {
  price: number
  installmentData: HotelDetailInstallmentData
}

const InstallmentTable: React.FC<IProps> = ({ price, installmentData }) => {
  const bankRows = installmentData.items.map((item) => (
    <Fragment key={item.bank}>
      <Table.Tr>
        <Table.Td>
          <div className='flex h-[40px] w-[60px] items-center justify-center'>
            <Image src={item.logo} alt={item.bank} />
          </div>
        </Table.Td>

        <Table.Td>{formatCurrency(price)}</Table.Td>
        {installmentData.headers.map((header, headerIndex) => {
          const calculatedPrice =
            price + (price * item.installments[header]) / 100
          return (
            <Table.Td key={headerIndex}>
              <div className='text-center'>
                {typeof item.installments[header] === 'number' ? (
                  <div>
                    <div>{formatCurrency(calculatedPrice / header)}</div>
                    <div className='font-semibold'>
                      {formatCurrency(calculatedPrice)}
                    </div>
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
          <Table.Td colSpan={installmentData.headers.length + 2}>
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
  const headers = installmentData.headers.map((header) => {
    return (
      <Table.Th key={header}>
        <div className='text-center font-normal'>
          <div>{header} Taksit</div>
          <div className='text-xs font-semibold'>Toplam</div>
        </div>
      </Table.Th>
    )
  })

  return (
    <Table stickyHeader stickyHeaderOffset={0} striped withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Th></Table.Th>
          <Table.Th>
            <div className='font-normal'>Tek Çekim</div>
          </Table.Th>
          {headers}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{bankRows}</Table.Tbody>
    </Table>
  )
}

export { InstallmentTable }
