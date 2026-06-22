import { useTranslation } from 'react-i18next';

export const SEO = ({ title, description, keywords }) => {
  const { t } = useTranslation();
  const defaultTitle = t('seo.default_title');
  const defaultDescription = t('seo.default_desc');
  const defaultKeywords = "volinor, 3d, modelleme, simülasyon, yapay zeka, ileri malzeme, kompozit";

  return (
    <>
      <title>{title ? `${title} | Volinor` : defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title ? `${title} | Volinor` : defaultTitle} />
      <meta property="og:description" content={description || defaultDescription} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title ? `${title} | Volinor` : defaultTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </>
  );
};
