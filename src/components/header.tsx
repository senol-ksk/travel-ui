import Image from 'next/image'
import Link from 'next/link'

import { Button } from '@mantine/core'
import { FaRegUserCircle } from 'react-icons/fa'

export const Header = () => (
  <header className='bg-white'>
    <div className='container mx-auto flex items-center p-2'>
      <Link href='/'>
        <Image
          src='/logo.png'
          width={152}
          height={41}
          alt='Fulltrip'
          priority
        />
      </Link>

      <div className='hidden flex-1 items-center md:flex'>
        <div className='flex gap-2 px-3 md:gap-4 md:px-5'>
          <Link href='/'>Otel</Link>
          <Link href='/'>Uçak</Link>
          <Link href='/'>Araç</Link>
          <Link href='/'>Otobüs</Link>
          <Link href='/'>Transfer</Link>
          <Link href='/'>Tur</Link>
        </div>
        <div className='ms-auto flex items-center gap-2'>
          <Link href='/'>Kampanyalar</Link>
          <Button
            type='button'
            variant={'outline'}
            className='flex gap-3'
            radius={'xl'}
            leftSection={<FaRegUserCircle />}
          >
            Hesabım
          </Button>
        </div>
      </div>
    </div>
  </header>
)

export default Header
