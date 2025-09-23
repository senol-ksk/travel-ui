import { formatCurrency } from '@/libs/util'
import { TourSearchResultSearchItem } from '@/modules/tour/type'
import { Combobox, InputBase, ScrollArea, useCombobox } from '@mantine/core'
import dayjs from 'dayjs'
import { useState } from 'react'
import classes from './Dropdown.module.css'
import clsx from 'clsx'
import { RxCalendar } from 'react-icons/rx'
import { BiChevronDown } from 'react-icons/bi'

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
          size='md'
          radius={'md'}
          pointer
          type='button'
          component='button'
          rightSection={<BiChevronDown size={20} />}
          onClick={() => {
            combobox.toggleDropdown()
          }}
        >
          <div className='flex items-center gap-2'>
            <RxCalendar size={20} />
            {dayjs(defaultItem?.startDate).format(dateFormat)} {' - '}
            {dayjs(defaultItem?.endDate).format(dateFormat)}
          </div>
        </InputBase>
      </Combobox.Target>
      <Combobox.Dropdown>
        <Combobox.Options>
          <ScrollArea.Autosize mah={250}>
            {data.map((item, index) => (
              <Combobox.Option
                key={item.key}
                value={item.key}
                className={clsx({ [classes.animateOption]: animating })}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className='flex w-full items-center justify-between gap-2'>
                  <div>
                    {dayjs(item.startDate).format(dateFormat)} {' - '}
                    {dayjs(item.endDate).format(dateFormat)}
                  </div>
                  <strong>{formatCurrency(item.tlPrice.value)}</strong>
                </div>
              </Combobox.Option>
            ))}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export { TourDropdown }
