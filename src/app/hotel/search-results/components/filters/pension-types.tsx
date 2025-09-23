import { useState } from 'react'

import { HotelSearchResponsePensionTypes } from '@/app/hotel/types'
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
  data: HotelSearchResponsePensionTypes[] | undefined | null
}

const PensionTypes: React.FC<IProps> = ({ data = [] }) => {
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
          .filter((dataItem) => !!dataItem.type)
          ?.filter((dataItem) =>
            dataItem.type
              ?.toLocaleLowerCase()
              .includes(searchTerm.toLocaleLowerCase())
          )
      )
    })
  }

  return (
    <>
      {/* <div className='pb-3'>
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
      </div> */}
      <ScrollArea.Autosize mah={rem(200)} type='always' scrollbars='y'>
        <Checkbox.Group
          value={
            filterParams.pensionTypes?.length
              ? filterParams.pensionTypes.map(String)
              : []
          }
          onChange={(value) => {
            setFilterParams({ pensionTypes: value.length ? value : null })
          }}
        >
          <Stack gap={4} p={rem(4)}>
            {filteredData && filteredData?.length > 0 ? (
              filteredData
                ?.sort((a, b) => {
                  if (!a.type && !b.type) return 0
                  if (!a.type) return 1
                  if (!b.type) return -1
                  return a.type.localeCompare(b.type)
                })
                .map((dataItem) => {
                  if (!dataItem.type) return null

                  return (
                    <Checkbox
                      key={dataItem.id}
                      label={dataItem.type}
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

export { PensionTypes }
