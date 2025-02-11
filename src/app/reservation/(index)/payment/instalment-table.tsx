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
    <Table striped withColumnBorders>
      <Table.Thead>
        <Table.Tr>
          <Table.Td>Kartlar</Table.Td>
          <Table.Td>Peşin</Table.Td>
          {installmentCountArr.map(
            (count) =>
              count && count > 1 && <Table.Th key={count}>{count}</Table.Th>
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
                />
              </Table.Td>
              {installmentCountArr.map((installmentCount) => {
                const relatedInstallment = currentInstallmentTableArr?.find(
                  (item) => item.installmentCount === installmentCount
                )
                return (
                  <Table.Td key={installmentCount} className='text-center'>
                    {relatedInstallment ? (
                      relatedInstallment.installmentCount === 1 ? (
                        <div>
                          <div>
                            {formatCurrency(relatedInstallment.totalAmount)}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className='pb-1 text-sm text-gray-500'>
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
  return (
    <Radio.Group
      name='Installment'
      defaultValue={'' + data.at(0)?.installmentCount}
      onChange={(value) => {
        console.log(value)
        onChange(value)
      }}
    >
      <div className='grid gap-3 md:flex'>
        {data.map((installment, installmentIndex) => (
          <Radio.Card
            className='p-2'
            key={installmentIndex}
            value={'' + installment.installmentCount}
          >
            <Group wrap='nowrap' align='flex-start'>
              <Radio.Indicator />
              <div>
                {installment.installmentCount === 1 ? (
                  'Tek Çekim'
                ) : (
                  <div className='flex gap-1'>
                    <div>
                      {formatCurrency(installment.amountPerInstallment)}
                    </div>
                    <div>x</div>
                    <div>{installment.installmentCount}</div>
                  </div>
                )}
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
