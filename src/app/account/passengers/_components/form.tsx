'use client'

import { Group, Input, NativeSelect, TextInput, Title } from '@mantine/core'

const PassengerForm = () => {
  return (
    <form>
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5'>
        <div className='col-span-2 flex'>
          <NativeSelect
            label='Yolcu Tipi'
            data={[
              { label: 'Yetişkin', value: '0' },
              { label: 'Çocuk', value: '1' },
              { label: 'Bebek', value: '2' },
            ]}
          />
        </div>
        <div className=''>
          <TextInput label='Ad' />
        </div>
        <div className=''>
          <TextInput label='Soyad' />
        </div>
        <div className=''>
          <Input.Wrapper>
            <Input.Label htmlFor='newPassengerBirthDate'>
              Doğum Tarihi
            </Input.Label>
            <Group grow>
              <NativeSelect id='newPassengerBirthDate' aria-placeholder='Gün' />
              <NativeSelect aria-placeholder='Ay' />
              <NativeSelect aria-placeholder='Yıl' />
            </Group>
          </Input.Wrapper>
        </div>
        <div className=''>
          <NativeSelect
            label='Cinsiyet'
            data={[
              { label: 'Erkek', value: '0' },
              { label: 'Kadın', value: '1' },
            ]}
          />
        </div>
        <div className=''>
          <TextInput label='TC Kimlik' inputMode='numeric' />
        </div>
        <div className='col-span-2'>
          <Title order={4}>Pasaport Bilgileri</Title>
        </div>
        <div>
          <NativeSelect label='Pasaportu Veren Ülke' />
        </div>
        <div>
          <TextInput label='Pasaport No' />
        </div>
        <div>
          <Input.Wrapper>
            <Input.Label htmlFor='newPassengerPassportDate'>
              Pasaport Geçerlilik Tarihi
            </Input.Label>
            <Group grow>
              <NativeSelect id='newPassengerPassportDate' />
              <NativeSelect />
              <NativeSelect />
            </Group>
          </Input.Wrapper>
        </div>
        <div className='col-span-2'>
          <Title order={4}>İletişim Bilgileri</Title>
        </div>
        <div>
          <TextInput type='email' label='E-posta' />
        </div>
        <div>
          <TextInput type='tel' inputMode='numeric' label='GSM No' />
        </div>
      </div>
    </form>
  )
}

export { PassengerForm }
