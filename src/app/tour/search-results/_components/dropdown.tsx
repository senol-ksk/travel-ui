import { formatCurrency } from '@/libs/util'
import { TourSearchResultSearchItem } from '@/modules/tour/type'
import { Combobox, InputBase, ScrollArea, useCombobox } from '@mantine/core'
import dayjs from 'dayjs'
import { useState } from 'react'
import classes from './Dropdown.module.css'
import clsx from 'clsx'

type IProps = {
  data: TourSearchResultSearchItem[]
  onSelect: (data: TourSearchResultSearchItem) => void
  defaultItem: TourSearchResultSearchItem
}

const TourDropdown: React.FC<IProps> = ({ data, onSelect, defaultItem }) => {
  const [animating, setAnimating] = useState(false)

  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption()
      setAnimating(false)
    },
    onDropdownOpen: () => setAnimating(true),
  })
  // const [selectedTour, setSelectedTour] = useState(defaultItem)
  const dateFormat = 'DD MMM YYYY'

  const handleOnSelect = (val: string) => {
    const selectedItem = data.find(
      (item) => item.key === val
    ) as TourSearchResultSearchItem

    // setSelectedTour(selectedItem)
    onSelect(selectedItem)
    combobox.closeDropdown()
  }

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      transitionProps={{ duration: 200, transition: 'pop' }}
      onOptionSubmit={handleOnSelect}
    >
      <Combobox.Target>
        <InputBase
          pointer
          type='button'
          component='button'
          rightSection={<Combobox.Chevron />}
          onClick={() => {
            combobox.toggleDropdown()
          }}
        >
          {dayjs(defaultItem?.startDate).format(dateFormat)} {' - '}
          {dayjs(defaultItem?.endDate).format(dateFormat)}
        </InputBase>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize mah={250} type='scroll'>
            {data.map((item, index) => (
              <Combobox.Option
                key={item.key}
                value={item.key}
                className={clsx({ [classes.animateOption]: animating })}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div>
                  {dayjs(item.startDate).format(dateFormat)} {' - '}
                  {dayjs(item.endDate).format(dateFormat)}
                </div>
                <strong>{formatCurrency(item.tlPrice.value)}</strong>
              </Combobox.Option>
            ))}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export { TourDropdown }
