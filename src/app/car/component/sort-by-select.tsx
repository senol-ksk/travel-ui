import { NativeSelect } from '@mantine/core'
import { useQueryStates } from 'nuqs'

import { filterParsers, SortOrderEnums } from '@/modules/carrent/types'

const SortBySelect = () => {
  const [filterParams, setFilterParams] = useQueryStates(filterParsers)
  return (
    <NativeSelect
      defaultValue={filterParams.order}
      onChange={({ currentTarget: { value } }) => {
        setFilterParams({
          order: value as SortOrderEnums,
        })
      }}
      data={[
        {
          label: 'Fiyat (Ucuzdan pahalıya)',
          value: SortOrderEnums.priceAsc,
        },
        {
          label: 'Fiyat (Pahalıdan ucuza)',
          value: SortOrderEnums.priceDesc,
        },
        // {
        //   label: 'İsme Göre (A-Z)',
        //   value: SortOrderEnums.nameAsc,
        // },
        // {
        //   label: 'İsme Göre (Z-A)',
        //   value: SortOrderEnums.nameDesc,
        // },
      ]}
    />
  )
}

export { SortBySelect }
