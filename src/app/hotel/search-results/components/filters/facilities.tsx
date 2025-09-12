import { HotelSearchResponseFacilities } from '@/app/hotel/types'
import { hotelFilterSearchParams } from '@/modules/hotel/searchParams'
import {
  Alert,
  Checkbox,
  CloseButton,
  rem,
  ScrollArea,
  Stack,
  TextInput,
  Button,
} from '@mantine/core'
import { useQueryStates } from 'nuqs'
import { useState, useMemo } from 'react'
import { IoSearchOutline } from 'react-icons/io5'

type FacilityType = {
  id: ID
  name: string
  priority: number
  facilities: null
}

type IProps = {
  data: HotelSearchResponseFacilities[] | undefined | null
  facilityTypes?: FacilityType[] | null
}
export const Facilities: React.FC<IProps> = ({ data, facilityTypes }) => {
  console.log('data', data)
  console.log('facilityTypes', facilityTypes)
  const [searchValue, setSearchValue] = useState('')
  const [filteredData, setFilteredData] = useState(data)
  const [filterParams, setFilterParams] = useQueryStates(
    hotelFilterSearchParams
  )

  const groupedFacilities = useMemo(() => {
    if (!data) return []

    if (!facilityTypes || facilityTypes.length === 0) {
      return [
        {
          id: 0,
          name: 'Tüm Tesisler',
          priority: 0,
          facilities: data,
        },
      ]
    }

    const grouped = facilityTypes
      .map((facilityType) => {
        const facilitiesInType = data.filter(
          (facility) => facility.type_id === facilityType.id
        )

        return {
          ...facilityType,
          facilities: facilitiesInType,
        }
      })
      .filter((group) => group.facilities.length > 0)

    return grouped
  }, [data, facilityTypes])

  const filteredGroupedFacilities = useMemo(() => {
    if (!searchValue) return groupedFacilities

    return groupedFacilities
      .map((group) => ({
        ...group,
        facilities: group.facilities.filter((facility) =>
          facility.name
            .toLocaleLowerCase()
            .includes(searchValue.toLocaleLowerCase())
        ),
      }))
      .filter((group) => group.facilities.length > 0)
  }, [groupedFacilities, searchValue])

  const handleSearchInput = (searchTerm: string) => {
    setSearchValue(searchTerm)
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
            filterParams.facilities?.length
              ? filterParams.facilities.map(String)
              : []
          }
          onChange={(value) => {
            setFilterParams({ facilities: value.length ? value : null })
          }}
        >
          <Stack gap={4} p={rem(4)}>
            {filteredGroupedFacilities &&
            filteredGroupedFacilities.length > 0 ? (
              filteredGroupedFacilities
                .sort((a, b) => a.priority - b.priority)
                .flatMap((group) =>
                  group.facilities
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((facility) => {
                      if (!facility.name) return null

                      return (
                        <Checkbox
                          key={facility.id}
                          label={facility.name}
                          value={'' + facility.id}
                        />
                      )
                    })
                )
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
