import {
  TourExtraOptionsItemType,
  TourExtraOptionsTypes,
} from '@/types/passengerViewModel'
import { NativeSelect } from '@mantine/core'

type IProps = {
  data: TourExtraOptionsItemType
}

const defaultValues: { label: string; value: string }[] = [
  {
    label: 'Ayrı Yataklar istiyorum',
    value: 'T|TwinBed|Ayrı Yataklar istiyorum',
  },
  {
    label: 'Tek Büyük Yatak istiyorum',
    value: 'F|FrenchBed|Tek Büyük Yatak istiyorum',
  },
]

const BedType: React.FC<IProps> = ({ data }) => {
  const extraItem = data

  const options: { label: string; value: string }[] =
    extraItem.filters && extraItem.filters.length > 0
      ? extraItem.filters.map((item) => ({
          label: item.key,
          value: item.value,
        }))
      : defaultValues

  return (
    <NativeSelect
      name={extraItem.code}
      data={options}
      defaultValue={options[0].value}
    />
  )
}

export { BedType }
