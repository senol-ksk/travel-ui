'use client'

import React from 'react'
import { TextInput, Button, Text, Box } from '@mantine/core'

const EbultenForm = () => {
  return (
    <Box className='rounded-2xl bg-blue-700 p-6 text-white shadow-lg md:p-10'>
      <div className='flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
        <div className='flex flex-col items-start gap-4 md:flex-row md:items-center'>
          <div className='rounded-full bg-white text-blue-600'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='80'
              height='80'
              viewBox='0 0 80 80'
              fill='none'
            >
              <path
                d='M40 80C62.0914 80 80 62.0914 80 40C80 17.9086 62.0914 0 40 0C17.9086 0 0 17.9086 0 40C0 62.0914 17.9086 80 40 80Z'
                fill='white'
              />
              <path
                d='M63.1949 21.9063C63.1833 21.8937 63.1726 21.8805 63.1603 21.8684C63.1304 21.8388 63.0991 21.8118 63.0669 21.7862C62.0128 20.8374 60.6191 20.2588 59.0924 20.2588H20.9077C19.381 20.2588 17.9873 20.8375 16.9331 21.7863C16.9009 21.8118 16.8697 21.8388 16.8398 21.8683C16.8275 21.8805 16.8169 21.8936 16.8052 21.9062C15.6696 22.99 14.96 24.5165 14.96 26.2064V53.488C14.96 55.1778 15.6695 56.704 16.8049 57.788C16.8166 57.8007 16.8274 57.814 16.8399 57.8263C16.8698 57.8559 16.9012 57.883 16.9334 57.9086C17.9875 58.8573 19.3812 59.4359 20.9077 59.4359H59.0924C60.619 59.4359 62.0127 58.8573 63.0669 57.9085C63.0991 57.883 63.1304 57.8559 63.1603 57.8264C63.1728 57.8141 63.1835 57.8008 63.1953 57.7881C64.3307 56.7042 65.0402 55.1779 65.0402 53.4881V26.2065C65.0401 24.5165 64.3305 22.9901 63.1949 21.9063ZM46.9655 39.8474L62.2874 24.3526C62.605 24.898 62.788 25.5311 62.788 26.2065V53.4881C62.788 54.1635 62.605 54.7966 62.2873 55.342L46.9655 39.8474ZM59.0924 22.5109C59.6352 22.5109 60.1505 22.6295 60.6153 22.8407L44.5908 39.0459C44.5905 39.0462 44.5903 39.0463 44.59 39.0466C44.5896 39.047 44.5894 39.0473 44.589 39.0477L41.796 41.8722C41.3179 42.3558 40.6801 42.6222 40 42.6222C39.3201 42.6222 38.6822 42.3558 38.2041 41.8721L35.4119 39.0483C35.4113 39.0478 35.4108 39.0471 35.4103 39.0466C35.4099 39.0462 35.4095 39.0459 35.4092 39.0456L19.3849 22.8406C19.8497 22.6295 20.365 22.5108 20.9078 22.5108L59.0924 22.5109ZM17.7128 55.3421C17.3951 54.7967 17.2121 54.1636 17.2121 53.4881V26.2065C17.2121 25.5311 17.3951 24.898 17.7127 24.3526L33.0345 39.8474L17.7128 55.3421ZM20.9077 57.1838C20.3649 57.1838 19.8496 57.0652 19.3849 56.8541L34.6183 41.449L36.6026 43.4557C37.5072 44.3705 38.7138 44.8744 40 44.8744C41.2864 44.8744 42.493 44.3705 43.3976 43.4558L45.3819 41.449L60.6153 56.8541C60.1506 57.0652 59.6352 57.1838 59.0925 57.1838H20.9077Z'
                fill='#1F6CE0'
              />
            </svg>
          </div>
          <div>
            <Text fw={600} size='lg' className='text-start'>
              Bültenimize Kaydolun!
            </Text>
            <Text size='sm' className='mt-1 text-start'>
              En son fırsatları, özel indirimleri, seyahat ilhamını alın ve
              dünyayı tek seferde bir tatille fethedin.{' '}
              <strong>#Travelfulltrip</strong>
            </Text>
          </div>
        </div>

        <div className='flex flex-col gap-2 md:items-end'>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <TextInput
              placeholder='E-posta adresiniz'
              classNames={{
                input: 'w-full sm:w-100 rounded',
              }}
              radius='md'
              size='md'
            />
            <Button
              color='orange'
              radius='md'
              size='md'
              className='hover:bg-orange-600'
            >
              Üye Ol
            </Button>
          </div>
          <Text size='xs' className='text-white/80'>
            Bu onay kutusunu tıklayarak, ParaflyTravel’dan haber bültenleri ve
            teklifler almayı kabul ediyorum.
            <a href='#' className='ml-1 underline'>
              Ayrıntılar
            </a>
          </Text>
        </div>
      </div>
    </Box>
  )
}

export { EbultenForm }
