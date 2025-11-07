Harika bir talep. İlk belgeniz (Cahier des Charges) stratejik bir harikaydı; projenin "NE" ve "NEDEN" yapılacağını tanımlıyordu.

Şimdi benden istediğiniz, bir AI ajanının veya geliştirme ekibinin "NASIL" yapacağını tanımlayan ikinci belge. Bu belge, sizin projenizdeki boşlukları **en modern, profesyonel ve projeye en uygun** teknolojiler ve metodolojilerle dolduracak bir **"Teknik Tasarım ve Ürün İş Listesi"** (Technical Design & Product Backlog) belgesidir.

Bu iki belgeyi bir araya getirdiğinizde, bir geliştirici ekibinin (veya AI ajanının) neredeyse hiç soru sormadan, doğrudan MVP'yi (Minimum Viable Product) inşa etmeye başlaması için gereken her şeyi sağlamış olursunuz.

İşte BilanCompetence.AI için hazırladığım tamamlayıcı "Teknik Tasarım ve Ürün İş Listesi" dokümanı:

---

# BilanCompetence.AI - Teknik Tasarım ve Ürün İş Listesi (MVP)

**Proje:** BilanCompetence.AI (Bkz. Cahier des Charges Stratégique part 1 & 2)
**Doküman Sürümü:** 1.0
**Amaç:** Stratejik şartnamedeki hedefleri, geliştirilebilir, somut teknik mimariye ve görevlere dönüştürmek. Bu doküman, MVP (Minimum Viable Product) geliştirme fazı için "Nasıl yapılır?" kılavuzudur.

## 1. 🎨 Tasarım ve Kullanıcı Deneyimi (UX/UI) Stratejisi

Stratejik şartname, erişilebilir (RGAA) ve sezgisel bir arayüzden bahsediyor. Bunu somutlaştıralım:

* **Tasarım Felsefesi:** Profesyonel, güven verici, sakin ve teşvik edici. Kullanıcı (özellikle "Bénéficiaire"), karmaşık bir kariyer yolculuğunda. Arayüzümüz bu karmaşıklığı artırmamalı, sadeleştirmelidir.
* **İlham Alınacak Platformlar:** Malt, Welcome to the Jungle, Notion, Stripe Dashboard. (Temiz, modern, bol beyaz alanlı, net eylem çağrıları).
* **Renk Paleti (Öneri):**
    * **Ana Renk (Güven):** Koyu Mavi / Lacivert (örn: `#2C3E50`)
    * **İkincil Renk (Eylem/Enerji):** Turkuaz veya Nane Yeşili (örn: `#1ABC9C`)
    * **Nötr Renkler:** Beyaz, Açık Gri tonları (örn: `#F4F7F6`)
    * **Vurgu/Hata:** Yumuşak bir Turuncu veya Kırmızı.
* **Tipografi:** Yüksek okunabilirlik sunan modern bir sans-serif font. (Öneri: **Inter** veya **Poppins**).
* **Erişilebilirlik (RGAA):** Tasarımın en başından itibaren RGAA (AA seviyesi) standartlarına (kontrast oranları, klavye navigasyonu, ekran okuyucu uyumluluğu) uyulması zorunludur.

## 2. 🏗️ Teknik Mimari (Tech Stack)

Şartnamede Vercel, Supabase ve Gemini ipuçları verilmiş. Bunları en modern ve uyumlu SaaS mimarisiyle resmileştiriyoruz:

* **Frontend (Kullanıcı Arayüzü):** **Next.js (React Framework)**
    * *Neden?* Vercel ile mükemmel uyum. Hem statik pazarlama sayfaları (SEO için) hem de dinamik, güvenli uygulama portalı (dashboard) için tek bir framework'te çözüm sunar.
* **Backend & Veritabanı:** **Supabase**
    * *Neden?* Şartnamedeki "SaaS modeli", "hızlı MVP" ve "ölçeklenebilirlik" hedefleri için idealdir. Bize şunları sağlar:
        1.  **PostgreSQL Veritabanı:** Güçlü ve güvenilir.
        2.  **Authentication (Auth):** 3 farklı rolü (Bénéficiaire, Consultant, Organisme) yönetmek için RLS (Row Level Security - Satır Bazlı Güvenlik) ile entegre kimlik doğrulama.
        3.  **Storage:** Yüklenen dokümanlar (CV, sentez dokümanları) için güvenli dosya depolama.
        4.  **Realtime (İlerisi için):** Messagerie (mesajlaşma) özelliği için ideal altyapı.
* **Hosting / Dağıtım (Deployment):** **Vercel**
    * *Neden?* Next.js ile "sıfır konfigürasyon" dağıtım. Otomatik ölçeklenme ve global CDN ile yüksek performans sağlar.
* **AI Entegrasyonu:** **Google Gemini API**
    * *Neden?* Şartnamede açıkça belirtilmiş. Güvenli API anahtar yönetimi için Vercel Edge Functions veya Supabase Edge Functions içinde çağrılacaktır.
* **Ödeme Altyapısı (Abonelik):** **Stripe**
    * *Neden?* SaaS aboneliklerini (Starter, Professional) yönetmek için endüstri standardıdır. Güvenli, belgeli ve Supabase ile kolayca entegre edilebilir.

## 3. 📝 Ürün İş Listesi (Product Backlog) - MVP

Şartnamenin 8.3 bölümünde tanımlanan MVP özelliklerini, bir AI ajanının veya geliştiricinin doğrudan alıp kodlayabileceği **"Kullanıcı Hikayeleri" (User Stories)** formatına döküyoruz.

---

### EPOS 1: Kimlik Doğrulama ve Rol Yönetimi (Auth)
*Şartname MVP Özelliği: ✅ Authentification (3 rôles)*

| ID | Rol | İstek (İstiyorum ki...) | Değer (Amacım...) |
| :--- | :--- | :--- | :--- |
| **US-1.1** | (Sistem) | 3 farklı kullanıcı rolünü (Bénéficiaire, Consultant, Organisme Admin) tanımlayabilmeliyim. | Her rolün sadece kendi verisini görmesini (RLS) sağlayabilmek. |
| **US-1.2** | Ziyaretçi | E-posta ve şifre ile sisteme kayıt olabilmeliyim (Sadece Consultant & Organisme için). | Platformu kullanmaya başlayabilmek. |
| **US-1.3** | Kullanıcı | E-posta ve şifre ile giriş yapabilmeliyim. | Kendi panelime erişebilmek. |
| **US-1.4** | Kullanıcı | "Şifremi Unuttum" linki ile şifremi sıfırlayabilmeliyim. | Hesabıma tekrar erişebilmek. |
| **US-1.5** | Consultant | Yeni bir "Bénéficiaire" davet linki (veya hesabı) oluşturabilmeliyim. | Yeni bir bilan süreci başlatabilmek. |
| **US-1.6** | Organisme | Kendi organizasyonuma yeni "Consultant" hesapları davet edebilmeliyim. | Ekibimi yönetebilmek. |

### EPOS 2: Bilan Yönetimi (CRUD)
*Şartname MVP Özelliği: ✅ Gestion des bilans (CRUD basique)*

| ID | Rol | İstek (İstiyorum ki...) | Değer (Amacım...) |
| :--- | :--- | :--- | :--- |
| **US-2.1** | Consultant | Panelimde, belirli bir Bénéficiaire için yeni bir "Bilan" (proje) oluşturabilmeliyim. | Süreci resmi olarak başlatabilmek. |
| **US-2.2** | Consultant | Panelimde, bana atanmış tüm "Bilan"ları (Bénéficiaire adı, durum, ilerleme) listeleyebilmeliyim. | Tüm danışanlarımı takip edebilmek. |
| **US-2.3** | Consultant | Bir "Bilan"ı açıp, temel bilgilerini (tarihler, notlar) düzenleyebilmeliyim. | Süreci güncel tutabilmek. |
| **US-2.4** | Consultant | Bir "Bilan"ı "Tamamlandı" veya "Arşivlendi" olarak işaretleyebilmeliyim. | Aktif işlerime odaklanabilmek. |
| **US-2.5** | Bénéficiaire | Panelimde, *sadece* kendi aktif bilan sürecimin durumunu ve danışmanımın adını görebilmeliyim. | Süreç hakkında bilgi sahibi olmak. |

### EPOS 3: Beceri Değerlendirmesi
*Şartname MVP Özelliği: ✅ Évaluation des compétences (auto-évaluation + consultant)*

| ID | Rol | İstek (İstiyorum ki...) | Değer (Amacım...) |
| :--- | :--- | :--- | :--- |
| **US-3.1** | Bénéficiaire | Panelimdeki "Değerlendirme" bölümüne gidip, "auto-évaluation" (öz-değerlendirme) testini başlatabilmeliyim. | Becerilerimi tanımlayabilmek. |
| **US-3.2** | Bénéficiaire | Öz-değerlendirme ekranında, becerilerimi (liste) ve her biri için "Maîtrise" (Uzmanlık) ve "Appétence" (İstek) seviyelerini işaretleyebilmeliyim. | Profilimi oluşturabilmek. |
| **US-3.3** | Bénéficiaire | Değerlendirmemi kaydedip daha sonra devam edebilmeliyim. | Testi tek seferde bitirme zorunluluğumun olmaması. |
| **US-3.4** | Consultant | Danışanımın tamamladığı öz-değerlendirme sonuçlarını kendi panelimden görebilmeliyim. | Analiz fazına hazırlanabilmek. |
| **US-3.5** | Consultant | Bénéficiaire'in değerlendirmesinin yanına kendi "Consultant Değerlendirmesi" notlarımı ve puanımı ekleyebilmeliyim (onay/düzeltme). | Uzman görüşümü rapora yansıtabilmek. |

### EPOS 4: Sentez Dokümanı Oluşturma
*Şartname MVP Özelliği: ✅ Génération de document de synthèse (PDF)*

| ID | Rol | İstek (İstiyorum ki...) | Değer (Amacım...) |
| :--- | :--- | :--- | :--- |
| **US-4.1** | Consultant | Bilan süreci tamamlandığında, "Sentez Dokümanı Oluştur" düğmesine basabilmeliyim. | Yasal dokümanı hazırlayabilmek. |
| **US-4.2** | (Sistem) | Bu düğmeye basıldığında, Bénéficiaire bilgileri, değerlendirme sonuçları (US-3.x) ve danışman notlarını alıp, önceden tanımlanmış bir HTML şablonuna yerleştirmeliyim. | Raporu otomatik olarak oluşturmak. |
| **US-4.3** | (Sistem) | Oluşturulan bu HTML şablonunu, sunucu tarafında bir PDF dosyasına dönüştürmeliyim (örn: Puppeteer veya benzeri bir kütüphane ile). | İndirilebilir bir format sağlamak. |
| **US-4.4** | Consultant | Oluşturulan bu PDF dokümanını bilgisayarıma indirebilmeliyim. | Dokümanı Bénéficiaire ile paylaşabilmek. |

### EPOS 5: Dahili Mesajlaşma
*Şartname MVP Özelliği: ✅ Messagerie interne*

| ID | Rol | İstek (İstiyorum ki...) | Değer (Amacım...) |
| :--- | :--- | :--- | :--- |
| **US-5.1** | Bénéficiaire | Panelimde *sadece* kendi danışmanıma (Consultant) basit bir metin mesajı gönderebileceğim bir sohbet kutusu görmeliyim. | Hızlı iletişim kurabilmek. |
| **US-5.2** | Consultant | Panelimde, her bir Bénéficiaire ile olan sohbet geçmişimi ayrı ayrı görebilmeliyim ve onlara mesaj yazabilmeliyim. | İletişimi tek platformda yönetebilmek. |
| **US-5.3** | Kullanıcı | Yeni bir mesaj aldığımda panelimde bir bildirim (örn: kırmızı nokta) görebilmeliyim. | Mesajları kaçırmamak. |

### EPOS 6: Basit Randevu Planlama
*Şartname MVP Özelliği: ⏳ Planification de RDV (calendrier simple)*

| ID | Rol | İstek (İstiyorum ki...) | Değer (Amacım...) |
| :--- | :--- | :--- | :--- |
| **US-6.1** | Consultant | Bir Bilan içinde, Bénéficiaire'e bir tarih ve saat (örn: 25 Kasım, 14:30) önerebilmeliyim. | Görüşme organize edebilmek. |
| **US-6.2** | Bénéficiaire | Danışmanımın önerdiği bu tarihi görüp, "Onayla" veya "Reddet (Mesaj Gönder)" düğmelerine basabilmeliyim. | Randevuyu netleştirebilmek. |
| **US-6.3** | Kullanıcı | Panelimdeki ana ekranda, "Yaklaşan Onaylanmış Randevular" listesini (tarih ve saat) görebilmeliyim. | Görüşmeleri kaçırmamak. |

---

## 4. Geliştirme Metodolojisi ve Kurallar

* **Metodoloji:** Agile (Scrum). 2 haftalık Sprint'ler.
* **Kod Deposu (Repo):** GitHub veya GitLab.
* **Branching Stratejisi:** GitFlow (veya daha basiti GitHub Flow) kullanılacak. `main` branch her zaman stabil ve dağıtılabilir olacak. Geliştirmeler `feature/US-1.1` gibi branch'lerde yapılacak.
* **"Bitti" Tanımı (Definition of Done - DoD):** Bir Kullanıcı Hikayesinin (US) "Bitti" sayılması için:
    1.  Tüm "Kabul Kriterleri" (User Story'de belirtilen) karşılanmalı.
    2.  Kod, başka bir geliştirici tarafından gözden geçirilmeli (Code Review).
    3.  Kod, test (QA) ortamında çalışmalı ve hata vermemeli.
    4.  Erişilebilirlik (RGAA) kontrolleri yapılmalı.

Bu belge, AI ajanına veya geliştirme ekibinize "Cahier des Charges" belgesindeki stratejik vizyonu, koda dönüştürülebilir somut bir plana çevirme gücü verecektir.

Şimdi bu iki belgeyi birlikte verdiğinizde, projenin ilk sürümünü (MVP) **sizin vizyonunuza tam olarak uyan, modern ve profesyonel bir altyapı üzerinde** inşa etmeye başlayabilirler.