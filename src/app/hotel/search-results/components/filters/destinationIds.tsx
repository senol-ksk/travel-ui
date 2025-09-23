import { useState } from 'react'

import { HotelSearchResponseDestinationInfos } from '@/app/hotel/types'
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
  destinationsInfo: HotelSearchResponseDestinationInfos[] | undefined
}

const DestinationIds: React.FC<IProps> = ({ destinationsInfo = [] }) => {
  const [values, setValues] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState(destinationsInfo)
  const [filterParams, setFilterParams] = useQueryStates(
    hotelFilterSearchParams
  )

  const handleSearchInput = (searchTerm: string) => {
    setSearchValue(searchTerm)

    setFilteredData(() => {
      return destinationsInfo?.filter((data) =>
        data.name.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
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
                setFilteredData(destinationsInfo)
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
      <ScrollArea h={150} type='always' scrollbars='y'>
        <Checkbox.Group
          value={
            filterParams.destinationIds?.length
              ? filterParams.destinationIds.map(String)
              : []
          }
          onChange={(value) => {
            setFilterParams({ destinationIds: value.length ? value : null })
          }}
        >
          <Stack gap={4} p={rem(4)}>
            {filteredData?.length > 0 ? (
              filteredData
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((destinationInfo) => {
                  return (
                    <Checkbox
                      key={destinationInfo.id}
                      label={`${destinationInfo.name} (${destinationInfo.count})`}
                      value={'' + destinationInfo.id}
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
      </ScrollArea>
    </>
  )
}

export { DestinationIds }
