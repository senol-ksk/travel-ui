import { formatCurrency } from '@/libs/util'
import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { Group, Image, Radio, Table } from '@mantine/core'

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

  return (
    <Table withTableBorder withColumnBorders withRowBorders striped>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className='text-center font-semibold'>Kartlar</Table.Th>
          <Table.Th className='text-center font-semibold'>Peşin</Table.Th>
          {installmentCountArr.map(
            (count) =>
              count &&
              count > 1 && (
                <Table.Th key={count} className='text-center font-semibold'>
                  <div>{count} Taksit</div>
                  <div className='font-normal'> Taksit | Toplam</div>
                </Table.Th>
              )
          )}
        </Table.Tr>
      </Table.Thead>
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
            <Table.Tr key={installmentData}>
              <Table.Td>
                <Image
                  src={`https://fulltripstatic.mncdn.com/5/Content/img/card-logos/${installmentData.toLowerCase()}.png`}
                  maw={90}
                  alt={installmentData}
                  mx={'auto'}
                />
              </Table.Td>
              {installmentCountArr.map((installmentCount) => {
                const relatedInstallment = currentInstallmentTableArr?.find(
                  (item) => item.installmentCount === installmentCount
                )
                return (
                  <Table.Td
                    key={installmentCount}
                    className='leading-md text-center'
                  >
                    {relatedInstallment ? (
                      relatedInstallment.installmentCount === 1 ? (
                        <div className='text-md font-semibold'>
                          {formatCurrency(relatedInstallment.totalAmount)}
                        </div>
                      ) : (
                        <div>
                          <div className='text-dark-700 text-xs'>
                            {formatCurrency(
                              relatedInstallment.amountPerInstallment
                            )}{' '}
                            X {relatedInstallment.installmentCount}
                          </div>
                          <div className='text-md font-semibold'>
                            {formatCurrency(relatedInstallment.totalAmount)}
                          </div>
                        </div>
                      )
                    ) : (
                      '-'
                    )}
                  </Table.Td>
                )
              })}
            </Table.Tr>
          )
        })}
      </Table.Tbody>
    </Table>
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
