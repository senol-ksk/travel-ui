import { Group, Modal, Radio, Title, UnstyledButton, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { CheckoutCard } from '@/components/card'

const TravelInsurancePackages = () => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <CheckoutCard>
        {/* <TravelInsurancePackages /> */}
        <Title order={5} className='text-lg font-semibold'>
          Seyahat Sağlık Güvencesi
        </Title>
        <div className='pt-4 pb-3'>
          Seyahat Destek Hizmet Paketi ile Seyahatinizi Güvenceye Almak İster
          misiniz?
        </div>

        <Radio.Group name='callCenterSupport_radio' defaultValue={'2'}>
          <div className='flex gap-5'>
            <Radio.Card value='2' className='col-8 p-2 md:p-4'>
              <Group wrap='nowrap'>
                <Radio.Indicator />
                <div>Hayır, İstemiyorum</div>
              </Group>
            </Radio.Card>
            <Radio.Card value='1' className='p-2 md:p-4'>
              <Group wrap='nowrap'>
                <Radio.Indicator />
                <div>Evet, İstiyorum</div>
              </Group>
            </Radio.Card>
          </div>
        </Radio.Group>

        <div className='grid pt-4 md:flex'>
          <Text
            size='xs'
            className='grid items-center text-gray-700 md:flex md:gap-2'
          >
            * Seyahat Sağlık Güvence Paketi ,Tamamliyo Teknoloji A.Ş. tarafından
            sunulmaktadır.
            <UnstyledButton
              onClick={open}
              type='button'
              size='xs'
              className='text-sm text-blue-500'
            >
              Detaylı bilgi
            </UnstyledButton>
          </Text>
        </div>
      </CheckoutCard>
      <Modal
        opened={opened}
        onClose={close}
        title='Seyahat Sağlık Destek Paketi'
      >
        <div className='text-sm'>
          <p>
            Yüksek sağlık masraflarınızı karşılıyoruz, sizi tam anlamıyla
            koruyoruz.
          </p>
          <ul className='grid list-disc gap-2 ps-4 pt-2'>
            <li>Tıbbi Tedavi: 5.000,00</li>
            <li>Tıbbi Tahliye: 5.000,00</li>
            <li>Tedavi Sonrası İkametgahınıza Dönüş: 5.000</li>
            <li>Cenazelerin İadesi: 5.000</li>
            <li>Tıbbi Tedavi Kalış Süresinin Uzatılması: 200.00 MAKS.4 GÜN</li>
            <li>Refakatçi Transferi: Ekonomi Sınıfı Uçak Bileti</li>
            <li>Refakatçi Konaklama Giderleri: 200.00 MAKS. 4 GÜN</li>
            <li>
              Aile Üyesinin Ölümü Nedeniyle İade: Ekonomi Sınıfı Uçak Bileti
            </li>
            <li>
              Daimi İkametgahta Hasar Nedeniyle İade: Ekonomi Sınıfı Uçak Bileti
            </li>
            <li>
              Kayıp Bagajın Kurtarılması ve Teslimi: Bilgi ve Organizasyon
            </li>
            <li>Bagaj Kaybı ve Hasarı: 300.00</li>
            <li>Ferdi Kaza Ölüm ve Sakatlık: 10.000</li>
            <li>Genel Bilgi Yardımı: Sınırsız</li>
            <li>Tıbbi Destek: Bilgi ve Organizasyon</li>
            <li>Gecikme: 100.00</li>
          </ul>
        </div>
      </Modal>
    </>
  )
}

export { TravelInsurancePackages }
