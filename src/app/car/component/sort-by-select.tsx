import { NativeSelect } from '@mantine/core'
import { useQueryStates } from 'nuqs'

import { filterParsers, SortOrderEnums } from '@/modules/carrent/types'

const SortBySelect = () => {
  const [filterParams, setFilterParams] = useQueryStates(filterParsers)
  return (
    <NativeSelect
      className='font-medium'
      value={filterParams.order}
      onChange={({ currentTarget: { value } }) => {
        setFilterParams({
          order: value as SortOrderEnums,
        })
      }}
      data={[
        {
          label: 'Fiyat artan',
          value: SortOrderEnums.priceAsc,
        },
        {
          label: 'Fiyat azalan',
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
