import { ActionIcon, CloseButton, TextInput } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { useEffect } from 'react'

import { GoSearch } from 'react-icons/go'

type IProps = {
  defaultValue: string | null
  onSearchClick: (value: string | null) => void
  onClear: () => void
}

const SearchByName: React.FC<IProps> = ({
  defaultValue,
  onSearchClick,
  onClear,
}) => {
  const [value, setValue] = useInputState(defaultValue ?? null)

  useEffect(() => {
    if (!defaultValue) {
      setValue(defaultValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue])

  return (
    <TextInput
      type='search'
      maxLength={20}
      placeholder='Otel adı yazın'
      value={value ?? ''}
      onChange={setValue}
      rightSection={
        <>
          {value && value.length > 0 && (
            <CloseButton
              onClick={() => {
                onClear()
                setValue(null)
              }}
            />
          )}
          <ActionIcon
            variant='light'
            onClick={() => {
              if (value && value.length > 2) {
                onSearchClick(value)
              }
            }}
          >
            <GoSearch />
          </ActionIcon>
        </>
      }
      rightSectionProps={{
        className: 'w-auto',
      }}
    />
  )
}

export { SearchByName }
