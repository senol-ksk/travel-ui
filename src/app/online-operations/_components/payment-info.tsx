import { formatCurrency } from '@/libs/util'
import { OperationResultViewData } from '../types'
import { BookDetailCard } from './card'
import { Table } from '@mantine/core'

type IProps = {
  data: OperationResultViewData
}

export const PaymentInfo: React.FC<IProps> = ({ data }) => {
  const { basketTotal, mlTotal, basketDiscountTotal, collectingTotal } =
    data.paymentInformation
  return (
    <BookDetailCard>
      <Table highlightOnHover>
        <Table.Tbody>
          <Table.Tr>
            <Table.Td>Toplam</Table.Td>
            <Table.Td align='right'>
              <div>{formatCurrency(basketTotal)}</div>
            </Table.Td>
          </Table.Tr>
          {basketDiscountTotal > 0 && (
            <Table.Tr>
              <Table.Td>İndirim Çeki Tutarı</Table.Td>
              <Table.Td align='right'>
                <div>{formatCurrency(basketDiscountTotal)}</div>
              </Table.Td>
            </Table.Tr>
          )}
          {mlTotal && mlTotal > 0 && (
            <Table.Tr color={'green'}>
              <Table.Td>ParafPara TL</Table.Td>
              <Table.Td align='right'>
                <div>{formatCurrency(mlTotal)}</div>
              </Table.Td>
            </Table.Tr>
          )}
          <Table.Tr>
            <Table.Td>Kredi Kartı İle Çekilen Tutar</Table.Td>
            <Table.Td align='right'>
              <div>
                {formatCurrency(
                  Math.abs(
                    (mlTotal ?? 0) -
                      basketTotal -
                      basketDiscountTotal -
                      collectingTotal
                  )
                )}
              </div>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      <div className='flex justify-between gap-3'>
        <div></div>
      </div>
    </BookDetailCard>
  )
}
