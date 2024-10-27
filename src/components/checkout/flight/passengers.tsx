import { ChangeEvent } from 'react'
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
import { range } from '@mantine/hooks'
import clsx from 'clsx'
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

const years_18_selectData = () =>
  years(1930).map((year) => ({
    label: '' + year,
    value: '' + year,
  }))

const passportYears = () =>
  years(dayjs().get('year'), dayjs().get('year') + 10).map((year) => ({
    label: '' + year,
    value: '' + year,
  }))

const birth_date_months = () =>
  dayjs.monthsShort().map((month, index) => {
    const currentIndex = index + 1
    const value = `${currentIndex < 10 ? `0${currentIndex}` : currentIndex}`
    const label = `${currentIndex < 10 ? `0${currentIndex}` : currentIndex} ${month}`
    return {
      label,
      value,
    }
  })

const passportMonths = () =>
  dayjs.monthsShort().map((month, index) => {
    const currentIndex = index + 1
    const value = `${currentIndex < 10 ? `0${currentIndex}` : currentIndex}`
    const label = `${currentIndex < 10 ? `0${currentIndex}` : currentIndex} ${month}`
    return {
      label,
      value,
    }
  })

const days = () =>
  range(1, 31).map((currentIndex) => {
    const value = `${currentIndex < 10 ? `0${currentIndex}` : currentIndex}`

    return {
      label: '' + value,
      value: '' + value,
    }
  })

const pasportDateValue = ['', '', '']

export const FlightPassengers: React.FC<IProps> = ({ field, index, error }) => {
  const methods = useFormContext()
  const namePrefix = `passengers.[${index}]`
  const name_birthDate = `${namePrefix}.birthDate`
  const name_birthDate_day = `${namePrefix}.birthDate_day`
  const name_birthDate_month = `${namePrefix}.birthDate_month`
  const name_birthDate_year = `${namePrefix}.birthDate_year`
  const name_passsportValidDate = `${namePrefix}.PassportValidityDate`

  const name_passsportValid_day = `${namePrefix}.passportValidity_1`
  const name_passsportValid_month = `${namePrefix}.passportValidity_2`
  const name_passsportValid_year = `${namePrefix}.passportValidity_3`

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
  function handlePassportdateSelect(
    event: ChangeEvent<HTMLSelectElement>,
    type: 'month' | 'day' | 'year'
  ) {
    const value = event.currentTarget.value
    // YYYY-MM-DD
    switch (type) {
      case 'year':
        pasportDateValue[0] = value
        break
      case 'month':
        pasportDateValue[1] = value
        break
      case 'day':
        pasportDateValue[2] = value
        break
      default:
        break
    }

    methods.setValue(name_passsportValidDate, pasportDateValue.join('-'), {
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
      <input
        {...methods.register(`${namePrefix}.model_PassengerId`)}
        type='hidden'
      />
      <input
        {...methods.register(`${namePrefix}.RegisteredPassengerId`)}
        type='hidden'
      />
      <input
        {...methods.register(`${namePrefix}.PassengerKey`)}
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
                    data={[{ label: 'Gün', value: '' }, ...days()]}
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
                    data={[{ label: 'Ay', value: '' }, ...birth_date_months()]}
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
                    data={[
                      { label: 'Yıl', value: '' },
                      ...years_18_selectData(),
                    ]}
                    error={!!error?.birthDate_year}
                  />
                )}
              />
            </div>
            {error?.birthDate ? (
              <Input.Error className='pt-1'>
                {error?.birthDate.message}
              </Input.Error>
            ) : null}
          </Input.Wrapper>

          <input type='hidden' {...methods.register(name_birthDate)} readOnly />
        </div>
        <div>
          <Input.Wrapper label='TC Kimlik No'>
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
                      methods.setValue(`${namePrefix}.PassportCountry`, '')
                      methods.setValue(`${namePrefix}.PassportNo`, '')
                      methods.setValue(`${namePrefix}.PassportValidityDate`, '')
                      methods.setValue(name_passsportValid_day, '')
                      methods.setValue(name_passsportValid_month, '')
                      methods.setValue(name_passsportValid_year, '')
                    }}
                    label='TC Vatandaşı değilim'
                  />
                )}
              />
            </div>
          </Input.Wrapper>
        </div>
        <div
          className={clsx('col-span-2 gap-3 sm:grid-cols-3', {
            grid: methods.watch(`${namePrefix}.nationality_Check`),
            hidden: !methods.watch(`${namePrefix}.nationality_Check`),
          })}
        >
          <div>
            <Controller
              control={methods.control}
              name={`${namePrefix}.PassportCountry`}
              defaultValue={''}
              render={({ field }) => (
                <NativeSelect
                  {...field}
                  label='Pasaportu Veren Ülke'
                  error={
                    !!error?.PassportCountry
                      ? error?.PassportCountry.message
                      : null
                  }
                  data={[
                    { label: 'Ülke', value: '' },
                    { label: 'Turkiye', value: 'tr' },
                  ]}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={methods.control}
              name={`${namePrefix}.PassportNo`}
              render={({ field }) => (
                <TextInput
                  {...field}
                  label='Pasaport No'
                  error={!!error?.PassportNo ? error?.PassportNo.message : null}
                />
              )}
            />
          </div>
          <div>
            <Input.Label>Pasaport Geçerlilik Tarihi</Input.Label>
            <Input.Wrapper className='grid grid-cols-3 gap-3'>
              <Controller
                control={methods.control}
                name={name_passsportValid_day}
                defaultValue={''}
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      handlePassportdateSelect(event, 'day')
                    }}
                    error={!!error?.PassportValidityDate}
                    data={[{ label: 'Gün', value: '' }, ...days()]}
                    autoComplete='off'
                  />
                )}
              />

              <Controller
                control={methods.control}
                name={name_passsportValid_month}
                defaultValue={''}
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      handlePassportdateSelect(event, 'month')
                    }}
                    error={!!error?.PassportValidityDate}
                    data={[{ label: 'Ay', value: '' }, ...passportMonths()]}
                    autoComplete='off'
                  />
                )}
              />
              <Controller
                control={methods.control}
                name={name_passsportValid_year}
                defaultValue={''}
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    onChange={(event) => {
                      field.onChange(event)
                      handlePassportdateSelect(event, 'year')
                    }}
                    error={!!error?.PassportValidityDate}
                    data={[{ label: 'Yıl', value: '' }, ...passportYears()]}
                    autoComplete='off'
                  />
                )}
              />
            </Input.Wrapper>
            <Input.Error className='pt-1'>
              {!!error?.PassportValidityDate
                ? error?.PassportValidityDate.message
                : null}
            </Input.Error>

            <input
              type='text'
              {...methods.register(name_passsportValidDate)}
              autoComplete='off'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightPassengers
