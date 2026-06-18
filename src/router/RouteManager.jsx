import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useConfigStore } from '../store/useConfigStore';
import { SEO } from './SEO';

const SEO_DATA = {
  '/modelleme': { title: 'Modelleme', description: '3D model & tasarım çözümlerimiz.' },
  '/simulasyon': { title: 'Simülasyon', description: 'Senaryo ve test simülasyonlarımız.' },
  '/ileri-malzeme': { title: 'İleri Malzeme', description: 'Kompozit ve analiz odaklı ileri malzeme teknolojilerimiz.' },
  '/yapay-zeka': { title: 'Yapay Zeka', description: 'Algoritma ve otonomi temelli yapay zeka sistemlerimiz.' },
  '/hakkimizda': { title: 'Hakkımızda', description: 'Volinor hakkında daha fazla bilgi edinin.' },
  '/urunlerimiz': { title: 'Ürünlerimiz', description: 'İleri teknoloji ürünlerimizi inceleyin.' },
  '/sertifika-ve-patentler': { title: 'Sertifika ve Patentler', description: 'Sahip olduğumuz sertifikalar ve patentler.' },
  '/referanslar': { title: 'Referanslar', description: 'Birlikte çalıştığımız değerli referanslarımız.' },
  '/iletisim': { title: 'İletişim', description: 'Bizimle iletişime geçin.' },
  '/model-kutuphanesi': { title: 'Model Kütüphanesi', description: '3D model kütüphanemizi keşfedin.' },
  '/video-kutuphanesi': { title: 'Video Kütüphanesi', description: 'Eğitici ve tanıtıcı video kütüphanemiz.' },
  '/auth': { title: 'Giriş Yap', description: 'Volinor hesabınıza giriş yapın veya kayıt olun.' },
  '/': { title: 'Ana Sayfa', description: 'Volinor ile 3D modelleme, simülasyon ve yapay zeka çözümlerini keşfedin.' }
};

export const RouteManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setActivePage, setSelectedPart, activePage, selectedPart } = useConfigStore();

  useEffect(() => {
    const path = location.pathname;

    // Dairesel Menü (3D Animasyonlu Sayfalar) -> selectedPart yönetimi
    if (path === '/modelleme') {
      setSelectedPart('subtitle1');
      setActivePage(null);
    } else if (path === '/simulasyon') {
      setSelectedPart('subtitle2');
      setActivePage(null);
    } else if (path === '/ileri-malzeme') {
      setSelectedPart('subtitle3');
      setActivePage(null);
    } else if (path === '/yapay-zeka') {
      setSelectedPart('subtitle4');
      setActivePage(null);
    } 
    // Sol Menü (Bilgi Sayfaları) -> activePage yönetimi
    else if (path === '/hakkimizda') {
      setActivePage('hakkimizda');
    } else if (path === '/urunlerimiz') {
      setActivePage('urunlerimiz');
    } else if (path === '/sertifika-ve-patentler') {
      setActivePage('sertifika-ve-patentler');
    } else if (path === '/referanslar') {
      setActivePage('referanslar');
    } else if (path === '/iletisim') {
      setActivePage('iletisim');
    } else if (path === '/model-kutuphanesi') {
      setActivePage('model-kutuphanesi');
    } else if (path === '/video-kutuphanesi') {
      setActivePage('video-kutuphanesi');
    } 
    // Ana Sayfa veya tanımsız
    else if (path === '/' || path === '/auth') {
      setSelectedPart(null);
      setActivePage(null);
    }
  }, [location.pathname, setActivePage, setSelectedPart]);

  // Eğer store üzerinden activePage veya selectedPart değişirse (eski onClick olayları vb. sebebiyle)
  // URL'nin de senkronize olmasını isteyebiliriz. Ancak menüleri <Link> yapısına dönüştüreceğimiz için
  // ters senkronizasyona (state -> URL) ihtiyacımız olmayabilir. 
  // Yine de eski onClick yapılarının tam uyumlu olması için ters senkronizasyon eklenebilir.

  const currentSeo = SEO_DATA[location.pathname] || SEO_DATA['/'];

  return <SEO title={currentSeo.title} description={currentSeo.description} />;
};
