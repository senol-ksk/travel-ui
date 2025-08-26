import { ChangeEvent } from 'react'
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
import clsx from 'clsx'

import { GenderEnums } from '@/types/passengerViewModel'
import { PassengerValidationType } from '@/app/reservation/types'
import { PassengerSchemaType } from '@/app/reservation/validations'

type IProps = {
  fieldProps: FieldArrayWithId<PassengerSchemaType, 'passengers', 'id'>
  error: Merge<FieldError, FieldErrorsImpl<PassengerValidationType>> | undefined
  index: number
  moduleName: string
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

const passportYears = () =>
  years(dayjs().get('year'), dayjs().get('year') + 10).map((year) => ({
    label: '' + year,
    value: '' + year,
  }))

const birth_date_months = () =>
  dayjs.months().map((month, index) => {
    const currentIndex = index + 1
    const value = `${currentIndex < 10 ? `0${currentIndex}` : currentIndex}`

    return {
      label: '',
      value,
    }
  })

const passportMonths = () =>
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

const passportDateValue = ['', '', '']

export const PassengerInformationForm: React.FC<IProps> = ({
  fieldProps,
  index,
  error,
  moduleName,
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
    })
  }
  function handlePassportDateSelect(
    event: ChangeEvent<HTMLSelectElement>,
    type: 'month' | 'day' | 'year'
  ) {
    const value = event.currentTarget.value
    // YYYY-MM-DD
    switch (type) {
      case 'year':
        passportDateValue[0] = value
        break
      case 'month':
        passportDateValue[1] = value
        break
      case 'day':
        passportDateValue[2] = value
        break
      default:
        break
    }

    methods.setValue(name_passportValidDate, passportDateValue.join('-'), {
      shouldValidate: true,
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
        {...methods.register(`${namePrefix}.hesCode`)}
        defaultValue={fieldProps.hesCode}
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

      <div className='flex flex-col gap-3 md:grid md:grid-cols-2 md:gap-5'>
        <div
          className={clsx(`col-span-2`, {
            hidden: moduleName.toLowerCase() === 'bus',
          })}
        >
          <Input.Wrapper error={!!error?.gender}>
            <Controller
              control={methods.control}
              name={`${namePrefix}.gender`}
              defaultValue={
                moduleName?.toLowerCase() === 'bus'
                  ? fieldProps.gender === '1'
                    ? '1'
                    : '0'
                  : null
              }
              render={({ field: { onChange, value } }) => (
                <>
                  <Radio.Group
                    defaultValue={'' + value}
                    onChange={onChange}
                    error={!!error?.gender ? error.gender.message : null}
                  >
                    <Group>
                      <Radio
                        value={GenderEnums.Female}
                        name={`${namePrefix}.gender`}
                        label='Kadın'
                      />
                      <Radio
                        value={GenderEnums.Male}
                        name={`${namePrefix}.gender`}
                        label='Erkek'
                      />
                    </Group>
                  </Radio.Group>
                </>
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
                size='md'
                label='Soyad'
                error={error?.lastName ? error?.lastName.message : null}
                autoComplete='family-name'
              />
            )}
          />
        </div>
        <div>
          <Input.Wrapper>
            <Input.Label fz='md' htmlFor={name_birthDate_day}>
              <span className='text-sm font-normal'>Doğum Tarihi</span>
            </Input.Label>
            <div className='grid grid-cols-3 gap-2'>
              <Controller
                control={methods.control}
                name={name_birthDate_day}
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    size='md'
                    id={name_birthDate_day}
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
          <Input.Wrapper>
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
                      methods.setValue(`${namePrefix}.passportCountry`, '')
                      methods.setValue(`${namePrefix}.PassportNo`, '')
                      methods.setValue(`${namePrefix}.passportValidityDate`, '')
                      methods.setValue(name_passportValid_day, '')
                      methods.setValue(name_passportValid_month, '')
                      methods.setValue(name_passportValid_year, '')
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
              name={`${namePrefix}.passportCountry`}
              defaultValue={''}
              render={({ field }) => (
                <NativeSelect
                  {...field}
                  size='md'
                  label={
                    <div className='text-sm font-normal'>
                      Pasaportu Veren Ülke
                    </div>
                  }
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
          <div>
            <Input.Label htmlFor={`${namePrefix}_${name_passportValid_day}`}>
              <div className='text-sm font-normal'>
                {' '}
                Pasaport Geçerlilik Tarihi
              </div>
            </Input.Label>
            <Input.Wrapper className='grid grid-cols-3 gap-3'>
              <Controller
                control={methods.control}
                name={name_passportValid_day}
                defaultValue={''}
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    size='md'
                    id={`${namePrefix}_${name_passportValid_day}`}
                    onChange={(event) => {
                      field.onChange(event)
                      handlePassportDateSelect(event, 'day')
                    }}
                    error={!!error?.passportValidityDate}
                    data={[{ label: 'Gün', value: '' }, ...days()]}
                    autoComplete='off'
                  />
                )}
              />

              <Controller
                control={methods.control}
                name={name_passportValid_month}
                defaultValue={''}
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    size='md'
                    onChange={(event) => {
                      field.onChange(event)
                      handlePassportDateSelect(event, 'month')
                    }}
                    error={!!error?.passportValidityDate}
                    data={[{ label: 'Ay', value: '' }, ...passportMonths()]}
                    autoComplete='off'
                  />
                )}
              />
              <Controller
                control={methods.control}
                name={name_passportValid_year}
                defaultValue={''}
                render={({ field }) => (
                  <NativeSelect
                    {...field}
                    size='md'
                    onChange={(event) => {
                      field.onChange(event)
                      handlePassportDateSelect(event, 'year')
                    }}
                    error={!!error?.passportValidityDate}
                    data={[{ label: 'Yıl', value: '' }, ...passportYears()]}
                    autoComplete='off'
                  />
                )}
              />
            </Input.Wrapper>
            <Input.Error className='pt-1'>
              {!!error?.passportValidityDate
                ? error?.passportValidityDate.message
                : null}
            </Input.Error>

            <input
              type='hidden'
              {...methods.register(name_passportValidDate, {
                value: fieldProps.passportValidityDate,
              })}
              autoComplete='off'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PassengerInformationForm
