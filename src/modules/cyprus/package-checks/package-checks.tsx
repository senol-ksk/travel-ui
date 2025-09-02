import { useState } from 'react'
import { Box, Chip, Group, Tooltip } from '@mantine/core'
import classes from './Chips.module.css'
import { AiOutlinePlus } from 'react-icons/ai'
import { MdOutlineCheck } from 'react-icons/md'

type PackageValues = ('1' | '2' | '3' | string)[]
type IProps = {
  selectedPackages: PackageValues
  onChange: (values: PackageValues) => void
}

export const CyprusSearchEnginePackagesCheck: React.FC<IProps> = ({
  selectedPackages,
  onChange,
}) => {
  const [checkedItems, setCheckedItems] = useState(selectedPackages)

  return (
    <Chip.Group
      multiple
      onChange={(value) => {
        setCheckedItems(value)
        onChange(value)
      }}
      defaultValue={selectedPackages}
    >
      <Group justify='start' mt='md' gap={'xs'}>
        <Tooltip label='Otel Paketten Çıkarılamaz' refProp='rootRef' withArrow>
          <Chip
            value='1'
            checked
            disabled
            classNames={classes}
            icon={<CheckIcon />}
          >
            Otel
            <PlusIcon />
          </Chip>
        </Tooltip>
        <Chip
          value='2'
          classNames={classes}
          icon={<CheckIcon />}
          checked={checkedItems.includes('2')}
        >
          Uçak Bileti
          <PlusIcon />
        </Chip>
        <Chip
          value='3'
          classNames={classes}
          icon={<CheckIcon />}
          checked={checkedItems.includes('3')}
        >
          Transfer
          <PlusIcon />
        </Chip>
      </Group>
    </Chip.Group>
  )
}

const PlusIcon = () => (
  <Box className={classes.chipIcon}>
    <AiOutlinePlus />
  </Box>
)

const CheckIcon = () => <MdOutlineCheck size={20} />
