import { Box, Chip, Group, Tooltip } from '@mantine/core'
import classes from './Chips.module.css'
import { AiOutlinePlus } from 'react-icons/ai'
import { MdOutlineCheck } from 'react-icons/md'

type IProps = {
  selectedPackages: string[]
  onChange: (values: string[]) => void
}

export const CyprusSearchEnginePackagesCheck: React.FC<IProps> = ({
  selectedPackages,
  onChange,
}) => (
  <Chip.Group
    multiple
    onChange={(value) => {
      onChange(value)
    }}
    defaultValue={selectedPackages}
  >
    <Group justify='start' mt='md' gap={'xs'}>
      <Tooltip label='Otel Paketten Çıkarılamaz' refProp='rootRef' withArrow>
        <Chip
          value='3'
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
        value='1'
        classNames={classes}
        icon={<CheckIcon />}
        checked={selectedPackages?.includes('1')}
      >
        Uçak Bileti
        <PlusIcon />
      </Chip>
      <Chip
        value='2'
        classNames={classes}
        icon={<CheckIcon />}
        checked={selectedPackages?.includes('2')}
      >
        Transfer
        <PlusIcon />
      </Chip>
    </Group>
  </Chip.Group>
)

const PlusIcon = () => (
  <Box className={classes.chipIcon}>
    <AiOutlinePlus />
  </Box>
)

const CheckIcon = () => <MdOutlineCheck size={20} />
