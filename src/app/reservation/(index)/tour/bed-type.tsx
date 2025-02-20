import {
  TourExtraOptionsItemType,
  TourExtraOptionsTypes,
} from '@/types/passengerViewModel'
import { NativeSelect } from '@mantine/core'

type IProps = {
  data: TourExtraOptionsItemType
}

const BedType: React.FC<IProps> = ({ data }) => {
  const extraItem = data

  const options: { label: string; value: string }[] = extraItem.filters.map(
    (item) => ({
      label: item.key,
      value: item.value,
    })
  )

  return (
    <NativeSelect
      name={extraItem.code}
      label={extraItem.description}
      data={options}
      defaultValue={options[0].value}
      onChange={({ currentTarget: { value } }) => {
        console.log(extraItem, value)
      }}
    />
  )
}

export { BedType }
