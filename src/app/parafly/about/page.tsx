import { Button, Image, Title } from '@mantine/core'
import NextImage from 'next/image'
import { MdOutlineChevronRight } from 'react-icons/md'

export default function ParafCalculate() {
  return (
    <div>
      <Title mb={'md'}>Parafly Travel Nedir?</Title>
      <div>
        <Image
          src={'/about-paraf.jpeg'}
          component={NextImage}
          width={860}
          height={431}
          alt='Parafly Travel Nedir?'
          radius={'md'}
        />
      </div>
      <div className='mt-xl text-lg'>
        <Title order={2} fz={'lg'}>
          Paraflytravel.com nedir?
        </Title>
        <div>
          <ul className='mt-2 list-disc ps-4'>
            <li>
              Paraflytravel.com üyelerine online olarak uçak bileti , otel
              rezervasyonu , yurtiçi ve yurtdışı turlar , araç kiralama gibi
              seyahat hizmetleri sunan seyahat sitesidir.
            </li>
          </ul>
        </div>

        <Title order={3} mt={'lg'} fz={'lg'}>
          Nasıl Çalışır?
        </Title>
        <div>
          <ul className='mt-2 list-disc ps-4'>
            <li>Paraflytravel.com’a üye olursunuz.&nbsp;</li>
            <li>
              Uçak, otel, tur ve araç kiralama ile ilgili ihtiyacınız olan ürünü
              ararsınız.&nbsp;
            </li>
            <li>
              Seçmiş olduğunuz ürün için ihtiyacınız olan TL ve ParafPara
              karşılığını görürsünüz.&nbsp;
            </li>
            <li>
              Paraflytravel.com’da tüm ürünleri sponsor kartımız olan Parafly
              kartlar ile taksitli veya paraf para kullanarak alabilirsiniz.
            </li>
            <li>
              İstediğiniz ürünü ParafPara’nız ile satın alabilirsiniz.&nbsp;
            </li>
            <li>
              ParafParanız yeterli değil ise avans ParafPara kullanabilirsiniz.
            </li>
            <li>
              Parafly ile Paraflytravel.com’da bir ürünü ParafPara+ AvansPara
              kullanarak satın alabilirsiniz. ParafParalarınızın yetmemesi
              durumunda eksik kalan tutarı satış işlemi ile tamamlayabilirsiniz.
            </li>
          </ul>
          <div className='mt-10'>
            <Button
              size='lg'
              component='a'
              href='https://www.parafly.com.tr/tr/hizli-basvur.html'
              target='_blank'
              rightSection={<MdOutlineChevronRight size={24} />}
            >
              PARAFLY KART SAHİBİ OLMAK İÇİN TIKLAYINIZ
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
