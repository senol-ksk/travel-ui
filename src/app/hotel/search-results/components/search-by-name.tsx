import { ActionIcon, CloseButton, TextInput } from '@mantine/core'
import { useInputState } from '@mantine/hooks'
import { useQueryStates } from 'nuqs'
import { GoSearch } from 'react-icons/go'

import { hotelFilterSearchParams } from '@/modules/hotel/searchParams'

const SearchByName = () => {
  const [filterParams, setFilterParams] = useQueryStates(
    hotelFilterSearchParams
  )
  const [searchByNameValue, setSearchByNameValue] = useInputState<string>(
    filterParams.hotelName ?? ''
  )

  return (
    <TextInput
      label=''
      type='search'
      onChange={setSearchByNameValue}
      maxLength={20}
      placeholder='Otel adı yazın'
      value={searchByNameValue}
      rightSection={
        <>
          {searchByNameValue.length > 0 && (
            <CloseButton
              onClick={() => {
                setSearchByNameValue('')
                setFilterParams({
                  hotelName: null,
                })
              }}
            />
          )}
          <ActionIcon
            variant='light'
            onClick={() => {
              if (searchByNameValue.length > 2) {
                setFilterParams({
                  hotelName: searchByNameValue,
                })
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
