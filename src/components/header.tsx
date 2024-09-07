import Image from 'next/image'
import Link from 'next/link'

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

      <div className='flex flex-1 items-center'>
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
          {/* <Button
      type='button'
      variant={'outlinePill'}
      className='flex gap-2'
    >
      <FaRegUserCircle />
      <span>Hesabım</span>
    </Button> */}
        </div>
      </div>
    </div>
  </header>
)

export default Header
