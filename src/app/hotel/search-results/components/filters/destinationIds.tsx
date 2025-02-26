import { useState } from 'react'

import { HotelSearchResponseDestinationInfos } from '@/app/hotel/types'
import {
  Alert,
  Checkbox,
  CloseButton,
  ScrollArea,
  Stack,
  TextInput,
} from '@mantine/core'

type IProps = {
  destinationsInfo: HotelSearchResponseDestinationInfos[] | undefined
}

const DestinationIds: React.FC<IProps> = ({ destinationsInfo = [] }) => {
  const [values, setValues] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState(destinationsInfo)

  const handleSearchInput = (searchTerm: string) => {
    // filteredData
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
          type='search'
          rightSection={
            <CloseButton
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
      <ScrollArea h={200} type='always' scrollbars='y'>
        <Checkbox.Group value={values} onChange={setValues} defaultValue={[]}>
          <Stack gap={4}>
            {filteredData?.length > 0 ? (
              filteredData?.map((destinationInfo) => {
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
