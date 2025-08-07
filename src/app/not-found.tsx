import { Center, Container, Title, Image, Button } from '@mantine/core'
import NextImage from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Container component={Center} display={'flex'} className='h-full py-12'>
      <div className='flex flex-col items-center gap-3'>
        <div className='mx-auto max-w-4xl'>
          <NextImage
            src={'/404.webp'}
            alt='Üzgünüz, aradığınız sayfa bulunamadı.'
            width={421}
            height={185}
          />
        </div>
        <Title mb={'md'}>Üzgünüz, aradığınız sayfa bulunamadı.</Title>
        <p className='text-lg'>
          Ulaşmaya çalıştığınız sayfa yayından kaldırılmış veya yanlış olabilir.
          Ana sayfadan kontrol edip tekrar deneyiniz.
        </p>
        <div>
          <Button component={Link} href='/' size='lg'>
            Ana Sayfa
          </Button>
        </div>
      </div>
    </Container>
  )
}
