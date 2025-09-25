import { AgreementContentTableWrapper } from './table'

type IProps = {
  agencyDocumentNo?: string
  agencyEmail?: string
  agencyFax?: string
  agencyPhone?: string
  agencyTitle?: string
  bookingCode?: string
  customerAddress?: string
  customerEmail?: string
  customerFax?: string
  customerFullName?: string
  customerID?: string
  customerInvoiceInfo?: string
  customerPhone?: string
  explain?: string
  organizer?: string
  paymentType?: string
  reservationDate?: string
  totalIncludedVat?: string
  totalPassenger?: string
  totalPrice?: string
  totalServiceFee?: string
  totalTax?: string
}

export const FlightAgreementContent: React.FC<IProps> = ({
  agencyDocumentNo = '',
  agencyEmail = '',
  agencyFax = '',
  agencyPhone = '',
  agencyTitle = '',
  bookingCode = '',
  customerAddress = '',
  customerEmail = '',
  customerFax = '',
  customerFullName = '',
  customerID = '',
  customerInvoiceInfo = '',
  customerPhone = '',
  explain = '',
  organizer = '',
  paymentType = '',
  reservationDate = '',
  totalIncludedVat = '',
  totalPassenger = '',
  totalPrice = '',
  totalServiceFee = '',
  totalTax = '',
}) => {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-center font-bold'>
        UÇAK BİLETİ MESAFELİ SATIŞ SÖZLEŞMESİ
      </h1>

      <p>
        <strong>MADDE 1 - KONU</strong>
      </p>
      <p>
        {`İşbu Sözleşme’nin konusu; SATICI'nın ALICI'ya satışını yaptığı, aşağıda
        nitelikleri ve satış fiyatı belirtilen hizmetin satışı ve ifası ile
        ilgili olarak tarafların hak ve yükümlülüklerini kapsamaktadır.`}
      </p>
      <p>
        <strong>MADDE 2 - SATICI BİLGİLERİ:</strong>
      </p>
      <AgreementContentTableWrapper>
        <tbody>
          <tr>
            <td width='40%' valign='top'>
              <p>
                <strong>SEYAHAT ACENTASI BELGE NO</strong>
              </p>
            </td>
            <td width='60%' valign='top'>
              <p>{agencyDocumentNo}</p>
            </td>
          </tr>
          <tr>
            <td width='40%' valign='top'>
              <p>
                <strong>SEYAHAT ACENTASI ÜNVANI</strong>
              </p>
            </td>
            <td width='60%' valign='top'>
              <p>{agencyTitle}</p>
            </td>
          </tr>
          <tr>
            <td width='40%' valign='top'>
              <p>
                <strong>ŞİRKET ÜNVANI</strong>
              </p>
            </td>
            <td width='60%' valign='top'>
              <p>Yeni Karamürsel Turizm Ltd. Şti.</p>
            </td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>ADRESİ</strong>
              </p>
            </td>
            <td valign='top'>
              <p>
                İcadiye Mah. Cumhuriyet Cad. Huzur Apt. Blok No: 167İç Kapı No:
                5 Üsküdar/İSTANBUL
              </p>
            </td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>MERSİS NO / VERGİ NO</strong>
              </p>
            </td>
            <td valign='top'>
              <p>0948-0064-0970-0018/9480064097</p>
            </td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>TEL</strong>
              </p>
            </td>
            <td valign='top'>
              <p>{agencyPhone}</p>
            </td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>FAKS</strong>
              </p>
            </td>
            <td valign='top'>
              <p>{agencyFax}</p>
            </td>
          </tr>
          <tr>
            <td valign='top'>
              <p>
                <strong>EPOSTA</strong>
              </p>
            </td>
            <td valign='top'>
              <p>{agencyEmail}</p>
            </td>
          </tr>
        </tbody>
      </AgreementContentTableWrapper>
      <p>
        <strong>MADDE 3 - ALICI</strong>
      </p>
      <AgreementContentTableWrapper>
        <tbody>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>ADI SOYADI</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerFullName}
            </td>
          </tr>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>T.C. KİMLİK NO</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerID}
            </td>
          </tr>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>ADRES</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerAddress}
            </td>
          </tr>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>FATURA BİLGİSİ</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerInvoiceInfo}
            </td>
          </tr>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>TEL</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerPhone}
            </td>
          </tr>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>FAKS</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerFax}
            </td>
          </tr>
          <tr>
            <td width='30%' valign='top'>
              <p>
                <strong>EPOSTA</strong>
              </p>
            </td>
            <td width='70%' valign='top'>
              {customerEmail}
            </td>
          </tr>
        </tbody>
      </AgreementContentTableWrapper>
      <p>
        <strong>MADDE 4 - SÖZLEŞME KONUSU HİZMET BİLGİLERİ</strong>
      </p>
      <AgreementContentTableWrapper>
        <tbody>
          <tr>
            <td width='40%' valign='top'>
              <p>ADI SOYADI</p>
            </td>
            <td width='60%' valign='top'></td>
          </tr>
          <tr>
            <td width='40%' valign='top'>
              <p>REZERVASYON NO</p>
            </td>
            <td width='60%' valign='top'>
              {bookingCode}
            </td>
          </tr>
          <tr>
            <td width='40%' valign='top'>
              <p>DÜZENLEYEN</p>
            </td>
            <td width='60%' valign='top'>
              <p>{organizer}</p>
            </td>
          </tr>
          <tr>
            <td width='40%' valign='top'>
              <p>DÜZENLEME TARİHİ</p>
            </td>
            <td width='60%' valign='top'>
              {reservationDate}
            </td>
          </tr>
          <tr>
            <td width='40%' valign='top'>
              <p>AÇIKLAMA</p>
            </td>
            <td width='60%' valign='top'>
              {explain}
            </td>
          </tr>
        </tbody>
      </AgreementContentTableWrapper>
      <p>
        Hizmetin türü, satış bedeli, ödeme şekli seçilen hizmetin işlem koduna
        göre aşağıdaki gibidir.
      </p>
      <AgreementContentTableWrapper>
        <tbody>
          <tr>
            <td width='100' valign='top'>
              <p>
                <strong>Yön</strong>
              </p>
            </td>
            <td valign='top'>
              <p>
                <strong>Havayolu</strong>
              </p>
            </td>
            <td valign='top'>
              <p>
                <strong>Kalkış</strong>
              </p>
            </td>
            <td valign='top'>
              <p>
                <strong>Varış</strong>
              </p>
            </td>
            <td valign='top'>
              <p>
                <strong>Kalkış Tarih/Saat</strong>
              </p>
            </td>
          </tr>
          {/* @if (Model.Segments != null) {
            foreach (Core.Web.UI.Models.FlightSegment item in Model.Segments)
        {
        <tr>
            <td width="100" valign="top">
                <p >
                    <strong>@item.Direction</strong>
                </p>
            </td>
            <td valign="top">
                @item.Airline
            </td>
            <td valign="top">
                @item.Departure
            </td>
            <td valign="top">
                @item.Arrival
            </td>
            <td valign="top">
                @item.DepartureDateTime
            </td>
        </tr>
        }
        } */}
        </tbody>
      </AgreementContentTableWrapper>
      {/* <table className="table">
    <tbody>
        @if (Model.Passengers != null) {
            foreach (Core.Web.UI.Models.FlightPassenger item in Model.Passengers)
        {
        <tr>
            <td width="55" valign="top">
                <p >
                    <strong>Yolcu</strong>
                </p>
            </td>
            <td width="300" valign="top">
                <p >
                    <strong>@item.FullName</strong>
                </p>
            </td>
        </tr>
        <tr>
            <td width="100" valign="top">
                <p >
                    <strong>@item.PassengerType</strong>
                </p>
            </td>
            <td width="300" valign="top">
            </td>
        </tr>
        }
        }
    </tbody>
</table> */}
      <table>
        <tbody>
          <tr>
            <td valign='top'>
              <p>
                <strong>Yolcu Sayısı</strong>
              </p>
            </td>
            <td valign='top'>
              <p>
                <strong>Fiyat</strong>
              </p>
            </td>
            <td valign='top'>
              <p>
                <strong>Vergi</strong>
              </p>
            </td>
            <td valign='top'>
              <p>
                <strong>Hizmet Bedeli</strong>
              </p>
            </td>
            <td valign='top'>
              <p>
                <strong>Toplam (Vergiler Dahil)</strong>
              </p>
            </td>
          </tr>
          <tr>
            <td valign='top'>{totalPassenger}</td>
            <td valign='top'>{totalPrice}</td>
            <td valign='top'>{totalTax}</td>
            <td valign='top'>{totalServiceFee}</td>
            <td valign='top'>{totalIncludedVat}</td>
          </tr>
        </tbody>
      </table>
      <table>
        <tbody>
          <tr>
            <td width='40%' valign='top'>
              <p>ÖDEME ŞEKLİ</p>
            </td>
            <td width='60%' valign='top'>
              <p>{paymentType}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        PNR numarası ve bilet numarası ALICI bu Sözleşmeyi onayladıktan sonra
        bilet kesildiğinde e-posta yolu ile alıcı ile paylaşılacaktır.
      </p>
      <p>
        <strong>MADDE 5 - UYARILAR</strong>
      </p>
      <p>
        <strong>5.1</strong>
        {`ALICI' nın seyahati gerçekleştireceği ülkeler için vizesinin bulunup
        bulunmadığını kontrol etmesi gerekmektedir.`}
      </p>
      <p>
        <strong>5.2</strong>
        Havayolu opsiyon tarihi veya uçuşla ilgili bilgilerde değişiklik yapma
        hakkına sahiptir. Bu tür değişikliklerden doğacak sorunlardan SATICI
        sorumlu tutulamaz.
      </p>
      <p>
        <strong>5.3</strong>
        Yolcuların İç hat uçuşlar için; tarifeli uçuştan iki (2) saat önce
        havaalanında bulunması, check-in ve bagaj işlemlerinin tamamlaması
        gerekmektedir. Yolcuların check-in esnasında yanlarında resmi ve resimli
        bir kimlik bulundurması gerekmektedir.
      </p>
      <p>
        <strong>5.4</strong>
        Yolcuların Dış hat uçuşlar için; tarifeli uçuştan üç (3) saat önce
        havaalanında bulunması, check-in ve bagaj işlemlerini tamamlaması
        gerekmektedir. Yolcuların check-in esnasında yanlarında pasaportlarını
        bulundurması gerekmektedir.
      </p>
      <p>
        <strong>5.5</strong>
        {`Kıbrıs uçuşları için; Yolcuların tarifeli uçuştan üç (3) saat önce
        havaalanında bulunması, check-in ve bagaj işlemlerinin tamamlaması
        gerekmektedir. Yolcuların check-in esnasında yanlarında pasaportlarını
        bulundurması gerekmektedir. Kıbrıs'a girişlerde ehliyet kesinlikle kabul
        edilmemektedir.`}
      </p>
      <p>
        <strong>5.6</strong>
        Koltuk seçimleri uçuş dan 24 saat öncesinde online check-in işleminde ya
        da havalimanında kontuarda yaptırılabilir.
      </p>
      <p>
        <strong>5.7</strong>
        Tüm bilet ve rezervasyon işlemlerinde GENEL KURALLAR VE KOŞULLAR
        bölümünü onaylanmadan, rezervasyon işlemleri yapılamamaktadır.
      </p>
      <p>
        <strong>MADDE 6 - GENEL HÜKÜMLER</strong>
      </p>
      <p>
        <strong>6.1</strong>
        {`ALICI, Madde 4'te belirtilen sözleşme konusu ürünün hizmetin
        nitelikleri, satış fiyatı ve ödeme şekli ile ifaya ilişkin tüm ön
        bilgileri okuyup bilgi sahibi olduğunu ve elektronik ortamda gerekli
        teyidi verdiğini beyan eder.`}
      </p>
      <p>
        <strong>6.2</strong>
        {`İşbu sözleşme, ALICI tarafından imzalanıp SATICI' ya ulaştırılmasından
        veya elektronik ortamda oluşturulmuşsa ALICI tarafından onaylanması ile
        geçerlilik kazanır.`}
      </p>
      <p>
        <strong>6.3</strong>
        {`Uçuş arama ve listeleme sayfalarındaki "Kurallar" bağlantılarında,
        uçuşların sınıflarına göre rezervasyonların iptal şartları, iade yapılıp
        yapılamayacağı, bilet geçerliliğinin uzatılması, rezervasyon değişiklik
        bilgileri, v.s. mevcuttur. Bu bilgiler Satıcı' nın uygulamış olduğu
        kısıtlamalar değil, havayollarının uygulamış olduğu kurallardır. Bu
        nedenle Satıcı ile havayolu(taşıyıcı) firmaları hilafına, uçuşun
        vaktinde başlayamaması ve/veya uçak gecikmeleri, arızalanmaları, hava
        muhalefeti, grev ve halk hareketleri, doluluk, gecikme yer durumunun
        müsait olmaması ile mücbir sebep, fevkalade haller, kaza, öngörülemez
        teknik olaylar ve benzeri olaylardan ötürü Satıcı' ya maddi ve manevi
        sorumluluk yüklenemez. Uygulanan bu kuralların Satıcı tarafından
        değiştirilmesi mümkün değildir.`}
      </p>
      <p>
        <strong>6.4</strong>
        Sözleşme konusu hizmetin ifası için işbu sözleşmenin, imzalı nüshasının
        SATICI ya ulaştırılmış olması ve bedelinin tercih edilen ödeme şekli ile
        ödenmiş olması şarttır. Herhangi bir nedenle ürün bedeli ödenmez veya
        banka kayıtlarında iptal edilir ise, SATICI hizmetin ifa yükümlülüğünden
        kurtulmuş kabul edilir. Bilet alımı onaylanıp tamamlandığında, vergiler
        ve diğer masraflar dahil olmak üzere toplam bilet tutarı, ödeme için
        kullanılan kredi kartından tahsil edilir. Bilet alımı için kullanılan
        kredi kartı sahibinin seyahat edecek yolculardan biri olması zorunlu
        değildir.
      </p>
      <p>
        <strong>6.5</strong>
        {`Hizmetin ifasından sonra ALICI' ya ait kredi kartının ALICI'nın
        kusurundan kaynaklanmayan bir şekilde yetkisiz kişilerce haksız veya
        hukuka aykırı olarak kullanılması nedeni ile ilgili banka veya finans
        kuruluşunun hizmet bedelini SATICI' ya ödememesi halinde, ALICI doğan
        zararlardan sorumludur.`}
      </p>
      <p>
        <strong>6.6</strong>
        {`Alıcı, Satıcı tarafından kendisine gönderilecek her türlü ticari
          elektronik iletilere, onay vermektedir. Bu kapsamda Alıcı, Satıcı
          tarafından kendisine, kişi müdahalesi olmadan çalışan faks, elektronik
          posta, kısa mesaj gibi otomatik arama sistemleri vasıtasıyla ya da
          başkaca diğer iletişim vasıtaları ile Alıcı'dan başkaca herhangi bir
          ön izin alınmaksızın tatil turları, ulaşım hizmetleri, muhtelif
          kiralama işleri ve diğer hizmetlerle ilgili bilgilendirme, pazarlama
          ve/veya reklam amacıyla her türlü elektronik ileti/sms/faks vs.
          gönderebileceğini kabul ve beyan eder. Alıcı dilediği zaman, hiçbir
          gerekçe belirtmeksizin bu kullanım şartları kapsamındaki elektronik
          iletileri almaktan vazgeçebilecek olup; bunun için, Satıcı' nın çağrı
          merkezi veya iletide yer alan iletişim bilgilerini kullanarak, bu
          yöndeki talebi iletmesi yeterli olacaktır.`}
        [11]
      </p>
      <p>
        <strong>MADDE 7 - CAYMA HAKKI, İPTAL - VAZGEÇME - DEĞİŞİKLİKLER</strong>
      </p>
      <p>
        <strong>7.1</strong>
        {`ALICI'nın Mesafeli Sözleşmeler Yönetmeliği uyarınca cayma hakkı
        bulunmamaktadır. Ancak müşteri memnuniyetini sağlamak adına
        havayollarının uygulamaları kapsamında ALICI' ya aşağıda belirtilen
        iptal, vazgeçme ve değişiklik yapma hakları tanınmıştır.`}
      </p>
      <p>
        <strong>7.2</strong>
        <strong>Gidiş Uçuş Kuralları : </strong>
        Uçuş öncesi ve uçuş sonrasında iptal/iade veya değişiklik yapılamaz.{' '}
        <strong>Dönüş Uçuş Kuralları : </strong>Uçuş öncesi ve uçuş sonrasında
        iptal/iade veya değişiklik yapılamaz.
      </p>
      <p>
        <strong>7.3</strong>
        {`Yapılmış olan rezervasyon(lar)ın iptallerinde uçak (taşıyıcı)
        firmalarının kendi iptal şartları geçerli olmasından dolayı iptale bağlı
        olarak o biletin ve havayolu(taşıyıcı) firmasının şartları gereğince
        Alıcı'dan ödeme talep edilebilir. Bu hususta, uçak firmalarının iptali
        kabul etmemesi durumunda veya ceza kesintisi yapmaları durumunda, Satıcı
        sadece aracı firma olduğu için Satıcı' ya atfedilebilecek bir sorumluluk
        yoktur. İptal iadeden kaynaklanan zararı Alıcı üstlenecektir. Yapılmış
        olan rezervasyonlarda isim değişikliği yapılması ve satın alınmış bir
        biletin bir başka isme devir edilmesi mümkün değildir. Alıcı aracılığı
        ile bilet alımı yapıldıktan sonra, biletinizin iptali veya parkur
        değişikliğinizin web sitesi üzerinden yapılamamaktadır. Biletlerin iptal
        işlemleri ilgili havayolundan da yapılabilmektedir, ancak bilet iade
        işlemleri sadece Satıcı' nın [12] çağrı merkezine iade talebinde
        bulunulduğu takdirde işleme alınacaktır. Satın alınan biletlerde iade ve
        iptal ceza bedeli, havayolu iptal kuralları çerçevesinde uygulanacaktır.`}
      </p>
      <p>
        <strong>7.4</strong>
        Genel havayolu kuralı olarak, tek bir kişi için aynı tarih aralığında
        aynı havayolu için birden fazla rezervasyon yapılmasına işlem anında
        izin verilecek olup, daha sonra havayolları tarafından uyarı
        yapılmaksızın iptal edilecektir. Bu sebeple, aynı kişi adına
        rezervasyonun birkaç kere yapılması halinde tüm rezervasyonlarınızın
        iptalinden Satıcı sorumluluk kabul etmez.
      </p>
      <p>
        <strong>7.5</strong>
        Biletleme esnasında tahsil edilen Biletleme Hizmet Bedeli iade
        edilmeyecek olup, iade işlemlerinde ayrıca bir hizmet bedeli
        alınmayacaktır.
      </p>
      <p>
        <strong>7.6</strong>
        Yapılmış olan rezervasyonlarda isim değişikliği yapılması ve satın
        alınmış bir biletin bir başka isme devir edilmesi mümkün değildir.
      </p>
      <p>
        <strong>7.7</strong>
        {`Havale veya EFT ile ödeme yapılması durumunda, rezervasyon süresinin
        sona ermesinden öncesine kadar bilet bedelinin Satıcı'nın banka hesabına
        yatırıldığının tespit edilmesiyle biletleme yapılacaktır. Bilet
        bedelinin hesaba geç girmesi durumunda Satıcı'nın herhangi bir
        sorumluluğu olmayacaktır. Havale ve EFT ile yapılan ödemenin iadesi
        durumunda ödenen miktar 15 gün içerisinde iade edilecektir.`}
      </p>
      <p>
        <strong>7.8</strong>
        {`Satıcı'nın internet sitesi üzerinden yapılan ödemelerde, iadesi mümkün
        olan biletlerin, iade işlemleri, iade şartları dahilin de sadece bilet
        satın alma işlemlerinde kullanılan kredi kartına yapılır. Kredi kartına
        iadeler 30 gün içerisinde ödeme yapılan şekilde iade edilir.`}
      </p>
      <p>
        <strong>7.9</strong>
        Gidiş-dönüş rezervasyonların gidişleri kullanılmadığında dönüşleri iptal
        olur, ayrıca kullanılamaz.
      </p>
      <p>
        <strong>7.10</strong>
        Değişiklik ve iptal işlemleri, bilet kuralları çerçevesinde, Havayolunun
        çağrı merkezinden ve havalimanı ofislerinden de yapılabilir.
      </p>
      <p>
        <strong>MADDE 8 - VİZE İŞLEMLERİ</strong>
      </p>
      <p>
        <strong>8.1</strong>
        {`Vize pasaport işlemleri Alıcı'ya aittir. Vize işlemleri tamamen
        konsoloslukların inisiyatifinde olduğundan Satıcı'nın herhangi bir
        sorumluluğu yoktur. Vize alınması o ülkeye giriş garantisi
        vermediğinden, ülkeye kabul edilmeyenler açısından Satıcı'nın hiçbir
        sorumluluğu yoktur. Ve bu sebeple herhangi bir iade veya tazminat
        ödemez. Hiçbir suretle hizmet bedeli Alıcı'ya iade edilmez. Herhangi bir
        sebep ile Alıcı'ya vize verilmemesi durumunda sözleşmede mevcut olan
        iptal şartları aynen geçerliliğini korur. Beraber yapılan seyahatlerde
        yolculardan bir kısmının vize alamamış olması diğerlerine herhangi bir
        iptal hakkı vermemektedir. Vize verilmemesi durumunun, Alıcı'dan
        kaynaklanan bir sorun olduğu kabul edilir.`}
      </p>
      <p>
        <strong>8.2</strong>
        Alıcı seyahat etmek istediği ülkenin talep etmekte olduğu tüm vize
        uygulamasını bilmekte olduğunu ve buna göre oluşabilecek tüm aksi
        durumlardan sorumluluğu kendisi üstlenmekte olduğunu kabul ve taahhüt
        etmektedir. Yurt dışına çıkışlarda pasaport kuralları ve polis
        uygulamalarından satıcı sorumlu değildir. Bu uygulamaları, Alıcı
        bilmediğini ileri süremez. Örneğin, pasaport geçerlilik süreleri,
        pasaport süresinin bitim tarihine kalan süre, vize gerektiren ve
        gerektirmeyen seyahatler, pasaportun tahrip olmuş olması, sayfalarının
        dolmuş olması, yeşil ve kırmızı pasaport uygulamaları ve benzeri
        uygulama ve pasaport işlemleri ile ilgili yasal düzenlemeleri Alıcı
        bildiğini beyan eder. Bu konularda Satıcı sorumlu değildir.
      </p>
      <p>
        <strong>MADDE 9 - DİĞER HÜKÜMLER</strong>
      </p>
      <p>
        <strong>9.1</strong>
        SATICI ile ALICI arasında kayıt esnasında akit olunan işbu sözleşme
        hükümleri ALICI tarafından okunmuş ve kendisi ile birlikte aynı hizmeti
        alan diğer şahısların adına da aynı şartlar altında kayıtlarının
        yapılmasını talep ve kabul ederek onaylanmıştır.
      </p>
      <p>
        <strong>9.2</strong>
        Satıcının internet sitesindeki satış ekranlarından tek başına çocuk
        rezervasyonu yapılamamaktadır. Mutlaka 1 yetişkin ile beraber
        rezervasyon yapılabilir. Bebek yolcular kucakta seyahat eder, bebek
        biletleri için koltuk ayrılmamaktadır. (0-2 yaş) 11-18 yaşından küçük
        yolcuların yalnız uçabileceğine dair ailelerinin iznini belirten
        muvafakat name belgesini yanlarında getirmeleri zorunludur.
      </p>
      <p>
        <strong>9.3</strong>
        Satıcı hizmeti satın alan ALICILARLA, taşıyıcı firmalar, diğer
        hizmetleri sunan her türlü üçüncü şahıs ve tüzel kişiler nezdinde hizmet
        veren konumundadır. Bu nedenle müracaat ile geziye kayıt olan ALICILARIN
        SATICI ile taşımayı üstlenen müesseseler arasında yapılmış anlaşmalar
        hilafına, araçların programda gösterilen saatte hareket yerinde
        bulunmamasından, kara, hava ve deniz araçlarının her türlü
        gecikmelerinden, arızalanmalarından, sis, fırtına ve her türlü hava
        koşullarından, yol engeli gibi sebeplerle, yol güzergah ve rotalarını
        değiştirmelerinden, grev, terör, savaş ve savaş ihtimali veya bunlara
        benzer mücbir sebeplerden veya öngörülemez teknik kusurlardan
        kaynaklanan maddi ve manevi zararlardan SATICI sorumlu değildir.
      </p>
      <p>
        <strong>9.4</strong>
        Satıcı hizmeti satın alan ALICILARLA, taşıyıcı firmalar, diğer
        hizmetleri sunan her türlü üçüncü şahıs ve tüzel kişiler nezdinde hizmet
        veren konumundadır. Bu nedenle müracaat ile geziye kayıt olan ALICILARIN
        SATICI ile taşımayı üstlenen müesseseler arasında yapılmış anlaşmalar
        hilafına, araçların programda gösterilen saatte hareket yerinde
        bulunmamasından, kara, hava ve deniz araçlarının her türlü
        gecikmelerinden, arızalanmalarından, sis, fırtına ve her türlü hava
        koşullarından, yol engeli gibi sebeplerle, yol güzergah ve rotalarını
        değiştirmelerinden, grev, terör, savaş ve savaş ihtimali veya bunlara
        benzer mücbir sebeplerden veya öngörülemez teknik kusurlardan
        kaynaklanan maddi ve manevi zararlardan SATICI sorumlu değildir.
      </p>
      <p>
        <strong>9.5</strong>
        {`ALICI'nın uçuşunda kullanabileceği serbest bagaj taşıma hakkı, havayolu
        şirketleri tarafından belirlenmekte olup, rezervasyon sınıfı ve uçuş
        parkuruna göre değişebilmektedir.`}
      </p>
      <p>
        <strong>9.6</strong>
        Mevzuat kapsamında sözleşmede verilen bilgiler kullanılan uzaktan
        iletişim araçlarına uygun olarak ve iyi niyet ilkeleri çerçevesinde
        ergin olmayanlar ile ayırtım gücünden yoksun veya kısıtlı erginleri
        koruyacak şekilde ticari amaçlarla verilmektedir.
      </p>
      <p>
        <strong>9.7</strong>
        {`Bu Sözleşmeye yazılı olmayan hususlarda 1618 Sayılı yasa, 6502 Sayılı
        Tüketicinin Korunması Hakkında Kanun, 6098 sayılı Türk Borçlar Kanunu,
        6102 sayılı Türk Ticaret Kanunu, IATA, IHA, UFTAA Konvensiyon hükümleri,
        Sivil Havacılık Kanunu, Türkiye'nin dahil olduğu uluslar arası
        sözleşmeler ve bunlara bağlı olarak çıkarılmış Tüzük, Yönetmelik,
        Genelge ve Tebliğler ile Uluslararası kabul görülen Frankfurter
        Tabelle'nin Türkiye' de tatbik olunan TÜRSAB Kütahya Çizelgesi hükümleri
        tatbik olunacaktır. TÜKETİCİ'nin, SATICI ile sorunları olur ise, sorunu
        SATICI'nın çözememesi durumda, 2022 yılı için Tüketici Hakem Heyetlerine
        yapılacak başvurularda, büyükşehir statüsünde olan illerde değeri 10 bin
        280 (Onbinikiyüzseksen) liranın altında bulunan uyuşmazlıklarda ilçe
        tüketici hakem heyetleri, büyükşehir statüsünde olan illerde değeri 10
        bin 280 (Onbinikiyüzseksen) ile 15 bin 430 (Onbeşbindörtyüzotuz) lira
        arasındaki uyuşmazlıklarda il tüketici hakem heyetleri ve büyükşehir
        statüsünde olmayan illerin merkezlerinde ve bağlı ilçelerde değeri 15
        bin 430 (Onbeşbindörtyüzotuz) liranın altında bulunan uyuşmazlıklarda il
        tüketici hakem heyetleri görevlidir. Bu değerlerin üzerindeki
        uyuşmazlıklar için tüketici hakem heyetlerine başvuru yapılamamaktadır.
        Söz konusu uyuşmazlıkların çözümü için 6502 sayılı Kanun’un 73/A maddesi
        kapsamında sırasıyla dava şartı arabuluculuk müessesesine ve tüketici
        mahkemelerine; tüketici mahkemeleri bulunmayan yerlerde ise asliye hukuk
        mahkemelerine başvurulması gerekmektedir. Başvurular, tüketicinin
        yerleşim yerinin bulunduğu veya tüketici işleminin yapıldığı yerdeki
        tüketici hakem heyetine ve Tüketici Mahkemelerine yapılabilir.`}
      </p>
      <p>
        <strong>Gizlilik Politikası</strong>
      </p>
      <ul>
        <li>
          {`Üyelik veya internet sitesi üzerindeki çeşitli form ve oylamaların
          doldurulması suretiyle Alıcıların kendileriyle ilgili bir takım
          kişisel bilgileri (isim-soyisim, firma bilgileri, telefon, adres veya
          e-posta adresleri vb. bilgileri) Satıcı'ya vermeleri gerekmektedir.
          Satıcı tarafından talep edilen bilgiler veya Alıcı tarafından sağlanan
          bilgiler veya internet sitesi üzerinden yapılan işlemlerle ilgili
          bilgiler; Satıcı ve işbirliği içinde olduğu kişiler tarafından,
          Mesafeli Satış Sözleşmesi ile belirlenen amaçlar ve kapsam dışında da,
          talep edilen bilgileri doğrudan pazarlama yapmak, çeşitli
          istatistiksel değerlendirmeler, veri tabanı oluşturma ve pazar
          araştırma amacıyla kullanılabilir ve 3. kişiyle paylaşabilir. Kişisel
          bilgiler, gerektiğinde kullanıcıyla temas kurmak için de
          kullanılabilir.`}
        </li>
        <li>
          Sistemle ilgili sorunların tanımlanması ve internet sitesinde
          çıkabilecek sorunların ivedilikle giderilebilmesi için, Satıcı,
          gerektiğinde kullanıcıların IP adresini tespit etmekte ve bunu
          kullanmaktadır. IP adresleri, kullanıcıları genel bir şekilde
          tanımlamak ve kapsamlı demografik bilgi toplamak amacıyla da
          kullanılabilir ve bu bilgi yargı süreçlerinde resmi kurumlar ile
          paylaşılabilir.
        </li>
        <li>
          {`Kişisel bilgileriniz; kişi isim-soyisim, cinsiyet doğum tarihi,
          adresi, ülke, şehir, semt, posta kodu, cep telefon numarası, e-posta
          adresi, parola, fatura ünvanı, fatura adresi, fatura şehir, fatura
          semt, vergi dairesi, vergi numarası, T.C. Kimlik numarası, yurt dışı
          turlarda Pasaport numarası, ödeme kredi kartı yapılacak ise kredi
          kartı numarası ve kullanıcıyı tanımlamaya yönelik her türlü bilgiyi
          içermektedir. Satıcı havayolu şirketleri, acenteler, araç kiralama
          şirketleri, kanal yönetim şirketleri ile bu bilgileri paylaşabilecek,
          bülten gönderimi amacıyla ve Alıcı'nın rezervasyon öncesi veya
          sonrasındaki taleplerinin hızlıca karşılanması amacıyla ilgili
          departman tarafından da bu bilgileri kullanabilecektir. Satıcı, işbu
          gizlilik politikasında aksi belirtilmedikçe kişisel bilgilerinizden
          herhangi birini Satıcı'nın işbirliği içinde olmadığı şirketlere ve
          üçüncü kişilere açıklamayacaktır. Aşağıda belirtilen sınırlı
          durumlarda Satıcı, işbu "Gizlilik Politikası" hükümleri dışında
          kullanıcılara ait bilgileri üçüncü kişilere açıklayabilir. Bu durumlar
          sınırlı sayıda olmak üzere;`}
        </li>
      </ul>
      <ol>
        <li>
          Kanun, Kanun Hükmünde Kararname, Yönetmelik v.b. yetkili hukuki
          otorite tarafından çıkarılan ve yürürlükte olan hukuk kurallarının
          getirdiği zorunluluklara uymak;
        </li>
        <li>
          {`paraflytravel'nin Alıcılarla akdettiği Üyelik Sözleşmesi ve Kullanım
          Koşullarının, Mesafeli Satış Sözleşmelerinin ve diğer sözleşmelerin
          gereklerini yerine getirmek ve bunları uygulamaya koymak amacıyla;`}
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
        <li>
          {`Satıcı, Alıcılar ve Alıcıların internet sitesi kullanımı hakkındaki
          bilgileri teknik bir iletişim dosyasını (Çerez-Cookie) kullanarak elde
          edebilir. Bahsi geçen teknik iletişim dosyaları, ana bellekte
          saklanmak üzere bir internet sitesinin kullanıcının tarayıcısına
          (browser) gönderdiği küçük metin dosyalarıdır. Teknik iletişim dosyası
          bir internet sitesi hakkında durum ve tercihleri saklayarak
          İnternet'in kullanımını kolaylaştırır. Teknik iletişim dosyası,
          internet sitesini kaç kişinin kullandığını, bir kişinin internet
          sitesini hangi amaçla, kaç kez ziyaret ettiğini ve ne kadar kaldıkları
          hakkında istatistiksel bilgileri elde etmeye ve kullanıcılar için özel
          tasarlanmış kullanıcı sayfalarından dinamik olarak reklam ve içerik
          üretilmesine yardımcı olur. Teknik iletişim dosyası, ana bellekte veya
          e-postanızdan veri veya başkaca herhangi bir kişisel bilgi almak için
          tasarlanmamıştır. Tarayıcıların pek çoğu başta teknik iletişim
          dosyasını kabul eder biçimde tasarlanmıştır ancak kullanıcılar dilerse
          teknik iletişim dosyasının gelmemesi veya teknik iletişim dosyasının
          gönderildiğinde ikaz verilmesini sağlayacak biçimde ayarları
          değiştirebilirler.`}
        </li>
      </ol>
    </div>
  )
}
