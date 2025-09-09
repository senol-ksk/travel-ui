import { InstallmentBankDescription } from '@/app/hotel/(detail)/[slug]/installment-description'
import { formatCurrency } from '@/libs/util'
import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { Group, Image, Radio, Table } from '@mantine/core'
import { FaInfoCircle } from 'react-icons/fa'
import { MdInfo } from 'react-icons/md'

type IProps = {
  data: ProductPassengerApiResponseModel['paymentIndexModel']['installment']['installmentInfoList']
}

const InstallmentTableModal: React.FC<IProps> = ({ data }) => {
  const groupedInstallmentData = Object.groupBy(
    data,
    ({ bankName }) => bankName
  )

  const installmentCountArr = Object.values(groupedInstallmentData)
    .flat()
    .map((a) => {
      return a?.installmentCount
    })
    .sort()
    .filter(
      (item, itemIndex, itemArr) =>
        itemArr.findIndex((item2) => item2 === item) === itemIndex
    )
  console.log(data)
  return (
    <>
      <Table withTableBorder withColumnBorders withRowBorders striped>
        <Table.Tbody>
          {Object.keys(groupedInstallmentData).map((installmentData) => {
            const currentInstallmentTableArr = groupedInstallmentData[
              installmentData
            ]
              ?.filter(
                (item, itemIndex, itemArr) =>
                  itemArr.findIndex(
                    (item2) => item2.installmentCount === item.installmentCount
                  ) === itemIndex
              )
              .sort((a, b) => a.installmentCount + b.totalAmount)

            return (
              <>
                <Table.Tr key={`${installmentData}-header`}>
                  <Table.Td rowSpan={3} className='bg-gray-100'>
                    <Image
                      src={`https://ykmturizm.mncdn.com/7/Content/img/card-logos/${installmentData.toLowerCase()}.png`}
                      maw={90}
                      alt={installmentData}
                      mx={'auto'}
                    />
                  </Table.Td>
                  <Table.Td className='bg-gray-100'></Table.Td>
                  <Table.Td className='bg-gray-100'>
                    <div className='text-center font-bold'>Tek Çekim</div>
                  </Table.Td>
                  {installmentCountArr.map(
                    (count) =>
                      count &&
                      count > 1 && (
                        <Table.Td key={count} className='bg-gray-100'>
                          <div className='text-center font-bold'>
                            <div>{count} Taksit</div>
                          </div>
                        </Table.Td>
                      )
                  )}
                </Table.Tr>
                <Table.Tr key={`${installmentData}-monthly`}>
                  <Table.Td>
                    <div className='text-center font-bold'>Aylık Taksit</div>
                  </Table.Td>
                  {installmentCountArr.map((installmentCount) => {
                    const relatedInstallment = currentInstallmentTableArr?.find(
                      (item) => item.installmentCount === installmentCount
                    )
                    return (
                      <Table.Td key={installmentCount} className='text-center'>
                        {relatedInstallment ? (
                          relatedInstallment.installmentCount === 1 ? (
                            <div className='font-bold'>-</div>
                          ) : (
                            <div>
                              {formatCurrency(
                                relatedInstallment.amountPerInstallment
                              )}
                            </div>
                          )
                        ) : (
                          '-'
                        )}
                      </Table.Td>
                    )
                  })}
                </Table.Tr>
                <Table.Tr key={`${installmentData}-total`}>
                  <Table.Td className='bg-white text-center font-bold'>
                    Toplam Tutar
                  </Table.Td>
                  {installmentCountArr.map((installmentCount) => {
                    const relatedInstallment = currentInstallmentTableArr?.find(
                      (item) => item.installmentCount === installmentCount
                    )
                    return (
                      <Table.Td
                        key={installmentCount}
                        className='bg-white text-center'
                      >
                        {relatedInstallment ? (
                          <div>
                            {formatCurrency(relatedInstallment.totalAmount)}
                          </div>
                        ) : (
                          '-'
                        )}
                      </Table.Td>
                    )
                  })}
                </Table.Tr>
              </>
            )
          })}
        </Table.Tbody>
      </Table>

      <div>
        <div className='my-2 flex gap-1 text-xs'>
          <MdInfo className='text-blue-900' size={18} />
          Yönetmelik doğrultusunda; ticari kartlarla yapılan işlemlerde ödeme
          erteleme kampanyasından yararlanılamıyor ve taksit yapılamıyor.
        </div>
      </div>
    </>
  )
}

type InstallmentSelectProps = {
  data: {
    amountPerInstallment: number
    bankName: string
    binList: string
    cardProgramName: string
    installmentCount: number
    totalAmount: number
  }[]

  onChange: (value: string) => void
}

const InstallmentSelect: React.FC<InstallmentSelectProps> = ({
  data,
  onChange,
}) => {
  const installmentData = data.filter((item) => item.totalAmount > 0)

  if (installmentData.length === 0) return

  return (
    <Radio.Group
      name='Installment'
      defaultValue={'' + data.at(0)?.installmentCount}
      onChange={(value) => {
        onChange(value)
      }}
    >
      <div className='grid gap-3'>
        {installmentData.map((installment, installmentIndex) => (
          <Radio.Card
            className='rounded border-0 bg-gray-50 p-4'
            key={installmentIndex}
            value={'' + installment.installmentCount}
          >
            <Group>
              <Radio.Indicator />
              <div className='flex flex-1 items-center justify-between'>
                <div className='leading-lg'>
                  {installment.installmentCount === 1 ? (
                    <div>
                      <div className='font-semibold text-blue-800'>
                        Peşin Ödeme
                      </div>
                      <div>Tek Çekim</div>
                    </div>
                  ) : (
                    <div>
                      <div className='font-semibold'>
                        {installment.installmentCount} Taksit
                      </div>
                      <div className='flex'>
                        <div>{installment.installmentCount}</div>
                        <div>x</div>
                        <div>
                          {formatCurrency(installment.amountPerInstallment)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>{formatCurrency(installment.totalAmount)}</div>
              </div>
            </Group>
          </Radio.Card>
        ))}
      </div>
    </Radio.Group>
  )
}

export { InstallmentTableModal, InstallmentSelect }
