'use client'

import { Button, Container, Box, Text } from '@mantine/core'
import Link from 'next/link'

const categories = [
  'Erken Rezervasyon',
  'Alanya Otelleri',
  'Kıbrıs Otelleri',
  'Bodrum Otelleri',
  'Belek Otelleri',
  'Kemer Otelleri',
  'başar otelleri',
]

const TrendRegions = () => {
  return (
    <>
      {/* Kategoriler */}
      <div className='container-fluid relative pt-10 md:pt-20'>
        <h2 className='mb-6 text-center text-2xl font-bold text-blue-900 md:text-3xl'>
          Trend Tatil Bölgeleri
        </h2>

        <Container className='mb-8 gap-2 overflow-x-auto md:overflow-x-visible'>
          <div className='flex w-max gap-2 md:w-auto md:flex-wrap md:justify-center'>
            {categories.map((title, i) => (
              <Link href='#' key={i}>
                <Button variant='default' color='white' size='md' radius='md'>
                  {title}
                </Button>
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </>
  )
}

export { TrendRegions }
