import {
  TourExtraOptionsItemType,
  TourExtraOptionsTypes,
} from '@/types/passengerViewModel'
import { NativeSelect } from '@mantine/core'

type IProps = {
  data: TourExtraOptionsItemType
}

const PickUpPointSelect: React.FC<IProps> = ({ data }) => {
  if (!data) return null
  const extraItem = data

  const values = extraItem.filters
    ?.find((item) => item.key === 'PickUpPointCode')
    ?.value.split('@') as string[]

  const labels = extraItem.filters
    ?.find((item) => item.key === 'PickUpPointExplain')
    ?.value.split('@') as string[]
  const options: { label: string; value: string }[] = []

  if (labels && values) {
    values.forEach((value, valueIndex) => {
      options.push({
        label: labels[valueIndex] ?? '',
        value: `${value}|${labels[valueIndex] ?? ''}|${labels[valueIndex] ?? ''}`,
      })
    })
  } else {
    extraItem.filters?.forEach((extraItemValue) => {
      options.push({
        value: extraItemValue.key,
        label: extraItemValue.value,
      })
    })
  }

  return (
    <NativeSelect
      name={extraItem.code}
      label={extraItem.description}
      data={options}
      defaultValue={options[0].value}
    />
  )
}

export { PickUpPointSelect }
