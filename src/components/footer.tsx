import Link from 'next/link'
import { Text } from '@mantine/core'
import Image from 'next/image'

const Footer = () => {
  return (
    <div className='bg-gray-100 p-6'>
      <div className='container'>
        <div className='grid grid-cols-1 gap-6 text-center md:grid-cols-3 md:text-center'>
          <Link href='/'>
            <Image
              src='/logo.png'
              width={152}
              height={41}
              alt='Fulltrip'
              priority
              className='mx-auto md:mx-0'
            />
          </Link>
          <div>
            <Text size='lg'>0850 878 1484</Text>
            <Text size='xs'>09:00 - 18:00 arasında arayabilirsiniz</Text>
          </div>
          <Text size='lg' className='md:text-right'>
            Sosyal Medya
          </Text>
        </div>

        <hr className='my-6' />

        <div className='grid grid-cols-2 justify-start gap-4 text-center md:flex md:justify-center'>
          <Link href='/yardim'>
            <Text size='sm'>Fulltrip</Text>
          </Link>
          <Link href='/yardim'>
            <Text size='sm'>Kullanım Şartları</Text>
          </Link>
          <Link href='/yardim'>
            <Text size='sm'>Gizlilik ve Güvenlik</Text>
          </Link>
          <Link href='/yardim'>
            <Text size='sm'>Yardım</Text>
          </Link>
          <Link href='/sss'>
            <Text size='sm'>Sık Sorulan Sorular</Text>
          </Link>
          <Link href='/canli-destek'>
            <Text size='sm'>KVKK</Text>
          </Link>
          <Link href='/iletisim'>
            <Text size='sm'>Tedarikçilerimiz</Text>
          </Link>
        </div>

        <hr className='my-6' />

        <div className='grid grid-cols-2 gap-4'>
          <div className='flex gap-3 md:justify-center'>
            <Text size='sm'>Logo 1</Text>
            <Text size='sm'>Logo 2</Text>
            <Text size='sm'>Logo 3</Text>
          </div>
          <div className='flex gap-3 md:justify-center'>
            <Text size='sm'>Logo 4</Text>
            <Text size='sm'>Logo 5</Text>
            <Text size='sm'>Logo 6</Text>
          </div>
        </div>

        <div className='mt-6 text-center text-sm text-gray-500'>
          <Text size='sm'>&copy; 2025 Fulltrip. Tüm hakları saklıdır.</Text>
          <Text size='sm'>
            Yolculuklarınız için en iyi rehber, en iyi fırsatlar burada!
          </Text>
        </div>
      </div>
    </div>
  )
}

export { Footer }
