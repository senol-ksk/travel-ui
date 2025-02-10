import { NativeSelect, type NativeSelectProps } from '@mantine/core'

import { FlightAdditionalDataSubGroup } from '@/types/passengerViewModel'
import { upperFirst } from '@mantine/hooks'
import { formatCurrency } from '@/libs/util'

const defaultValue = '0|TRY|0|KG|NOEXTRABAGGE1'

type IProps = {
  data: FlightAdditionalDataSubGroup['subGroups'][0]['items']
  onChange: (
    data:
      | FlightAdditionalDataSubGroup['subGroups'][0]['items'][0]
      | typeof defaultValue
  ) => void
  label?: string
}

const convertBaggageLabel = (data: string) => {
  const dataArr = data.split(':') // ==> ['5950.00', 'TRY', 'ADT', 'CarryOn', '35', 'KG', 'SH1', '']
  const price = formatCurrency(+dataArr[0]) // first item is price
  const baggage = `${dataArr[4]} ${upperFirst(dataArr[5].toLocaleLowerCase())}`

  return `+${baggage} ${price} `
}

const BaggageSelect: React.FC<IProps> = ({ data, onChange, label }) => {
  const options: NativeSelectProps['data'] = data.map((item) => {
    return {
      label: convertBaggageLabel(item.data),
      value: item.uniqueIdentifier,
    }
  })

  return (
    <NativeSelect
      label={label}
      defaultValue={defaultValue}
      data={[
        {
          label: 'Bagaj Ekle',
          value: defaultValue,
        },
        ...options,
      ]}
      onChange={({ currentTarget: { value } }) => {
        const changeValue = data.find(
          (item) => item.uniqueIdentifier === value
        ) as FlightAdditionalDataSubGroup['subGroups'][0]['items'][0]
        onChange(changeValue ?? '0|TRY|0|KG|NOEXTRABAGGE1')
      }}
    />
  )
}

export { BaggageSelect }
