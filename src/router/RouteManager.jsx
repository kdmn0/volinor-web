import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useConfigStore } from '../store/useConfigStore';
import { SEO } from './SEO';

export const RouteManager = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { setActivePage, setSelectedPart, activePage, selectedPart } = useConfigStore();

  useEffect(() => {
    const path = location.pathname;

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
    } else if (path === '/hakkimizda') {
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
    } else if (path === '/' || path === '/auth') {
      setSelectedPart(null);
      setActivePage(null);
    }
  }, [location.pathname, setActivePage, setSelectedPart]);

  const seoData = useMemo(() => ({
    '/modelleme': { title: t('seo.modeling_title'), description: t('seo.modeling_desc') },
    '/simulasyon': { title: t('seo.simulation_title'), description: t('seo.simulation_desc') },
    '/ileri-malzeme': { title: t('seo.materials_title'), description: t('seo.materials_desc') },
    '/yapay-zeka': { title: t('seo.ai_title'), description: t('seo.ai_desc') },
    '/hakkimizda': { title: t('seo.about_title'), description: t('seo.about_desc') },
    '/urunlerimiz': { title: t('seo.products_title'), description: t('seo.products_desc') },
    '/sertifika-ve-patentler': { title: t('seo.certs_title'), description: t('seo.certs_desc') },
    '/referanslar': { title: t('seo.refs_title'), description: t('seo.refs_desc') },
    '/iletisim': { title: t('seo.contact_title'), description: t('seo.contact_desc') },
    '/model-kutuphanesi': { title: t('seo.model_lib_title'), description: t('seo.model_lib_desc') },
    '/video-kutuphanesi': { title: t('seo.video_lib_title'), description: t('seo.video_lib_desc') },
    '/auth': { title: t('seo.auth_title'), description: t('seo.auth_desc') },
    '/': { title: t('seo.home_title'), description: t('seo.home_desc') },
  }), [t, i18n.language]);

  const currentSeo = seoData[location.pathname] || seoData['/'];

  return <SEO title={currentSeo.title} description={currentSeo.description} />;
};
