# Volinor Savunma ve Teknoloji - Frontend

Bu proje, **Volinor Savunma ve Teknoloji**'nin kurumsal ve ürün tanıtım web uygulamasının frontend (ön yüz) kodlarını barındırmaktadır. Modern web teknolojileri kullanılarak, yüksek performanslı 3D sahneler ve akıcı kullanıcı arayüzleri oluşturulmuştur.

## 🚀 Teknolojik Altyapı

Proje, güncel teknolojilerin bir araya gelmesiyle inşa edilmiştir:

- **Çatı & Yapılandırma:** React 19, Vite 6
- **3D Motoru (WebGL):** Three.js, React Three Fiber (R3F), Drei
- **Animasyon:** Motion (Framer Motion), GSAP
- **Durum Yönetimi (State):** Zustand
- **Stil & Tasarım:** Tailwind CSS v4, PostCSS
- **Yönlendirme (Routing):** React Router DOM
- **Dil:** JavaScript (ES6+)

## 📂 Proje Mimarisi

Kök `src/` klasörü, uygulamanın farklı parçalarını mantıksal modüller halinde ayırır:

```text
src/
├── components/          # Tekrar kullanılabilir UI bileşenleri
│   ├── cards/           # Kart bileşenleri (Ürün kartları vb.)
│   ├── effects/         # Animasyonlu görsel efektler (Magic Rings, Ambient Particles)
│   ├── feedback/        # Kullanıcıya bilgi veren UI öğeleri (Loading ekranı, Analiz Arayüzü)
│   ├── layout/          # Ana ekran düzeni bileşenleri (Menüler, ConfigPanel)
│   └── modals/          # Tam ekran açılan pencereler ve paneller
├── data/                # Statik içerikler, yapılandırma ve mock veriler
├── pages/               # Sayfa seviyesindeki bileşenler (Model/Video kütüphanesi)
│   └── auth/            # Giriş, Kayıt, Şifre Sıfırlama ve E-posta doğrulama sayfaları
├── router/              # Uygulama içi rotalar ve SEO yönetim bileşenleri
├── scene/               # 3D Kanvas bileşenleri ve modeller (BeeModel, Experience, Simülasyon)
└── store/               # Zustand global state (durum) dosyaları (useConfigStore vb.)
```

## 🌟 Öne Çıkan Özellikler

1. **Etkileşimli 3D Ürün Sergileme:** Ziyaretçiler ana sayfada 3D modeller (örn: Bee Drone) etrafında gezinebilir, parçaları inceleyebilir.
2. **Kategori Modları:** Modelleme, Simülasyon, İleri Malzeme ve Yapay Zeka gibi farklı gösterim modlarına göre 3D model gerçek zamanlı tepkiler verir (Kanat çırpma hızının artması, engellerden kaçma animasyonları, x-ray röntgen görünümü).
3. **Akıcı Animasyonlar:** Motion ve GSAP ile sayfa geçişlerinde, menü açılışlarında ve UI öğelerinde premium bir hissiyat sunulur.
4. **Modüler Tasarım:** Tailwind CSS kullanılarak hızlıca genişletilebilen ve her cihaza uyumlu (responsive) bir arayüz geliştirilmiştir.
5. **Kütüphaneler:** Gelişmiş veri arama ve filtreleme özelliğine sahip 'Model Kütüphanesi' ve API üzerinden beslenebilen 'Video Kütüphanesi' mevcuttur.

## 🛠️ Kurulum ve Geliştirme

Projeyi yerel ortamınızda (local) çalıştırmak için aşağıdaki adımları izleyin:

### Ön Gereksinimler
- **Node.js:** v18+ (Tavsiye edilen v20+)
- **NPM:** Node ile birlikte gelir.

### Başlangıç
1. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```

2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```
   *Tarayıcınızda otomatik olarak açılacaktır (Genellikle `http://localhost:5173`).*

### Diğer Komutlar

- **Üretim sürümünü oluşturmak (Build):**
  ```bash
  npm run build
  ```
- **Linter ile kod analizi yapmak:**
  ```bash
  npm run lint
  ```
- **Oluşturulan üretim build'ini test etmek:**
  ```bash
  npm run preview
  ```

## 📜 Scriptler ve Araçlar

Proje içerisindeki `scripts/` klasöründe yer alan araçlar, uygulamanın dinamik verilerini yönetmeye yardımcı olur. Örneğin:
- **`update-youtube.js`:** `.env` dosyasındaki API bilgilerini kullanarak Volinor'un güncel YouTube videolarını çeker ve `public/videolar.json` içerisine kaydeder.

*(Bu scriptleri kullanmak için `.env.example` dosyasını kopyalayıp adını `.env` yaparak ilgili API Key bilgilerini doldurmanız gerekmektedir.)*
