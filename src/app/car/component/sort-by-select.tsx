import { NativeSelect } from '@mantine/core'
import { useQueryStates } from 'nuqs'

import { filterParsers, SortOrderEnums } from '@/modules/carrent/types'
import { FaCheck } from 'react-icons/fa'

const SortBySelect = () => {
  const [filterParams, setFilterParams] = useQueryStates(filterParsers)
  return (
    <NativeSelect
      leftSection={<FaCheck />}
      radius={'md'}
      className='font-medium'
      value={filterParams.order}
      onChange={({ currentTarget: { value } }) => {
        setFilterParams({
          order: value as SortOrderEnums,
        })
      }}
      data={[
        {
          label: 'Fiyata Göre Artan ',
          value: SortOrderEnums.priceAsc,
        },
        {
          label: 'Fiyata Göre Azalan',
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
