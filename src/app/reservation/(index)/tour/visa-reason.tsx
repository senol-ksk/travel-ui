import { TourExtraOptionsItemType } from '@/types/passengerViewModel'
import { NativeSelect } from '@mantine/core'

type IProps = {
  data: TourExtraOptionsItemType
}

const VisaReason: React.FC<IProps> = ({ data }) => {
  const extraItem = data

  const options: { label: string; value: string }[] = extraItem.filters.map(
    (filter) => ({
      label: filter.key,
      value: filter.value,
    })
  )

  return (
    <NativeSelect
      name={extraItem.code}
      data={options}
      defaultValue={options[0].value}
    />
  )
}

export { VisaReason }
