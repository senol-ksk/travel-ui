import { type ChangeEvent } from 'react'
import {
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
import 'dayjs/locale/tr'
import { range } from '@mantine/hooks'

import { GenderEnums } from '@/types/passengerViewModel'
import { PassengerValidationType } from '@/app/reservation/types'
import { PassengerSchemaType } from '@/app/reservation/validations'

type IProps = {
  fieldProps: FieldArrayWithId<PassengerSchemaType, 'passengers', 'id'>
  moduleName: string
  error: Merge<FieldError, FieldErrorsImpl<PassengerValidationType>> | undefined
  index: string | number
}

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

const birth_date_months = () =>
  dayjs.months().map((month, index) => {
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

export const HotelPassengerInformationForm: React.FC<IProps> = ({
  fieldProps,
  index,
  error,
}) => {
  const methods = useFormContext()

  const namePrefix = `passengers.[${index}]`
  const name_birthDate = `${namePrefix}.birthDate`
  const name_birthDate_day = `${namePrefix}.birthDate_day`
  const name_birthDate_month = `${namePrefix}.birthDate_month`
  const name_birthDate_year = `${namePrefix}.birthDate_year`
  const name_passportValidDate = `${namePrefix}.passportValidityDate`

  const name_passportValid_day = `${namePrefix}.passportValidity_1`
  const name_passportValid_month = `${namePrefix}.passportValidity_2`
  const name_passportValid_year = `${namePrefix}.passportValidity_3`

  function handleBirthdateSelect(e: ChangeEvent<HTMLSelectElement>) {
    const values = methods.getValues([
      name_birthDate_year,
      name_birthDate_month,
      name_birthDate_day,
    ])

    methods.setValue(name_birthDate, values.join('-'), {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    })
  }

  return (
    <div className='grid gap-3 md:gap-4'>
      <input
        {...methods.register(`${namePrefix}.type`, {
          value: fieldProps.type,
        })}
        type='hidden'
      />
      <input
        {...methods.register(`${namePrefix}.passengerId`, {
          value: fieldProps.passengerId,
        })}
        type='hidden'
      />
      <input
        {...methods.register(`${namePrefix}.model_PassengerId`, {
          value: fieldProps.model_PassengerId,
        })}
        type='hidden'
      />
      <input
        {...methods.register(`${namePrefix}.registeredPassengerId`, {
          value: fieldProps.registeredPassengerId,
        })}
        type='hidden'
      />
      <input
        {...methods.register(`${namePrefix}.passengerKey`, {
          value: fieldProps.passengerKey,
        })}
        type='hidden'
      />
      <input
        {...methods.register(`${namePrefix}.hesCode`, {
          value: fieldProps.hesCode,
        })}
        type='hidden'
      />
      <input
        {...methods.register(`${namePrefix}.moduleName`, {
          value: fieldProps.moduleName,
        })}
        type='hidden'
      />
      <input
        {...methods.register(`${namePrefix}.calculationYearType`, {
          value: fieldProps.calculationYearType,
        })}
        type='hidden'
      />
      <input
        {...methods.register(`${namePrefix}.checkinDate`, {
          value: fieldProps.checkinDate,
        })}
        type='hidden'
      />
      <input
        {...methods.register(`${namePrefix}.declaredAge`, {
          value: fieldProps.declaredAge,
        })}
        type='hidden'
      />

      <div className='flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-3'>
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
                    <Radio value={'' + GenderEnums.Female} label='Kadın' />
                    <Radio value={'' + GenderEnums.Male} label='Erkek' />
                  </Group>
                </Radio.Group>
              )}
            />
          </Input.Wrapper>
        </div>
        <div>
          <Controller
            control={methods.control}
            name={`${namePrefix}.firstName`}
            defaultValue={fieldProps.firstName ? fieldProps.firstName : ''}
            render={({ field }) => {
              return (
                <TextInput
                  {...field}
                  size='md'
                  label='Ad'
                  error={error?.firstName ? error?.firstName?.message : null}
                  autoComplete='given-name'
                />
              )
            }}
          />
        </div>
        <div>
          <Controller
            control={methods.control}
            name={`${namePrefix}.lastName`}
            defaultValue={fieldProps.lastName}
            render={({ field }) => (
              <TextInput
                {...field}
                label='Soyad'
                error={error?.lastName ? error?.lastName.message : null}
                autoComplete='family-name'
              />
            )}
          />
        </div>
        <div>
          <Input.Wrapper>
            <Input.Label htmlFor={name_birthDate_day}>Doğum Tarihi</Input.Label>
            <div className='grid grid-cols-3 gap-2'>
              <Controller
                control={methods.control}
                name={name_birthDate_day}
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    size='md'
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
                    size='md'
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
                    size='md'
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
          <Controller
            control={methods.control}
            name={`${namePrefix}.citizenNo`}
            defaultValue={fieldProps.citizenNo}
            render={({ field }) => (
              <TextInput
                {...field}
                size='md'
                label='TC Kimlik No'
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
              defaultValue={false}
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
        </div>
        <div hidden>
          <input {...methods.register(`${namePrefix}.PassportNo`)} />
          <input {...methods.register(name_passportValidDate)} />
          <input {...methods.register(name_passportValid_day)} />
          <input {...methods.register(name_passportValid_month)} />
          <input {...methods.register(name_passportValid_year)} />
          <div>
            <Controller
              control={methods.control}
              name={`${namePrefix}.passportCountry`}
              defaultValue={'NL'}
              render={({ field }) => (
                <NativeSelect
                  {...field}
                  size='md'
                  label='Pasaportu Veren Ülke'
                  error={
                    !!error?.passportCountry
                      ? error?.passportCountry.message
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
              name={`${namePrefix}.passportNo`}
              defaultValue={''}
              render={({ field }) => (
                <TextInput
                  {...field}
                  size='md'
                  label='Pasaport No'
                  error={!!error?.passportNo ? error?.passportNo.message : null}
                />
              )}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
