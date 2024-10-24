import {
  type NativeSelectProps,
  Input,
  NativeSelect,
  Radio,
  Group,
  TextInput,
  Switch,
} from '@mantine/core'
import {
  type FieldArrayWithId,
  type FieldError,
  type Merge,
  type FieldErrorsImpl,
  Controller,
  useFormContext,
} from 'react-hook-form'
import dayjs from 'dayjs'
import localeDate from 'dayjs/plugin/localeData'

import type {
  PassengerSchemaType,
  PassengerValidationType,
} from '@/app/checkout/page'

type IProps = {
  field: FieldArrayWithId<PassengerSchemaType, 'passengers', 'id'>
  error: Merge<FieldError, FieldErrorsImpl<PassengerValidationType>> | undefined
  index: number
}

import 'dayjs/locale/tr'
import { ChangeEvent } from 'react'
dayjs.locale('tr')
dayjs.extend(localeDate)

const years = (
  startYear: number,
  currentYear: number = new Date().getFullYear()
): number[] => {
  const years = []
  while (startYear <= currentYear) {
    years.push(startYear++)
  }
  return years
}

const years_18_selectData: NativeSelectProps['data'] = years(1930).map(
  (year) => ({
    label: '' + year,
    value: '' + year,
  })
)

const months: NativeSelectProps['data'] = dayjs
  .monthsShort()
  .map((month, index) => {
    const currentIndex = index + 1
    const value = `${currentIndex < 10 ? `0${currentIndex}` : currentIndex}`
    const label = `${currentIndex < 10 ? `0${currentIndex}` : currentIndex} ${month}`
    return {
      label,
      value,
    }
  })

const days: NativeSelectProps['data'] = Array.from(Array(31).keys()).map(
  (day, index) => {
    const value = (day < 9 ? `0${++day}` : ++day).toString()

    return {
      label: value,
      value,
    }
  }
)

export const FlightPassengers: React.FC<IProps> = ({ field, index, error }) => {
  const methods = useFormContext()
  const namePrefix = `passengers.[${index}]`
  const name_birthDate = `${namePrefix}.birthDate`
  const name_birthDate_day = `${namePrefix}.birthDate_day`
  const name_birthDate_month = `${namePrefix}.birthDate_month`
  const name_birthDate_year = `${namePrefix}.birthDate_year`

  function handleBirthdateSelect(e: ChangeEvent<HTMLSelectElement>) {
    const values = methods.getValues([
      name_birthDate_year,
      name_birthDate_month,
      name_birthDate_day,
    ])

    methods.setValue(name_birthDate, values.join('-'), {
      shouldValidate: true,
    })
  }

  return (
    <div className='grid gap-3 md:gap-4'>
      <input
        {...methods.register(`${namePrefix}.type`)}
        value={field.type}
        type='hidden'
      />
      <div className='grid grid-cols-2 gap-3'>
        <div className='col-span-2'>
          <Input.Wrapper error={!!error?.gender}>
            <Controller
              control={methods.control}
              name={`${namePrefix}.gender`}
              render={({ field: { onChange, value } }) => (
                <Radio.Group
                  defaultValue={value}
                  onChange={onChange}
                  error={!!error?.gender ? error.gender.message : null}
                >
                  <Group>
                    <Radio value={'1'} label='Kadın' />
                    <Radio value={'0'} label='Erkek' />
                  </Group>
                </Radio.Group>
              )}
            />
          </Input.Wrapper>
        </div>
        <div>
          <Input.Wrapper label='Ad'>
            <Controller
              control={methods.control}
              name={`${namePrefix}.firstName`}
              defaultValue={field.firstName ? field.firstName : ''}
              render={({ field }) => {
                return (
                  <TextInput
                    {...field}
                    error={error?.firstName ? error?.firstName?.message : null}
                    autoComplete='given-name'
                  />
                )
              }}
            />
          </Input.Wrapper>
        </div>
        <div>
          <Input.Wrapper label='Soyad'>
            <Controller
              control={methods.control}
              name={`${namePrefix}.lastName`}
              defaultValue={field.lastName}
              render={({ field }) => (
                <TextInput
                  {...field}
                  error={error?.lastName ? error?.lastName.message : null}
                  autoComplete='family-name'
                />
              )}
            />
          </Input.Wrapper>
        </div>
        <div>
          <Input.Wrapper label={'Doğum Tarihi'}>
            <div className='grid grid-cols-3 gap-2'>
              <Controller
                control={methods.control}
                name={name_birthDate_day}
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleBirthdateSelect(e)
                    }}
                    data={[{ label: 'Gün', value: '' }, ...days]}
                    error={!!error?.birthDate_day}
                  />
                )}
              />
              <Controller
                control={methods.control}
                name={name_birthDate_month}
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleBirthdateSelect(e)
                    }}
                    data={[{ label: 'Ay', value: '' }, ...months]}
                    error={!!error?.birthDate_month}
                  />
                )}
              />
              <Controller
                control={methods.control}
                name={name_birthDate_year}
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    onChange={(e) => {
                      field.onChange(e)
                      handleBirthdateSelect(e)
                    }}
                    data={[{ label: 'Yıl', value: '' }, ...years_18_selectData]}
                    error={!!error?.birthDate_year}
                  />
                )}
              />
            </div>
          </Input.Wrapper>

          {error?.birthDate ? (
            <Input.Error className='pt-1'>
              {error?.birthDate.message}{' '}
            </Input.Error>
          ) : null}

          <input type='hidden' {...methods.register(name_birthDate)} readOnly />
        </div>
        <div>
          <Input.Wrapper label='Tc Kimlik No'>
            <Controller
              control={methods.control}
              name={`${namePrefix}.citizenNo`}
              render={({ field }) => (
                <TextInput
                  {...field}
                  inputMode='numeric'
                  type='tel'
                  error={
                    !methods.watch(`${namePrefix}.nationality_Check`) &&
                    !!error?.citizenNo
                      ? error.citizenNo.message
                      : null
                  }
                  disabled={methods.watch(`${namePrefix}.nationality_Check`)}
                />
              )}
            />
            <div className='pt-2'>
              <Controller
                control={methods.control}
                name={`${namePrefix}.nationality_Check`}
                render={({ field }) => (
                  <Switch
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      methods.setValue(`${namePrefix}.citizenNo`, '')
                    }}
                    label='TC Vatandaşı değilim'
                  />
                )}
              />
            </div>
          </Input.Wrapper>
        </div>
        <div hidden>
          <div>Pasaportu Veren Ülke</div>
          <div>Pasaport No</div>
          <div>Pasaport Geçerlilik Tarihi</div>
        </div>
      </div>
    </div>
  )
}

export default FlightPassengers
