import { useState } from 'react'

import { HotelSearchResponseThemes } from '@/app/hotel/types'
import {
  Alert,
  Checkbox,
  CloseButton,
  rem,
  ScrollArea,
  Stack,
  TextInput,
} from '@mantine/core'
import { useQueryStates } from 'nuqs'

import { hotelFilterSearchParams } from '@/modules/hotel/searchParams'
import { IoSearchOutline } from 'react-icons/io5'

type IProps = {
  data: HotelSearchResponseThemes[] | undefined | null
}

const Themes: React.FC<IProps> = ({ data = [] }) => {
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState(data)
  const [filterParams, setFilterParams] = useQueryStates(
    hotelFilterSearchParams
  )

  const handleSearchInput = (searchTerm: string) => {
    setSearchValue(searchTerm)

    setFilteredData(() => {
      return (
        data &&
        data
          .filter((dataItem) => !!dataItem.themeName)
          ?.filter((dataItem) =>
            dataItem.themeName
              .toLocaleLowerCase()
              .includes(searchTerm.toLocaleLowerCase())
          )
      )
    })
  }

  return (
    <>
      <div className='pb-3'>
        <TextInput
          leftSection={<IoSearchOutline size={16} />}
          placeholder='Filtrele'
          size='xs'
          type='search'
          rightSection={
            <CloseButton
              size={'sm'}
              onClick={() => {
                setFilteredData(data)
                setSearchValue('')
              }}
            />
          }
          value={searchValue}
          onChange={(event) => {
            handleSearchInput(event.currentTarget.value)
          }}
        />
      </div>
      <ScrollArea.Autosize mah={rem(200)} type='always' scrollbars='y'>
        <Checkbox.Group
          value={
            filterParams.themes?.length ? filterParams.themes.map(String) : []
          }
          onChange={(value) => {
            setFilterParams({ themes: value.length ? value : null })
          }}
        >
          <Stack gap={4} p={rem(4)}>
            {filteredData && filteredData?.length > 0 ? (
              filteredData
                ?.sort((a, b) => a.themeName.localeCompare(b.themeName))
                .map((dataItem) => {
                  if (!dataItem.themeName) return null

                  return (
                    <Checkbox
                      key={dataItem.id}
                      label={dataItem.themeName}
                      value={'' + dataItem.id}
                    />
                  )
                })
            ) : (
              <Alert color='red' variant='light' p={5}>
                Sonuç bulunamadı.
              </Alert>
            )}
          </Stack>
        </Checkbox.Group>
      </ScrollArea.Autosize>
    </>
  )
}

export { Themes }
