import { Accordion, Alert, Drawer } from '@mantine/core'
import { Title } from '@mantine/core'

import { MdInfoOutline } from 'react-icons/md'

import { useDisclosure } from '@mantine/hooks'
import { BsInfoCircle } from 'react-icons/bs'
import { FaChevronRight } from 'react-icons/fa'
type Props = {
  kminCluded: string | number
  minDriverAge: string | number
  licenseYear: string | number
}

const RentTermsDrawer: React.FC<Props> = ({
  kminCluded,
  minDriverAge,
  licenseYear,
}) => {
  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Title
        size='lg'
        onClick={open}
        className='flex cursor-pointer items-center gap-2'
      >
        <span>Kiralama Koşulları</span>
        <MdInfoOutline size={20} />
      </Title>
      <Alert
        className='border border-orange-300 bg-orange-50'
        mt={'md'}
        icon={<BsInfoCircle />}
      >
        Aracı teslim alırken yanınızda kimliğiniz, ehliyetiniz ve üzerinde
        adınız, soyadınız ve kart numaranızın yazdığı bir kredi kartı
        bulunmalıdır.
      </Alert>
      <div onClick={open} className='flex items-center gap-2'>
        <div className='cursor-pointer text-blue-700'>Daha Fazla Göster</div>
        <FaChevronRight className='text-blue-700' size={12} />
      </div>
      <Drawer
        opened={opened}
        onClose={close}
        title={<div className='text-lg font-bold'>Kiralama Koşulları</div>}
        position='right'
      >
        <Accordion className='grid gap-3 rounded-md border p-3' multiple>
          {' '}
          <Accordion.Item value='Kilometre Sınırı'>
            <Accordion.Control>Kilometre Sınırı</Accordion.Control>
            <Accordion.Panel>
              Maksimum kilometre sınır {kminCluded} km olarak belirlenmiştir.
              Kilometre sınırı bulunan araçlarda, sınırın aşılması durumunda KM
              başına ücretlendirme yapılmaktadır. KM aşım ücreti aracınızı
              teslim alırken imzalayacağınız sözleşme içerisinde belirtilmiştir.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value='Sürücü Yaş Sınırı'>
            <Accordion.Control>Sürücü Yaş Sınırı</Accordion.Control>
            <Accordion.Panel>
              Sürücü yaşı minumum {minDriverAge} olmalıdır.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value='Ehliyet Sınırı'>
            <Accordion.Control>Ehliyet Sınırı</Accordion.Control>
            <Accordion.Panel>
              Sürücü ehliyet yılı minumum {licenseYear} olmalıdır.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value='Ödeme Bilgileri'>
            <Accordion.Control>Ödeme Bilgileri</Accordion.Control>
            <Accordion.Panel>
              Online rezervasyon işleminiz sırasında tüm banka veya kredi
              kartlarını kullanmanız mümkündür. Rezervasyonunuza ait ekstra ürün
              ücreti bulunuyorsa bunlar ofiste tahsil edilecektir. Depozito
              ücretinin tahsil edilmesi için kendi adınıza düzenlenmiş bir kredi
              kartınız bulunmalıdır. Bazı tedarikçiler belirli segmentteki
              araçları için çift kredi kartı talebinde bulunabilir.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value='Yakıt Politikası'>
            <Accordion.Control>Yakıt Politikası</Accordion.Control>
            <Accordion.Panel>
              Aracınızı teslim aldığınızda yakıt miktarı aracı bıraktığınızda da
              aynı seviyede olmalıdır. Aracı teslim alırken lütfen ne kadar
              yakıt olduğunu kontrol edin. Aracı teslim ettiğinizde yakıt eksik
              olursa sizden hem yakıt ikmal ücreti hem de eksik yakıt bedeli
              (litre başına mevcut piyasa fiyatından) tahsil edilecektir.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value='Sigorta ve Güvenceler'>
            <Accordion.Control>Sigorta ve Güvenceler</Accordion.Control>
            <Accordion.Panel>
              Kiralayacağınız araç, çarpma, çarpılma, çalınma ve hırsızlık
              girişimine karşı koruma altına alınmıştır. Üçüncü şahıslara
              verilebilecek zararlar da trafik sigortası limitleri dahilinde
              koruma altındadır. Kira sözleşmesi boyunca meydana gelen kazaya
              ilişkin olarak sözleşmede ve yasal mevzuatta temin etmesi gereken
              evrakı (kaza tutanacağı, alkol raporu vs.) eksiksiz temin ederek
              Araç Kiralama şirketine iletmesi durumunda, söz konusu kazadaki
              hasar ve zarar bedelinin Araç Kiralama Şirketi’nin kiralama
              sözleşmesinde belirtilen muafiyet tutarı kadarını ödemekle yükümlü
              olacaktır. Bununla birlikte, uygun bir şekilde kayıt altına
              alınmamış (kaza tespit tutanağı, alkol raporu, kazaya karışan
              tarafların belgeleri vb.) hasarlar bedelleri münhasıran
              kullanıcıya aittir. Zabıt altına alınmamış hasarlarda, sürücü
              beyanı ile hasar onarım işlemi kesinlikle yapılmamaktadır.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value='Önemli Bilgiler'>
            <Accordion.Control>Önemli Bilgiler</Accordion.Control>
            <Accordion.Panel>
              Araç teslim almaya gidildiğinde, firma findeks sorgusu yapacaktır.
              Aracın teslim tarihinden daha önce bir tarihte iade edilmesi
              durumunda; iade yapılacak tutar, toplam kiralama süresini
              kapsamaz. Aracın misafir tarafından kullanıldığı günlerin ücreti,
              toplam kiralama ücretinden düşülerek, aracın kullanılmadığı
              günlerin bedeli iade edilir. Bu bedel söz konusu tarihteki araç
              kiralama tutarı üzerinden hesaplanır. Yukarıda içeriği belirtilen
              başlıklar haricindeki diğer kiralama koşulları, araç teslimi
              sırasında firması yetkilisi tarafından imzanıza sunulacak şekilde
              size tebliğ edilir. Lütfen aracı teslim almadan önce size sunulan
              belgeyi okumayı unutmayınız.
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value='nexto'>
            <Accordion.Control>
              Aracı Teslim Alırken Yanınızda Bulunması Gerekenler
            </Accordion.Control>
            <Accordion.Panel>
              Aracı teslim alırken kimliğiniz, ehliyetiniz ve depozito ücretinin
              tahsil edilebilmesi için kendi adınıza düzenlenmiş kredi kartınız
              yanınızda bulunmalıdır. Ehliyet ve kimliğinizin çipli ve yeni
              olması gerekmektedir, eğer bu belgeleriniz eski ise yıpranmamış ve
              okunabilir olması beklenmektedir.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Drawer>
    </>
  )
}
export { RentTermsDrawer }
