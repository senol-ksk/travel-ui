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

enum InvoiceType {
  Individual = '0',
  Corporate = '1',
}

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
        label={'Fatura Bilgileri'}
        defaultChecked={opened}
        onChange={() => toggle()}
        classNames={{
          label: 'font-semibold text-lg',
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
                      label='Faturaya bir ad verin'
                      {...formContext.register('individual.BillingInfoName')}
                      error={!!formContext.formState.errors.BillingInfoName}
                    />
                  </div>
                </div>
                <div className='col-span-6'>
                  <TextInput
                    label='Ad'
                    {...formContext.register('individual.Name')}
                    error={!!formContext.formState.errors.Name}
                  />
                </div>
                <div className='col-span-6'>
                  <TextInput
                    label='Soyad'
                    {...formContext.register('individual.LastName')}
                    error={!!formContext.formState.errors.LastName}
                  />
                </div>
                <div className='col-span-6'>
                  <NativeSelect
                    label='Unvan'
                    defaultValue={'Bay'}
                    {...formContext.register('individual.Title')}
                    error={!!formContext.formState.errors.Title}
                  >
                    <option value='Bay'>Bay</option>
                    <option value='Bayan'>Bayan</option>
                  </NativeSelect>
                </div>
                <div className='col-span-6'>
                  <TextInput
                    label='TC Kimlik No'
                    type='tel'
                    {...formContext.register('individual.TcKimlikNo')}
                    error={!!formContext.formState.errors.TcKimlikNo}
                  />
                </div>
                <div className='col-span-6'>
                  <NativeSelect
                    label='Ülke'
                    {...formContext.register('individual.CountryCode')}
                    error={!!formContext.formState.errors.CountryCode}
                  >
                    <CountryOptions />
                  </NativeSelect>
                </div>
                <div className='col-span-6'>
                  <TextInput
                    label='Şehir'
                    {...formContext.register('individual.City')}
                    error={!!formContext.formState.errors.City}
                  />
                </div>
                <div className='col-span-12 md:col-span-6'>
                  <TextInput
                    label='İlçe'
                    {...formContext.register('individual.District')}
                    error={!!formContext.formState.errors.District}
                  />
                </div>
                <div className='col-span-12'>
                  <TextInput
                    label='Adres'
                    {...formContext.register('individual.Address')}
                    error={!!formContext.formState.errors.Address}
                  />
                </div>
                <div className='col-span-6'>
                  <TextInput
                    label='E-Posta'
                    {...formContext.register('individual.Email')}
                    error={!!formContext.formState.errors.Email}
                  />
                </div>
                <div className='col-span-6'>
                  <Input.Wrapper>
                    <Input.Label htmlFor='individual.MobilPhoneNumber'>
                      GSM No
                    </Input.Label>
                    <div
                      className='m_6c018570 mantine-Input-wrapper'
                      data-variant='default'
                    >
                      <Controller
                        control={formContext.control}
                        name='individual.MobilPhoneNumber'
                        render={({ field }) => {
                          return (
                            <IntlTelInput
                              {...field}
                              usePreciseValidation
                              inputProps={{
                                className: clsx(
                                  'm_8fb7ebe7 mantine-Input-input',
                                  {
                                    'border-rose-500':
                                      !!formContext.formState?.errors
                                        .MobilPhoneNumber,
                                  }
                                ),
                                'data-variant': 'default',
                                id: field.name,
                                name: field.name,
                              }}
                              ref={(ref) => {
                                field.ref({
                                  focus: ref?.getInput,
                                })
                              }}
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
                    <TextInput label='Faturaya bir ad verin' />
                  </div>
                </div>
                <div className='col-span-6'>
                  <TextInput label='Şirket Ünvanı' />
                </div>
                <div className='col-span-6'>
                  <TextInput label='Vergi Dairesi' />
                </div>
                <div className='col-span-6'>
                  <NativeSelect label='Vergi Numarası' />
                </div>
                <div className='col-span-6'>
                  <NativeSelect label='Ülke'>
                    <CountryOptions />
                  </NativeSelect>
                </div>
                <div className='col-span-6'>
                  <TextInput label='Şehir' />
                </div>
                <div className='col-span-6'>
                  <TextInput label='İlçe' />
                </div>
                <div className='col-span-12'>
                  <TextInput label='Adres' />
                </div>
                <div className='col-span-6'>
                  <TextInput label='E-Posta' />
                </div>
                <div className='col-span-6'>
                  <Input.Wrapper>
                    <Input.Label htmlFor='MobilPhoneNumber'>GSM No</Input.Label>
                    <div
                      className='m_6c018570 mantine-Input-wrapper'
                      data-variant='default'
                    >
                      <IntlTelInput
                        usePreciseValidation
                        inputProps={{
                          className: clsx('m_8fb7ebe7 mantine-Input-input'),
                          'data-variant': 'default',
                          id: 'MobilPhoneNumber',
                          name: 'MobilPhoneNumber',
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
