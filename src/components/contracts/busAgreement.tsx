import { AgreementContentTableWrapper } from './table'

type IProps = {
  total?: string
  agencyTitle?: string
  agencyAddress?: string
  agencyPhone?: string
  agencyEmail?: string
  customerFullName?: string
  customerPhone?: string
  customerEmail?: string
  busCompanyName?: string
  busDate?: string
  hour?: string
  seatNo?: string
  destination?: string
  arrival?: string
  paymentType?: string
}

export const BusAgreementContent: React.FC<IProps> = ({
  agencyTitle = '',
  total = '',
  agencyAddress = '',
  agencyPhone = '',
  agencyEmail = '',
  customerFullName = '',
  customerPhone = '',
  customerEmail = '',
  arrival = '',
  busCompanyName = '',
  busDate = '',
  destination = '',
  hour = '',
  seatNo = '',
  paymentType = '',
}) => (
  <div className='flex flex-col gap-3'>
    <h1 className='fs-4 text-center'>MESAFELİ SATIŞ SÖZLEŞMESİ</h1>

    <p>
      İşbu Sözleşme 27.11.2014 tarih ve 29188 sayılı Resmi Gazete’de yayınlanan
      Mesafeli Sözleşmeler Yönetmeliği gereği, satıcı veya sağlayıcı ile
      tüketicinin eş zamanlı fiziksel varlığı olmaksızın, mal veya hizmetlerin
      uzaktan pazarlanmasına yönelik olarak oluşturulmuş bir sistem
      çerçevesinde, taraflar arasında sözleşmenin kurulduğu ana kadar ve
      kurulduğu an da dahil olmak üzere uzaktan iletişim araçlarının
      kullanılması suretiyle kurulan bir sözleşme olması hasebiyle
      düzenlenmiştir.
    </p>
    <p>
      <strong>MADDE 1 – KONU</strong>
    </p>
    <p>
      {`İşbu Sözleşmenin konusu, Yeni Karamürsel Turizm Ltd. Şti.’ne ait ….. alan
      adlı internet sitesi üzerinden SATICI'nın, ALICI'ya satışını yaptığı,
      yolcu taşıma biletinin satışı ile ilgili olarak 6502 sayılı Tüketicinin
      Korunması Hakkında Kanun ve ikincil mevzuatı olan Mesafeli Sözleşmeler
      Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin
      belirlenmesidir.`}
    </p>
    <p>
      Yeni Karamürsel Turizm Ltd. Şti., yalnızca ve sadece …. alan adlı internet
      sitesinin sahibi olup Alıcı’ya Satıcı tarafından sağlanacak hizmete
      ilişkin sözleşmenin tarafı olmadığı gibi, ilgili sözleşme konusu hizmetin
      verilmesine ilişkin de herhangi bir sorumluluğu bulunmamaktadır. Bu
      kapsamda, Yeni Karamürsel Turizm Ltd. Şti., Satıcı ve Alıcı arasında
      oluşabilecek uyuşmazlıklarda taraf gösterilemez.
    </p>
    <p>
      <strong>MADDE 2 - TARAFLAR</strong>
    </p>
    <p>
      <strong>2.1 SATICI</strong>
    </p>
    <AgreementContentTableWrapper>
      <tbody>
        <tr>
          <td>
            <p>
              <strong>Ünvan</strong>
            </p>
          </td>
          <td>
            <p>{agencyTitle}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p>
              <strong>Adres</strong>
            </p>
          </td>
          <td>{agencyAddress}</td>
        </tr>
        <tr>
          <td>
            <p>
              <strong>Telefon</strong>
            </p>
          </td>
          <td>{agencyPhone}</td>
        </tr>
        <tr>
          <td>
            <p>
              <strong>Eposta</strong>
            </p>
          </td>
          <td>
            <p>{agencyEmail}</p>
          </td>
        </tr>
      </tbody>
    </AgreementContentTableWrapper>
    <p>
      <strong>2.2 ALICI</strong>
    </p>
    <AgreementContentTableWrapper>
      <tbody>
        <tr>
          <td>
            <p>
              <strong>Adı, Soyadı</strong>
            </p>
          </td>
          <td>{customerFullName}</td>
        </tr>
        <tr>
          <td>
            <p>
              <strong>Telefon</strong>
            </p>
          </td>
          <td>{customerPhone}</td>
        </tr>
        <tr>
          <td>
            <p>
              <strong>Eposta</strong>
            </p>
          </td>
          <td>{customerEmail}</td>
        </tr>
      </tbody>
    </AgreementContentTableWrapper>
    <p>
      <strong>MADDE 3 - SÖZLEŞME KONUSU ÜRÜN, HİZMET BİLGİLERİ</strong>
    </p>
    <p>
      {`İşbu Sözleşme konusu hizmet, otobüs yolcu taşıma bileti olup biletin,
      satış bedeli, ödeme şekli, biniş yeri, varış yeri, seyahat tarihi, hareket
      saati, koltuk numarası siparişin sonlandığı andaki bilgilerden
      oluşmaktadır ve ALICI'nın elektronik posta adresine de gönderilmektedir.`}
    </p>
    <AgreementContentTableWrapper>
      <thead>
        <tr>
          <td colSpan={6}>
            <p>
              <strong>Açıklama</strong>
            </p>
          </td>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td valign='top'>
            <p>
              <strong>Firma</strong>
            </p>
          </td>
          <td valign='top'>
            <p>
              <strong>Tarih</strong>
            </p>
          </td>
          <td valign='top'>
            <p>
              <strong>Saat</strong>
            </p>
          </td>
          <td valign='top'>
            <p>
              <strong>Koltuk No</strong>
            </p>
          </td>
          <td valign='top'>
            <p>
              <strong>Nereden</strong>
            </p>
          </td>
          <td valign='top'>
            <p>
              <strong>Nereye</strong>
            </p>
          </td>
        </tr>

        <tr>
          <td valign='top'>{busCompanyName}</td>
          <td valign='top'>{busDate}</td>
          <td valign='top'>{hour}</td>
          <td valign='top'>{seatNo}</td>
          <td valign='top'>{destination}</td>
          <td valign='top'>{arrival}</td>
        </tr>
      </tbody>
    </AgreementContentTableWrapper>

    <AgreementContentTableWrapper>
      <tbody>
        <tr>
          <td valign='top'>
            <p>
              <strong>Ödeme Şekli</strong>
            </p>
          </td>
          <td valign='top'>
            <p>{paymentType}</p>
          </td>
        </tr>
        <tr>
          <td valign='top'>
            <p>
              <strong>Toplam (KDV Dahil)</strong>
            </p>
          </td>
          <td valign='top'>{total}</td>
        </tr>
      </tbody>
    </AgreementContentTableWrapper>

    <p>
      <strong>MADDE 4 - GENEL HÜKÜMLER</strong>
    </p>
    <p>
      <strong>4.01</strong>
      {`ALICI, …. alan adlı internet sitesinde sözleşme konusu ürünü temel
      nitelikleri, tüm vergiler dahil satış fiyatı, ödeme şekli ve SATICI'nın
      tam ticari unvanı, açık adresi ve iletişim bilgilerine ilişkin ön
      bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli
      teyidi verdiğini beyan eder.`}
    </p>
    <p>
      {`ALICI; bu sözleşmeyi elektronik ortamda teyit etmekle, mesafeli
      sözleşmelerin akdinden önce, SATICI tarafından ALICI'ya sağlanması gereken
      hizmet için verilen siparişteki hizmete ait temel özellikler, biletlerin
      vergiler dahil fiyatı, ödeme bilgilerinin de doğru ve eksiksiz olarak
      edindiğini teyit etmiş olur. Sözleşme konusu yolcu taşıma bileti, ALICI
      tarafından seyahat başlangıcı öncesinde SATICI'nın en yakın şubesinden
      teslim alınacaktır.`}
    </p>
    <p>
      <strong>4.02</strong>
      {`Herhangi bir nedenle ürün bedeli ödenemez veya banka kayıtlarında iptal
      edilirse, SATICI'nın herhangi bir yükümlülüğü kalmayacaktır.`}
    </p>
    <p>
      {`Satış işlemi gerçekleştikten sonra ALICI'ya ait kredi kartının ALICI'nın
      kusurundan kaynaklanmayan bir şekilde yetkisiz kişilerce haksız veya
      hukuka aykırı olarak kullanılması durumunda, bilet bedelinin ilgili banka
      veya finans kuruluşunca SATICI'ya ödenmemesi halinde, SATICININ herhangi
      bir yükümlülüğü kalmayacaktır.`}
    </p>
    <p>
      <strong>4.03</strong>
      {`Sözleşme konusu yolcu taşıma bileti, ALICI'nın şahsen kendine teslim
      edilir. Bu nedenle alıcı yolcu taşıma biletini teslim alırken kimlik
      kartını SATICI firmanın görevli personeline ibraz etmek zorundadır.`}
    </p>
    <p>
      {`Sözleşme konusu bilet Alıcı'dan başka bir kişi/kuruluşa teslim edilecek
      ise, teslim edilecek kişi/kuruluşun teslimatı kabul etmemesinden SATICI
      sorumlu tutulamaz.`}
    </p>
    <p>
      <strong>4.04</strong>
      İnternetten bilet alırken araç koltuk şeması ekranda gösterilmektedir. Bu
      şemada bay ve bayan için uygun koltuklar belirtilmektedir. ALICI koltuk
      seçerken kendi cinsiyeti için uygun olarak gösterilen koltuğu doğru olarak
      seçmekle yükümlüdür. Aksi durumda seyahati sırasında başka uygun koltuk
      varsa o koltuğa yerleştirilir, uygun koltuk yoksa bileti geçersiz sayılır
      ve bilet bedeli iadesi yapılmaz. Taşıyıcı firma tarafından operasyonel
      sebeplerle araç tipi ve koltuk konumu değiştirilebilir. Bu durumdan Yeni
      Karamürsel Turizm Ltd. Şti. sorumlu değildir.
    </p>
    <p>
      <strong>4.05</strong>
      Alınan Bilet, üzerinde yazılı Tarih/Saat ve Güzergâh için geçerlidir.
      Üzerinde yazılı gün ve saatte kullanılmayan bilet geçersiz sayılır.
    </p>
    <p>
      <strong>4.06</strong>
      Bagaja verilen ve değer takdiri yapılmayan eşyaların kaybı halinde, bilet
      bedelinin üç mislinden fazla para ödenmez. Otobüs ve Şehir içi servis
      araçları içerisinde unutulan, kaybolan veya çalınan eşyalardan Yeni
      Karamürsel Turizm Ltd. Şti. sorumlu tutulamaz.
    </p>
    <p>
      <strong>4.07</strong>
      Bilet gösterilip, fiş alınarak bagaja verilen eşyanın idari ve adli
      makamlarda yapılacak muayenelerinde doğacak cezai mesuliyet bagaj sahibine
      aittir. ALICI seyahati başlangıcında araca binerken bagajını teslim etmesi
      durumunda mutlaka bagaj fişi istemelidir. Kaybolan bagajlardan Yeni
      Karamürsel Turizm Ltd. Şti. sorumlu tutulamaz.
    </p>
    <p>
      <strong>4.08</strong>
      {`Bagajda ve yolcu beraberinde, insan sağlığı açısından zararlı ve tehlikeli
      durum ihtiva eden maddeler ile, uygunsuz nitelikteki ambalaj ve eşyalar
      kesinlikle taşınmaz. Her yolcu için 30 KG'ı aşan bagaj, ayrı ücrete
      tabidir.`}
    </p>
    <p>
      <strong>4.09</strong>
      {`Konuk olarak seyahat eden ALICI'lar, ek Ferdi Kaza Sigorta kapsamında
      değildir.`}
    </p>
    <p>
      <strong>4.10</strong>
      {`Araç içinde aşı karneli kedi, köpek (tehlike arz edenler hariç) ve kuş
      (saka, muhabbet kuşu veya kanarya) gibi evcil hayvanlar, özel kafesleri
      kilitli olmak şartıyla bagaj taşımaya mahsus bölümün dışında hayvan sahibi
      yolcunun kucağında veya oturduğu koltuğun önünde de taşınabilir. Gerekli
      hallerde, yolcu alınmaksızın evcil hayvanların taşıtın içinde
      taşınabileceği özel sefer düzenlenebilir.`}
    </p>
    <p>
      <strong>4.11</strong>
      Kanun ve Yönetmelik gereği, sefer ve fiyat tarifeleri önceden haber
      verilmeksizin değiştirilebilir. Tarife süresi sonundaki tarife
      değişikliklerinden doğan ücret farkları, açık biletlere de uygulanır.
    </p>
    <p>
      <strong>4.12</strong>7 yaşından büyük çocuklar için otobüste ayrı yer
      tahsisi, ayrı bilet alınması zorunludur. Reşit olmayan ve yalnız seyahat
      edecek çocuklar için yazılı veli muvafakati gerekir.
    </p>
    <p>
      <strong>4.13</strong>
      {`ALICI'nın tanımadığı kişilerin yiyecek – içecek ikramlarını güvenliği
      bakımından kabul etmemesi ve alkollü bir şekilde araca binmemesi
      gerekmektedir.`}
    </p>
    <p>
      <strong>4.14</strong>
      Yasal açıdan izin verilmeyen yerlerde inip binmek için ısrar edilemez.
      İnilecek olan durak önceden haber verilmek durumundadır. İnmeden önce
      bagaj fişinin ve eşyaların hazırlanması, araç durmadan yolcunun yerinden
      ayrılmaması gerekmektedir.
    </p>
    <p>
      <strong>4.15</strong>
      SATICI tarafından belirlenmiş mola yeri dışında, hastalanma vb. acil
      haller haricinde durulması veya mola verilmesi istenemez.
    </p>
    <p>
      <strong>4.16</strong>
      Kaybedilen bilet ve yolculuk kuponları için hiçbir ücret iadesi yapılmaz,
      yolculuk hakkı verilmez.
    </p>
    <p>
      <strong>4.17</strong>
      Trafiğin seyir ve güvenliğini tehlikeye düşürecek, araç içerisindeki diğer
      yolcuları rahatsız edecek tavır ve davranışlar sergilenemez. Aracın teknik
      donanımını olumsuz etkileyecek hiçbir elektronik cihaz kullanılamaz.
    </p>
    <p>
      <strong>4.18</strong>
      Mücbir sebeplerle ortaya çıkan ve taşımanın devamına engel olan
      nedenlerin, belirsiz bir süre beklemeyi mecburi kılması veya varış
      noktasına kadar gerekli zamanın bir katından daha fazla beklemeyi
      gerektirmesi halinde, SATICI, imkân olduğu taktirde bir başka güzergâhı
      izleyerek taşımayı tamamlar, aksi halde Alıcı’yı, güzergâh üzerindeki
      dilediği bir noktaya kadar götürür veya hareket noktasına geri getirir.
      SATICI, mücbir sebeplerden kaynaklı olarak sefer iptal etme hakkına
      sahiptir.
    </p>
    <p>
      <strong>4.19</strong>
      {`ALICI'nın kredi kartı ile yaptığı ödemelerde ise, ürün tutarı, siparişin
      ALICI tarafından iptal edilmesinden sonra 30 gün içerisinde ilgili bankaya
      iade edilir. Bu tutarın bankaya iadesinden sonra ALICI hesaplarına
      yansıması tamamen banka işlem süreci ile ilgili olup, SATICI'nın bu hususa
      ilişkin herhangi bir şekilde müdahalede bulunması mümkün olamamaktadır.`}
    </p>
    <p>
      <strong>4.20 </strong>
      Siparişin sonuçlanması durumunda ALICI işbu sözleşmenin tüm koşullarını
      kabul etmiş sayılacaktır.
    </p>
    <p>
      <strong>4.21</strong>
      …… internet sitesi üzerinden bilet satın alırken tüm bilgilerin (cinsiyet,
      isim vb.) doğru girilmesi gerekmektedir. Aksi takdirde doğacak
      aksaklıklardan dolayı Yeni Karamürsel Turizm Ltd. Şti. sorumlu tutulamaz.
      ALICI, bu sözleşme ile beraber …… sitesini kullanırken gelen uyarıları da
      dikkate almak mecburiyetindedir. ……. (internet sitesi) kullanıcılar ile
      hizmet sağlayıcıların bir araya getirildiği bir platformdur. Hizmet
      sağlayıcılar ile kullanıcılar arasındaki hukuki ilişki ………. (internet
      sitesi)nden kullanıcılara sunulan platform hizmetinden ayrı ve
      bağımsızdır. ….. (internet sitesi) site veya mobil uygulama üzerinde yer
      alan kullanıcı ve hizmet sağlayıcıların bilgilerinin içeriğinden sorumlu
      tutulamaz. Hizmet Sağlayıcı firmalar ve kullanıcılar arasında doğabilecek
      uyuşmazlıklardan, zararlardan ve/veya taleplerden Yeni Karamürsel Turizm
      Ltd. Şti. sorumlu tutulamaz. Seferler sırasında meydana gelebilecek her
      türlü kaza, mal veya can kaybı gibi durumlardan online işlem hizmeti veren
      kuruluş Yeni Karamürsel Turizm Ltd. Şti. sorumlu değildir. Yeni Karamürsel
      Turizm Ltd. Şti. sefer sırasında oluşacak herhangi bir ihmal veya kusurdan
      dolayı sorumlu tutulamaz. ….. (internet sitesi)nden bilet satın alanlar bu
      şartı peşinen ve gayrikabili rücu olarak kabul etmiş sayılır.
    </p>
    <p>
      <strong>MADDE 5 - CAYMA HAKKI</strong>
    </p>
    <p>
      {`ALICI, sözleşme konusu yolcu taşıma biletinden, sipariş aşamasında ve
      ALICI'ya gönderilmiş olan elektronik postada belirtilen hareket saatinden
      24 (yirmi dört saat) öncesine kadar cayma hakkına sahiptir. Cayma hakkının
      kullanılması için bu süre içinde SATICI'ya şahsen, e-posta veya telefon
      ile bildirimde bulunulması şarttır. Bu hakkın kullanılması halinde, takip
      eden 30 gün içinde bilet bedeli ALICI'ya iade edilir. ALICI tarafından
      SATICI'nın herhangi bir şubesinden basılı yolcu taşıma bileti alınmışsa
      ALICI bu bilet ile ilgili cayma hakkını ancak yine SATICI'nın şubesinden
      kimlik ve kredi kartı ile birlikte şahsen başvurarak kullanabilir.`}
    </p>
    <p>
      {`Aracın hareket saatine 24 (yirmi dört) saatten daha az süre kalması
      durumunda bilet bedeli iadesi yapılmaz. Aracın hareket saatine 12 (on iki)
      saat kalıncaya kadar bilet ertelenebilir, bu durumda ALICI'ya SATICI
      tarafından açık bilet verilir, ALICI bu bileti 6 (altı) ay süre ile aynı
      güzergâhtaki uygun bir seferde seyahat etmek için kullanabilir. Aracın
      hareket saatine 12 (on iki) saatten daha az bir süre kalmışsa bilet cayma
      hakkı kullanılamaz, açık bilet verilmez alınmış olan bilet geçersiz
      sayılır. Açık tarihli biletlerde ücret iadesi kesinlikle yapılmaz. Kredi
      kartı ile alınan biletlerin iadeleri nakit olarak yapılmaz. Para iadesi;
      ilgili bankaya verilen talimat kanalıyla yapılır.`}
    </p>
    <p>
      <strong>MADDE 6 - BORÇLUNUN TEMERRÜDÜ</strong>
    </p>
    <p>
      {`ALICI'nın temerrüde düşmesi halinde, ALICI, borcun gecikmeli ifasından
      dolayı SATICI'nın oluşan zarar ve ziyanını ödemeyi kabul eder. ALICI'nın
      temerrüdünün SATICI'nın kusurundan kaynaklandığı hallerde ALICI herhangi
      bir zarar ve ziyan talebini karşılamak mecburiyetinde olmayacaktır.`}
    </p>
    <p>
      <strong>MADDE 7 - YETKİLİ MAHKEME</strong>
    </p>
    <p>
      {`TÜKETİCİ'nin, SATICI ile sorunları olur ise, sorunu SATICI'nın çözememesi
      durumda, 2022 yılı için Tüketici Hakem Heyetlerine yapılacak başvurularda,
      büyükşehir statüsünde olan illerde değeri 10 bin 280 (Onbinikiyüzseksen)
      liranın altında bulunan uyuşmazlıklarda ilçe tüketici hakem heyetleri,
      büyükşehir statüsünde olan illerde değeri 10 bin 280 (Onbinikiyüzseksen)
      ile 15 bin 430 (Onbeşbindörtyüzotuz) lira arasındaki uyuşmazlıklarda il
      tüketici hakem heyetleri ve büyükşehir statüsünde olmayan illerin
      merkezlerinde ve bağlı ilçelerde değeri 15 bin 430 (Onbeşbindörtyüzotuz)
      liranın altında bulunan uyuşmazlıklarda il tüketici hakem heyetleri
      görevlidir. Bu değerlerin üzerindeki uyuşmazlıklar için tüketici hakem
      heyetlerine başvuru yapılamamaktadır. Söz konusu uyuşmazlıkların çözümü
      için 6502 sayılı Kanun’un 73/A maddesi kapsamında sırasıyla dava şartı
      arabuluculuk müessesesine ve tüketici mahkemelerine; tüketici mahkemeleri
      bulunmayan yerlerde ise asliye hukuk mahkemelerine başvurulması
      gerekmektedir. Başvurular, tüketicinin yerleşim yerinin bulunduğu veya
      tüketici işleminin yapıldığı yerdeki tüketici hakem heyetine ve Tüketici
      Mahkemelerine yapılabilir.`}
    </p>
    <p>
      Siparişin onaylanması durumunda ALICI işbu sözleşmenin tüm koşullarını
      kabul etmiş sayılır.
    </p>
    <p>
      <strong>Gizlilik Politikası</strong>
    </p>
    <p>
      {`Üyelik veya internet sitesi üzerindeki çeşitli form ve oylamaların
      doldurulması suretiyle Alıcıların kendileriyle ilgili bir takım kişisel
      bilgileri (isim-soyisim, firma bilgileri, telefon, adres veya e-posta
      adresleri vb. bilgileri) Satıcı'ya ve Yeni Karamürsel Turizm’e vermeleri
      gerekmektedir. Satıcı ve Yeni Karamürsel Turizm tarafından talep edilen
      bilgiler veya Alıcı tarafından sağlanan bilgiler veya internet sitesi
      üzerinden yapılan işlemlerle ilgili bilgiler; Satıcı, Yeni Karamürsel
      Turizm ve işbirliği içinde olduğu kişiler tarafından, Mesafeli Satış
      Sözleşmesi ile belirlenen amaçlar ve kapsam dışında da, talep edilen
      bilgileri doğrudan pazarlama yapmak, çeşitli istatistiksel
      değerlendirmeler, veri tabanı oluşturma ve pazar araştırma amacıyla
      kullanılabilir ve 3. kişiyle paylaşabilir. Kişisel bilgiler, gerektiğinde
      kullanıcıyla temas kurmak için de kullanılabilir.`}
    </p>
    <p>
      Sistemle ilgili sorunların tanımlanması ve internet sitesinde çıkabilecek
      sorunların ivedilikle giderilebilmesi için, Satıcı ve Yeni Karamürsel
      Turizm, gerektiğinde kullanıcıların IP adresini tespit etmekte ve bunu
      kullanmaktadır. IP adresleri, kullanıcıları genel bir şekilde tanımlamak
      ve kapsamlı demografik bilgi toplamak amacıyla da kullanılabilir ve bu
      bilgi yargı süreçlerinde resmi kurumlar ile paylaşılabilir.
    </p>
    <p>
      {`Kişisel bilgileriniz; kişi isim-soyisim, cinsiyet doğum tarihi, adresi,
      ülke, şehir, semt, posta kodu, cep telefon numarası, e-posta adresi,
      parola, fatura ünvanı, fatura adresi, fatura şehir, fatura semt, vergi
      dairesi, vergi numarası, T.C. Kimlik numarası, yurt dışı turlarda Pasaport
      numarası, ödeme kredi kartı yapılacak ise kredi kartı numarası ve
      kullanıcıyı tanımlamaya yönelik her türlü bilgiyi içermektedir. Satıcı ve
      Yeni Karamürsel Turizm otobüs ve havayolu şirketleri, acenteler, araç
      kiralama şirketleri, kanal yönetim şirketleri ile bu bilgileri
      paylaşabilecek, bülten gönderimi amacıyla ve Alıcı'nın rezervasyon öncesi
      veya sonrasındaki taleplerinin hızlıca karşılanması amacıyla ilgili
      departman tarafından da bu bilgileri kullanabilecektir. Satıcı ve Yeni
      Karamürsel Turizm, işbu gizlilik politikasında aksi belirtilmedikçe
      kişisel bilgilerinizden herhangi birini Satıcı'nın ve Yeni Karamürsel
      Turizm’in işbirliği içinde olmadığı şirketlere ve üçüncü kişilere
      açıklamayacaktır. Aşağıda belirtilen sınırlı durumlarda Satıcı ve Yeni
      Karamürsel Turizm, işbu "Gizlilik Politikası" hükümleri dışında
      kullanıcılara ait bilgileri üçüncü kişilere açıklayabilir. Bu durumlar
      sınırlı sayıda olmak üzere;`}
    </p>

    <ol>
      <li>
        Kanun, Kanun Hükmünde Kararname, Yönetmelik v.b. yetkili hukuki otorite
        tarafından çıkarılan ve yürürlükte olan hukuk kurallarının getirdiği
        zorunluluklara uymak;
      </li>
      <li>
        Yeni Karamürsel Turizm’in Alıcılarla akdettiği Üyelik Sözleşmesi ve
        Kullanım Koşullarının, Mesafeli Satış Sözleşmelerinin ve diğer
        sözleşmelerin gereklerini yerine getirmek ve bunları uygulamaya koymak
        amacıyla;
      </li>
      <li>
        Yetkili idari ve adli otorite tarafından usulüne göre yürütülen bir
        araştırma veya soruşturmanın yürütümü amacıyla kullanıcılarla ilgili
        bilgi talep edilmesi;
      </li>
      <li>
        Kullanıcıların hakları veya güvenliklerini korumak için bilgi vermenin
        gerekli olduğu hallerdir.
      </li>
    </ol>
    <p>
      {`Satıcı ve Yeni Karamürsel Turizm, Alıcılar ve Alıcıların internet sitesi
      kullanımı hakkındaki bilgileri teknik bir iletişim dosyasını
      (Çerez-Cookie) kullanarak elde edebilir. Bahsi geçen teknik iletişim
      dosyaları, ana bellekte saklanmak üzere bir internet sitesinin
      kullanıcının tarayıcısına (browser) gönderdiği küçük metin dosyalarıdır.
      Teknik iletişim dosyası bir internet sitesi hakkında durum ve tercihleri
      saklayarak İnternet'in kullanımını kolaylaştırır. Teknik iletişim dosyası,
      internet sitesini kaç kişinin kullandığını, bir kişinin internet sitesini
      hangi amaçla, kaç kez ziyaret ettiğini ve ne kadar kaldıkları hakkında
      istatistiksel bilgileri elde etmeye ve kullanıcılar için özel tasarlanmış
      kullanıcı sayfalarından dinamik olarak reklam ve içerik üretilmesine
      yardımcı olur. Teknik iletişim dosyası, ana bellekte veya e-postanızdan
      veri veya başkaca herhangi bir kişisel bilgi almak için tasarlanmamıştır.
      Tarayıcıların pek çoğu başta teknik iletişim dosyasını kabul eder biçimde
      tasarlanmıştır ancak kullanıcılar dilerse teknik iletişim dosyasının
      gelmemesi veya teknik iletişim dosyasının gönderildiğinde ikaz verilmesini
      sağlayacak biçimde ayarları değiştirebilirler.`}
    </p>
  </div>
)
