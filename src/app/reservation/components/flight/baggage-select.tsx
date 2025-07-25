import { NativeSelect, type NativeSelectProps } from '@mantine/core'
import React from 'react'

import { FlightOptionalServicesDataItem } from '@/types/passengerViewModel'
import { upperFirst } from '@mantine/hooks'
import { formatCurrency } from '@/libs/util'
import { ReactNode } from 'react'

type IProps = {
  data: FlightOptionalServicesDataItem[]
  onChange: (data: FlightOptionalServicesDataItem) => void
  label?: ReactNode
}

const convertBaggageLabel = (data: string) => {
  const dataArr = data.split(':') // ==> ['5950.00', 'TRY', 'ADT', 'CarryOn', '35', 'KG', 'SH1', '']
  const price = +dataArr[0]
  const priceFormated = formatCurrency(+dataArr[0]) // first item is price

  if (!price || price === 0) return 'Ek Bagaj Ekle'

  const baggage =
    dataArr[4] && dataArr[5]
      ? `${dataArr[4]} ${upperFirst(dataArr[5].toLocaleLowerCase())}`
      : ''

  return `+${baggage} ${priceFormated} `
}
const noExtraBaggaeOption: FlightOptionalServicesDataItem = {
  code: 'XBAG',
  data: '0:TRY:0:KG:NOEXTRABAGGE1',
  included: false,
  indexNo: -1,
  required: false,
  description: null,
  filters: null,
  selected: true,
  uniqueIdentifier: '',
}
const BaggageSelect: React.FC<IProps> = ({ data, onChange, label }) => {
  const dataWithDefaultValue: FlightOptionalServicesDataItem[] = [
    {
      ...noExtraBaggaeOption,
      uniqueIdentifier: data[0].uniqueIdentifier,
    },
    ...data,
  ]

  const options: NativeSelectProps['data'] = dataWithDefaultValue.map(
    (item, itemIndex) => ({
      label: convertBaggageLabel(item.data),
      value: '' + item.indexNo,
    })
  )

  const selectedOption = (
    dataWithDefaultValue.find((item) => item.selected)?.indexNo ??
    noExtraBaggaeOption.indexNo
  ).toString()

  return (
    <NativeSelect
      size='md'
      label={label}
      // default value is `indexNo` of data
      defaultValue={selectedOption}
      data={options}
      onChange={({ currentTarget: { value } }) => {
        // find the selected item with `indexNo` comes from `value` and trigger `onChage` prop finding selected data
        onChange(
          dataWithDefaultValue.find((item) => item.indexNo === +value) ??
            noExtraBaggaeOption
        )
      }}
    />
  )
}

export { BaggageSelect }
