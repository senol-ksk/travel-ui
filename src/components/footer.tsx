import { Link } from 'next-view-transitions'
import Image from 'next/image'

const Footer = () => {
  return (
    <footer className='bg-gray-200'>
      <Link href='/'>
        <Image
          src='/logo.png'
          width={152}
          height={41}
          alt='Fulltrip'
          priority
          style={{ width: 152, height: 41 }}
        />
      </Link>
    </footer>
  )
}

export { Footer }
