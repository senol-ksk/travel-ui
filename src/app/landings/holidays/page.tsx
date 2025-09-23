import { getContent } from '@/libs/cms-data'
import {
  CmsContent,
  holidayLandingParams,
  holidayLandingWidgets,
} from '@/types/cms-types'
import {
  Container,
  Title,
  Table,
  TableThead,
  TableTbody,
  TableTr,
  TableTh,
  TableTd,
  Button,
  Grid,
  GridCol,
  Card,
  Text,
} from '@mantine/core'
import Image from 'next/image'

import { notFound } from 'next/navigation'

export default async function HolidaysPage() {
  const data = (
    await getContent<CmsContent<holidayLandingWidgets[], holidayLandingParams>>(
      'resmi-tatil-gunleri'
    )
  )?.data

  if (!data) return notFound()
  const { params, widgets } = data
  const holiday_link = widgets.filter((x) => x.point === 'holiday_link')
  const getHolidayLinks = (holidayName: string) => {
    const found = holiday_link.find(
      (item) =>
        item.title?.toLowerCase().includes(holidayName.toLowerCase()) ||
        item.params?.description?.value
          ?.toLowerCase()
          .includes(holidayName.toLowerCase())
    )
    return found
  }

  const holidays = [
    {
      name: 'Yılbaşı',
      date: '1 Ocak 2026',
      duration: '1 Gün',
      day: 'Perşembe',
    },
    {
      name: 'Ramazan Bayramı',
      date: '19 Mart (Arife) - 22 Mart 2026',
      duration: '3.5 Gün',
      day: 'Perşembe-Pazar',
    },
    {
      name: 'Ulusal Egemenlik ve Çocuk Bayramı',
      date: '23 Nisan 2026',
      duration: '1 Gün',
      day: 'Perşembe',
    },
    {
      name: 'Emek Ve Dayanışma Günü',
      date: '1 Mayıs 2026',
      duration: '1 Gün',
      day: 'Cuma',
    },
    {
      name: "Atatürk'ü Anma Ve Gençlik Ve Spor Bayramı",
      date: '19 Mayıs 2026',
      duration: '1 Gün',
      day: 'Salı',
    },
    {
      name: 'Kurban Bayramı',
      date: '26 (Arife) - 30 Haziran 2026',
      duration: '4.5 Gün',
      day: 'Salı-Cumartesi',
    },
    {
      name: 'Demokrasi Ve Milli Birlik Günü',
      date: '15 Temmuz 2026',
      duration: '1 Gün',
      day: 'Çarşamba',
    },
    {
      name: 'Zafer Bayramı',
      date: '30 Ağustos 2026',
      duration: '1 Gün',
      day: 'Pazar',
    },
    {
      name: 'Cumhuriyet Bayramı',
      date: '28 - 29 Ekim 2026',
      duration: '1.5 Gün',
      day: 'Perşembe',
    },
  ]

  const holidayCards = [
    {
      name: 'Yılbaşı',
      date: '1 Ocak 2026',
      day: 'Çarşamba',
      duration: '1 Gün İzin',
    },
    {
      name: 'Ramazan Bayramı',
      date: '19-22 Mart 2026',
      day: 'Perşembe-Pazar',
      duration: '3,5 Gün İzin',
    },
    {
      name: 'Ulusal Egemenlik ve Çocuk Bayramı',
      date: '23 Nisan 2026',
      day: 'Perşembe',
      duration: '1 Gün İzin',
    },
    {
      name: 'Emek ve Dayanışma Günü',
      date: '1 Mayıs 2026',
      day: 'Cuma',
      duration: '1 Gün İzin',
    },
    {
      name: "Atatürk'ü Anma ve Gençlik ve Spor Bayramı",
      date: '19 Mayıs 2026',
      day: 'Salı',
      duration: '1 Gün İzin',
    },
    {
      name: 'Kurban Bayramı',
      date: '26-30 Haziran 2026',
      day: 'Salı-Cumartesi',
      duration: '4,5 Gün İzin',
    },
    {
      name: 'Demokrasi ve Milli Birlik Günü',
      date: '15 Temmuz 2026',
      day: 'Çarşamba',
      duration: '1 Gün İzin',
    },
    {
      name: 'Zafer Bayramı',
      date: '30 Ağustos 2026',
      day: 'Pazar',
      duration: '1 Gün İzin',
    },
    {
      name: 'Cumhuriyet Bayramı',
      date: '28-29 Ekim 2026',
      day: 'Perşembe',
      duration: '1,5 Gün İzin',
    },
    {
      name: '1. Ara Tatil',
      date: '10-14 Kasım 2025',
      day: 'Pazar',
      duration: '5 Gün Tatil',
    },
    {
      name: '2. Ara Tatil',
      date: '16-20 Mart 2026',
      day: 'Perşembe',
      duration: '5 Gün Tatil',
    },
    {
      name: 'Yarıyıl Tatili',
      date: '19-30 Ocak 2026',
      day: 'Çarşamba',
      duration: '15 Gün Tatil',
    },
  ]

  return (
    <div>
      <div className='relative h-48 w-full overflow-hidden md:h-96'>
        <Image
          src='https://ykmturizm.mncdn.com/11/Files/638929335298480169.jpg'
          alt='2026 Resmi Tatil Günleri'
          fill
          className='object-cover'
          priority
        />
      </div>

      <Container size='lg' py='xl'>
        <div className='mb-12'>
          <Title order={2} size='h2' mb='md'>
            2026 Resmi Tatil Günleri
          </Title>
          <p className='text-lg'>
            2026 resmi tatil günleri, ajandanızı keyifli seyahat planlarıyla
            doldurmak için harika fırsatlar sunuyor. Kısa kaçamaklar için
            tatilleri değerlendirebilir veya kişisel izin günlerinizle
            birleştirerek daha uzun tatil fırsatları yaratabilirsiniz. Bu
            fırsatları Parafly Travel ayrıcalıklarıyla birleştirerek yeni yerler
            keşfedin, sevdiklerinizle unutulmaz anılar biriktirin ve yıl boyunca
            enerjinizi yenileyin.
          </p>
        </div>

        <div>
          <Title order={2} size='h2' mb='lg'>
            2026 Resmi Tatiller
          </Title>
          <div className='overflow-x-auto'>
            <Table className='min-w-full'>
              <TableThead>
                <TableTr className='bg-blue-100'>
                  <TableTh className='text-lg font-semibold'>
                    Tatil Günü
                  </TableTh>
                  <TableTh className='text-lg font-semibold'>Tarih</TableTh>
                  <TableTh className='text-lg font-semibold'>Süre</TableTh>
                  <TableTh className='text-lg font-semibold'>Gün</TableTh>
                </TableTr>
              </TableThead>
              <TableTbody>
                {holidays.map((holiday, index) => (
                  <TableTr key={index}>
                    <TableTd className='font-medium'>{holiday.name}</TableTd>
                    <TableTd>{holiday.date}</TableTd>
                    <TableTd>{holiday.duration}</TableTd>
                    <TableTd>{holiday.day}</TableTd>
                  </TableTr>
                ))}
              </TableTbody>
            </Table>
          </div>
        </div>

        <div className='mt-16'>
          <Grid gutter='md'>
            {holidayCards.map((holiday, index) => (
              <GridCol key={index} span={{ base: 12, sm: 6, md: 4 }}>
                <Card shadow='sm' radius='md' withBorder className='h-full'>
                  <div className='-m-4 mb-4 flex h-20 items-center justify-center rounded-t-md bg-blue-800 px-4 py-6 text-white'>
                    <Text size='lg' fw={600} className='text-center'>
                      {holiday.name}
                    </Text>
                  </div>

                  <div className='mb-4 space-y-2 text-center'>
                    <Text size='xl' className='text-center'>
                      <strong>{holiday.date}</strong>
                    </Text>
                    <Text
                      size='xl'
                      c='dimmed'
                      className='border-b pb-2 text-center'
                    >
                      <strong>{holiday.day}</strong>
                    </Text>
                    <Text size='xl' c='orange' fw={500} className='text-center'>
                      <strong>{holiday.duration}</strong>
                    </Text>
                  </div>

                  {(() => {
                    const currentHolidayLinks = getHolidayLinks(holiday.name)
                    return currentHolidayLinks ? (
                      <div>
                        <div className='grid grid-cols-2 gap-2'>
                          {currentHolidayLinks.params?.dom_hotel?.value && (
                            <a
                              href={currentHolidayLinks.params.dom_hotel.value}
                              className='col-span-1'
                            >
                              <Button
                                variant='default'
                                fullWidth
                                size='sm'
                                className='text-blue-600 hover:bg-blue-100'
                              >
                                Yurt İçi Otelleri
                              </Button>
                            </a>
                          )}
                          {currentHolidayLinks.params?.dom_tour?.value && (
                            <a href={currentHolidayLinks.params.dom_tour.value}>
                              <Button
                                variant='default'
                                fullWidth
                                size='sm'
                                className='text-blue-600 hover:bg-blue-100'
                              >
                                Kültür Turları
                              </Button>
                            </a>
                          )}
                        </div>
                        <div className='mt-2 grid grid-cols-2 gap-2'>
                          {currentHolidayLinks.params?.int_hotel?.value && (
                            <a
                              href={currentHolidayLinks.params.int_hotel.value}
                            >
                              <Button
                                variant='default'
                                fullWidth
                                size='sm'
                                className='text-blue-600 hover:bg-blue-100'
                              >
                                Kıbrıs Otelleri
                              </Button>
                            </a>
                          )}
                          {currentHolidayLinks.params?.int_tour?.value && (
                            <a
                              href={currentHolidayLinks.params.int_tour.value}
                              className='col-span-1'
                            >
                              <Button
                                variant='default'
                                fullWidth
                                size='sm'
                                className='text-blue-600 hover:bg-blue-100'
                              >
                                Yurt Dışı Turları
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className='grid grid-cols-2 gap-2'>
                        <a href='/otel' className='col-span-1'>
                          <Button
                            variant='default'
                            fullWidth
                            size='sm'
                            className='text-blue-600 hover:bg-blue-100'
                          >
                            Yurt İçi Otelleri
                          </Button>
                        </a>
                        <a href='/tur' className='col-span-1'>
                          <Button
                            variant='default'
                            fullWidth
                            size='sm'
                            className='text-blue-600 hover:bg-blue-100'
                          >
                            Kültür Turları
                          </Button>
                        </a>
                      </div>
                    )
                  })()}
                </Card>
              </GridCol>
            ))}
          </Grid>
        </div>
        <div className='mt-16 space-y-8'>
          <div>
            <Title order={3} size='h3' mb='md'>
              Yılbaşı
            </Title>
            <Text size='md'>
              <strong>Tarih:</strong> 1 Ocak 2026, Perşembe
            </Text>
            <Text size='md'>
              Yeni yıla girişin coşkusunu yaşayın. 2 Ocak Cuma günü 1 gün izin
              alarak 4 günlük tatil planlayabilirsiniz.
            </Text>
          </div>

          <div>
            <Title order={3} size='h3' mb='md'>
              Ramazan Bayramı
            </Title>
            <Text size='md'>
              <strong>Tarih:</strong> 19 Mart (Arife) - 22 Mart 2026,
              Perşembe-Pazar
            </Text>
            <Text size='md'>
              Perşembe günü yarım gün izin alarak 4 günlük bayram tatilini
              Parafly Travel fırsatlarıyla planlayabilirsiniz.
            </Text>
          </div>

          <div>
            <Title order={3} size='h3' mb='md'>
              23 Nisan Ulusal Egemenlik ve Çocuk Bayramı
            </Title>
            <Text size='md'>
              <strong>Tarih:</strong> 23 Nisan 2026, Perşembe
            </Text>
            <Text size='md'>
              24 Nisan Cuma günü 1 gün izin alarak uzun hafta sonu tatilinin
              keyfini çıkarabilirsiniz.
            </Text>
          </div>

          <div>
            <Title order={3} size='h3' mb='md'>
              1 Mayıs Emek ve Dayanışma Günü
            </Title>
            <Text size='md'>
              <strong>Tarih:</strong> 1 Mayıs 2026, Cuma
            </Text>
            <Text size='md'>
              Bu tatili hafta sonuyla birleştirerek yaşamın yoğunluğundan 3
              günlük mola alabilir, Doğa Otelleri arasından seçim
              yapabilirsiniz.
            </Text>
          </div>

          <div>
            <Title order={3} size='h3' mb='md'>
              19 Mayıs Atatürk&apos;ü Anma, Gençlik ve Spor Bayramı
            </Title>
            <Text size='md'>
              <strong>Tarih:</strong> 19 Mayıs 2026, Salı
            </Text>
            <Text size='md'>
              18 Mayıs Pazartesi günü 1 gün izin alarak 4 günlük tatil fırsatı
              yaratabilir, doğayla iç içe keyifli bir tatil planlayabilirsiniz.
            </Text>
          </div>

          <div>
            <Title order={3} size='h3' mb='md'>
              Kurban Bayramı
            </Title>
            <Text size='md'>
              <strong>Tarih:</strong> 26 Mayıs (Arife) - 30 Mayıs 2026,
              Salı-Cumartesi
            </Text>
            <Text size='md'>
              Salı günü yarım gün izin alarak tatili 5 güne çıkarabilirsiniz.
              İsteğe bağlı olarak 25 Mayıs Pazartesi gününü de dahil ederek 9
              güne uzatabilirsiniz. Sevdiklerinizle bir araya gelebileceğiniz
              veya yeni yerler keşfedebileceğiniz bu tatili Parafly
              Travel&apos;ın özel tatil fırsatlarıyla değerlendirin.
            </Text>
          </div>

          <div>
            <Title order={3} size='h3' mb='md'>
              15 Temmuz Demokrasi ve Milli Birlik Günü
            </Title>
            <Text size='md'>
              <strong>Tarih:</strong> 15 Temmuz 2026, Çarşamba
            </Text>
            <Text size='md'>
              Bu hafta ortası resmi tatil etrafında Pazartesi ve Salı (13-14
              Temmuz) veya Perşembe ve Cuma (16-17 Temmuz) günlerinde izin
              alarak 5 günlük yaz tatili planlayabilirsiniz.
            </Text>
          </div>

          <div>
            <Title order={3} size='h3' mb='md'>
              30 Ağustos Zafer Bayramı
            </Title>
            <Text size='md'>
              <strong>Tarih:</strong> 30 Ağustos 2026, Pazar
            </Text>
            <Text size='md'>
              Bu hafta sonu tatilini Parafly Travel Yaz Fırsatları ile
              değerlendirerek yaşamın yoğunluğundan keyifli bir mola
              alabilirsiniz.
            </Text>
          </div>

          <div>
            <Title order={3} size='h3' mb='md'>
              29 Ekim Cumhuriyet Bayramı
            </Title>
            <Text size='md'>
              <strong>Tarih:</strong> 29 Ekim 2026, Perşembe
            </Text>
            <Text size='md'>
              Cumhuriyetimizin 103. yılını kutlayın. Çarşamba günü yarım gün
              tatille başlayan 29 Ekim tatilini sadece 1.5 gün (28-30 Ekim) izin
              alarak 5 günlük uzun sonbahar tatiline dönüştürebilirsiniz.
            </Text>
          </div>
        </div>
        <div className='mt-16'>
          <Title order={2} size='h2' mb='lg' className='text-center'>
            2026 Okul Tatilleri ve Ara Tatiller
          </Title>
          <div className='rounded-lg bg-gray-50 p-6'>
            <div className='space-y-6'>
              <div>
                <Title order={3} size='h3' mb='md'>
                  Yarıyıl Tatili
                </Title>
                <Text size='md'>
                  Pazartesi, 19 Ocak 2026 tarihinde başlayan yarıyıl tatili,
                  Cuma, 30 Ocak 2026 tarihinde sona erer. Bu 12 günlük tatil
                  dönemi, aileler için uzun bir tatil planlama fırsatı sunar.
                </Text>
              </div>

              <div>
                <Title order={3} size='h3' mb='md'>
                  İkinci Dönem
                </Title>
                <Text size='md'>
                  İkinci dönem Pazartesi, 2 Şubat 2026 tarihinde başlar ve
                  eğitim-öğretim yılı Cuma, 26 Haziran 2026 tarihinde sona erer.
                </Text>
              </div>

              <div>
                <Title order={3} size='h3' mb='md'>
                  İkinci Dönemin Ara Tatili
                </Title>
                <Text size='md'>
                  İkinci dönemin ara tatili Pazartesi, 16 Mart 2026 tarihinde
                  başlar ve Cuma, 20 Mart 2026 tarihinde sona erer. Bu 5 günlük
                  ara tatil, bahar aylarında kısa bir mola için ideal bir
                  fırsattır.
                </Text>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
