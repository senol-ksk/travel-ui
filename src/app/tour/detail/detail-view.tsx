import { Accordion, Divider, Spoiler, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { IoCalendarClearOutline } from 'react-icons/io5'

import { TourDetailApiResponse } from '@/modules/tour/type'
import { BiMoon } from 'react-icons/bi'
import { IoIosAirplane } from 'react-icons/io'
import { MdOutlineLocalHotel } from 'react-icons/md'
import { FaRegCheckCircle } from 'react-icons/fa'
import { GoNoEntry } from 'react-icons/go'
import { TbWorld } from 'react-icons/tb'
import { CiLocationOn } from 'react-icons/ci'
import { HiOutlineLocationMarker } from 'react-icons/hi'
// import { TourPassengers } from '../_components/tour-passengers'
type Props = {
  data: TourDetailApiResponse
}

const TourDetail: React.FC<Props> = ({ data }) => {
  const { startDate, endDate } = data.package
  const dayjsStartDate = dayjs(startDate)
  const dayjsEndDate = dayjs(endDate)
  const totalNights = dayjsEndDate.diff(dayjsStartDate, 'day')
  const totalDays = totalNights + 1

  return (
    <div className='flex flex-col gap-6'>
      <Title
        order={2}
        fz={{ base: 'h4', md: 'h2' }}
        px={{ base: 'md', md: 0 }}
        id='tour-program'
      >
        Tur Programı
      </Title>
      <div className='flex flex-col gap-5 rounded-lg border p-5 shadow-sm'>
        <Spoiler
          maxHeight={300}
          hideLabel={
            <div className='text-sm font-semibold underline'>
              Daha Az Görüntüle
            </div>
          }
          showLabel={
            <div className='text-sm font-semibold underline'>
              Devamını Göster
            </div>
          }
          classNames={{
            root: 'pb-3',
          }}
        >
          <div className='flex flex-col gap-6'>
            {data.detail.tourProgram.map((tourProgram, tourProgramIndex) => (
              <div key={tourProgramIndex}>
                <Title order={4} fz={{ base: 'md' }} c={'blue.8'} pb='md'>
                  {tourProgram.title}
                </Title>
                <Title fz={'sm'} lh={'sm'}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: tourProgram.description,
                    }}
                  />
                </Title>
              </div>
            ))}
          </div>
        </Spoiler>
      </div>
      <Title
        order={2}
        fz={{ base: 'h4', md: 'h2' }}
        px={{ base: 'md', md: 0 }}
        id='transport'
      >
        Ulaşım Bilgisi
      </Title>
      <div className='flex flex-col gap-5 rounded-lg border p-5 shadow-sm'>
        {data.detail.flightInformation &&
          data.detail.flightInformation.length &&
          data.detail.flightInformation.length > 0 && (
            <>
              <div className='flex items-center gap-3 text-lg font-semibold'>
                <div>
                  <HiOutlineLocationMarker size={22} />
                </div>
                <div>Araç Bilgisi</div>
              </div>
              <Divider />
              <div className='grid gap-4'>
                {data.detail.flightInformation.map((flight, flightIndex) => (
                  <div key={flightIndex}>
                    <div dangerouslySetInnerHTML={{ __html: flight }} />
                  </div>
                ))}
              </div>
            </>
          )}
        {data.package.hotelInformations &&
          data.package.hotelInformations.length > 0 && (
            <>
              <Divider className='shadow-xl' />
              <div className='flex items-center gap-3 text-lg font-semibold'>
                <div>
                  <MdOutlineLocalHotel size={22} />
                </div>
                <div>Otel Bilgisi</div>
              </div>
              <Divider />
              <div>
                {data.package.hotelInformations &&
                  data.package.hotelInformations.map((hotel, hotelIndex) => (
                    <div key={hotelIndex}>{hotel.name}</div>
                  ))}
              </div>
            </>
          )}
      </div>

      <Title
        order={2}
        fz={{ base: 'h4', md: 'h2' }}
        px={{ base: 'md', md: 0 }}
        id='general'
      >
        Genel Bilgiler
      </Title>
      <div className='flex flex-col gap-3 rounded-lg border px-3 pt-3 shadow-sm'>
        <div className='flex items-center gap-3 p-3'>
          <FaRegCheckCircle size={20} />
          <span className='text-md font-semibold md:text-lg'>
            Ücrete Dahil Olan Hizmetler
          </span>
        </div>
        <Divider />

        <div
          className='px-10'
          dangerouslySetInnerHTML={{
            __html: data.detail.includedInformation,
          }}
        />
        <Accordion
          multiple={false}
          variant='default'
          className='my-5 rounded-md border'
        >
          <Accordion.Item value='visa'>
            <Accordion.Control>
              <div className='flex items-center gap-3'>
                <TbWorld size={20} />
                <span className='text-md font-semibold md:text-lg'>
                  Vize Bilgileri
                </span>
              </div>
            </Accordion.Control>
            <Spoiler
              maxHeight={200}
              hideLabel={
                <div className='px-9 text-sm font-semibold'>
                  Daha Az Görüntüle
                </div>
              }
              showLabel={
                <div className='px-9 text-sm font-semibold'>
                  Devamını Göster
                </div>
              }
            >
              <Accordion.Panel>
                <ul className='list-disc space-y-2 ps-5'>
                  <li>
                    Vize başvurusu için evrak talebinin (Otel, uçak rezervasyonu
                    ve seyahat sigortası) vize randevu tarihinden en az 15 gün
                    önce yapılması gerekmektedir. İlgili evrakların hazırlanması
                    başvuru yapılacak ülkelere göre değiştiğinden, vize
                    randevusu almadan önce mutlaka satış ekiplerimizden
                    evrakların iletilmesiyle ilgili bilgi alınması ve buna göre
                    vize randevusu alınması gerekmektedir. Acentemizin doğacak
                    olumsuzluklardan dolayı herhangi bir sorumluluğu
                    bulunmamaktadır.
                  </li>
                  <li>
                    Yeşil pasaport sahibi misafirlerimizin pasaportlarının
                    süresi dolması durumunda soğuk damga ile uzatma
                    yapmamalarını ve yenilemelerini tavsiye ediyoruz. Uzatma
                    yapılan pasaportlar birçok ülkede kabul görmemektedir.
                    Acentamızın bu hususta bir sorumluluğu bulunmamaktadır.
                  </li>
                  <li>
                    Yurt dışı çıkış fonu ücreti fiyatlarımıza dahil değildir.
                    Çıkış harcının yolcular tarafından ödenmesi gerekmektedir.
                  </li>
                  <li>
                    Tur dönüş tarihi esas alınmak şartıyla yolcunun en az 6 ay
                    geçerli pasaportunun olması gerekmektedir.
                  </li>
                  <li>Pasaport alım tarihi 10 yıldan eski olmamalıdır.</li>
                  <li>
                    Vize talepleriniz için +90 (212) 368 4969 telefon numarasını
                    arayarak bilgi alabilirsiniz.
                  </li>
                  <li>
                    Acentemiz, misafirlerimiz ile konsolosluklar arasında aracı
                    kurum olup, herhangi bir vize alım garantisi vermez.
                    Konsolosluğun vize vermemesi acentemizin sorumluluğunda
                    değildir.
                  </li>
                  <li>
                    Vize başvurularının tur hareket tarihinden en az 3 ay
                    öncesinde yapılması tavsiye edilir. Vize sürecinizin daha
                    sağlıklı ilerleyebilmesi adına başvurunuzu tur kalkış
                    tarihinden en az 3 ay öncesinde tamamlamanızı önemle tavsiye
                    ediyoruz.
                  </li>
                  <li>
                    Ziyaret edilen ülke Türk vatandaşlarına vize uygulayan bir
                    ülke ise ilgili vizenin geçerli pasaportunuzda olması
                    gerekmektedir. İptal edilmiş bir pasaporttaki vize geçerli
                    bir vize dahi olsa, bu vize/pasaport ile seyahat
                    edilememektedir. Acentemizin doğacak olumsuzluklardan dolayı
                    herhangi bir sorumluluğu bulunmamaktadır.
                  </li>
                  <li>
                    Gümrük geçişlerinde ve sınır kapılarında, pasaportunuza
                    giriş-çıkış kaşesi basılabilmesi için, pasaportunuzda en az
                    6 boş sayfa olması gerekmektedir. Vize alınmış olması veya
                    vize gerektirmeyen pasaporta sahip olunması, ülkeye giriş ve
                    çıkış yapılabileceği anlamına gelmeyip, pasaport polisinin
                    sizi ülkeye giriş izni vermeme veya ülkeden çıkarmama
                    yetkisi bulunmaktadır. Acentemizin bu konuda herhangi bir
                    sorumluluğu bulunmamaktadır.
                  </li>
                  <li>
                    Türk vatandaşı olmayan ya da çifte vatandaşlığı olup da
                    diğer ülke pasaportunu kullanarak tura katılacak olan
                    misafirlerin; seyahat edilecek ülkenin, kullanacakları
                    pasaporta uyguladığı vize prosedürünü ilgili konsolosluklara
                    bizzat danışmaları gerekmektedir. Acentemizin doğacak
                    olumsuzluklardan dolayı herhangi bir sorumluluğu
                    bulunmamaktadır.
                  </li>
                  <li>
                    Farklı bir ülkede oturum izni bulunan misafirlerin vize
                    durumlarını, bağlı bulundukları konsolosluklara bizzat
                    danışmaları gerekmektedir. Acentemizin doğacak
                    olumsuzluklardan dolayı herhangi bir sorumluluğu
                    bulunmamaktadır.
                  </li>
                  <li>
                    Yırtılmış, yıpranmış veya benzeri tahribatlara uğramış
                    pasaportlar ile seyahat edilememektedir.
                  </li>
                  <li>
                    Evlilik sebebiyle soyadı değişen misafirlerin, evliliğin
                    üzerinden 3 aydan fazla süre geçtiyse pasaportunu
                    değiştirmesi gerekmektedir. Ülkeden çıkış ve ilgili ülkelere
                    giriş kuralları tamamen pasaport polisi insiyatifindedir.
                  </li>
                  <li>
                    18 yaşından küçük bireylerin tek başlarına ya da anne ve
                    babadan sadece bir tanesi ile seyahat etmesi durumunda hem
                    anneden hem de babadan noter onaylı muvafakatname alması
                    gerekmektedir.
                  </li>
                </ul>
              </Accordion.Panel>
            </Spoiler>
          </Accordion.Item>

          <Accordion.Item value='not-included'>
            <Accordion.Control>
              <div className='flex items-center gap-3'>
                <GoNoEntry size={20} />
                <span className='text-md font-semibold md:text-lg'>
                  Ücrete Dahil Olmayan Hizmetler & Önemli Notlar
                </span>
              </div>
            </Accordion.Control>
            <Spoiler
              maxHeight={200}
              hideLabel={
                <div className='mt-1 px-4 text-sm font-semibold'>
                  Daha Az Görüntüle
                </div>
              }
              showLabel={
                <div className='mt-1 px-4 text-sm font-semibold'>
                  Devamını Göster
                </div>
              }
            >
              <Accordion.Panel>
                <div
                  dangerouslySetInnerHTML={{
                    __html: data.detail.notIncludedInformation,
                  }}
                />
              </Accordion.Panel>
            </Spoiler>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  )
}

export { TourDetail }
