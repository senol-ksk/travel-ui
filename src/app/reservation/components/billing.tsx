'use client'
import 'intl-tel-input/styles'

import {
  Checkbox,
  Group,
  NativeSelect,
  Radio,
  TextInput,
  Input,
  Tabs,
  Collapse,
} from '@mantine/core'
import clsx from 'clsx'
import IntlTelInput from 'intl-tel-input/react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { CountryOptions } from './countries'
import { useDisclosure } from '@mantine/hooks'
import { InvoiceType } from '@/types/global'

const BillingForm = () => {
  const formContext = useFormContext()
  const [opened, { toggle }] = useDisclosure(false)

  const [activeTab, setActiveTab] = useState<InvoiceType>(
    InvoiceType.Individual
  )

  return (
    <div>
      <Checkbox
        {...formContext.register('fillBillingInfosCheck')}
        label='Fatura Bilgileri'
        defaultChecked={opened}
        onChange={() => toggle()}
        classNames={{
          label: 'font-semibold text-xl',
          body: 'items-center',
        }}
      />

      <Collapse in={opened}>
        <div className='pt-5'>
          <Tabs value={activeTab} variant='none'>
            <Radio.Group defaultValue={activeTab}>
              <Group>
                <Radio
                  label='Bireysel'
                  value={InvoiceType.Individual}
                  {...formContext.register('invoiceType')}
                  onChange={() => setActiveTab(InvoiceType.Individual)}
                />

                <Radio
                  label='Kurumsal'
                  value={InvoiceType.Corporate}
                  {...formContext.register('invoiceType')}
                  onChange={() => setActiveTab(InvoiceType.Corporate)}
                />
              </Group>
            </Radio.Group>

            <Tabs.Panel value={InvoiceType.Individual}>
              <div className='grid grid-cols-2 gap-3 pt-4 md:grid-cols-12'>
                <div className='col-span-12 grid grid-cols-12 gap-3'>
                  <div className='col-span-6'>
                    <TextInput
                      size='md'
                      label='Faturaya bir ad verin'
                      {...formContext.register(
                        'billingIndiviual.billingInfoName'
                      )}
                      error={!!formContext.formState.errors.billingInfoName}
                    />
                  </div>
                </div>
                <div className='col-span-6'>
                  <TextInput
                    size='md'
                    label='Ad'
                    {...formContext.register('billingIndiviual.name')}
                    error={!!formContext.formState.errors.name}
                  />
                </div>
                <div className='col-span-6'>
                  <TextInput
                    size='md'
                    label='Soyad'
                    {...formContext.register('billingIndiviual.lastName')}
                    error={!!formContext.formState.errors.lastName}
                  />
                </div>
                <div className='col-span-6'>
                  <NativeSelect
                    label='Unvan'
                    size='md'
                    defaultValue={'Bay'}
                    {...formContext.register('billingIndiviual.title')}
                    error={!!formContext.formState.errors.Title}
                  >
                    <option value='Bay'>Bay</option>
                    <option value='Bayan'>Bayan</option>
                  </NativeSelect>
                </div>
                <div className='col-span-6'>
                  <TextInput
                    size='md'
                    label='TC Kimlik No'
                    type='tel'
                    {...formContext.register('billingIndiviual.tcKimlikNo')}
                    error={!!formContext.formState.errors.tcKimlikNo}
                  />
                </div>
                <div className='col-span-6'>
                  <NativeSelect
                    size='md'
                    label='Ülke'
                    {...formContext.register('billingIndiviual.countryCode')}
                    error={!!formContext.formState.errors.countryCode}
                  >
                    <CountryOptions />
                  </NativeSelect>
                </div>
                <div className='col-span-6'>
                  <TextInput
                    size='md'
                    label='Şehir'
                    {...formContext.register('billingIndiviual.city')}
                    error={!!formContext.formState.errors.city}
                  />
                </div>
                <div className='col-span-12 md:col-span-6'>
                  <TextInput
                    size='md'
                    label='İlçe'
                    {...formContext.register('billingIndiviual.district')}
                    error={!!formContext.formState.errors.district}
                  />
                </div>
                <div className='col-span-12'>
                  <TextInput
                    size='md'
                    label='Adres'
                    {...formContext.register('billingIndiviual.address')}
                    error={!!formContext.formState.errors.address}
                  />
                </div>
                <div className='col-span-6'>
                  <Controller
                    control={formContext.control}
                    name='billingIndiviual.email'
                    defaultValue={
                      formContext.formState.defaultValues?.billingIndiviual
                        ?.email ?? ''
                    }
                    render={({ field, fieldState, formState }) => (
                      <TextInput
                        size='md'
                        label='E-Posta'
                        type='email'
                        {...field}
                        ref={(ref) => field.ref(ref)}
                        error={fieldState.invalid}
                      />
                    )}
                  />
                </div>
                <div className='col-span-6'>
                  <Input.Wrapper>
                    <Input.Label htmlFor='billingIndiviual.mobilPhoneNumber'>
                      GSM No
                    </Input.Label>
                    <div
                      className='m_6c018570 mantine-Input-wrapper'
                      data-variant='default'
                    >
                      <Controller
                        control={formContext.control}
                        name='billingIndiviual.mobilPhoneNumber'
                        render={({ field }) => {
                          return (
                            <IntlTelInput
                              {...field}
                              usePreciseValidation
                              inputProps={{
                                className: clsx(
                                  'm_8fb7ebe7 mantine-Input-input py-5',
                                  {
                                    'border-rose-500':
                                      !!formContext.formState?.errors
                                        .mobilPhoneNumber,
                                  }
                                ),
                                id: field.name,
                                name: field.name,
                              }}
                              ref={(ref) => field.ref(ref?.getInput())}
                              onChangeNumber={field.onChange}
                              initOptions={{
                                strictMode: true,
                                containerClass: 'w-full',
                                separateDialCode: true,
                                initialCountry: 'auto',

                                i18n: {
                                  tr: 'Türkiye',
                                  searchPlaceholder: 'Ülke adı giriniz',
                                },
                                loadUtils: () =>
                                  // @ts-expect-error watch for the package updates
                                  import('intl-tel-input/build/js/utils.js'),
                                geoIpLookup: (callback) => {
                                  fetch('https://ipapi.co/json')
                                    .then((res) => res.json())
                                    .then((data) => callback(data.country_code))
                                    .catch(() => callback('tr'))
                                },
                              }}
                            />
                          )
                        }}
                      />
                    </div>
                  </Input.Wrapper>
                </div>
              </div>
            </Tabs.Panel>
            <Tabs.Panel value={InvoiceType.Corporate}>
              <div className='grid grid-cols-2 gap-3 pt-4 md:grid-cols-12'>
                <div className='col-span-12 grid grid-cols-12 gap-3'>
                  <div className='col-span-6'>
                    <Controller
                      control={formContext.control}
                      name='billingCorporate.billingInfoName'
                      defaultValue={''}
                      render={({ field, formState }) => {
                        return (
                          <TextInput
                            size='md'
                            label='Faturaya bir ad verin'
                            {...field}
                            error={!!formState.errors.billingInfoName}
                          />
                        )
                      }}
                    />
                  </div>
                </div>
                <div className='col-span-6'>
                  <Controller
                    control={formContext.control}
                    name='billingCorporate.title'
                    defaultValue={''}
                    render={({ field, formState }) => {
                      return (
                        <TextInput
                          size='md'
                          label='Şirket Ünvanı'
                          {...field}
                          error={!!formState.errors.title}
                        />
                      )
                    }}
                  />
                </div>
                <div className='col-span-6'>
                  <Controller
                    control={formContext.control}
                    defaultValue={''}
                    name='billingCorporate.vergiDairesi'
                    render={({ field, formState }) => {
                      return (
                        <TextInput
                          size='md'
                          label='Vergi Dairesi'
                          {...field}
                          error={!!formState.errors.vergiDairesi}
                        />
                      )
                    }}
                  />
                </div>
                <div className='col-span-6'>
                  <Controller
                    control={formContext.control}
                    name='billingCorporate.vergiNo'
                    defaultValue={''}
                    render={({ field, formState }) => {
                      return (
                        <TextInput
                          size='md'
                          label='Vergi Numarası'
                          {...field}
                          error={!!formState.errors.vergiNo}
                        />
                      )
                    }}
                  />
                </div>
                <div className='col-span-6'>
                  <Controller
                    control={formContext.control}
                    defaultValue={'TR'}
                    name='billingCorporate.countryCode'
                    render={({ field }) => {
                      return (
                        <NativeSelect label='Ülke' {...field} size='md'>
                          <CountryOptions />
                        </NativeSelect>
                      )
                    }}
                  />
                </div>
                <div className='col-span-6'>
                  <Controller
                    control={formContext.control}
                    name='billingCorporate.city'
                    defaultValue={''}
                    render={({ field, formState }) => (
                      <TextInput
                        size='md'
                        label='Şehir'
                        {...field}
                        error={!!formState.errors.city}
                      />
                    )}
                  />
                </div>
                <div className='col-span-6'>
                  <Controller
                    control={formContext.control}
                    name='billingCorporate.district'
                    defaultValue={''}
                    render={({ field, formState }) => (
                      <TextInput
                        size='md'
                        label='İlçe'
                        {...field}
                        error={!!formState.errors.district}
                      />
                    )}
                  />
                </div>
                <div className='col-span-12'>
                  <Controller
                    control={formContext.control}
                    name='billingCorporate.address'
                    defaultValue={''}
                    render={({ field, formState }) => (
                      <TextInput
                        size='md'
                        label='Adres'
                        {...field}
                        error={!!formState.errors.address}
                      />
                    )}
                  />
                </div>
                <div className='col-span-6'>
                  <Controller
                    control={formContext.control}
                    name='billingCorporate.email'
                    defaultValue={''}
                    render={({ field, formState }) => (
                      <TextInput
                        size='md'
                        type='email'
                        label='E-Posta'
                        {...field}
                        error={!!formState.errors.email}
                      />
                    )}
                  />
                </div>
                <div className='col-span-6'>
                  <Input.Wrapper>
                    <Input.Label htmlFor='billingCorporate.phoneNumber'>
                      GSM No
                    </Input.Label>
                    <div
                      className='m_6c018570 mantine-Input-wrapper'
                      data-variant='default'
                    >
                      <Controller
                        control={formContext.control}
                        name='billingCorporate.phoneNumber'
                        defaultValue={''}
                        render={({ field }) => (
                          <IntlTelInput
                            usePreciseValidation
                            inputProps={{
                              className: clsx(
                                'm_8fb7ebe7 mantine-Input-input py-5',
                                {
                                  'border-rose-500':
                                    !!formContext.formState?.errors.phoneNumber,
                                }
                              ),
                              id: field.name,
                              name: field.name,
                            }}
                            initOptions={{
                              strictMode: true,
                              containerClass: 'w-full',
                              separateDialCode: true,
                              initialCountry: 'auto',
                              i18n: {
                                tr: 'Türkiye',
                                searchPlaceholder: 'Ülke adı giriniz',
                              },
                              loadUtils: () =>
                                // @ts-expect-error watch for the package updates
                                import('intl-tel-input/build/js/utils.js'),
                              geoIpLookup: (callback) => {
                                fetch('https://ipapi.co/json')
                                  .then((res) => res.json())
                                  .then((data) => callback(data.country_code))
                                  .catch(() => callback('tr'))
                              },
                            }}
                            ref={(ref) => field.ref(ref?.getInput())}
                            onChangeNumber={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </Input.Wrapper>
                </div>
              </div>
            </Tabs.Panel>
          </Tabs>
        </div>
      </Collapse>
    </div>
  )
}

export { BillingForm }
